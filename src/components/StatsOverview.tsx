'use client';

import React from 'react';
import { CollectionStats } from '@/lib/types';
import { IndianRupee, Banknote, QrCode, Users, Award, Calendar } from 'lucide-react';

interface StatsOverviewProps {
  stats: CollectionStats | null;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-stone-200 rounded-xl" />
        ))}
      </div>
    );
  }

  const cashPercent = stats.totalAmount > 0
    ? Math.round((stats.cashAmount / stats.totalAmount) * 100)
    : 0;

  const upiPercent = stats.totalAmount > 0
    ? Math.round((stats.upiAmount / stats.totalAmount) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Top Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Collected */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-red-700 to-amber-700 text-white p-4 rounded-2xl shadow-md border border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
              कुल चंदा (Total)
            </span>
            <div className="p-1.5 bg-amber-400/20 rounded-lg">
              <IndianRupee className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            ₹{stats.totalAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-amber-100/80 mt-1 flex items-center gap-1">
            <Users className="w-3 h-3 inline" />
            {stats.totalDonors} रसीदें (Donors)
          </p>
        </div>

        {/* Cash Collection */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              नकद (Cash)
            </span>
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            ₹{stats.cashAmount.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {cashPercent}% कुल का
          </div>
        </div>

        {/* UPI Collection */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              UPI / ऑनलाइन
            </span>
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            ₹{stats.upiAmount.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium mt-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            {upiPercent}% कुल का
          </div>
        </div>

        {/* Today's Collection */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              आज का संग्रह (Today)
            </span>
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-800 mt-2">
            ₹{stats.todayAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">आज की तारीख में</p>
        </div>

        {/* Top Performer Card */}
        <div className="col-span-2 sm:col-span-1 bg-amber-50/80 p-4 rounded-2xl shadow-sm border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              सर्वश्रेष्ठ संग्रहकर्ता
            </span>
            <div className="p-1.5 bg-amber-200 rounded-lg text-amber-800">
              <Award className="w-4 h-4" />
            </div>
          </div>
          {stats.collectorBreakdown && stats.collectorBreakdown.length > 0 && stats.totalAmount > 0 ? (
            <>
              <p className="text-sm font-bold text-stone-900 mt-2 truncate">
                {stats.collectorBreakdown[0].collectorName}
              </p>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                ₹{stats.collectorBreakdown[0].totalAmount.toLocaleString('en-IN')} ({stats.collectorBreakdown[0].count} दान)
              </p>
            </>
          ) : (
            <p className="text-xs text-stone-500 mt-2">नया सत्र (सक्रिय)</p>
          )}
        </div>
      </div>

      {/* Collector Leaderboard Banner */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              टीम संग्रह प्रगति (Team Leaderboard)
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">
            प्रत्येक उपयोगकर्ता द्वारा दर्ज कुल राशि
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.collectorBreakdown.map((item) => {
            const share = stats.totalAmount > 0
              ? Math.round((item.totalAmount / stats.totalAmount) * 100)
              : 0;
            return (
              <div
                key={item.collectorId}
                className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      {item.collectorName}
                    </span>
                    <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full font-medium">
                      {item.count} रसीदें
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-stone-800 mt-1">
                    ₹{item.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, share)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
