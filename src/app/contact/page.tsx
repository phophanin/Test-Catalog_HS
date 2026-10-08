'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { createOrderLead } from '@/lib/data/store';
import {
  MapPin,
  Phone,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('Product Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setIsSubmitting(true);
    try {
      await createOrderLead({
        customer_name: name,
        customer_phone: contact,
        contact_channel: 'website',
        product_name: subject,
        quantity: 1,
        total_price: 0,
        currency: 'USD',
        status: 'new',
        notes: message,
      });
      setIsSubmitted(true);
      setName('');
      setContact('');
      setMessage('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-black uppercase text-rose-600 tracking-widest">
              GET IN TOUCH
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-1">
              Contact HOME SPORT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Have questions about sizes, boot availability, team orders, or delivery to your province? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact Info & Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Channel Cards */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-wider">
                  Direct Ordering Channels
                </h3>

                <a
                  href="https://t.me/homesportkh"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-100 hover:bg-sky-100/80 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Telegram Chat</h4>
                    <p className="text-xs text-sky-700 font-medium">@homesportkh</p>
                    <span className="text-[10px] text-slate-500">Fastest response (under 5 mins)</span>
                  </div>
                </a>

                <a
                  href="https://m.me/homesportcambodia"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100/80 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Facebook Messenger</h4>
                    <p className="text-xs text-blue-700 font-medium">m.me/homesportcambodia</p>
                    <span className="text-[10px] text-slate-500">Official HOME SPORT Page</span>
                  </div>
                </a>

                <a
                  href="tel:+85512345678"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/80 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Direct Phone Call</h4>
                    <p className="text-xs text-emerald-800 font-semibold">+855 12 345 678 / +855 98 765 432</p>
                    <span className="text-[10px] text-slate-500">Cellcard & Smart</span>
                  </div>
                </a>
              </div>

              {/* Physical Store & Hours Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Store Location:</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      St 271, Sangkat Boeung Tumpun, Khan Mean Chey, Phnom Penh, Cambodia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Business Hours:</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Monday - Sunday: 8:00 AM - 9:00 PM (Every day)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Message Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
              <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-2">
                Send a Message or Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill out the form below and our sports coordinator will contact you via Telegram or phone call.
              </p>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-lg text-emerald-900">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Thank you for reaching out to HOME SPORT. Our team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sokha Rithy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Phone Number or Telegram Handle *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 012 345 678 or @username"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    >
                      <option value="Product Sizing Inquiry">Football Boot Sizing / Fit Advice</option>
                      <option value="Stock Availability Check">Stock Check for Specific Boot/Jersey</option>
                      <option value="Provincial Delivery Question">Provincial Delivery to My Area</option>
                      <option value="Team Kit Bulk Order">Team Kit Bulk Order (Jerseys + Printing)</option>
                      <option value="Other">Other Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Message / Question
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what size, boot or team kit you are looking for..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Send Inquiry to HOME SPORT'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
