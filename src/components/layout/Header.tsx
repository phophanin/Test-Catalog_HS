'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Phone,
  Send,
  MessageCircle,
  ChevronDown,
  Globe,
  Coins,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useCurrency } from '@/lib/context/CurrencyContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_products'), href: '/products' },
    { label: t('nav_boots'), href: '/category/football-boots' },
    { label: t('nav_jerseys'), href: '/category/jerseys' },
    { label: t('nav_shorts'), href: '/category/shorts' },
    { label: t('nav_accessories'), href: '/category/accessories' },
    { label: t('nav_brands'), href: '/products?view=brands' },
    { label: t('nav_about'), href: '/about' },
    { label: t('nav_contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-shadow">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="font-medium text-[11px] sm:text-xs">
              {language === 'km'
                ? '🚚 សេវាដឹកជញ្ជូនរហ័ស ២៥ ខេត្ត-ក្រុង • ធានាគុណភាពផលិតផល ១០០%'
                : '🚚 Fast delivery across 25 provinces in Cambodia • 100% Quality Guaranteed'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <a
              href="https://t.me/homesportkh"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>Telegram: @homesportkh</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a
              href="tel:+85512345678"
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+855 12 345 678</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tighter">HS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                HOME<span className="text-rose-600"> SPORT</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-600 tracking-wider uppercase mt-0.5">
                Football & Gear Cambodia
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 text-slate-900 pl-10 pr-4 py-2 rounded-full text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all placeholder:text-slate-600"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Controls: Language, Currency, Mobile triggers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Switcher */}
            <div className="relative inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === 'USD'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="US Dollars"
              >
                USD $
              </button>
              <button
                type="button"
                onClick={() => setCurrency('KHR')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === 'KHR'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Cambodian Riel"
              >
                KHR ៛
              </button>
            </div>

            {/* Language Switcher */}
            <div className="relative inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  language === 'km'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇰🇭 ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 py-2.5 text-sm font-medium">
          <div className="flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors whitespace-nowrap py-1 relative ${
                    isActive
                      ? 'text-rose-600 font-bold'
                      : 'text-slate-700 hover:text-rose-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products?sale=true"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full text-xs font-bold transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              {t('badge_sale')}
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="lg:hidden px-4 py-3 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm placeholder:text-slate-600"
            />
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-slate-900/60 backdrop-blur-sm z-40">
          <div className="bg-white h-full max-w-sm w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-bold text-slate-900 text-lg">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base py-2 px-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t space-y-3">
                <Link
                  href="/products?sale=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg bg-rose-50 text-rose-700 font-bold text-sm"
                >
                  <span>🔥 {t('badge_sale')}</span>
                  <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full">HOT</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 text-slate-800 font-medium text-sm hover:bg-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>{t('nav_admin')}</span>
                </Link>
              </div>
            </div>

            {/* Quick Contact buttons in mobile drawer */}
            <div className="pt-6 border-t mt-6 space-y-2">
              <a
                href="https://t.me/homesportkh"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Telegram @homesportkh</span>
              </a>
              <a
                href="tel:+85512345678"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+855 12 345 678</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
