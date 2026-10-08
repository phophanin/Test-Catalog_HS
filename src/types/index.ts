export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type ContactChannel = 'telegram' | 'messenger' | 'phone' | 'whatsapp' | 'website';

export type LeadStatus = 'new' | 'contacted' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  name_kh: string;
  slug: string;
  description?: string;
  image_url: string;
  icon_name?: string;
  display_order: number;
  product_count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  description_kh?: string;
  logo_url: string;
  country?: string;
  is_featured: boolean;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  name_kh: string;
  slug: string;
  sku: string;
  brand_id?: string;
  brand?: Brand | { name: string; slug: string };
  category_id?: string;
  category?: Category | { name: string; slug: string };
  price: number;
  original_price?: number;
  discount_percent: number;
  sizes: string[];
  colors: string[];
  stock_status: StockStatus;
  stock_quantity: number;
  is_new: boolean;
  is_sale: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  description: string;
  description_kh?: string;
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface OrderLead {
  id: string;
  customer_name: string;
  customer_phone?: string;
  contact_channel: ContactChannel;
  telegram_username?: string;
  product_id?: string;
  product_name: string;
  sku?: string;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  total_price: number;
  currency: 'USD' | 'KHR';
  status: LeadStatus;
  notes?: string;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  phone: string;
  telegram: string;
  messenger: string;
  address: string;
  usd_to_khr_rate: number;
  announcement_en?: string;
  announcement_kh?: string;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice?: number;
  maxPrice?: number;
  size: string;
  color: string;
  stockStatus: string;
  isSale: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  sortBy: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
}

export type Language = 'km' | 'en';
export type Currency = 'USD' | 'KHR';
