'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickOrder?: (product: Product) => void;
}

export default function ProductGrid({ products, onQuickOrder }: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickOrder={onQuickOrder}
        />
      ))}
    </div>
  );
}
