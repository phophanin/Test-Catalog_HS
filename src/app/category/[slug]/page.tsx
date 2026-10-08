'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import OrderLeadModal from '@/components/product/OrderLeadModal';
import { Product, Category } from '@/types';
import { getCategoryBySlug, getProducts } from '@/lib/data/store';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ChevronRight, PackageOpen, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, t } = useLanguage();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadCategory() {
      if (!slug) return;
      setIsLoading(true);
      const cat = await getCategoryBySlug(slug);
      setCategory(cat);

      const prods = await getProducts({ category: slug });
      setProducts(prods);
      setIsLoading(false);
    }
    loadCategory();
  }, [slug]);

  // Handle sorting and size filtering
  let filtered = [...products];
  if (selectedSize && selectedSize !== 'all') {
    filtered = filtered.filter((p) => p.sizes.includes(selectedSize));
  }
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Collect all available sizes in this category
  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes))).sort();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{category?.name || slug}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-md">
          {category?.image_url && (
            <div className="absolute inset-0 opacity-25">
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-xs font-black uppercase text-rose-500 tracking-widest">
              Category Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {category?.name || slug}
            </h1>
            {category?.name_kh && (
              <p className="text-lg sm:text-xl font-bold text-rose-300">
                {category.name_kh}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {category?.description}
            </p>
          </div>
        </div>

        {/* Filter / Sort bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-semibold text-slate-600">
            Showing <strong className="text-slate-900 font-black">{filtered.length}</strong> items in this category
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            {/* Quick Size Filter */}
            {allSizes.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500">Size:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-slate-100 text-slate-800 px-2.5 py-1.5 rounded-lg font-bold border-none text-xs focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">All Sizes</option>
                  {allSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Selector */}
            <div className="relative inline-block text-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-100 text-slate-800 pl-3 pr-8 py-2 rounded-xl font-bold border-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading products...</p>
          </div>
        ) : filtered.length > 0 ? (
          <ProductGrid
            products={filtered}
            onQuickOrder={(p) => setActiveModalProduct(p)}
          />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-slate-900 mb-1">
              No products found in this category
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Check back soon as new inventory arrives weekly at HOME SPORT!
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider inline-block"
            >
              View All Products
            </Link>
          </div>
        )}
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
