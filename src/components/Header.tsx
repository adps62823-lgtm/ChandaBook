'use client';

import React from 'react';
import { CollectorUser } from '@/lib/types';
import { LogOut, PlusCircle, Database, ShieldCheck, MapPin } from 'lucide-react';

interface HeaderProps {
  currentUser: CollectorUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenNewEntry: () => void;
  isLiveMongo: boolean;
}

export default function Header({
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenNewEntry,
  isLiveMongo,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-red-800 via-amber-700 to-red-900 text-white shadow-lg border-b-2 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-2xl select-none" role="img" aria-label="Durga Puja Trishul">
                🔱
              </span>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold text-amber-200 tracking-wider uppercase">
                  ॥ श्री दुर्गाय नमः ॥
                </span>
                <span
                  className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isLiveMongo
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                      : 'bg-amber-400/20 text-amber-100 border border-amber-300/40'
                  }`}
                  title={isLiveMongo ? 'Connected to MongoDB Atlas' : 'Running on fast local storage'}
                >
                  <Database className="w-2.5 h-2.5 mr-1" />
                  {isLiveMongo ? 'MongoDB Active' : 'Offline/Local Mode'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                माँ दुर्गा पूजा समिति • रौज़ा रोड
              </h1>
              <p className="text-xs text-amber-100/90 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3 h-3 text-amber-300 inline" />
                सासाराम (रोहतास) • चंदा संग्रह दल (ChandaBook)
              </p>
            </div>
          </div>

          {/* Action and User Session Controls */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {currentUser ? (
              <>
                <div className="flex items-center bg-black/25 backdrop-blur-sm border border-amber-400/30 rounded-lg px-3 py-1.5 shadow-sm">
                  <div
                    className={`w-7 h-7 rounded-full ${currentUser.avatarColor || 'bg-amber-600'} text-white font-bold flex items-center justify-center text-xs shadow-inner mr-2`}
                  >
                    {currentUser.name.replace('User ', 'U')}
                  </div>
                  <div className="text-left mr-2">
                    <p className="text-xs font-bold leading-tight text-amber-100">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-amber-300/80 leading-tight">
                      अधिकृत सदस्य
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    title="लॉग आउट करें (Sign Out)"
                    className="ml-1 p-1 hover:bg-red-700/60 rounded text-red-200 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={onOpenNewEntry}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 font-bold px-3.5 py-2 rounded-lg text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4 text-red-900" />
                  <span>+ नया चंदा</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-4 py-2 rounded-lg text-sm shadow-md transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>लॉगिन करें</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
