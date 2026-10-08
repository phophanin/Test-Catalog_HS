'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { Product, Category, Brand } from '@/types';
import { getProductById, getCategories, getBrands } from '@/lib/data/store';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!id) return;
      const [prod, cats, brs] = await Promise.all([
        getProductById(id),
        getCategories(),
        getBrands(),
      ]);
      setProduct(prod);
      setCategories(cats);
      setBrands(brs);
      setIsLoading(false);
    }
    init();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading product data...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-rose-500 font-bold">Product not found.</div>;
  }

  return <ProductForm initialData={product} categories={categories} brands={brands} />;
}
