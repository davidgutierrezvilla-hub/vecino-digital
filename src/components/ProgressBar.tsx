/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="glass p-8 rounded-[40px] shadow-2xl border border-white/10">
      <div className="flex justify-between items-end mb-4">
        <span className="text-2xl font-black text-white/90 uppercase tracking-tight">Tu progreso</span>
        <span className="text-3xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">{percentage}%</span>
      </div>
      <div className="w-full bg-white/5 h-6 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
        <div
          className="bg-blue-600 h-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-4 text-xl text-white/50 font-bold uppercase tracking-widest text-center">
        Has completado <span className="text-white">{completed}</span> de <span className="text-white">{total}</span> píldoras
      </p>
    </div>

  );
};
