'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import OrderLeadModal from '@/components/product/OrderLeadModal';
import { Product, Category, Brand } from '@/types';
import { getProducts, getCategories, getBrands } from '@/lib/data/store';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  Send,
  MessageCircle,
  Phone,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      const [cats, brs, prods] = await Promise.all([
        getCategories(),
        getBrands(),
        getProducts(),
      ]);

      setCategories(cats);
      setBrands(brs);

      // Featured products
      setFeaturedProducts(prods.filter((p) => p.is_featured).slice(0, 8));
      // Best sellers
      setBestSellers(prods.filter((p) => p.is_best_seller).slice(0, 4));
      // New arrivals
      setNewArrivals(prods.filter((p) => p.is_new).slice(0, 4));
      // Hot sale
      setSaleProducts(prods.filter((p) => p.is_sale).slice(0, 4));
    }

    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* 2. HERO SECTION */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          {/* Subtle background glow & grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>CAMBODIA&apos;S PREMIER FOOTBALL STORE</span>
                </div>

                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] uppercase">
                  {t('hero_title')}
                </h1>

                <p className="text-base sm:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  {t('hero_subtitle')}
                </p>

                {/* Hero CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
                  >
                    <span>{t('hero_shop_now')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm sm:text-base transition-colors"
                  >
                    <span>{t('hero_contact_us')}</span>
                  </Link>
                </div>

                {/* Quick stats pills */}
                <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Authentic Gear</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-rose-500">25</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Provinces Delivery</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-sky-400">5★</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Player Rated</div>
                  </div>
                </div>
              </div>

              {/* Hero Visual Banner (placeholder sports image) */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
                  <Image
                    src="https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=900&auto=format&fit=crop"
                    alt="HOME SPORT Boots Collection"
                    fill
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider">
                        Featured Boot
                      </span>
                      <span className="text-xs font-bold bg-rose-600 px-2 py-0.5 rounded text-white">
                        NEW SEASON
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base mt-1">Nike Mercurial Vapor 16</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Air Zoom Technology for explosive speed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. FEATURED CATEGORIES */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">
                  Explore by Category
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t('section_featured_categories')}
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 group"
              >
                <span>View All Categories</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                        {language === 'km' ? cat.name_kh : cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {cat.product_count} {t('products_found')}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                      <span>Browse Products</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. FEATURED PRODUCTS */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Handpicked Gear
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t('section_featured_products')}
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 group"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <ProductGrid
              products={featuredProducts}
              onQuickOrder={(prod) => setActiveModalProduct(prod)}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. BEST SELLERS */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Most Popular Choices
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t('section_best_sellers')}
                </h2>
              </div>
              <Link
                href="/products?sort=popularity"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-rose-600 group"
              >
                <span>Browse All Best Sellers</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <ProductGrid
              products={bestSellers}
              onQuickOrder={(prod) => setActiveModalProduct(prod)}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. NEW ARRIVALS */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-extrabold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Fresh In Stock
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t('section_new_arrivals')}
                </h2>
              </div>
              <Link
                href="/products?new=true"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-rose-600 group"
              >
                <span>See All New Arrivals</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <ProductGrid
              products={newArrivals}
              onQuickOrder={(prod) => setActiveModalProduct(prod)}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. SALE PRODUCTS */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-20 bg-rose-50/50 border-y border-rose-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                  🔥 Big Discounts
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {t('section_sale_products')}
                </h2>
              </div>
              <Link
                href="/products?sale=true"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 group"
              >
                <span>View All Sale Items</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <ProductGrid
              products={saleProducts}
              onQuickOrder={(prod) => setActiveModalProduct(prod)}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. POPULAR BRANDS */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">
                Official Brands
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {t('section_popular_brands')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                We stock top performance products from leading global athletic brands.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/brand/${b.slug}`}
                  className="group flex flex-col items-center p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 bg-white border border-slate-200 group-hover:scale-105 transition-transform">
                    <Image
                      src={b.logo_url}
                      alt={b.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                    {b.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {b.product_count} {t('products_found')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 9. WHY CHOOSE HOME SPORT */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest">
                Our Commitment
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {t('section_why_choose')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  Genuine & Tested Products
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every football boot, jersey, and accessory in our catalog is hand-checked for stitching, stud durability, and authentic quality standards before reaching you.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-sky-600/20 text-sky-400 flex items-center justify-center mb-5">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  Lightning Delivery Across Cambodia
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Same-day delivery across Phnom Penh city, and safe overnight bus/van delivery to all 25 provinces via reliable courier partners (J&T, Virak Buntham, Capitol).
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  Personal Football Consultation
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Not sure whether you need FG, AG, or Turf studs? Unsure about shoe width? Chat directly with our sales players on Telegram for personalized size recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10. CALL TO ACTION */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-rose-600 to-rose-700 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
              {t('section_cta_title')}
            </h2>
            <p className="text-base sm:text-lg text-rose-100 max-w-2xl mx-auto leading-relaxed">
              {t('section_cta_subtitle')}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href="https://t.me/homesportkh"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-rose-600 hover:bg-slate-100 font-extrabold text-sm sm:text-base shadow-xl transition-transform hover:scale-105"
              >
                <Send className="w-4 h-4 text-sky-500" />
                <span>Message Telegram: @homesportkh</span>
              </a>

              <a
                href="https://m.me/homesportcambodia"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-black text-white font-extrabold text-sm sm:text-base shadow-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span>Chat on Facebook Messenger</span>
              </a>

              <a
                href="tel:+85512345678"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-rose-800/80 hover:bg-rose-900 text-white font-bold text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+855 12 345 678</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Quick Order Lead Modal */}
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
