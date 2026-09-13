'use client';

import React from 'react';
import { ChandaEntry } from '@/lib/types';
import { COMMITTEE_INFO } from '@/lib/defaultUsers';
import { Printer, Share2, X, CheckCircle2, MapPin, Calendar, UserCheck, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ReceiptModalProps {
  entry: ChandaEntry | null;
  onClose: () => void;
  onDeleteEntry?: (id: string, receiptNo: string) => void;
}

export default function ReceiptModal({ entry, onClose, onDeleteEntry }: ReceiptModalProps) {
  if (!entry) return null;

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `🔱 *${COMMITTEE_INFO.name}* 🔱\n` +
      `*${COMMITTEE_INFO.subtitle} (स्था० २००१)*\n` +
      `*डिजिटल चंदा रसीद (Donation Receipt)*\n` +
      `--------------------------------\n` +
      `📜 *रसीद संख्या*: ${entry.receiptNo}\n` +
      `👤 *दाता का नाम*: ${entry.donorName}\n` +
      `💰 *सहयोग राशि*: ₹${entry.amount.toLocaleString('en-IN')}\n` +
      `💳 *भुगतान माध्यम*: ${entry.paymentMode} ${entry.transactionId ? `(Txn: ${entry.transactionId})` : ''}\n` +
      `📍 *स्थान/पता*: ${entry.address}${entry.landmark ? ` (${entry.landmark})` : ''}\n` +
      `📅 *दिनांक*: ${formattedDate}\n` +
      `✍️ *संग्रहकर्ता*: ${entry.collectedBy.name}\n` +
      `--------------------------------\n` +
      `माँ भगवती आप और आपके परिवार पर सदैव कृपा बनाए रखें! 🙏✨\n` +
      `_${COMMITTEE_INFO.name}, सासाराम (रोहतास)_`;

    const encoded = encodeURIComponent(text);
    const phoneClean = entry.phone ? entry.phone.replace(/\D/g, '') : '';
    const url = phoneClean.length === 10
      ? `https://wa.me/91${phoneClean}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print bg-stone-900 text-stone-100 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            डिजिटल चंदा रसीद (Donation Slip)
          </span>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Printable Receipt Content */}
        <div className="p-4 sm:p-6 overflow-y-auto" id="printable-receipt">
          <div className="border-4 border-double border-red-800 p-5 sm:p-6 bg-gradient-to-b from-amber-50/40 via-white to-red-50/20 rounded-xl relative">
            {/* Watermark Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="relative w-72 h-72">
                <Image
                  src={COMMITTEE_INFO.logoUrl}
                  alt="Watermark Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Puja Header with Official Logo */}
            <div className="text-center border-b-2 border-red-800 pb-4 relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative w-14 h-14 rounded-full border-2 border-amber-500 overflow-hidden shadow-sm shrink-0 bg-white">
                  <Image
                    src={COMMITTEE_INFO.logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left sm:text-center">
                  <p className="text-[11px] font-bold text-red-800 tracking-widest uppercase">
                    ॥ श्री गणेशाय नमः ॥ || ॥ स्थापित सन् २००१ ॥
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-red-900 tracking-tight leading-tight">
                    {COMMITTEE_INFO.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-amber-900">
                    {COMMITTEE_INFO.subtitle} (रोहतास) बिहार - 821115
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Meta (No. & Date) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-semibold py-3 border-b border-stone-200 gap-1 text-stone-700 relative z-10">
              <div>
                रसीद सं० (Receipt No):{' '}
                <span className="font-mono text-red-700 font-bold text-sm bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {entry.receiptNo}
                </span>
              </div>
              <div className="flex items-center gap-1 text-stone-500">
                <Calendar className="w-3.5 h-3.5" />
                दिनांक: {formattedDate}
              </div>
            </div>

            {/* Donor Details Table */}
            <div className="py-4 space-y-3 text-sm text-stone-800 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-bold text-stone-700 min-w-[140px]">
                  सधन्यवाद प्राप्त किया :
                </span>
                <span className="font-bold text-stone-950 text-base border-b border-dotted border-stone-400 flex-1">
                  श्री/श्रीमती {entry.donorName}
                </span>
              </div>

              {entry.phone && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-stone-600 min-w-[140px]">
                    संपर्क मोबाइल नं० :
                  </span>
                  <span className="font-mono text-stone-900 border-b border-dotted border-stone-400 flex-1">
                    +91 {entry.phone}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-semibold text-stone-600 min-w-[140px]">
                  स्थान / पता :
                </span>
                <span className="text-stone-900 border-b border-dotted border-stone-400 flex-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 inline" />
                  {entry.address} {entry.landmark ? `(${entry.landmark})` : ''}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-semibold text-stone-600 min-w-[140px]">
                  भुगतान माध्यम :
                </span>
                <span className="font-medium text-stone-900 border-b border-dotted border-stone-400 flex-1">
                  {entry.paymentMode === 'Cash' ? '💵 नकद (Cash)' : '📱 UPI / ऑनलाइन'}
                  {entry.transactionId ? ` (Txn/Ref: ${entry.transactionId})` : ''}
                </span>
              </div>

              {entry.notes && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-xs">
                  <span className="font-semibold text-stone-500 min-w-[140px]">
                    विशेष विवरण/मद :
                  </span>
                  <span className="italic text-stone-700 flex-1">
                    {entry.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Amount Box */}
            <div className="bg-red-50/90 border-2 border-red-700/50 rounded-xl p-3 sm:p-4 my-2 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
              <div>
                <span className="text-xs font-bold text-red-800 uppercase tracking-wide">
                  प्राप्त सहयोग राशि (Amount Received)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-red-900">
                  ₹{entry.amount.toLocaleString('en-IN')}/-
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                  ✓ विधिवत स्वीकृत एवं पंजीकृत
                </span>
              </div>
            </div>

            {/* Collector Tag & Seal */}
            <div className="pt-4 mt-4 border-t border-stone-200 flex justify-between items-end text-xs relative z-10">
              <div className="text-left">
                <p className="text-[11px] text-stone-500">
                  संग्रहकर्ता टैग (Collector Tag):
                </p>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-900">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>{entry.collectedBy.name}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="h-10 flex items-end justify-end">
                  <span className="text-[11px] font-mono text-red-700 border-b border-stone-800 pb-0.5 font-bold">
                    माँ भगवती पूजन कला संघ
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  कम्पनी सराय, सासाराम
                </p>
              </div>
            </div>

            <div className="text-center mt-4 pt-2 border-t border-dotted border-stone-300 text-[10px] text-stone-500 relative z-10">
              माँ जगदम्बे आपके परिवार को सुख, शांति एवं समृद्धि प्रदान करें! 🙏
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden in Print) */}
        <div className="no-print bg-stone-50 p-4 border-t border-stone-200 flex flex-wrap gap-2 items-center justify-between">
          <div>
            {onDeleteEntry && (
              <button
                type="button"
                onClick={() => {
                  const isConfirmed = window.confirm(
                    `⚠️ क्या आप सचमुच यह चंदा रसीद हटाना चाहते हैं?\n\nरसीद सं०: ${entry.receiptNo}\nदाता: ${entry.donorName}\nराशि: ₹${entry.amount.toLocaleString('en-IN')}`
                  );
                  if (isConfirmed) {
                    onDeleteEntry(entry._id, entry.receiptNo);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
                title="रसीद हटाएं"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>हटाएं (Delete)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-xl text-xs sm:text-sm shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>रसीद प्रिंट करें (Print)</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp पर भेजें</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors"
            >
              बन्द करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
