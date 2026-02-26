/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lesson, LessonStatus } from '../types';
import { Play, CheckCircle, Clock } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  onClick: () => void;
  isFeatured?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, status, onClick, isFeatured }) => {
  const statusLabels = {
    [LessonStatus.PENDING]: { label: 'Pendiente', color: 'bg-white/10 text-white/60' },
    [LessonStatus.IN_PROGRESS]: { label: 'En curso', color: 'bg-blue-500/20 text-blue-300' },
    [LessonStatus.COMPLETED]: { label: 'Hecha', color: 'bg-green-500/20 text-green-300' },
  };

  return (
    <button
      onClick={onClick}
      className={`group glass p-4 rounded-[2.5rem] transition-all hover:border-blue-400/30 shadow-lg flex flex-col items-center mx-auto w-full max-w-[480px] hover:scale-[1.02] active:scale-95 ${isFeatured ? 'ring-2 ring-blue-500/50' : ''
        }`}
    >
      {/* Contenedor del Vídeo con Proporción 16:9 */}
      <div className="relative w-full aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-black shadow-inner mb-4 ring-1 ring-white/10">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg">
            <Play className="w-10 h-10 text-white fill-white" />
          </div>
        </div>

        {/* Badge de estado en la esquina */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider backdrop-blur-md ${statusLabels[status].color}`}>
            {statusLabels[status].label}
          </span>
        </div>

        {/* Duración */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg font-bold text-sm">
          {lesson.duration}
        </div>
      </div>

      {/* Título o Texto Inferior */}
      <h3 className="text-white font-medium text-xl px-2 text-center leading-tight">
        {lesson.title}
      </h3>

      {/* Orden de la lección decorativo */}
      <span className="mt-2 text-white/20 font-black text-sm uppercase tracking-widest">
        Lección #{lesson.order}
      </span>
    </button>
  );
};
