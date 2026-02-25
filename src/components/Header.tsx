/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRANDING } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 glass border-b-2 border-fuengirola-blue/20 h-20 sm:h-24 flex items-center px-4 sm:px-8 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="h-12 sm:h-16 w-auto overflow-hidden rounded-lg">
            <img
              src="/logo.png"
              alt="Logo Fuengirola"
              className="h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black text-fuengirola-blue leading-tight uppercase tracking-tight">
              {BRANDING.municipality}
            </h1>
            <p className="text-lg font-bold text-fuengirola-blue/70">
              {BRANDING.appName}
            </p>
          </div>
        </div>

        <div className="bg-fuengirola-blue/10 px-6 py-2 rounded-full border border-fuengirola-blue/20">
          <span className="text-fuengirola-blue font-black text-lg">VECINDAD</span>
        </div>
      </div>
    </header>
  );
};
