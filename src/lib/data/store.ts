import { Product, Category, Brand, OrderLead, StoreSettings, FilterState, LeadStatus } from '@/types';
import { initialProducts, initialCategories, initialBrands, initialOrderLeads, initialSettings } from './mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

// Local storage keys for offline/local mode persistence
const STORAGE_KEYS = {
  PRODUCTS: 'home_sport_products_v1',
  CATEGORIES: 'home_sport_categories_v1',
  BRANDS: 'home_sport_brands_v1',
  LEADS: 'home_sport_leads_v1',
  SETTINGS: 'home_sport_settings_v1',
};

// Helper to get in-browser local storage or fallback to mock
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error('Error reading localStorage', e);
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
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(id, name, slug),
          category:categories(id, name, slug)
        `);
      if (!error && data && data.length > 0) {
        products = data as unknown as Product[];
      } else {
        products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
      }
    } catch {
      products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
    }
  } else {
    products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
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
  const products = await getProducts();
  const match = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return match || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  const match = products.find((p) => p.id === id);
  return match || null;
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').insert([newProduct]);
    } catch (e) {
      console.error('Supabase product insert error', e);
    }
  }

  const products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  const updated = [newProduct, ...products];
  setLocalItem(STORAGE_KEYS.PRODUCTS, updated);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').update(updates).eq('id', id);
    } catch (e) {
      console.error('Supabase product update error', e);
    }
  }

  const products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...updates, updated_at: new Date().toISOString() };
  products[index] = updatedProduct;
  setLocalItem(STORAGE_KEYS.PRODUCTS, products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase product delete error', e);
    }
  }

  const products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  const filtered = products.filter((p) => p.id !== id);
  setLocalItem(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
}

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories(): Promise<Category[]> {
  const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const products = await getProducts();

  // Recalculate dynamic product counts
  return categories.map((cat) => {
    const count = products.filter((p) => {
      const slug = typeof p.category === 'object' && p.category ? p.category.slug : p.category_id;
      return slug?.toLowerCase() === cat.slug.toLowerCase();
    }).length;
    return { ...cat, product_count: count };
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createCategory(catData: Omit<Category, 'id'>): Promise<Category> {
  const newCat: Category = {
    ...catData,
    id: `cat-${Date.now()}`,
    product_count: 0,
  };
  const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const updated = [...categories, newCat];
  setLocalItem(STORAGE_KEYS.CATEGORIES, updated);
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
  return categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  const filtered = categories.filter((c) => c.id !== id);
  setLocalItem(STORAGE_KEYS.CATEGORIES, filtered);
  return true;
}

// ==========================================
// BRANDS
// ==========================================

export async function getBrands(): Promise<Brand[]> {
  const brands = getLocalItem<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
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
  const brands = await getBrands();
  return brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createBrand(brandData: Omit<Brand, 'id'>): Promise<Brand> {
  const newBrand: Brand = {
    ...brandData,
    id: `brand-${Date.now()}`,
    product_count: 0,
  };
  const brands = getLocalItem<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
  const updated = [...brands, newBrand];
  setLocalItem(STORAGE_KEYS.BRANDS, updated);
  return newBrand;
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
  const brands = getLocalItem<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
  const index = brands.findIndex((b) => b.id === id);
  if (index === -1) return null;
  brands[index] = { ...brands[index], ...updates };
  setLocalItem(STORAGE_KEYS.BRANDS, brands);
  return brands[index];
}

export async function deleteBrand(id: string): Promise<boolean> {
  const brands = getLocalItem<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
  const filtered = brands.filter((b) => b.id !== id);
  setLocalItem(STORAGE_KEYS.BRANDS, filtered);
  return true;
}

// ==========================================
// ORDER LEADS
// ==========================================

export async function getOrderLeads(): Promise<OrderLead[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('order_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as OrderLead[];
      }
    } catch {
      // Fallback
    }
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
    try {
      await supabase.from('order_leads').insert([newLead]);
    } catch (e) {
      console.error('Supabase lead insert error', e);
    }
  }

  const leads = getLocalItem<OrderLead[]>(STORAGE_KEYS.LEADS, initialOrderLeads);
  const updated = [newLead, ...leads];
  setLocalItem(STORAGE_KEYS.LEADS, updated);
  return newLead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('order_leads').update({ status }).eq('id', id);
    } catch (e) {
      console.error('Supabase lead update error', e);
    }
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
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .single();
      if (!error && data) {
        return data as StoreSettings;
      }
    } catch {
      // Fallback
    }
  }
  return getLocalItem<StoreSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated = { ...current, ...updates };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('store_settings').upsert(updated);
    } catch (e) {
      console.error('Supabase settings update error', e);
    }
  }

  setLocalItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}
