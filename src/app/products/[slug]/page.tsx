'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import OrderLeadModal from '@/components/product/OrderLeadModal';
import { Product } from '@/types';
import { getProductBySlug, getProducts } from '@/lib/data/store';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { generateTelegramLink, generateMessengerLink, generatePhoneLink } from '@/lib/utils';
import {
  Send,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  Ruler,
  Share2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { formatPrice, formatSecondaryPrice } = useCurrency();
  const { language, t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      const found = await getProductBySlug(slug);
      if (found) {
        setProduct(found);
        setSelectedSize(found.sizes?.[0] || '');
        setSelectedColor(found.colors?.[0] || '');

        // Fetch related products in same category
        const all = await getProducts();
        const related = all
          .filter((p) => p.id !== found.id && p.category_id === found.category_id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
    loadProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const brandName = typeof product.brand === 'object' && product.brand ? product.brand.name : 'HOME SPORT';
  const brandSlug = typeof product.brand === 'object' && product.brand ? product.brand.slug : 'brand';
  const categoryName = typeof product.category === 'object' && product.category ? product.category.name : 'Category';
  const categorySlug = typeof product.category === 'object' && product.category ? product.category.slug : 'category';

  const telegramUser = process.env.NEXT_PUBLIC_STORE_TELEGRAM || 'homesportkh';
  const messengerUser = process.env.NEXT_PUBLIC_STORE_MESSENGER || 'homesportcambodia';
  const phone = process.env.NEXT_PUBLIC_STORE_PHONE || '+855 12 345 678';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const telegramOrderUrl = generateTelegramLink({
    username: telegramUser,
    productName: product.name,
    sku: product.sku,
    size: selectedSize,
    color: selectedColor,
    price: formatPrice(product.price * quantity),
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/category/${categorySlug}`} className="hover:text-slate-900 transition-colors">
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Gallery (5 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Active Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-center"
                />

                {/* Badges on main image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new && (
                    <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-sky-500 text-white shadow-sm">
                      {t('badge_new')}
                    </span>
                  )}
                  {product.is_sale && product.discount_percent > 0 && (
                    <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                      {t('badge_sale')} -{product.discount_percent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-rose-600 ring-2 ring-rose-600/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Purchase Actions (7 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & SKU Header */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/brand/${brandSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider transition-colors"
                  >
                    <span>Brand: {brandName}</span>
                  </Link>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Product Title (EN & Khmer) */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>
                {product.name_kh && (
                  <p className="text-base sm:text-lg font-bold text-rose-700 leading-snug">
                    {product.name_kh}
                  </p>
                )}

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                    {product.discount_percent > 0 && (
                      <span className="text-xs font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded-full">
                        SAVE {product.discount_percent}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Cambodian Riel Price: ≈{' '}
                    <strong className="text-slate-700">{formatSecondaryPrice(product.price)}</strong>
                  </div>
                </div>

                {/* Stock Status Indicator */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock_status === 'in_stock'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : product.stock_status === 'low_stock'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.stock_status === 'in_stock'
                          ? 'bg-emerald-500'
                          : product.stock_status === 'low_stock'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    {product.stock_status === 'in_stock'
                      ? t('stock_in')
                      : product.stock_status === 'low_stock'
                      ? t('stock_low')
                      : t('stock_out')}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({product.stock_quantity} available in Phnom Penh store)
                  </span>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {t('select_size')}:{' '}
                        <span className="text-rose-600 font-black">{selectedSize}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>{t('size_guide')}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-[48px] py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            selectedSize === s
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      {t('select_color')}:{' '}
                      <span className="text-rose-600 font-black">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                            selectedColor === c
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="pt-2 flex items-center gap-4">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('quantity')}:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-extrabold text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversion Buttons: Telegram, Messenger, Direct Modal */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{t('order_now')} (Direct Inquiry)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={telegramOrderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram @homesportkh</span>
                  </a>

                  <a
                    href={generateMessengerLink(messengerUser)}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Facebook Messenger</span>
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <a
                    href={generatePhoneLink(phone)}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Call Sales: {phone}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specs Tabs */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Description */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                {t('product_desc')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              {product.description_kh && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-sm text-slate-800 leading-relaxed font-medium">
                  {product.description_kh}
                </div>
              )}
            </div>

            {/* Specifications Table */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                {t('product_specs')}
              </h3>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200 text-xs">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex p-3">
                    <span className="w-1/2 font-bold text-slate-600">{key}</span>
                    <span className="w-1/2 font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
              {t('product_related')}
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </main>

      <Footer />

      {/* Order Lead Modal */}
      {isOrderModalOpen && (
        <OrderLeadModal
          product={product}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          defaultSize={selectedSize}
          defaultColor={selectedColor}
        />
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Football Gear Size Guide
              </h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Football Boots (EU / CM):</h4>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-2 bg-slate-100 rounded">EU 39 (24.5cm)</div>
                  <div className="p-2 bg-slate-100 rounded">EU 40 (25.0cm)</div>
                  <div className="p-2 bg-slate-100 rounded">EU 41 (26.0cm)</div>
                  <div className="p-2 bg-slate-100 rounded">EU 42 (26.5cm)</div>
                  <div className="p-2 bg-slate-100 rounded">EU 43 (27.5cm)</div>
                  <div className="p-2 bg-slate-100 rounded">EU 44 (28.0cm)</div>
                  <div className="p-2 bg-slate-100 rounded">EU 45 (29.0cm)</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Jerseys & Shorts (Chest / Height):</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-100 rounded">S: 160-168cm (50-60kg)</div>
                  <div className="p-2 bg-slate-100 rounded">M: 168-174cm (60-70kg)</div>
                  <div className="p-2 bg-slate-100 rounded">L: 174-180cm (70-80kg)</div>
                  <div className="p-2 bg-slate-100 rounded">XL: 180-185cm (80-90kg)</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * For football boots with thicker grip socks, we recommend choosing half a size or one size up for wide feet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
