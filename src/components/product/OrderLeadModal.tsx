'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Send, MessageCircle, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product, OrderLead } from '@/types';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { createOrderLead } from '@/lib/data/store';
import { generateTelegramLink, generateMessengerLink, generatePhoneLink } from '@/lib/utils';

interface OrderLeadModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  defaultSize?: string;
  defaultColor?: string;
}

export default function OrderLeadModal({
  product,
  isOpen,
  onClose,
  defaultSize,
  defaultColor,
}: OrderLeadModalProps) {
  const { formatPrice, currency } = useCurrency();
  const { language, t } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string>(
    defaultSize || product.sizes?.[0] || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    defaultColor || product.colors?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const telegramUser = process.env.NEXT_PUBLIC_STORE_TELEGRAM || 'homesportkh';
  const messengerUser = process.env.NEXT_PUBLIC_STORE_MESSENGER || 'homesportcambodia';
  const phone = process.env.NEXT_PUBLIC_STORE_PHONE || '+855 12 345 678';

  const totalPrice = product.price * quantity;
  const formattedTotalPrice = formatPrice(totalPrice);

  const saveLead = async (channel: 'telegram' | 'messenger' | 'phone' | 'website') => {
    try {
      setIsSubmitting(true);
      await createOrderLead({
        customer_name: customerName.trim() || 'Guest Customer',
        customer_phone: customerPhone.trim() || 'Direct Inquiry',
        contact_channel: channel,
        telegram_username: customerPhone.includes('@') ? customerPhone : undefined,
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        selected_size: selectedSize,
        selected_color: selectedColor,
        quantity,
        total_price: totalPrice,
        currency,
        status: 'new',
        notes: customerNotes.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error('Failed to save lead', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTelegramOrder = async () => {
    await saveLead('telegram');
    const directUrl = typeof window !== 'undefined' ? window.location.href : '';
    const url = generateTelegramLink({
      username: telegramUser,
      productName: product.name,
      sku: product.sku,
      size: selectedSize,
      color: selectedColor,
      price: formattedTotalPrice,
      url: directUrl,
    });
    window.open(url, '_blank');
  };

  const handleMessengerOrder = async () => {
    await saveLead('messenger');
    const url = generateMessengerLink(messengerUser);
    window.open(url, '_blank');
  };

  const handlePhoneCall = async () => {
    await saveLead('phone');
    const url = generatePhoneLink(phone);
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {t('order_modal_title')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('order_modal_subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Product Summary Box */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
              <Image
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                {product.sku}
              </div>
              <h4 className="font-bold text-slate-900 text-sm truncate">
                {language === 'km' && product.name_kh ? product.name_kh : product.name}
              </h4>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {formatPrice(product.price)}
                {product.original_price && (
                  <span className="text-xs text-slate-400 line-through font-normal ml-2">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                {t('select_size')}: <span className="text-rose-600 font-black">{selectedSize || 'None'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                {t('select_color')}: <span className="text-rose-600 font-black">{selectedColor || 'None'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedColor === color
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Total */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="block text-xs font-bold text-slate-700">{t('quantity')}</span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="font-extrabold text-sm w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-xs font-semibold text-slate-500">Total Price</span>
              <span className="text-lg font-black text-rose-600">{formattedTotalPrice}</span>
            </div>
          </div>

          {/* Optional Customer Inputs */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('customer_name')} (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chan Sokha"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('customer_phone')} (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 012 345 678 or @username"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Direct Conversion Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleTelegramOrder}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>{t('order_via_telegram')} (@homesportkh)</span>
            </button>

            <button
              type="button"
              onClick={handleMessengerOrder}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('order_via_messenger')}</span>
            </button>

            <button
              type="button"
              onClick={handlePhoneCall}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('call_store')} ({phone})</span>
            </button>
          </div>

          {isSubmitted && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{t('inquiry_sent_success')}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fast replies within 5-10 minutes • Cash on delivery available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
