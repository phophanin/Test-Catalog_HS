'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/types';
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/lib/data/store';
import { PlusCircle, Edit, Trash2, ExternalLink, X } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKh, setDescriptionKh] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [country, setCountry] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    const brs = await getBrands();
    setBrands(brs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setDescription('');
    setDescriptionKh('');
    setLogoUrl('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300');
    setCountry('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setDescription(b.description || '');
    setDescriptionKh(b.description_kh || '');
    setLogoUrl(b.logo_url);
    setCountry(b.country || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, {
          name,
          slug,
          description,
          description_kh: descriptionKh,
          logo_url: logoUrl,
          country,
        });
      } else {
        await createBrand({
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          description_kh: descriptionKh,
          logo_url: logoUrl,
          country,
          is_featured: true,
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (confirm(`Delete brand "${brandName}"?`)) {
      await deleteBrand(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Brands
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure partner brands, logos, origin countries, and descriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                  <Image src={b.logo_url} alt={b.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{b.name}</h3>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Origin: {b.country || 'Global'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">/brand/{b.slug}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600">
                {b.product_count} products
              </span>

              <div className="flex items-center gap-1">
                <Link
                  href={`/brand/${b.slug}`}
                  target="_blank"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEditModal(b)}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id, b.name)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingBrand && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Country of Origin
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Germany, USA, Japan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Logo Image URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description (Khmer)
                </label>
                <textarea
                  rows={2}
                  value={descriptionKh}
                  onChange={(e) => setDescriptionKh(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  {isSaving ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
