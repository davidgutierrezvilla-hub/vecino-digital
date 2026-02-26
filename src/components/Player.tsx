/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, SkipBack, SkipForward, X } from 'lucide-react';
import { Lesson } from '../types';

interface PlayerProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  initialPosition?: number;
  onUpdatePosition: (pos: number) => void;
}

export const Player: React.FC<PlayerProps> = ({
  lesson,
  onClose,
  onComplete,
  onNext,
  onPrev,
  initialPosition = 0,
  onUpdatePosition
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      onUpdatePosition(0);
      onClose();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
      onUpdatePosition(current);
    }
  };

  const handleEnded = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex justify-between items-center z-10 bg-black/60">
        <h2 className="text-white text-xl sm:text-3xl font-black truncate pr-12 sm:pr-16 uppercase tracking-tight">
          {lesson.title}
        </h2>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/30 p-4 sm:p-6 rounded-full text-white transition-all active:scale-90 border-2 border-white/20"
          aria-label="Cerrar reproductor"
        >
          <X className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={3} />
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center relative group bg-black">
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          poster={lesson.thumbnail}
          className="w-full h-full object-contain max-h-screen shadow-2xl"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onClick={togglePlay}
          playsInline
          autoPlay
          preload="auto"
          controlsList="nodownload"
        />

        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute bg-fuengirola-blue/90 p-10 sm:p-16 rounded-full text-white shadow-2xl scale-110 active:scale-95 transition-transform border-4 border-white/20 backdrop-blur-sm"
          >
            <Play className="w-16 h-16 sm:w-24 sm:h-24" fill="currentColor" />
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-zinc-900 p-6 sm:p-10 pb-10 sm:pb-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          {/* Progress Bar */}
          <div className="relative group/progress cursor-pointer">
            <div className="w-full bg-zinc-800 h-3 sm:h-5 rounded-full overflow-hidden shadow-inner transition-all group-hover/progress:h-5 sm:group-hover/progress:h-8">
              <div
                className="bg-fuengirola-gold h-full rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(254,203,0,0.4)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Clickable area for seeking - note: seeking logic could be added here if needed */}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-4 sm:gap-12">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="p-4 sm:p-8 text-white disabled:opacity-20 active:scale-90 hover:bg-white/5 rounded-full transition-all flex flex-col items-center gap-2 group"
            >
              <SkipBack className="w-10 h-10 sm:w-16 sm:h-16" fill={onPrev ? "currentColor" : "none"} strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Anterior</span>
            </button>

            <div className="flex gap-6 sm:gap-16 items-center">
              <button
                onClick={handleStop}
                className="p-4 sm:p-8 text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-full active:scale-90 transition-all border-2 border-white/5 hover:border-white/10"
              >
                <Square className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" strokeWidth={2.5} />
              </button>

              <button
                onClick={togglePlay}
                className="p-8 sm:p-14 text-white bg-fuengirola-blue rounded-full shadow-[0_20px_50px_rgba(0,75,147,0.5)] active:scale-90 transition-all border-4 border-white/20 hover:scale-105 hover:shadow-[0_25px_60px_rgba(0,75,147,0.6)]"
              >
                {isPlaying ? (
                  <Pause className="w-14 h-14 sm:w-22 sm:h-22" fill="currentColor" strokeWidth={2.5} />
                ) : (
                  <Play className="w-14 h-14 sm:w-22 sm:h-22" fill="currentColor" strokeWidth={2.5} />
                )}
              </button>
            </div>

            <button
              onClick={onNext}
              disabled={!onNext}
              className="p-4 sm:p-8 text-white disabled:opacity-20 active:scale-90 hover:bg-white/5 rounded-full transition-all flex flex-col items-center gap-2 group"
            >
              <SkipForward className="w-10 h-10 sm:w-16 sm:h-16" fill={onNext ? "currentColor" : "none"} strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Siguiente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
