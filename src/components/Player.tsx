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
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col backdrop-blur-xl">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-8 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
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
      <div className="flex-1 flex items-center justify-center relative group">
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          className="w-full h-auto max-h-[80vh] shadow-2xl bg-black"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onClick={togglePlay}
          playsInline
          preload="auto"
        />

        {!isPlaying && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={togglePlay}
            className="absolute bg-fuengirola-blue p-10 sm:p-16 rounded-full text-white shadow-[0_0_60px_rgba(0,75,147,0.6)] scale-110 active:scale-95 transition-transform border-8 border-white/20"
          >
            <Play className="w-16 h-16 sm:w-24 sm:h-24" fill="currentColor" />
          </motion.button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-zinc-900/90 p-6 sm:p-10 pb-10 sm:pb-16 backdrop-blur-md border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          {/* Progress Bar */}
          <div className="relative group/progress">
            <div className="w-full bg-zinc-800 h-4 sm:h-6 rounded-full overflow-hidden cursor-pointer shadow-inner">
              <motion.div
                className="bg-fuengirola-gold h-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]" />
              </motion.div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-4 sm:gap-12">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="p-4 sm:p-8 text-white disabled:opacity-20 active:bg-white/10 rounded-full transition-all flex flex-col items-center gap-2 group"
            >
              <SkipBack className="w-10 h-10 sm:w-16 sm:h-16" fill={onPrev ? "currentColor" : "none"} strokeWidth={3} />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Anterior</span>
            </button>

            <div className="flex gap-4 sm:gap-12 items-center">
              <button
                onClick={handleStop}
                className="p-4 sm:p-8 text-white bg-zinc-800 rounded-full active:bg-zinc-700 transition-all border-4 border-white/5 hover:border-white/10"
              >
                <Square className="w-8 h-8 sm:w-14 sm:h-14" fill="currentColor" strokeWidth={3} />
              </button>

              <button
                onClick={togglePlay}
                className="p-6 sm:p-12 text-white bg-fuengirola-blue rounded-full shadow-[0_20px_40px_rgba(0,75,147,0.4)] active:scale-90 transition-all border-4 border-white/20 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 sm:w-20 sm:h-20" fill="currentColor" strokeWidth={3} />
                ) : (
                  <Play className="w-12 h-12 sm:w-20 sm:h-20" fill="currentColor" strokeWidth={3} />
                )}
              </button>
            </div>

            <button
              onClick={onNext}
              disabled={!onNext}
              className="p-4 sm:p-8 text-white disabled:opacity-20 active:bg-white/10 rounded-full transition-all flex flex-col items-center gap-2 group"
            >
              <SkipForward className="w-10 h-10 sm:w-16 sm:h-16" fill={onNext ? "currentColor" : "none"} strokeWidth={3} />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Siguiente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
