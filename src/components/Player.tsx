import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, RotateCcw, RotateCw, SkipBack, SkipForward } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        onUpdatePosition(videoRef.current.currentTime);
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setShowControls(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden"
      onClick={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        poster={lesson.thumbnail}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onComplete}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        playsInline
        autoPlay
        preload="auto"
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6 sm:p-12"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-white text-2xl sm:text-4xl font-black uppercase tracking-tight drop-shadow-lg">
                  {lesson.title}
                </h2>
                <p className="text-blue-300 font-bold text-lg sm:text-xl opacity-80 uppercase tracking-widest">
                  Lección {lesson.order}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) onUpdatePosition(videoRef.current.currentTime);
                  onClose();
                }}
                className="bg-white/10 hover:bg-white/20 p-4 sm:p-5 rounded-full text-white backdrop-blur-xl transition-all border border-white/20 active:scale-90"
              >
                <X size={32} strokeWidth={3} />
              </button>
            </div>

            {/* Center Controls */}
            <div className="flex items-center justify-center gap-8 sm:gap-20" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => skip(-10)}
                className="text-white/80 hover:text-white transition-all active:scale-90 flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <RotateCcw size={60} strokeWidth={1.5} className="sm:w-24 sm:h-24" />
                  <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-2xl font-black mt-1">10</span>
                </div>
              </button>

              <button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 p-10 sm:p-16 rounded-full text-white backdrop-blur-2xl transition-all border-2 border-white/20 shadow-2xl active:scale-95"
              >
                {isPlaying ? (
                  <Pause size={64} fill="white" className="sm:w-24 sm:h-24" />
                ) : (
                  <Play size={64} fill="white" className="sm:w-24 sm:h-24 ml-2" />
                )}
              </button>

              <button
                onClick={() => skip(10)}
                className="text-white/80 hover:text-white transition-all active:scale-90 flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <RotateCw size={60} strokeWidth={1.5} className="sm:w-24 sm:h-24" />
                  <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-2xl font-black mt-1">10</span>
                </div>
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 text-white/80 font-black text-lg sm:text-xl tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                  <motion.div
                    className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                  />
                </div>
                <span>-{formatTime(duration - currentTime)}</span>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="flex items-center gap-3 text-white/50 hover:text-white disabled:opacity-0 transition-all font-black uppercase tracking-widest text-lg"
                >
                  <SkipBack size={32} fill="currentColor" />
                  Anterior
                </button>
                <button
                  onClick={onNext}
                  disabled={!onNext}
                  className="flex items-center gap-3 text-white/50 hover:text-white disabled:opacity-0 transition-all font-black uppercase tracking-widest text-lg"
                >
                  Siguiente
                  <SkipForward size={32} fill="currentColor" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

