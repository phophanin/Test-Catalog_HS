'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import OrderLeadModal from '@/components/product/OrderLeadModal';
import { Product } from '@/types';
import { getProducts } from '@/lib/data/store';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Search, PackageOpen, X, Sparkles } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const suggestedSearches = [
    'Nike Mercurial',
    'Predator FT',
    'Football Boots',
    'Cambodia Jersey',
    'Joma Futsal',
    'Grip Socks',
    'HS-NK-001',
  ];

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q.trim()) {
      executeSearch(q);
    } else {
      setResults([]);
    }
  }, [searchParams]);

  const executeSearch = async (searchTerm: string) => {
    setIsLoading(true);
    const prods = await getProducts({ search: searchTerm });
    setResults(prods);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggested: string) => {
    setQuery(suggested);
    router.push(`/search?q=${encodeURIComponent(suggested)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Input Hero */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            Search Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Search football boots, team jerseys, brand names, or specific SKU codes.
          </p>

          <form onSubmit={handleSubmit} className="relative shadow-md rounded-2xl">
            <input
              type="text"
              autoFocus
              placeholder="e.g. Nike, Mercurial, 42, Jersey, HS-NK-001..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white text-slate-900 pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-500" />
              Popular:
            </span>
            {suggestedSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        {initialQuery && (
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="text-sm font-semibold text-slate-600">
              Results for &ldquo;<strong className="text-slate-900">{initialQuery}</strong>&rdquo;:
            </div>
            <span className="text-xs font-bold text-rose-600">
              {results.length} {t('products_found')}
            </span>
          </div>
        )}

        {/* Results Display */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Searching products...</p>
          </div>
        ) : results.length > 0 ? (
          <ProductGrid
            products={results}
            onQuickOrder={(p) => setActiveModalProduct(p)}
          />
        ) : initialQuery ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-black text-xl text-slate-900 mb-1">
              {t('no_products_found')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              {t('no_products_msg')}
            </p>
            <button
              type="button"
              onClick={() => handleSuggestionClick('Football Boots')}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider inline-block hover:bg-black transition-colors"
            >
              Browse Football Boots Instead
            </button>
          </div>
        ) : null}
      </main>

      <Footer />

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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
