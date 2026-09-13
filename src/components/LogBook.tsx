'use client';

import React, { useState, useMemo } from 'react';
import { ChandaEntry } from '@/lib/types';
import { DEFAULT_COLLECTORS } from '@/lib/defaultUsers';
import {
  Search,
  Filter,
  Eye,
  Share2,
  UserCheck,
  MapPin,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

interface LogBookProps {
  entries: ChandaEntry[];
  onSelectEntry: (entry: ChandaEntry) => void;
  onDeleteEntry?: (id: string, receiptNo: string) => void;
  onOpenNewEntry?: () => void;
}

export default function LogBook({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onOpenNewEntry,
}: LogBookProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collectorFilter, setCollectorFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return entries
      .filter((item) => {
        const matchesSearch =
          !term ||
          item.donorName.toLowerCase().includes(term) ||
          item.receiptNo.toLowerCase().includes(term) ||
          (item.phone && item.phone.includes(term)) ||
          item.address.toLowerCase().includes(term) ||
          (item.notes && item.notes.toLowerCase().includes(term)) ||
          item.collectedBy.name.toLowerCase().includes(term);

        const matchesCollector =
          collectorFilter === 'all' || item.collectedBy.id === collectorFilter;

        const matchesPayment =
          paymentFilter === 'all' || item.paymentMode === paymentFilter;

        return matchesSearch && matchesCollector && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [entries, searchTerm, collectorFilter, paymentFilter, sortBy]);

  // Calculate dynamic totals for the currently filtered view
  const currentTotal = useMemo(() => {
    return filteredEntries.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredEntries]);

  const currentCash = useMemo(() => {
    return filteredEntries
      .filter((i) => i.paymentMode === 'Cash')
      .reduce((sum, item) => sum + item.amount, 0);
  }, [filteredEntries]);

  const currentUpi = useMemo(() => {
    return filteredEntries
      .filter((i) => i.paymentMode === 'UPI')
      .reduce((sum, item) => sum + item.amount, 0);
  }, [filteredEntries]);

  // Export to CSV for Excel & Committee records
  const exportToCSV = () => {
    if (filteredEntries.length === 0) {
      alert('निर्यात करने के लिए कोई डेटा उपलब्ध नहीं है (No data to export)');
      return;
    }

    const headers = [
      'रसीद संख्या',
      'दिनांक एवं समय',
      'दाता का नाम',
      'मोबाइल नं',
      'चंदा राशि (₹)',
      'माध्यम',
      'UPI UTR/Txn ID',
      'पता / स्थान',
      'प्रमुख स्थल (Landmark)',
      'संग्रहकर्ता (Collector)',
      'विशेष विवरण',
    ];

    const rows = filteredEntries.map((e) => [
      `"${e.receiptNo}"`,
      `"${new Date(e.createdAt).toLocaleString('en-IN')}"`,
      `"${e.donorName.replace(/"/g, '""')}"`,
      `"${e.phone || ''}"`,
      e.amount,
      `"${e.paymentMode}"`,
      `"${e.transactionId || ''}"`,
      `"${e.address.replace(/"/g, '""')}"`,
      `"${e.landmark || ''}"`,
      `"${e.collectedBy.name}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `DurgaPuja_Sasaram_RouzaRoad_Chanda_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppQuickShare = (item: ChandaEntry) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString('hi-IN');
    const text = `🔱 *श्री दुर्गा पूजा समिति, रौज़ा रोड सासाराम* 🔱\n` +
      `डिजिटल चंदा रसीद: *${item.receiptNo}*\n` +
      `दाता: *${item.donorName}*\n` +
      `सहयोग राशि: *₹${item.amount.toLocaleString('en-IN')}*\n` +
      `भुगतान: *${item.paymentMode}*\n` +
      `संग्रहकर्ता: *${item.collectedBy.name}*\n` +
      `दिनांक: ${formattedDate}\n` +
      `माँ दुर्गा की असीम अनुकम्पा आप पर सदैव बनी रहे! 🙏`;

    const encoded = encodeURIComponent(text);
    const phoneClean = item.phone ? item.phone.replace(/\D/g, '') : '';
    const url = phoneClean.length === 10
      ? `https://wa.me/91${phoneClean}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  };

  const handleDeletePrompt = (item: ChandaEntry) => {
    const isConfirmed = window.confirm(
      `⚠️ क्या आप सचमुच यह चंदा रसीद हटाना चाहते हैं?\n\nरसीद सं०: ${item.receiptNo}\nदाता: ${item.donorName}\nराशि: ₹${item.amount.toLocaleString('en-IN')}\n\nयह प्रविष्टि हमेशा के लिए मिट जाएगी।`
    );
    if (isConfirmed && onDeleteEntry) {
      onDeleteEntry(item._id, item.receiptNo);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
      {/* Top Search & Filter Toolbar */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="दाता का नाम, मोबाइल नंबर, रसीद सं०, या पता खोजें..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Controls: Export & Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-700 outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="date-desc">नवीनतम पहले (Newest)</option>
              <option value="date-asc">पुरातन पहले (Oldest)</option>
              <option value="amount-desc">राशि: अधिक से कम (High to Low)</option>
              <option value="amount-asc">राशि: कम से अधिक (Low to High)</option>
            </select>

            <button
              type="button"
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-colors shrink-0"
              title="समिति हेतु एक्सेल/CSV बहीखाता डाउनलोड करें"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV निर्यात</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            फ़िल्टर:
          </span>

          {/* Collector filter */}
          <select
            value={collectorFilter}
            onChange={(e) => setCollectorFilter(e.target.value)}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-700 outline-none"
          >
            <option value="all">सभी उपयोगकर्ता (All Users)</option>
            {DEFAULT_COLLECTORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-700 outline-none"
          >
            <option value="all">सभी माध्यम (All Modes)</option>
            <option value="Cash">💵 नकद (Cash)</option>
            <option value="UPI">📱 UPI / ऑनलाइन</option>
          </select>

          {(searchTerm || collectorFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCollectorFilter('all');
                setPaymentFilter('all');
              }}
              className="text-xs text-red-600 hover:text-red-800 underline font-medium ml-1"
            >
              फ़िल्टर हटाएं (Reset)
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Ribbon for Current Filter */}
      <div className="bg-amber-50/60 px-4 py-2.5 border-b border-amber-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-stone-700">
          प्रदर्शित रसीदें:{' '}
          <span className="font-bold text-stone-900">{filteredEntries.length}</span> / {entries.length}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-600">
            कुल: <b className="text-red-800">₹{currentTotal.toLocaleString('en-IN')}</b>
          </span>
          <span className="text-stone-500 hidden sm:inline">|</span>
          <span className="text-emerald-700 hidden sm:inline">
            नकद: <b>₹{currentCash.toLocaleString('en-IN')}</b>
          </span>
          <span className="text-blue-700 hidden sm:inline">
            UPI: <b>₹{currentUpi.toLocaleString('en-IN')}</b>
          </span>
        </div>
      </div>

      {/* Table & Card Views */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center text-stone-500">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-amber-700 text-2xl">
            📖
          </div>
          <p className="text-sm font-bold text-stone-800">
            {entries.length === 0
              ? 'बहीखाते में अभी कोई रसीद दर्ज नहीं है'
              : 'दिए गए फ़िल्टर के अनुसार कोई प्रविष्टि नहीं मिली'}
          </p>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {entries.length === 0
              ? 'दुर्गा पूजा चंदा संग्रह शुरू करने के लिए ऊपर "+ नया चंदा" बटन दबाएं।'
              : 'सर्च कीवर्ड या फ़िल्टर बदलकर पुनः प्रयास करें।'}
          </p>
          {entries.length === 0 && onOpenNewEntry && (
            <button
              onClick={onOpenNewEntry}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-xl text-xs shadow hover:scale-105 transition-all"
            >
              + पहला चंदा दर्ज करें
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/80 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <th className="p-3">रसीद सं०</th>
                  <th className="p-3">दिनांक</th>
                  <th className="p-3">दाता का नाम</th>
                  <th className="p-3">स्थान / रौज़ा रोड</th>
                  <th className="p-3">राशि (₹)</th>
                  <th className="p-3">माध्यम</th>
                  <th className="p-3">संग्रहकर्ता (Tagged)</th>
                  <th className="p-3 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEntries.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-amber-50/40 transition-colors group"
                  >
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {item.receiptNo}
                    </td>
                    <td className="p-3 text-stone-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('hi-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{item.donorName}</div>
                      {item.phone && (
                        <div className="text-[11px] text-stone-500 font-mono">
                          +91 {item.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-stone-600 max-w-xs truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0 inline" />
                        <span>{item.address}</span>
                      </span>
                      {item.notes && (
                        <div className="text-[10px] text-stone-400 italic truncate">
                          &quot;{item.notes}&quot;
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-sm text-stone-900 bg-red-50 text-red-900 px-2 py-0.5 rounded border border-red-200">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {item.paymentMode === 'Cash' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          💵 नकद
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          📱 UPI
                        </span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-bold text-stone-800">
                          {item.collectedBy.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectEntry(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        title="रसीद देखें एवं प्रिंट करें"
                      >
                        <Eye className="w-3 h-3" />
                        <span>रसीद</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleWhatsAppQuickShare(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        title="WhatsApp पर भेजें"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePrompt(item)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-semibold transition-colors"
                        title="रसीद हटाएं (Delete Entry)"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>हटाएं</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="block md:hidden divide-y divide-stone-100">
            {filteredEntries.map((item) => (
              <div key={item._id} className="p-4 space-y-2 hover:bg-stone-50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      {item.receiptNo}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-1">
                      {item.donorName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-red-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                    <div>
                      {item.paymentMode === 'Cash' ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          नकद
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                          UPI
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-1 font-bold text-stone-800">
                    <UserCheck className="w-3 h-3 text-amber-600" />
                    <span>टैग: {item.collectedBy.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectEntry(item)}
                      className="px-2.5 py-1 bg-stone-800 text-white rounded-lg text-xs font-semibold"
                    >
                      रसीद
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppQuickShare(item)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                    >
                      WA
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePrompt(item)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
