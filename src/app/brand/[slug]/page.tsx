'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import OrderLeadModal from '@/components/product/OrderLeadModal';
import { Product, Brand } from '@/types';
import { getBrandBySlug, getProducts } from '@/lib/data/store';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ChevronRight, PackageOpen, Award } from 'lucide-react';

export default function BrandPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, t } = useLanguage();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadBrand() {
      if (!slug) return;
      setIsLoading(true);
      const b = await getBrandBySlug(slug);
      setBrand(b);

      const prods = await getProducts({ brand: slug });
      setProducts(prods);
      setIsLoading(false);
    }
    loadBrand();
  }, [slug]);

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
            Brands
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{brand?.name || slug}</span>
        </nav>

        {/* Brand Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {brand?.logo_url && (
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 shadow-md">
              <Image
                src={brand.logo_url}
                alt={brand.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-black uppercase text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                Official Brand
              </span>
              {brand?.country && (
                <span className="text-xs font-semibold text-slate-500">
                  Origin: {brand.country}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
              {brand?.name || slug}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {language === 'km' && brand?.description_kh
                ? brand.description_kh
                : brand?.description}
            </p>

            <div className="text-xs font-bold text-slate-500 pt-1">
              <strong className="text-slate-900 font-black">{products.length}</strong> products available in HOME SPORT catalog
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid
            products={products}
            onQuickOrder={(p) => setActiveModalProduct(p)}
          />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-slate-900 mb-1">
              No products available for this brand
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Check out other top performance brands in our shop.
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider inline-block"
            >
              Browse All Products
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
