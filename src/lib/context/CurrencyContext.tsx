'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '@/types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  exchangeRate: number;
  formatPrice: (amountInUsd: number) => string;
  formatSecondaryPrice: (amountInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const exchangeRate = Number(process.env.NEXT_PUBLIC_USD_TO_KHR_RATE) || 4100;

  useEffect(() => {
    const saved = localStorage.getItem('home_sport_currency') as Currency;
    if (saved && (saved === 'USD' || saved === 'KHR')) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('home_sport_currency', curr);
    }
  };

  const formatPrice = (amountInUsd: number): string => {
    if (currency === 'KHR') {
      const khrAmount = Math.round(amountInUsd * exchangeRate);
      return `${new Intl.NumberFormat('en-US').format(khrAmount)} ៛`;
    }
    // USD
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amountInUsd % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amountInUsd);
  };

  const formatSecondaryPrice = (amountInUsd: number): string => {
    if (currency === 'USD') {
      const khrAmount = Math.round(amountInUsd * exchangeRate);
      return `${new Intl.NumberFormat('en-US').format(khrAmount)} ៛`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amountInUsd % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amountInUsd);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        formatPrice,
        formatSecondaryPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
