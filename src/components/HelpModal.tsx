/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const faqs = [
    {
      q: '¿Cómo reproduzco un vídeo?',
      a: 'Pulsa sobre la imagen del vídeo que quieras ver y luego pulsa el botón azul grande con el triángulo (Play).'
    },
    {
      q: '¿Cómo continúo donde lo dejé?',
      a: 'La aplicación recuerda por dónde ibas. Si entras en un vídeo que ya empezaste, pulsa "Reproducir" y seguirá desde ese punto.'
    },
    {
      q: '¿Cómo paso al siguiente vídeo?',
      a: 'Al terminar un vídeo aparecerá un botón grande que dice "Siguiente". También puedes usar las flechas en el reproductor.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="bg-blue-800 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <HelpCircle size={32} />
            <h2 className="text-2xl font-bold">Ayuda</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X size={32} />
          </button>
        </div>
        
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-xl font-black text-blue-900 leading-tight">
                {faq.q}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Entendido, volver
          </button>
        </div>
      </div>
    </div>
  );
};
