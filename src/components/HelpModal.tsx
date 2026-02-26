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
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 border border-white/10">
        <div className="bg-blue-600/20 p-6 flex justify-between items-center text-white border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <HelpCircle size={32} className="text-blue-400" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Ayuda</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={32} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-xl font-black text-blue-300 leading-tight">
                {faq.q}
              </h3>
              <p className="text-lg text-white/60 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-black/20 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[30px] text-xl font-black shadow-xl active:scale-95 transition-all"
          >
            ENTENDIDO, VOLVER
          </button>
        </div>
      </div>
    </div>
  );
};
