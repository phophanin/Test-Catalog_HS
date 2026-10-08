'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import OrderLeadModal from '@/components/product/OrderLeadModal';
import { Product, Category, Brand, FilterState } from '@/types';
import { getProducts, getCategories, getBrands } from '@/lib/data/store';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  PackageOpen,
  ChevronDown,
} from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Pagination / Load More
  const [displayLimit, setDisplayLimit] = useState<number>(12);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || 'all',
    minPrice: undefined,
    maxPrice: undefined,
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    stockStatus: searchParams.get('stock') || 'all',
    isSale: searchParams.get('sale') === 'true',
    isNew: searchParams.get('new') === 'true',
    isBestSeller: searchParams.get('best_seller') === 'true',
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'featured',
  });

  // Initial load
  useEffect(() => {
    async function init() {
      const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
      setCategories(cats);
      setBrands(brs);
    }
    init();
  }, []);

  // Update filters when query params change
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('search');
    const cat = searchParams.get('category');
    const br = searchParams.get('brand');
    const sale = searchParams.get('sale');
    const isNew = searchParams.get('new');

    setFilters((prev) => ({
      ...prev,
      search: q !== null ? q : prev.search,
      category: cat || prev.category,
      brand: br || prev.brand,
      isSale: sale === 'true' ? true : prev.isSale,
      isNew: isNew === 'true' ? true : prev.isNew,
    }));
  }, [searchParams]);

  // Execute query on filter change
  useEffect(() => {
    async function filterAndFetch() {
      setIsLoading(true);
      const filtered = await getProducts(filters);
      setProducts(filtered);
      setIsLoading(false);
    }
    filterAndFetch();
  }, [filters]);

  // Handle Load More
  useEffect(() => {
    setDisplayedProducts(products.slice(0, displayLimit));
  }, [products, displayLimit]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      brand: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      size: '',
      color: '',
      stockStatus: 'all',
      isSale: false,
      isNew: false,
      isBestSeller: false,
      sortBy: 'featured',
    });
    setDisplayLimit(12);
  };

  const handleRemoveChip = (key: keyof FilterState) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      setFilters({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else if (key === 'isSale' || key === 'isNew' || key === 'isBestSeller') {
      setFilters({ ...filters, [key]: false });
    } else if (key === 'category' || key === 'brand' || key === 'stockStatus') {
      setFilters({ ...filters, [key]: 'all' });
    } else {
      setFilters({ ...filters, [key]: '' });
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.category && filters.category !== 'all') ||
    (filters.brand && filters.brand !== 'all') ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.size ||
    filters.color ||
    (filters.stockStatus && filters.stockStatus !== 'all') ||
    filters.isSale ||
    filters.isNew ||
    filters.isBestSeller
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Title & Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>HOME SPORT</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{t('nav_products')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            {t('nav_products')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our complete sports collection. Select your size and order directly through Telegram, Messenger or phone.
          </p>
        </div>

        {/* Top Control Bar: Search, Count, Mobile Filters, Sort Dropdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Counts & Controls */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              <strong className="text-slate-900 font-black">{products.length}</strong>{' '}
              {t('products_found')}
            </span>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Trigger */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                <span>{t('filter')}</span>
              </button>

              {/* Sort Selector */}
              <div className="relative inline-block">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sortBy: e.target.value as FilterState['sortBy'],
                    })
                  }
                  className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-800 pl-3 pr-8 py-2 rounded-xl text-xs font-bold border-none focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer transition-colors"
                >
                  <option value="featured">{t('sort_featured')}</option>
                  <option value="newest">{t('sort_newest')}</option>
                  <option value="price_asc">{t('sort_price_low')}</option>
                  <option value="price_desc">{t('sort_price_high')}</option>
                  <option value="name_asc">{t('sort_name')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-slate-500 mr-1">Active Filters:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                Keyword: &ldquo;{filters.search}&rdquo;
                <button type="button" onClick={() => handleRemoveChip('search')}>
                  <X className="w-3 h-3 hover:text-rose-600" />
                </button>
              </span>
            )}

            {filters.category && filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                Category: {filters.category}
                <button type="button" onClick={() => handleRemoveChip('category')}>
                  <X className="w-3 h-3 hover:text-rose-900" />
                </button>
              </span>
            )}

            {filters.brand && filters.brand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                Brand: {filters.brand}
                <button type="button" onClick={() => handleRemoveChip('brand')}>
                  <X className="w-3 h-3 hover:text-rose-900" />
                </button>
              </span>
            )}

            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                <button type="button" onClick={() => handleRemoveChip('minPrice')}>
                  <X className="w-3 h-3 hover:text-rose-900" />
                </button>
              </span>
            )}

            {filters.size && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                Size: {filters.size}
                <button type="button" onClick={() => handleRemoveChip('size')}>
                  <X className="w-3 h-3 hover:text-rose-900" />
                </button>
              </span>
            )}

            {filters.color && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                Color: {filters.color}
                <button type="button" onClick={() => handleRemoveChip('color')}>
                  <X className="w-3 h-3 hover:text-rose-900" />
                </button>
              </span>
            )}

            {filters.stockStatus && filters.stockStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold">
                Stock: {filters.stockStatus}
                <button type="button" onClick={() => handleRemoveChip('stockStatus')}>
                  <X className="w-3 h-3 hover:text-rose-600" />
                </button>
              </span>
            )}

            {filters.isSale && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold">
                Sale Items
                <button type="button" onClick={() => handleRemoveChip('isSale')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.isNew && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500 text-white text-xs font-bold">
                New Items
                <button type="button" onClick={() => handleRemoveChip('isNew')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.isBestSeller && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-900 text-xs font-bold">
                Best Sellers
                <button type="button" onClick={() => handleRemoveChip('isBestSeller')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline ml-2"
            >
              {t('reset_filters')}
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          {/* Sidebar Filters */}
          <ProductFilters
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={(f) => {
              setFilters(f);
              setDisplayLimit(12);
            }}
            onReset={handleResetFilters}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">Loading catalog items...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-8">
                <ProductGrid
                  products={displayedProducts}
                  onQuickOrder={(prod) => setActiveModalProduct(prod)}
                />

                {/* Load More Button */}
                {displayedProducts.length < products.length && (
                  <div className="pt-6 text-center">
                    <button
                      type="button"
                      onClick={() => setDisplayLimit((prev) => prev + 12)}
                      className="px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-sm shadow-sm transition-all hover:scale-105"
                    >
                      Load More Products ({products.length - displayedProducts.length} remaining)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* No Products Found */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-1">
                  {t('no_products_found')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                  {t('no_products_msg')}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {t('reset_filters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Order Modal */}
      {activeModalProduct && (
        <OrderLeadModal
          product={activeModalProduct}
          isOpen={Boolean(activeModalProduct)}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading HOME SPORT catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
