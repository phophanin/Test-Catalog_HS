'use client';

import React, { useState, useEffect } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { Category, Brand } from '@/types';
import { getCategories, getBrands } from '@/lib/data/store';

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
      setCategories(cats);
      setBrands(brs);
      setIsLoading(false);
    }
    init();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading form...</div>;
  }

  return <ProductForm categories={categories} brands={brands} />;
}
