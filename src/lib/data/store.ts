import { Product, Category, Brand, OrderLead, StoreSettings, FilterState, LeadStatus } from '@/types';
import { initialProducts, initialCategories, initialBrands, initialOrderLeads, initialSettings } from './mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// localStorage is used ONLY for:
//   - language preference  (managed by LanguageContext)
//   - currency preference  (managed by CurrencyContext)
//   - order leads fallback (when Supabase is not configured — dev only)
//   - store settings cache (when Supabase is not configured — dev only)
//
// Products, Categories, and Brands are NEVER stored in localStorage.
// Supabase is the single source of truth for all product data.
// ---------------------------------------------------------------------------

// Minimal localStorage helpers — used only for leads & settings fallback
const STORAGE_KEYS = {
  LEADS: 'home_sport_leads_v1',
  SETTINGS: 'home_sport_settings_v1',
};

function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

// ==========================================
// PRODUCTS
// ==========================================

export async function getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
  let products: Product[] = [];

  if (isSupabaseConfigured && supabase) {
    // Supabase is the ONLY source of truth — no localStorage fallback for products.
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug)
      `);
    if (error) {
      console.error('Supabase getProducts error:', error.message);
      // Surface the error; return empty array so UI shows "no products" rather than stale data.
      products = [];
    } else {
      products = (data ?? []) as unknown as Product[];
    }
  } else {
    // Local / dev mode — Supabase not configured. Use mock data in-memory only.
    console.warn('[store] Supabase not configured — using mock data (dev mode only).');
    products = initialProducts;
  }

  if (!filters) return products;

  // Apply filters
  let filtered = [...products];

  // Search filter
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const brandName = typeof p.brand === 'object' && p.brand ? p.brand.name.toLowerCase() : '';
      const catName = typeof p.category === 'object' && p.category ? p.category.name.toLowerCase() : '';
      const sku = (p.sku || '').toLowerCase();
      const tags = (p.tags || []).join(' ').toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.name_kh && p.name_kh.includes(q)) ||
        brandName.includes(q) ||
        catName.includes(q) ||
        sku.includes(q) ||
        tags.includes(q)
      );
    });
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    const catSlug = filters.category.toLowerCase();
    filtered = filtered.filter((p) => {
      const slug = typeof p.category === 'object' && p.category ? p.category.slug : p.category_id;
      return slug?.toLowerCase() === catSlug;
    });
  }

  // Brand filter
  if (filters.brand && filters.brand !== 'all') {
    const brandSlug = filters.brand.toLowerCase();
    filtered = filtered.filter((p) => {
      const slug = typeof p.brand === 'object' && p.brand ? p.brand.slug : p.brand_id;
      return slug?.toLowerCase() === brandSlug;
    });
  }

  // Price range filter
  if (typeof filters.minPrice === 'number') {
    filtered = filtered.filter((p) => p.price >= (filters.minPrice as number));
  }
  if (typeof filters.maxPrice === 'number') {
    filtered = filtered.filter((p) => p.price <= (filters.maxPrice as number));
  }

  // Size filter
  if (filters.size && filters.size !== 'all') {
    const targetSize = filters.size.toLowerCase();
    filtered = filtered.filter((p) =>
      p.sizes.some((s) => s.toLowerCase() === targetSize || s.toLowerCase().includes(targetSize))
    );
  }

  // Color filter
  if (filters.color && filters.color !== 'all') {
    const targetColor = filters.color.toLowerCase();
    filtered = filtered.filter((p) =>
      p.colors.some((c) => c.toLowerCase().includes(targetColor))
    );
  }

  // Stock status filter
  if (filters.stockStatus && filters.stockStatus !== 'all') {
    filtered = filtered.filter((p) => p.stock_status === filters.stockStatus);
  }

  // Badges / flags
  if (filters.isSale) {
    filtered = filtered.filter((p) => p.is_sale);
  }
  if (filters.isNew) {
    filtered = filtered.filter((p) => p.is_new);
  }
  if (filters.isBestSeller) {
    filtered = filtered.filter((p) => p.is_best_seller);
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }
  }

  return filtered;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug)
      `)
      .eq('slug', slug.toLowerCase())
      .single();
    if (error || !data) return null;
    return data as unknown as Product;
  }
  // Dev fallback
  return initialProducts.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data as unknown as Product;
  }
  // Dev fallback
  return initialProducts.find((p) => p.id === id) || null;
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  if (!isSupabaseConfigured || !supabase) {
    // Dev-only in-memory creation (no persistence across refreshes)
    console.warn('[store] Supabase not configured — product created in memory only (dev mode).');
    return {
      ...productData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ ...productData }])
    .select(`
      *,
      brand:brands(id, name, slug),
      category:categories(id, name, slug)
    `)
    .single();

  if (error || !data) {
    console.error('Supabase createProduct error:', error?.message);
    throw new Error(error?.message || 'Failed to create product in database.');
  }

  return data as unknown as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — product update is in memory only (dev mode).');
    return null;
  }

  // Strip out joined objects before sending to Supabase — it only wants flat columns
  const { brand, category, ...flatUpdates } = updates as Product & { brand?: unknown; category?: unknown };
  void brand; void category; // suppress unused-var warnings

  const { data, error } = await supabase
    .from('products')
    .update({ ...flatUpdates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      brand:brands(id, name, slug),
      category:categories(id, name, slug)
    `)
    .single();

  if (error || !data) {
    console.error('Supabase updateProduct error:', error?.message);
    throw new Error(error?.message || 'Failed to update product in database.');
  }

  return data as unknown as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — delete is in memory only (dev mode).');
    return true;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase deleteProduct error:', error.message);
    throw new Error(error.message || 'Failed to delete product from database.');
  }

  return true;
}

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories(): Promise<Category[]> {
  let categories: Category[] = [];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) {
      console.error('Supabase getCategories error:', error.message);
      categories = [];
    } else {
      categories = (data ?? []) as Category[];
    }
  } else {
    console.warn('[store] Supabase not configured — using mock categories (dev mode).');
    categories = initialCategories;
  }

  // Recalculate product counts from live products
  const products = await getProducts();
  return categories.map((cat) => {
    const count = products.filter((p) => {
      const slug = typeof p.category === 'object' && p.category ? p.category.slug : p.category_id;
      return slug?.toLowerCase() === cat.slug.toLowerCase();
    }).length;
    return { ...cat, product_count: count };
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .single();
    if (error || !data) return null;
    return data as Category;
  }
  return initialCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createCategory(catData: Omit<Category, 'id'>): Promise<Category> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — category created in memory only (dev mode).');
    return { ...catData, id: `cat-${Date.now()}`, product_count: 0 };
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...catData, product_count: 0 }])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create category.');
  }
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — category update is in memory only (dev mode).');
    return null;
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update category.');
  }
  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — delete is in memory only (dev mode).');
    return true;
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Failed to delete category.');
  return true;
}

// ==========================================
// BRANDS
// ==========================================

export async function getBrands(): Promise<Brand[]> {
  let brands: Brand[] = [];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    if (error) {
      console.error('Supabase getBrands error:', error.message);
      brands = [];
    } else {
      brands = (data ?? []) as Brand[];
    }
  } else {
    console.warn('[store] Supabase not configured — using mock brands (dev mode).');
    brands = initialBrands;
  }

  // Recalculate product counts from live products
  const products = await getProducts();
  return brands.map((b) => {
    const count = products.filter((p) => {
      const slug = typeof p.brand === 'object' && p.brand ? p.brand.slug : p.brand_id;
      return slug?.toLowerCase() === b.slug.toLowerCase();
    }).length;
    return { ...b, product_count: count };
  });
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .single();
    if (error || !data) return null;
    return data as Brand;
  }
  return initialBrands.find((b) => b.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createBrand(brandData: Omit<Brand, 'id'>): Promise<Brand> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — brand created in memory only (dev mode).');
    return { ...brandData, id: `brand-${Date.now()}`, product_count: 0 };
  }

  const { data, error } = await supabase
    .from('brands')
    .insert([{ ...brandData, product_count: 0 }])
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create brand.');
  }
  return data as Brand;
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — brand update is in memory only (dev mode).');
    return null;
  }

  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update brand.');
  }
  return data as Brand;
}

export async function deleteBrand(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[store] Supabase not configured — delete is in memory only (dev mode).');
    return true;
  }

  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Failed to delete brand.');
  return true;
}

// ==========================================
// ORDER LEADS
// ==========================================

export async function getOrderLeads(): Promise<OrderLead[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('order_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getOrderLeads error:', error.message);
      return getLocalItem<OrderLead[]>(STORAGE_KEYS.LEADS, initialOrderLeads);
    }
    return (data ?? []) as OrderLead[];
  }
  return getLocalItem<OrderLead[]>(STORAGE_KEYS.LEADS, initialOrderLeads);
}

export async function createOrderLead(leadData: Omit<OrderLead, 'id' | 'created_at'>): Promise<OrderLead> {
  const newLead: OrderLead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('order_leads')
      .insert([newLead])
      .select()
      .single();
    if (!error && data) return data as OrderLead;
    console.error('Supabase createOrderLead error:', error?.message);
    // Fall through to localStorage backup so customer order is not lost
  }

  const leads = getLocalItem<OrderLead[]>(STORAGE_KEYS.LEADS, initialOrderLeads);
  const updated = [newLead, ...leads];
  setLocalItem(STORAGE_KEYS.LEADS, updated);
  return newLead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('order_leads').update({ status }).eq('id', id);
    if (error) {
      console.error('Supabase updateLeadStatus error:', error.message);
      return false;
    }
    return true;
  }

  const leads = getLocalItem<OrderLead[]>(STORAGE_KEYS.LEADS, initialOrderLeads);
  const index = leads.findIndex((l) => l.id === id);
  if (index !== -1) {
    leads[index].status = status;
    setLocalItem(STORAGE_KEYS.LEADS, leads);
    return true;
  }
  return false;
}

// ==========================================
// STORE SETTINGS
// ==========================================

export async function getStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'default')
      .single();
    if (!error && data) return data as StoreSettings;
    console.error('Supabase getStoreSettings error:', error?.message);
  }
  return getLocalItem<StoreSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated = { ...current, ...updates };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('store_settings').upsert(updated);
    if (error) {
      console.error('Supabase updateStoreSettings error:', error.message);
      throw new Error(error.message || 'Failed to save settings.');
    }
    return updated;
  }

  setLocalItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}
