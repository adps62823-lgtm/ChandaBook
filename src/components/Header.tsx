'use client';

import React from 'react';
import { CollectorUser } from '@/lib/types';
import { COMMITTEE_INFO } from '@/lib/defaultUsers';
import { LogOut, PlusCircle, ShieldCheck, MapPin } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  currentUser: CollectorUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenNewEntry: () => void;
  isLiveMongo?: boolean;
}

export default function Header({
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenNewEntry,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-red-900 via-amber-800 to-red-950 text-white shadow-lg border-b-2 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="relative w-12 h-12 rounded-full border-2 border-amber-300 shadow-md overflow-hidden shrink-0 bg-amber-100 flex items-center justify-center">
              <Image
                src={COMMITTEE_INFO.logoUrl}
                alt="माँ भगवती पूजन कला संघ लोगो"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-semibold text-amber-200 tracking-wider uppercase">
                  ॥ स्थापित सन् २००१ ॥
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-sm leading-snug">
                {COMMITTEE_INFO.name}
              </h1>
              <p className="text-xs text-amber-100/90 flex items-center justify-center sm:justify-start gap-1 font-medium">
                <MapPin className="w-3 h-3 text-amber-300 inline shrink-0" />
                {COMMITTEE_INFO.subtitle} (रोहतास)
              </p>
            </div>
          </div>

          {/* Action and User Session Controls */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {currentUser ? (
              <>
                <div className="flex items-center bg-black/30 backdrop-blur-sm border border-amber-400/30 rounded-lg px-3 py-1.5 shadow-sm">
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
