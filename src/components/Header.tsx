/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRANDING } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 glass border-b border-white/10 h-20 sm:h-24 flex items-center px-4 sm:px-8 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="h-12 sm:h-16 w-auto overflow-hidden rounded-lg group">
            <img
              src="/logo.png"
              alt="Logo Fuengirola"
              className="h-full object-contain brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all group-hover:scale-110"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
              {BRANDING.municipality}
            </h1>
            <p className="text-lg font-bold text-blue-300/70">
              {BRANDING.appName}
            </p>
          </div>
        </div>


        <div />
      </div>
    </header>

  );
};
