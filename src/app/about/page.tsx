'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ShieldCheck, Truck, Users, Award, MapPin, Send, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <span className="text-xs font-black uppercase text-rose-500 tracking-widest">
              ABOUT HOME SPORT
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Fueling Cambodian Football Passion
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              We provide grassroots players, tournament contenders, and football enthusiasts in Cambodia with authentic boots, professional kits, and performance gear.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-14 sm:py-20 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-black uppercase text-rose-600 tracking-widest">
                  Our Story & Mission
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  From Passionate Footballers to Cambodia&apos;s Trusted Gear Specialist
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  HOME SPORT was established in Phnom Penh with a clear goal: to make premium football boots, authentic jerseys, and specialized sports accessories easily accessible, transparently priced, and delivered quickly across all 25 provinces in Cambodia.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Whether you play on natural turf, 7-a-side artificial grass pitches, or indoor futsal surfaces, we understand the specific traction, sizing, and comfort requirements of Cambodian football players.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
                  >
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=900&auto=format&fit=crop"
                  alt="HOME SPORT Team and Pitch"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-14 sm:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
                What Sets HOME SPORT Apart
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Quality Verified</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every product is thoroughly inspected for stitching, stud strength, and exact sizing before dispatch.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">25 Provinces Delivery</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fast reliable dispatch to Siem Reap, Battambang, Kampong Cham, Sihanoukville, and all corners of Cambodia.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Expert Guidance</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Consultation on boot fits, narrow vs wide feet, stud configurations (FG, AG, TF, IN), and size charts.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Community First</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Proud supporters of local football tournaments, academy teams, and youth sports development.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
