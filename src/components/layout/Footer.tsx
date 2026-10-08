'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Send, MapPin, ShieldCheck, Truck, Headphones, Award } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-600/10 text-rose-500 border border-rose-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t('prop_authentic_title')}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {t('prop_authentic_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-sky-600/10 text-sky-400 border border-sky-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t('prop_delivery_title')}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {t('prop_delivery_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t('prop_consult_title')}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {t('prop_consult_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t('prop_support_title')}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {t('prop_support_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-600/30">
                HS
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                HOME<span className="text-rose-600"> SPORT</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t('footer_about')}
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>St 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+85512345678" className="hover:text-white transition-colors">
                  +855 12 345 678 / +855 98 765 432
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a
                  href="https://t.me/homesportkh"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram: @homesportkh
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/category/football-boots" className="hover:text-rose-400 transition-colors">
                  Football Boots
                </Link>
              </li>
              <li>
                <Link href="/category/jerseys" className="hover:text-rose-400 transition-colors">
                  Football Jerseys
                </Link>
              </li>
              <li>
                <Link href="/category/shorts" className="hover:text-rose-400 transition-colors">
                  Shorts
                </Link>
              </li>
              <li>
                <Link href="/category/gloves" className="hover:text-rose-400 transition-colors">
                  Goalkeeper Gloves
                </Link>
              </li>
              <li>
                <Link href="/category/bags" className="hover:text-rose-400 transition-colors">
                  Bags & Backpacks
                </Link>
              </li>
              <li>
                <Link href="/category/socks" className="hover:text-rose-400 transition-colors">
                  Grip Socks
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-rose-400 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Top Brands
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/brand/nike" className="hover:text-rose-400 transition-colors">
                  Nike Football
                </Link>
              </li>
              <li>
                <Link href="/brand/adidas" className="hover:text-rose-400 transition-colors">
                  Adidas Football
                </Link>
              </li>
              <li>
                <Link href="/brand/puma" className="hover:text-rose-400 transition-colors">
                  Puma Future & Ultra
                </Link>
              </li>
              <li>
                <Link href="/brand/mizuno" className="hover:text-rose-400 transition-colors">
                  Mizuno Japan
                </Link>
              </li>
              <li>
                <Link href="/brand/joma" className="hover:text-rose-400 transition-colors">
                  Joma Futsal / Turf
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Fast Ordering */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Quick Order
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Order directly via Telegram or Facebook Messenger. We ship daily!
            </p>
            <div className="space-y-2">
              <a
                href="https://t.me/homesportkh"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chat on Telegram</span>
              </a>
              <a
                href="https://m.me/homesportcambodia"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
              >
                <span>Chat on Messenger</span>
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-1">Payment options accepted:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Cash on Delivery</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">ABA Pay</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Wing</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Bakong KHQR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HOME SPORT Cambodia. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
