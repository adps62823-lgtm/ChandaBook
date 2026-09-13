'use client';

import React, { useState } from 'react';
import { CollectorUser } from '@/lib/types';
import { DEFAULT_COLLECTORS } from '@/lib/defaultUsers';
import { ShieldCheck, Lock, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: CollectorUser) => void;
  onClose?: () => void;
  isDismissable?: boolean;
}

export default function LoginModal({
  isOpen,
  onLoginSuccess,
  onClose,
  isDismissable = false,
}: LoginModalProps) {
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>(DEFAULT_COLLECTORS[0].id);
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedCollector = DEFAULT_COLLECTORS.find((c) => c.id === selectedCollectorId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('कृपया अपना 4 अंकों का पिन दर्ज करें (Please enter 4-digit PIN)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectorId: selectedCollectorId,
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'गलत पिन (Invalid PIN)');
      }

      // Successful login
      onLoginSuccess(data.user);
      setPin('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('लॉगिन करने में त्रुटि हुई');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillPin = (presetPin: string) => {
    setPin(presetPin);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500/40">
        {/* Modal Top Festive Header */}
        <div className="bg-gradient-to-br from-red-700 via-red-800 to-amber-700 p-5 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-300 mb-2">
            <span className="text-2xl" role="img" aria-label="Puja Diya">
              🪔
            </span>
          </div>
          <h2 className="text-xl font-bold text-amber-100">
            संग्रहकर्ता टीम लॉगिन
          </h2>
          <p className="text-xs text-amber-200/90 mt-0.5">
            रौज़ा रोड दुर्गा पूजा समिति, सासाराम • एक बार लॉगिन (Persistent Session)
          </p>
          <div className="mt-2 text-[11px] bg-amber-500/20 text-amber-100 py-1 px-3 rounded-full inline-block border border-amber-400/30">
            🔒 लॉग आउट करने तक यह लॉगिन इसी फ़ोन/कंप्यूटर में सेव रहेगा
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
              अपना नाम चुनें (Select Your Name)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_COLLECTORS.map((collector) => {
                const isSelected = collector.id === selectedCollectorId;
                return (
                  <button
                    key={collector.id}
                    type="button"
                    onClick={() => {
                      setSelectedCollectorId(collector.id);
                      setError('');
                    }}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/80 ring-2 ring-red-500/30 shadow-sm'
                        : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${collector.avatarColor} text-white text-[11px] font-bold flex items-center justify-center`}
                      >
                        {collector.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {collector.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 pl-8">
                      {collector.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PIN Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                सुरक्षा पिन (4-Digit PIN)
              </label>
              {selectedCollector && (
                <button
                  type="button"
                  onClick={() => handleQuickFillPin(selectedCollector.pin)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  पिन भरें (PIN: {selectedCollector.pin})
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4 अंकों का पिन दर्ज करें"
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-center tracking-[0.4em] font-mono text-lg border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserCheck className="w-5 h-5" />
              <span>{loading ? 'सत्यापित हो रहा है...' : 'लॉगिन करें (Start Collection)'}</span>
            </button>
          </div>

          {isDismissable && onClose && (
            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-700 underline"
              >
                रद्द करें (Cancel)
              </button>
            </div>
          )}

          <div className="border-t border-stone-100 pt-3 text-center">
            <p className="text-[11px] text-stone-400">
              📍 रौज़ा रोड, सासाराम (बिहार) • दुर्गा पूजा उत्सव समिति
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
