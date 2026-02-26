/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Lesson, LessonStatus, AppState, UserProgress } from './types';
import { LESSONS, BRANDING } from './constants';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { LessonCard } from './components/LessonCard';
import { Player } from './components/Player';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('vecino_digital_progress');
    const progress = saved ? JSON.parse(saved) : {};
    return {
      currentView: 'home',
      selectedLessonId: null,
      progress: progress
    };
  });

  const [showHelp, setShowHelp] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('vecino_digital_progress', JSON.stringify(state.progress));
  }, [state.progress]);

  const selectedLesson = useMemo(() =>
    LESSONS.find(l => l.id === state.selectedLessonId) || null
    , [state.selectedLessonId]);

  const completedCount = useMemo(() =>
    Object.values(state.progress).filter((p: UserProgress) => p.status === LessonStatus.COMPLETED).length
    , [state.progress]);

  const updateProgress = (lessonId: string, updates: Partial<UserProgress>) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [lessonId]: {
          lessonId,
          status: LessonStatus.PENDING,
          lastPosition: 0,
          ...(prev.progress[lessonId] || {}),
          ...updates
        }
      }
    }));
  };

  const handleStartLesson = (id: string) => {
    setState(prev => ({ ...prev, currentView: 'player', selectedLessonId: id }));
  };

  const handlePlay = () => {
    if (state.selectedLessonId) {
      updateProgress(state.selectedLessonId, { status: LessonStatus.IN_PROGRESS });
      setState(prev => ({ ...prev, currentView: 'player' }));
    }
  };

  const handleVideoComplete = () => {
    if (state.selectedLessonId) {
      updateProgress(state.selectedLessonId, { status: LessonStatus.COMPLETED, lastPosition: 0 });
      setState(prev => ({ ...prev, currentView: 'end' }));
    }
  };

  const handleNext = () => {
    const currentIndex = LESSONS.findIndex(l => l.id === state.selectedLessonId);
    if (currentIndex < LESSONS.length - 1) {
      const nextLesson = LESSONS[currentIndex + 1];
      setState(prev => ({ ...prev, currentView: 'lesson', selectedLessonId: nextLesson.id }));
    } else {
      setState(prev => ({ ...prev, currentView: 'home', selectedLessonId: null }));
    }
  };

  const handlePrev = () => {
    const currentIndex = LESSONS.findIndex(l => l.id === state.selectedLessonId);
    if (currentIndex > 0) {
      const prevLesson = LESSONS[currentIndex - 1];
      setState(prev => ({ ...prev, currentView: 'lesson', selectedLessonId: prevLesson.id }));
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 px-4 sm:px-8 overflow-x-hidden">
      <Header />

      <main className={`max-w-5xl mx-auto space-y-8 sm:space-y-12 transition-opacity duration-300 ${state.currentView === 'player' ? 'opacity-0 pointer-events-none fixed' : 'opacity-100'}`}>
        <AnimatePresence mode="wait">
          {state.currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 sm:space-y-12"
            >
              <ProgressBar completed={completedCount} total={LESSONS.length} />

              <section>
                <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-4 px-2">
                  <span className="w-3 h-10 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  Tu aprendizaje hoy
                </h2>
                <div className="grid gap-10">
                  {LESSONS.map((lesson, idx) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isFeatured={idx === 0 && completedCount === 0}
                      status={state.progress[lesson.id]?.status || LessonStatus.PENDING}
                      onClick={() => handleStartLesson(lesson.id)}
                    />
                  ))}
                </div>
              </section>

              <button
                onClick={() => setShowHelp(true)}
                className="w-full flex items-center justify-center gap-4 p-8 glass border-2 border-dashed border-white/10 rounded-[40px] text-blue-300 font-black text-2xl hover:bg-white/5 transition-all shadow-xl group"
              >
                <HelpCircle size={40} className="transition-transform group-hover:scale-110" />
                ¿Quieres que te ayudemos?
              </button>
            </motion.div>
          )}

          {state.currentView === 'lesson' && selectedLesson && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <button
                onClick={() => setState(prev => ({ ...prev, currentView: 'home' }))}
                className="flex items-center gap-3 text-blue-300 font-black text-2xl p-4 hover:bg-white/5 rounded-2xl transition-colors group"
              >
                <ArrowLeft size={36} className="transition-transform group-hover:-translate-x-1" />
                Volver al curso
              </button>

              <div className="glass rounded-[40px] sm:rounded-[60px] overflow-hidden shadow-2xl border border-white/10">
                <div className="aspect-[16/9] relative cursor-pointer group" onClick={handlePlay}>
                  <img src={selectedLesson.thumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-xl p-8 rounded-full shadow-2xl ring-1 ring-white/20 transition-transform group-hover:scale-110">
                      <Play size={64} className="text-white fill-white ml-2" />
                    </div>
                  </div>
                </div>

                <div className="p-8 sm:p-12 space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-xl uppercase tracking-wider shadow-lg shadow-blue-600/20">
                      Lección {selectedLesson.order}
                    </span>
                    <span className="bg-white/5 backdrop-blur-md px-6 py-2 rounded-2xl font-black text-blue-200 text-xl border border-white/5">
                      {selectedLesson.duration} min
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                    {selectedLesson.title}
                  </h2>

                  <p className="text-xl sm:text-2xl text-white/60 leading-relaxed font-medium">
                    {selectedLesson.description}
                  </p>

                  <div className="pt-6">
                    <button
                      onClick={handlePlay}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-8 sm:py-10 rounded-[30px] sm:rounded-[40px] text-3xl sm:text-4xl font-black shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-6 transition-all active:scale-95"
                    >
                      <Play size={48} fill="currentColor" />
                      {state.progress[selectedLesson.id]?.lastPosition ? 'CONTINUAR VÍDEO' : 'VER AHORA'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentView === 'end' && selectedLesson && (
            <motion.div
              key="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-12 py-16 px-8 glass rounded-[60px] sm:rounded-[80px] border border-white/10 shadow-2xl"
            >
              <div className="flex justify-center">
                <div className="bg-green-500/10 p-12 rounded-[50px] text-green-400 backdrop-blur-md border border-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                  <CheckCircle size={140} strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-6xl font-black text-white tracking-tight">¡Bravo!</h2>
                <p className="text-3xl text-white/70 font-bold leading-snug">
                  Has completado: <br />
                  <span className="text-blue-400 text-4xl font-black block mt-2">"{selectedLesson.title}"</span>
                </p>
              </div>

              <div className="grid gap-8 pt-10">
                {LESSONS.findIndex(l => l.id === selectedLesson.id) < LESSONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full bg-fuengirola-blue text-white py-10 rounded-[40px] text-4xl font-black shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-transform"
                  >
                    SIGUIENTE VÍDEO
                    <ArrowRight size={48} />
                  </button>
                ) : (
                  <p className="text-2xl font-black text-fuengirola-blue uppercase tracking-widest">
                    ¡Has terminado todo el curso! 🌟
                  </p>
                )}

                <button
                  onClick={() => setState(prev => ({ ...prev, currentView: 'home', selectedLessonId: null }))}
                  className="w-full glass border border-white/10 text-white/60 py-8 rounded-[40px] text-3xl font-black active:scale-95 hover:bg-white/5 hover:text-white transition-all shadow-xl"
                >
                  VOLVER AL INICIO
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {state.currentView === 'player' && selectedLesson && (
        <Player
          lesson={selectedLesson}
          initialPosition={state.progress[selectedLesson.id]?.lastPosition || 0}
          onClose={() => setState(prev => ({ ...prev, currentView: 'home' }))}
          onComplete={handleVideoComplete}
          onUpdatePosition={(pos) => updateProgress(selectedLesson.id, { lastPosition: pos })}
          onNext={LESSONS.findIndex(l => l.id === selectedLesson.id) < LESSONS.length - 1 ? handleNext : undefined}
          onPrev={LESSONS.findIndex(l => l.id === selectedLesson.id) > 0 ? handlePrev : undefined}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
