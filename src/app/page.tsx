'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CollectorUser, ChandaEntry, CollectionStats } from '@/lib/types';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import NewEntryModal from '@/components/NewEntryModal';
import ReceiptModal from '@/components/ReceiptModal';
import StatsOverview from '@/components/StatsOverview';
import LogBook from '@/components/LogBook';
import MapView from '@/components/MapView';
import {
  BookOpen,
  MapPin,
  BarChart3,
  PlusCircle,
  RefreshCw,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sasaram_chandabook_collector';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<CollectorUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [selectedReceiptEntry, setSelectedReceiptEntry] = useState<ChandaEntry | null>(null);

  const [activeTab, setActiveTab] = useState<'logbook' | 'map' | 'stats'>('logbook');
  const [entries, setEntries] = useState<ChandaEntry[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [isLiveMongo, setIsLiveMongo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Check persistent one-time login from localStorage on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } else {
        setIsLoginModalOpen(true);
      }
    } catch (e) {
      console.warn('Error reading stored session:', e);
      setIsLoginModalOpen(true);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 2. Fetch collections & stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/collections', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setEntries(json.data || []);
        setStats(json.stats || null);
        setIsLiveMongo(Boolean(json.isLiveMongo));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Login handler: Save permanently to localStorage until explicit Sign Out
  const handleLoginSuccess = (user: CollectorUser) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    triggerToast(`जय माता दी! स्वागत है ${user.name}`);
  };

  // Logout handler: Explicit sign out removes localStorage
  const handleLogout = () => {
    if (window.confirm('क्या आप सचमुच साइन आउट करना चाहते हैं? (Do you want to sign out?)')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCurrentUser(null);
      setIsLoginModalOpen(true);
      triggerToast('आप सफलतापूर्वक साइन आउट हो गए हैं');
    }
  };

  // Handler when a new collection entry is created
  const handleEntrySaved = (newEntry: ChandaEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    // Refresh stats
    fetchData();
    // Open receipt modal immediately so volunteer can print or share via WhatsApp
    setSelectedReceiptEntry(newEntry);
    triggerToast(`रसीद ${newEntry.receiptNo} सफलतापूर्वक दर्ज हुई!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0]">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenNewEntry={() => {
          if (!currentUser) {
            setIsLoginModalOpen(true);
          } else {
            setIsNewEntryOpen(true);
          }
        }}
        isLiveMongo={isLiveMongo}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-stone-900 text-amber-300 px-4 py-2.5 rounded-xl shadow-xl border border-amber-400/50 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
        {/* Festive Welcome Ribbon */}
        <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-800">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl" role="img" aria-label="Puja Bell">
              🔔
            </span>
            <div>
              <p className="text-xs font-bold text-amber-900 tracking-wide uppercase">
                माँ दुर्गा पूजा उत्सव • रौज़ा रोड सासाराम
              </p>
              <p className="text-xs text-stone-600">
                चंदा संग्रह बहीखाता एवं रीयल-टाइम मानचित्र
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              title="डेटा रीफ्रेश करें"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-white/80 rounded-xl border border-stone-200 transition-colors text-xs flex items-center gap-1 font-medium bg-white/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-600' : ''}`} />
              <span className="hidden sm:inline">रीफ्रेश</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setIsNewEntryOpen(true)}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ नया चंदा काटें</span>
              </button>
            )}
          </div>
        </div>

        {/* Top KPI Metrics Overview */}
        <StatsOverview stats={stats} />

        {/* Navigation Tabs (Log Book vs Map View vs Analytics) */}
        <div className="flex items-center justify-between border-b border-stone-200">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === 'logbook'
                  ? 'border-red-600 text-red-900 bg-white/60 rounded-t-xl shadow-sm'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📋 बहीखाता (Log Book)</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-stone-200 text-stone-700 rounded-full font-mono">
                {entries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === 'map'
                  ? 'border-red-600 text-red-900 bg-white/60 rounded-t-xl shadow-sm'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-red-600" />
              <span>🗺️ संग्रह मानचित्र (Map)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 sm:gap-2 py-3 px-3 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === 'stats'
                  ? 'border-red-600 text-red-900 bg-white/60 rounded-t-xl shadow-sm'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 टीम आंकड़े (Leaderboard)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Textual Log Book */}
        {activeTab === 'logbook' && (
          <div className="animate-fadeIn">
            <LogBook
              entries={entries}
              onSelectEntry={(entry) => setSelectedReceiptEntry(entry)}
              onOpenNewEntry={() => {
                if (!currentUser) {
                  setIsLoginModalOpen(true);
                } else {
                  setIsNewEntryOpen(true);
                }
              }}
            />
          </div>
        )}

        {/* Tab 2: Map View */}
        {activeTab === 'map' && (
          <div className="animate-fadeIn">
            <MapView
              entries={entries}
              onSelectEntry={(entry) => setSelectedReceiptEntry(entry)}
            />
          </div>
        )}

        {/* Tab 3: Detailed Analytics & Transparency Ledger */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">
                  संग्रह टीम उत्तरदायित्व एवं ऑडिट विवरण (Team Audit Trail)
                </h3>
              </div>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                प्रत्येक चंदा प्रविष्टि संबंधित उपयोगकर्ता के खाते से टैग है। यह समिति के वित्तीय बहीखाते
                में 100% पारदर्शिता सुनिश्चित करता है।
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-600 border-b font-bold">
                      <th className="p-3">उपयोगकर्ता</th>
                      <th className="p-3 text-center">कुल रसीदें</th>
                      <th className="p-3 text-right">कुल संग्रह (₹)</th>
                      <th className="p-3 text-right">योगदान प्रतिशत</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {stats?.collectorBreakdown.map((item) => {
                      const share = stats.totalAmount > 0
                        ? ((item.totalAmount / stats.totalAmount) * 100).toFixed(1)
                        : '0';
                      return (
                        <tr key={item.collectorId} className="hover:bg-amber-50/50">
                          <td className="p-3 font-bold text-stone-900">
                            {item.collectorName}
                          </td>
                          <td className="p-3 text-center font-bold">
                            {item.count}
                          </td>
                          <td className="p-3 text-right font-black text-red-900">
                            ₹{item.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right font-bold text-amber-800">
                            {share}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Mobile "+ नया चंदा" Quick Button */}
      {currentUser && (
        <div className="fixed bottom-5 right-5 z-30 sm:hidden">
          <button
            onClick={() => setIsNewEntryOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold p-3.5 rounded-full shadow-2xl active:scale-95 transition-transform"
          >
            <PlusCircle className="w-6 h-6" />
            <span className="pr-1 text-sm font-bold">नया चंदा</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 border-t border-stone-200 bg-stone-100/80 py-4 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-700">
          श्री दुर्गा पूजा समिति • रौज़ा रोड, सासाराम (रोहतास), बिहार
        </p>
        <p className="text-[11px] text-stone-400 mt-1">
          Zero-Cost Open Source Web Architecture • Vercel & MongoDB Ready
        </p>
      </footer>

      {/* 1-Time Login Modal */}
      {authChecked && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginModalOpen(false)}
          isDismissable={Boolean(currentUser)}
        />
      )}

      {/* New Collection Entry Modal */}
      {currentUser && (
        <NewEntryModal
          isOpen={isNewEntryOpen}
          currentUser={currentUser}
          onClose={() => setIsNewEntryOpen(false)}
          onEntrySaved={handleEntrySaved}
        />
      )}

      {/* Digital Receipt Modal with Print & WhatsApp Share */}
      <ReceiptModal
        entry={selectedReceiptEntry}
        onClose={() => setSelectedReceiptEntry(null)}
      />
    </div>
  );
}
