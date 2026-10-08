'use client';

import React, { useState, useEffect } from 'react';
import { StoreSettings } from '@/types';
import { getStoreSettings, updateStoreSettings } from '@/lib/data/store';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Save, CheckCircle2, Database, ShieldAlert, Store, HelpCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    id: 'default',
    store_name: 'HOME SPORT',
    phone: '+855 12 345 678',
    telegram: 'homesportkh',
    messenger: 'homesportcambodia',
    address: 'St 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh, Cambodia',
    usd_to_khr_rate: 4100,
    announcement_en: '🚚 Free delivery in Phnom Penh for orders over $50! Fast delivery across 25 provinces.',
    announcement_kh: '🚚 ដឹកជញ្ជូនឥតគិតថ្លៃក្នុងរាជធានីភ្នំពេញសម្រាប់ការបញ្ជាទិញចាប់ពី $50 ឡើងទៅ!',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getStoreSettings();
      setSettings(data);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Store & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure business contact points, KHR currency exchange rates, and database connections.
        </p>
      </div>

      {/* Supabase Status Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
        <div
          className={`p-3 rounded-2xl ${
            isSupabaseConfigured
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          <Database className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900">Database Connection Status</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isSupabaseConfigured ? 'Supabase Live Connected' : 'Local / Resilient Storage Mode'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {isSupabaseConfigured
              ? 'Your application is connected to a live Supabase PostgreSQL database.'
              : 'Your application is running in fully functional offline/resilient storage mode with rich sports seed data. To connect to Supabase, provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local or Vercel dashboard.'}
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              required
              value={settings.store_name}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              USD to KHR Currency Exchange Rate
            </label>
            <input
              type="number"
              required
              value={settings.usd_to_khr_rate}
              onChange={(e) => setSettings({ ...settings, usd_to_khr_rate: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default: 4100 KHR per 1 USD
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Store Phone Number(s)
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Telegram Username / Channel
            </label>
            <input
              type="text"
              required
              value={settings.telegram}
              onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Direct link will open: https://t.me/{settings.telegram}
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Facebook Messenger Username
            </label>
            <input
              type="text"
              required
              value={settings.messenger}
              onChange={(e) => setSettings({ ...settings, messenger: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Direct link will open: https://m.me/{settings.messenger}
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Physical Store Address
            </label>
            <textarea
              rows={2}
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Top Announcement Bar (English)
            </label>
            <input
              type="text"
              value={settings.announcement_en || ''}
              onChange={(e) => setSettings({ ...settings, announcement_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Top Announcement Bar (Khmer)
            </label>
            <input
              type="text"
              value={settings.announcement_kh || ''}
              onChange={(e) => setSettings({ ...settings, announcement_kh: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex items-center justify-between">
          {isSaved ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Updates apply immediately</span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
