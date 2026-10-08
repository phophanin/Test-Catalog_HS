-- ================================================================
-- HOME SPORT - Database Schema (Supabase / PostgreSQL)
-- Complete E-commerce Product Catalog & Order Lead Tracking
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_kh VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    icon_name VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    description_kh TEXT,
    logo_url TEXT,
    country VARCHAR(100),
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_kh VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percent INT DEFAULT 0,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    stock_status VARCHAR(50) NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    stock_quantity INT DEFAULT 10,
    is_new BOOLEAN DEFAULT false,
    is_sale BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    description TEXT,
    description_kh TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDER LEADS TABLE (Customer Conversions & Inquiries)
CREATE TABLE IF NOT EXISTS public.order_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(100),
    contact_channel VARCHAR(50) NOT NULL DEFAULT 'telegram' CHECK (contact_channel IN ('telegram', 'messenger', 'phone', 'whatsapp', 'website')),
    telegram_username VARCHAR(100),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    selected_size VARCHAR(50),
    selected_color VARCHAR(100),
    quantity INT DEFAULT 1,
    total_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    store_name VARCHAR(255) NOT NULL DEFAULT 'HOME SPORT',
    phone VARCHAR(100) NOT NULL DEFAULT '+855 12 345 678',
    telegram VARCHAR(100) NOT NULL DEFAULT 'homesportkh',
    messenger VARCHAR(100) NOT NULL DEFAULT 'homesportcambodia',
    address TEXT NOT NULL DEFAULT 'St 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh, Cambodia',
    usd_to_khr_rate NUMERIC(10, 2) DEFAULT 4100,
    announcement_en TEXT DEFAULT '🚚 Free delivery in Phnom Penh for orders over $50! Fast delivery across all 25 provinces.',
    announcement_kh TEXT DEFAULT '🚚 ដឹកជញ្ជូនឥតគិតថ្លៃក្នុងរាជធានីភ្នំពេញសម្រាប់ការបញ្ជាទិញចាប់ពី $50 ឡើងទៅ! សេវាដឹកទូទាំង ២៥ ខេត្ត-ក្រុង។',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for lightning fast queries & filtering
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_status);
CREATE INDEX IF NOT EXISTS idx_order_leads_status ON public.order_leads(status);
CREATE INDEX IF NOT EXISTS idx_order_leads_created ON public.order_leads(created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read catalog
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public brands are viewable by everyone" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone" ON public.store_settings FOR SELECT USING (true);

-- Anyone can submit an order lead
CREATE POLICY "Anyone can insert order leads" ON public.order_leads FOR INSERT WITH CHECK (true);

-- Admins / Service role full access
CREATE POLICY "Full access categories for authenticated" ON public.categories FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Full access brands for authenticated" ON public.brands FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Full access products for authenticated" ON public.products FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Full access order_leads for authenticated" ON public.order_leads FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Full access settings for authenticated" ON public.store_settings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
