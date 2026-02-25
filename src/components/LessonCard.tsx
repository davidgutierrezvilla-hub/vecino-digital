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
    [LessonStatus.PENDING]: { label: 'Pendiente', color: 'bg-gray-100 text-gray-600' },
    [LessonStatus.IN_PROGRESS]: { label: 'En curso', color: 'bg-blue-100 text-blue-700' },
    [LessonStatus.COMPLETED]: { label: 'Hecha', color: 'bg-green-100 text-green-700' },
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full text-left bg-white rounded-3xl overflow-hidden border-4 transition-all active:scale-95 ${
        isFeatured ? 'border-blue-600 shadow-xl' : 'border-gray-200 shadow-md'
      }`}
    >
      <div className="relative aspect-video">
        <img 
          src={lesson.thumbnail} 
          alt={lesson.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded-full shadow-lg">
            <Play className="w-10 h-10 text-blue-800 fill-blue-800" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg font-bold text-lg">
          {lesson.duration}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider ${statusLabels[status].color}`}>
            {statusLabels[status].label}
          </span>
          <span className="text-gray-400 font-bold text-xl">#{lesson.order}</span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
          {lesson.title}
        </h3>
        <p className="text-lg text-gray-600 line-clamp-2">
          {lesson.description}
        </p>
      </div>
    </button>
  );
};
