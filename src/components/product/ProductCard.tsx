'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Send } from 'lucide-react';
import { Product } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { useLanguage } from '@/lib/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onQuickOrder?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickOrder }: ProductCardProps) {
  const { formatPrice, formatSecondaryPrice, currency } = useCurrency();
  const { language, t } = useLanguage();

  const brandName = typeof product.brand === 'object' && product.brand ? product.brand.name : 'HOME SPORT';
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop';

  // Stock status styles
  const getStockBadge = () => {
    switch (product.stock_status) {
      case 'in_stock':
        return {
          label: t('stock_in'),
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'low_stock':
        return {
          label: t('stock_low'),
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'out_of_stock':
      default:
        return {
          label: t('stock_out'),
          bg: 'bg-slate-100 text-slate-500 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const stockBadge = getStockBadge();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
      {/* Top Image & Badges Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          {product.is_new && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-sky-500 text-white shadow-sm">
              {t('badge_new')}
            </span>
          )}
          {product.is_sale && product.discount_percent > 0 && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
              {t('badge_sale')} -{product.discount_percent}%
            </span>
          )}
          {product.is_best_seller && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
              {t('badge_best_seller')}
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand Name */}
          <div className="flex items-center justify-between text-xs font-bold tracking-wider text-rose-600 uppercase mb-1">
            <span>{brandName}</span>
            <span className="text-[10px] text-slate-600 font-mono">{product.sku}</span>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-rose-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
              {language === 'km' && product.name_kh ? product.name_kh : product.name}
            </h3>
          </Link>

          {/* Prices & Discount */}
          <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
            <span className="font-extrabold text-lg sm:text-xl text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs sm:text-sm text-slate-600 line-through font-medium">
                {formatPrice(product.original_price)}
              </span>
            )}
            {product.discount_percent > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                -{product.discount_percent}%
              </span>
            )}
          </div>

          {/* Secondary Currency (e.g. KHR conversion) */}
          <div className="text-[11px] text-slate-600 mt-0.5">
            ≈ {formatSecondaryPrice(product.price)}
          </div>

          {/* Available Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2.5 text-xs text-slate-600">
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t('available_sizes')}
              </span>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 5).map((size) => (
                  <span
                    key={size}
                    className="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 5 && (
                  <span className="text-[10px] text-slate-600 self-center">
                    +{product.sizes.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stock Status & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Stock Indicator */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${stockBadge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stockBadge.dot}`} />
              {stockBadge.label}
            </span>
            <span className="text-[11px] text-slate-600">
              {product.stock_quantity > 0 ? `${product.stock_quantity} left` : ''}
            </span>
          </div>

          {/* Action Buttons: View Product & Quick Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors text-center"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('view_product')}</span>
            </Link>

            {onQuickOrder ? (
              <button
                type="button"
                onClick={() => onQuickOrder(product)}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('order_now')}</span>
              </button>
            ) : (
              <Link
                href={`/products/${product.slug}?order=open`}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('order_now')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
