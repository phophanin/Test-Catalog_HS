'use client';

import React, { useState, useEffect } from 'react';
import { OrderLead, LeadStatus } from '@/types';
import { getOrderLeads, updateLeadStatus } from '@/lib/data/store';
import {
  Send,
  MessageCircle,
  Phone,
  Globe,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  ShoppingBag,
} from 'lucide-react';

export default function AdminOrderLeadsPage() {
  const [leads, setLeads] = useState<OrderLead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = async () => {
    setIsLoading(true);
    const data = await getOrderLeads();
    setLeads(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    await updateLeadStatus(id, newStatus);
    loadLeads();
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || l.contact_channel === channelFilter;
    return matchesStatus && matchesChannel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Leads & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track customer orders captured from Telegram, Messenger, phone, and catalog conversions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="telegram">Telegram</option>
            <option value="messenger">Messenger</option>
            <option value="phone">Phone</option>
            <option value="website">Website</option>
          </select>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Size & Color</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status & Action</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">{lead.customer_name}</div>
                        <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                          {lead.customer_phone || lead.telegram_username || 'N/A'}
                        </div>
                        {lead.notes && (
                          <div className="text-[10px] text-slate-400 italic mt-1 line-clamp-1">
                            Note: {lead.notes}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] bg-slate-100 text-slate-700">
                          {lead.contact_channel === 'telegram' && <Send className="w-3 h-3 text-sky-500" />}
                          {lead.contact_channel === 'messenger' && <MessageCircle className="w-3 h-3 text-blue-600" />}
                          {lead.contact_channel === 'phone' && <Phone className="w-3 h-3 text-emerald-600" />}
                          {lead.contact_channel === 'website' && <Globe className="w-3 h-3 text-purple-600" />}
                          {lead.contact_channel}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 max-w-xs">{lead.product_name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{lead.sku}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-700">
                          Size: <strong className="text-slate-900">{lead.selected_size || 'N/A'}</strong>
                        </div>
                        {lead.selected_color && (
                          <div className="text-[11px] text-slate-500">Color: {lead.selected_color}</div>
                        )}
                        <div className="text-[11px] text-slate-500">Qty: {lead.quantity}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-black text-slate-900 text-sm">
                          ${lead.total_price}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase border-none cursor-pointer ${
                            lead.status === 'new'
                              ? 'bg-sky-100 text-sky-800'
                              : lead.status === 'contacted'
                              ? 'bg-amber-100 text-amber-800'
                              : lead.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="completed">COMPLETED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>

                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(lead.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No order leads match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
