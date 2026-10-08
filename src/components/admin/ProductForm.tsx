'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand, StockStatus } from '@/types';
import { createProduct, updateProduct } from '@/lib/data/store';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  brands: Brand[];
}

export default function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [nameKh, setNameKh] = useState(initialData?.name_kh || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [sku, setSku] = useState(initialData?.sku || `HS-SP-${Math.floor(100 + Math.random() * 900)}`);
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || (typeof initialData?.category === 'object' ? initialData.category?.slug : '') || categories[0]?.slug || ''
  );
  const [brandId, setBrandId] = useState(
    initialData?.brand_id || (typeof initialData?.brand === 'object' ? initialData.brand?.slug : '') || brands[0]?.slug || ''
  );
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '0');
  const [originalPrice, setOriginalPrice] = useState(initialData?.original_price ? String(initialData.original_price) : '');
  const [sizesStr, setSizesStr] = useState(initialData?.sizes?.join(', ') || '40, 41, 42, 43, 44');
  const [colorsStr, setColorsStr] = useState(initialData?.colors?.join(', ') || 'Black, White');
  const [stockStatus, setStockStatus] = useState<StockStatus>(initialData?.stock_status || 'in_stock');
  const [stockQuantity, setStockQuantity] = useState(initialData?.stock_quantity ? String(initialData.stock_quantity) : '10');
  const [isNew, setIsNew] = useState(initialData?.is_new || false);
  const [isSale, setIsSale] = useState(initialData?.is_sale || false);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.is_best_seller || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [imagesStr, setImagesStr] = useState(
    initialData?.images?.join('\n') || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [descriptionKh, setDescriptionKh] = useState(initialData?.description_kh || '');
  const [tagsStr, setTagsStr] = useState(initialData?.tags?.join(', ') || 'football, sport');

  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);

    const numPrice = parseFloat(price) || 0;
    const numOriginal = originalPrice ? parseFloat(originalPrice) : undefined;
    const discountPercent =
      numOriginal && numOriginal > numPrice
        ? Math.round(((numOriginal - numPrice) / numOriginal) * 100)
        : 0;

    const sizes = sizesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const colors = colorsStr.split(',').map((c) => c.trim()).filter(Boolean);
    const images = imagesStr.split('\n').map((img) => img.trim()).filter(Boolean);
    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);

    const selectedBrandObj = brands.find((b) => b.slug === brandId || b.id === brandId);
    const selectedCatObj = categories.find((c) => c.slug === categoryId || c.id === categoryId);

    const payload = {
      name,
      name_kh: nameKh,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku,
      brand_id: brandId,
      brand: selectedBrandObj ? { name: selectedBrandObj.name, slug: selectedBrandObj.slug } : undefined,
      category_id: categoryId,
      category: selectedCatObj ? { name: selectedCatObj.name, slug: selectedCatObj.slug } : undefined,
      price: numPrice,
      original_price: numOriginal,
      discount_percent: discountPercent,
      sizes,
      colors,
      stock_status: stockStatus,
      stock_quantity: parseInt(stockQuantity, 10) || 0,
      is_new: isNew,
      is_sale: isSale || discountPercent > 0,
      is_best_seller: isBestSeller,
      is_featured: isFeatured,
      images,
      description,
      description_kh: descriptionKh,
      tags,
      specifications: initialData?.specifications || {
        'Category': selectedCatObj?.name || 'Football Gear',
        'Brand': selectedBrandObj?.name || 'HOME SPORT',
      },
    };

    try {
      if (isEditing && initialData) {
        await updateProduct(initialData.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEditing ? `Edit: ${initialData?.name}` : 'Add New Product'}
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-extrabold text-sm uppercase text-slate-800 tracking-wider">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Product Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Nike Mercurial Vapor 16 Pro FG"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Product Name (Khmer)
              </label>
              <input
                type="text"
                value={nameKh}
                onChange={(e) => setNameKh(e.target.value)}
                placeholder="e.g. ស្បែកជើងបាល់ទាត់ Nike Mercurial Vapor 16"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. nike-mercurial-vapor-16-pro-fg"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                SKU Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. HS-NK-001"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.name_kh})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Brand *
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 bg-white"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-slate-800 tracking-wider">
            Pricing & Stock
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sale Price ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Original Price ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Stock Status
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 bg-white"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
                />
              </div>
            </div>

            {/* Badges Checkboxes */}
            <div className="pt-2 border-t grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded text-rose-600 w-4 h-4"
                />
                <span>NEW Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isSale}
                  onChange={(e) => setIsSale(e.target.checked)}
                  className="rounded text-rose-600 w-4 h-4"
                />
                <span>SALE Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded text-rose-600 w-4 h-4"
                />
                <span>BEST SELLER</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-rose-600 w-4 h-4"
                />
                <span>Featured on Home</span>
              </label>
            </div>
          </div>
        </div>

        {/* Variants: Sizes & Colors */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-slate-800 tracking-wider">
            Sizes & Colors
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                placeholder="e.g. 39, 40, 41, 42, 43 or S, M, L, XL"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Examples: boots (38, 39, 40, 41, 42, 43, 44), shirts (S, M, L, XL, 2XL)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Available Colors (comma-separated)
              </label>
              <input
                type="text"
                value={colorsStr}
                onChange={(e) => setColorsStr(e.target.value)}
                placeholder="e.g. Volt / Black, Pearl White, Red"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Search Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="e.g. boots, nike, mercurial, vapor, fg"
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Images & Descriptions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-extrabold text-sm uppercase text-slate-800 tracking-wider">
            Media & Descriptions
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Image URLs (one per line)
              </label>
              <textarea
                rows={3}
                value={imagesStr}
                onChange={(e) => setImagesStr(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Engineered for explosive speed on firm ground pitches..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description (Khmer)
                </label>
                <textarea
                  rows={4}
                  value={descriptionKh}
                  onChange={(e) => setDescriptionKh(e.target.value)}
                  placeholder="រចនាឡើងសម្រាប់ល្បឿន និងការបត់បែនលឿនបំផុត..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
