'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Product, Category, Brand } from '@/types';
import { getProducts, getCategories, getBrands, deleteProduct } from '@/lib/data/store';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [prods, cats, brs] = await Promise.all([
      getProducts(),
      getCategories(),
      getBrands(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setBrands(brs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        await loadData();
      } catch (err) {
        console.error('Delete product error:', err);
        alert(`Failed to delete product: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const brandName = typeof p.brand === 'object' && p.brand ? p.brand.name.toLowerCase() : '';
    const brandSlug = typeof p.brand === 'object' && p.brand ? p.brand.slug : p.brand_id;
    const catSlug = typeof p.category === 'object' && p.category ? p.category.slug : p.category_id;
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.name_kh && p.name_kh.includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      brandName.includes(q);

    const matchesCat = selectedCategory === 'all' || catSlug === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || brandSlug === selectedBrand;
    const matchesStock = selectedStock === 'all' || p.stock_status === selectedStock;

    return matchesSearch && matchesCat && matchesBrand && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {products.length} products registered in HOME SPORT catalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Brand / Cat</th>
                <th className="p-4">Price</th>
                <th className="p-4">Sizes</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const brandName = typeof p.brand === 'object' && p.brand ? p.brand.name : 'N/A';
                  const catName = typeof p.category === 'object' && p.category ? p.category.name : 'N/A';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <Image
                              src={p.images[0] || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=300'}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1">
                              {p.name}
                            </div>
                            {p.name_kh && (
                              <div className="text-[11px] font-medium text-slate-500 line-clamp-1">
                                {p.name_kh}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-semibold text-slate-600">
                        {p.sku}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-800">{brandName}</div>
                        <div className="text-[10px] text-slate-500">{catName}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">${p.price}</div>
                        {p.original_price && p.original_price > p.price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ${p.original_price} (-{p.discount_percent}%)
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {p.sizes.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                          {p.sizes.length > 3 && (
                            <span className="text-[10px] text-slate-400">+{p.sizes.length - 3}</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            p.stock_status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-700'
                              : p.stock_status === 'low_stock'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {p.stock_status.replace('_', ' ')} ({p.stock_quantity})
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.is_sale && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase">
                              SALE
                            </span>
                          )}
                          {p.is_new && (
                            <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-[9px] font-black uppercase">
                              NEW
                            </span>
                          )}
                          {p.is_best_seller && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase">
                              BEST
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            title="View on site"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            title="Edit"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No products match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
