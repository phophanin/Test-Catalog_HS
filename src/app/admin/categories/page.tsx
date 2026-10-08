'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/data/store';
import { PlusCircle, Edit, Trash2, ExternalLink, Save, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nameKh, setNameKh] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setNameKh('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setNameKh(cat.name_kh);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, {
          name,
          name_kh: nameKh,
          slug,
          description,
          image_url: imageUrl,
        });
      } else {
        await createCategory({
          name,
          name_kh: nameKh,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          image_url: imageUrl,
          display_order: categories.length + 1,
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

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Delete category "${catName}"?`)) {
      try {
        await deleteCategory(id);
        await loadData();
      } catch (err) {
        console.error('Delete category error:', err);
        alert(`Failed to delete category: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize HOME SPORT catalog hierarchy and navigation menus.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full bg-slate-100">
              <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">{cat.name}</h3>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {cat.product_count} products
                  </span>
                </div>
                <div className="text-xs font-semibold text-rose-700">{cat.name_kh}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">/category/{cat.slug}</div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cat.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/category/${cat.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingCat ? 'Edit Category' : 'Add New Category'}
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
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCat && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Category Name (Khmer)
                </label>
                <input
                  type="text"
                  value={nameKh}
                  onChange={(e) => setNameKh(e.target.value)}
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
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
