'use client';

import React, { useState } from 'react';
import { FilterState, Category, Brand } from '@/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Filter, X, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function ProductFilters({
  categories,
  brands,
  filters,
  onFilterChange,
  onReset,
  isMobileOpen,
  onMobileClose,
}: ProductFiltersProps) {
  const { language, t } = useLanguage();

  const priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under $20', min: 0, max: 20 },
    { label: '$20 - $50', min: 20, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100+', min: 100, max: 9999 },
  ];

  const bootSizes = ['38', '39', '40', '41', '42', '43', '44', '45'];
  const apparelSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  const colors = [
    { name: 'Black', hex: '#09090b' },
    { name: 'White', hex: '#f8fafc', border: true },
    { name: 'Red', hex: '#e11d48' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Volt', hex: '#84cc16' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Silver', hex: '#94a3b8' },
  ];

  const handlePriceSelect = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleSizeSelect = (size: string) => {
    const newSize = filters.size === size ? '' : size;
    onFilterChange({ ...filters, size: newSize });
  };

  const handleColorSelect = (colorName: string) => {
    const newColor = filters.color === colorName ? '' : colorName;
    onFilterChange({ ...filters, color: newColor });
  };

  const activeFiltersCount = [
    filters.category && filters.category !== 'all',
    filters.brand && filters.brand !== 'all',
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    Boolean(filters.size),
    Boolean(filters.color),
    filters.stockStatus && filters.stockStatus !== 'all',
    filters.isSale,
    filters.isNew,
    filters.isBestSeller,
  ].filter(Boolean).length;

  const content = (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-rose-600" />
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider">
            {t('filter')}
          </h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('reset_filters')}</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          {t('filter_category')}
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, category: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              !filters.category || filters.category === 'all'
                ? 'bg-rose-50 text-rose-600 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat.slug })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-rose-50 text-rose-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{language === 'km' ? cat.name_kh : cat.name}</span>
                {cat.product_count !== undefined && (
                  <span className="text-[10px] text-slate-400">({cat.product_count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          {t('filter_brand')}
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, brand: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              !filters.brand || filters.brand === 'all'
                ? 'bg-rose-50 text-rose-600 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Brands</span>
          </button>
          {brands.map((b) => {
            const isSelected = filters.brand === b.slug;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, brand: b.slug })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-rose-50 text-rose-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{b.name}</span>
                {b.product_count !== undefined && (
                  <span className="text-[10px] text-slate-400">({b.product_count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          {t('filter_price')}
        </label>
        <div className="space-y-1">
          {priceRanges.map((range, idx) => {
            const isSelected =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePriceSelect(range.min, range.max)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-rose-50 text-rose-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter (Boots + Apparel) */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          {t('filter_size')} (Boots: 38-45)
        </label>
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {bootSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSizeSelect(s)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                filters.size === s
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Apparel Sizes (S-3XL)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {apparelSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSizeSelect(s)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                filters.size === s
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          {t('filter_color')}
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isSelected = filters.color === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorSelect(c.name)}
                title={c.name}
                className={`relative w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                  isSelected ? 'scale-110 ring-2 ring-rose-500 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {c.border && <span className="absolute inset-0 rounded-full border border-slate-300" />}
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      c.name === 'White' || c.name === 'Volt' || c.name === 'Yellow'
                        ? 'text-slate-950'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          {t('filter_stock')}
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'All Availability' },
            { id: 'in_stock', label: t('stock_in') },
            { id: 'low_stock', label: t('stock_low') },
            { id: 'out_of_stock', label: t('stock_out') },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange({ ...filters, stockStatus: item.id })}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filters.stockStatus === item.id || (!filters.stockStatus && item.id === 'all')
                  ? 'bg-rose-50 text-rose-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Type / Badges */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          {t('filter_tags')}
        </label>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={filters.isSale}
              onChange={(e) => onFilterChange({ ...filters, isSale: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span>🔥 {t('badge_sale')} Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => onFilterChange({ ...filters, isNew: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span>✨ {t('badge_new')} Items</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={filters.isBestSeller}
              onChange={(e) => onFilterChange({ ...filters, isBestSeller: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span>⭐ {t('badge_best_seller')}</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b mb-4">
                <span className="font-extrabold text-slate-900 text-base">Filter Products</span>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t mt-6">
              <button
                type="button"
                onClick={onMobileClose}
                className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
