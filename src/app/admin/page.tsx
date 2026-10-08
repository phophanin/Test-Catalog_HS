'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  Award,
  Inbox,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  Clock,
  Phone,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Product, Category, Brand, OrderLead } from '@/types';
import { getProducts, getCategories, getBrands, getOrderLeads } from '@/lib/data/store';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [leads, setLeads] = useState<OrderLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [prods, cats, brs, lds] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands(),
        getOrderLeads(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setBrands(brs);
      setLeads(lds);
      setIsLoading(false);
    }
    loadStats();
  }, []);

  const lowStockProducts = products.filter(
    (p) => p.stock_status === 'low_stock' || p.stock_quantity <= 3
  );

  const newLeads = leads.filter((l) => l.status === 'new');

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of HOME SPORT catalog, inventory status, and recent customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          href="/admin/products"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Products</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{products.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live in catalog</span>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Order Leads</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{leads.length}</div>
          <span className="text-[11px] text-sky-600 font-bold mt-1 block">
            {newLeads.length} new pending leads
          </span>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Categories</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{categories.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active categories</span>
        </Link>

        <Link
          href="/admin/brands"
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Brands</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{brands.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Official brands</span>
        </Link>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">
                Low Stock Alert ({lowStockProducts.length} items)
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                The following products are running low in the Phnom Penh warehouse:{' '}
                {lowStockProducts.map((p) => p.name).slice(0, 3).join(', ')}...
              </p>
            </div>
          </div>
          <Link
            href="/admin/products?stock=low_stock"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex-shrink-0"
          >
            Manage Stock
          </Link>
        </div>
      )}

      {/* Recent Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Recent Order Conversions & Leads
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct inquiries submitted from Telegram, Messenger, or website forms.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All ({leads.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Product & Specs</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{lead.customer_name}</div>
                    <div className="text-slate-500 text-[11px]">{lead.customer_phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-slate-100 text-slate-700">
                      {lead.contact_channel === 'telegram' && <Send className="w-3 h-3 text-sky-500" />}
                      {lead.contact_channel === 'messenger' && <MessageCircle className="w-3 h-3 text-blue-600" />}
                      {lead.contact_channel === 'phone' && <Phone className="w-3 h-3 text-emerald-600" />}
                      {lead.contact_channel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 truncate max-w-xs">{lead.product_name}</div>
                    <div className="text-slate-500 text-[11px]">
                      {lead.selected_size ? `Size: ${lead.selected_size}` : ''}
                      {lead.selected_color ? ` • ${lead.selected_color}` : ''}
                      {lead.quantity ? ` • Qty: ${lead.quantity}` : ''}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-slate-900">
                    ${lead.total_price}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                        lead.status === 'new'
                          ? 'bg-sky-100 text-sky-700'
                          : lead.status === 'contacted'
                          ? 'bg-amber-100 text-amber-700'
                          : lead.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
