'use client';

import React, { useState } from 'react';
import { CollectorUser, ChandaEntry } from '@/lib/types';
import { ROUZA_ROAD_LANDMARKS, SASARAM_ROUZA_ROAD_COORDS, COMMITTEE_INFO } from '@/lib/defaultUsers';
import {
  X,
  MapPin,
  QrCode,
  Banknote,
  IndianRupee,
  Navigation,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Phone,
  User,
  Home,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Image from 'next/image';

interface NewEntryModalProps {
  isOpen: boolean;
  currentUser: CollectorUser;
  onClose: () => void;
  onEntrySaved: (entry: ChandaEntry) => void;
}

const PRESET_AMOUNTS = [101, 251, 501, 1100, 2100, 5100];

export default function NewEntryModal({
  isOpen,
  currentUser,
  onClose,
  onEntrySaved,
}: NewEntryModalProps) {
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>(501);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI'>('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [landmark, setLandmark] = useState(ROUZA_ROAD_LANDMARKS[0]);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: SASARAM_ROUZA_ROAD_COORDS.lat + (Math.random() - 0.5) * 0.003,
    lng: SASARAM_ROUZA_ROAD_COORDS.lng + (Math.random() - 0.5) * 0.003,
  });
  const [locationStatus, setLocationStatus] = useState<string>('📍 कम्पनी सराय, रौज़ा रोड डिफॉल्ट');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [upiId, setUpiId] = useState(COMMITTEE_INFO.defaultUpiId);
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('ब्राउज़र में GPS समर्थित नहीं है');
      return;
    }

    setLocationStatus('GPS से स्थान प्राप्त हो रहा है...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setCoords(newCoords);
        setLocationStatus(`GPS प्राप्त: ${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('GPS नहीं मिला, कम्पनी सराय स्थान प्रयुक्त');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!donorName.trim()) {
      setError('कृपया दाता का नाम दर्ज करें (Donor name is required)');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('कृपया वैध राशि दर्ज करें (Valid amount is required)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        donorName: donorName.trim(),
        phone: phone.trim(),
        amount: Number(amount),
        paymentMode,
        transactionId: paymentMode === 'UPI' ? transactionId.trim() : '',
        landmark,
        address: address.trim() || `${landmark}, सासाराम`,
        location: coords,
        collectedBy: {
          id: currentUser.id,
          name: currentUser.name,
        },
        notes: notes.trim(),
      };

      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'चंदा दर्ज करने में विफलता');
      }

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#dc2626', '#f59e0b', '#10b981'],
        });
      } catch {
        // ignore confetti errors if unsupported
      }

      onEntrySaved(json.data);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('चंदा दर्ज करने में त्रुटि आई');
      }
    } finally {
      setLoading(false);
    }
  };

  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=${encodeURIComponent(COMMITTEE_INFO.name)}${
      amount && Number(amount) > 0 ? `&am=${amount}` : ''
    }&cu=INR`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500 max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-800 via-amber-700 to-red-900 text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-full border-2 border-amber-300 overflow-hidden shrink-0 bg-white">
              <Image
                src={COMMITTEE_INFO.logoUrl}
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100 leading-tight">
                नया चंदा रसीद काटें (Log Collection)
              </h2>
              <p className="text-[11px] text-amber-200/90 font-medium">
                {COMMITTEE_INFO.name} • {COMMITTEE_INFO.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-amber-200 hover:text-white rounded-lg hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2.5 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tagged Collector Info Banner */}
          <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-stone-600">संग्रहकर्ता टैग:</span>
              <span className="font-bold text-stone-900">{currentUser.name}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 inline" />
              ऑटो-टैग
            </span>
          </div>

          {/* Donor Name & Mobile Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                दाता का नाम (Donor Name) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="दाता का नाम लिखें"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                मोबाइल नंबर (WhatsApp रसीद हेतु)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 अंकों का मोबाइल नं."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amount and Quick Presets */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-stone-700">
                चंदा राशि (Amount in ₹) <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-amber-800 font-semibold">
                शुभ दान राशि चुनें:
              </span>
            </div>

            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-700 font-bold">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="राशि दर्ज करें"
                className="w-full pl-9 pr-3 py-2.5 text-lg font-bold text-stone-900 border-2 border-amber-400/80 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-600 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                    amount === val
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-300 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Mode (Cash / UPI) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              भुगतान माध्यम (Payment Mode)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold text-xs transition-all ${
                  paymentMode === 'Cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>💵 नकद (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold text-xs transition-all ${
                  paymentMode === 'UPI'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>📱 UPI / ऑनलाइन</span>
              </button>
            </div>

            {paymentMode === 'UPI' && (
              <div className="mt-2.5 p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-900">
                    UPI संदर्भ संख्या (Ref / UTR / Txn ID)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(!showQrModal)}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    {showQrModal ? 'QR छुपाएं' : 'पंडाल का QR कोड दिखाएं'}
                  </button>
                </div>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="उदा. UTR: 428198765432 या PhonePe/GPay ID"
                  className="w-full px-3 py-1.5 text-xs border border-blue-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-500"
                />

                {showQrModal && (
                  <div className="p-3 bg-white rounded-xl border border-blue-300 text-center animate-fadeIn shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-500">
                        <Image src={COMMITTEE_INFO.logoUrl} alt="Logo" fill className="object-cover" />
                      </div>
                      <p className="text-xs font-bold text-stone-800">
                        {COMMITTEE_INFO.name}
                      </p>
                    </div>

                    <div className="inline-block p-2 bg-white border-2 border-stone-800 rounded-xl shadow-md">
                      <img
                        src={dynamicQrUrl}
                        alt="समिति UPI QR कोड"
                        className="w-44 h-44 mx-auto rounded"
                      />
                    </div>

                    <div className="mt-2 text-center">
                      <p className="text-[11px] font-semibold text-stone-600 mb-1">
                        स्कैन करें या UPI ID पर भुगतान करें:
                      </p>
                      <div className="flex items-center justify-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 max-w-xs mx-auto">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="text-xs font-mono font-bold text-stone-800 bg-transparent outline-none flex-1 text-center"
                          placeholder="अपनी UPI ID दर्ज करें"
                        />
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 text-stone-600 hover:text-stone-900 rounded"
                          title="UPI ID कॉपी करें"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {copiedUpi && (
                        <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">
                          ✓ UPI ID कॉपी हो गई!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rouza Road Landmark & Address */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              स्थान / प्रमुख स्थल (Landmark)
            </label>
            <select
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl bg-stone-50 focus:ring-2 focus:ring-red-500 outline-none mb-2 font-medium"
            >
              {ROUZA_ROAD_LANDMARKS.map((lm) => (
                <option key={lm} value={lm}>
                  {lm}
                </option>
              ))}
            </select>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Home className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="दुकान/मकान सं०, कम्पनी सराय, रौज़ा रोड"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Map & GPS Tagging Section */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-stone-800">
                  संग्रह स्थल GPS टैग (Map Location)
                </span>
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-900 bg-red-100/70 hover:bg-red-200/80 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Navigation className="w-3 h-3" />
                <span>📍 वर्तमान स्थान लें</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-600 font-mono">
              <span className="truncate">{locationStatus}</span>
              <span className="shrink-0 text-stone-400 ml-2">
                [{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}]
              </span>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              विशेष टिप्पणी / संकल्प (Notes / Remarks)
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-stone-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="उदा. भोग, आरती, दीपदान, लंगर सेवा"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-700 via-amber-700 to-red-800 hover:from-red-800 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{loading ? 'रसीद तैयार हो रही है...' : 'चंदा सुरक्षित करें एवं रसीद काटें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
