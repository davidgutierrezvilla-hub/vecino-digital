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
    <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xl font-bold text-gray-700">Progreso del curso</span>
        <span className="text-2xl font-black text-blue-800">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-lg text-gray-600 font-medium">
        Has completado <span className="font-bold text-gray-900">{completed}</span> de <span className="font-bold text-gray-900">{total}</span> píldoras
      </p>
    </div>
  );
};
