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
    setState(prev => ({ ...prev, currentView: 'lesson', selectedLessonId: id }));
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
    <div className="min-h-screen bg-[#f0f4f8] pt-28 sm:pt-32 pb-16 px-4 sm:px-8">
      <Header />

      <main className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
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
                <h2 className="text-4xl font-black text-gray-900 mb-8 flex items-center gap-4 px-2">
                  <span className="w-3 h-10 bg-fuengirola-blue rounded-full" />
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
                className="w-full flex items-center justify-center gap-4 p-8 bg-white border-4 border-dashed border-fuengirola-blue/20 rounded-[40px] text-fuengirola-blue font-black text-2xl hover:bg-fuengirola-blue/5 transition-all shadow-md"
              >
                <HelpCircle size={40} />
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
                className="flex items-center gap-3 text-fuengirola-blue font-black text-2xl p-4 hover:bg-fuengirola-blue/10 rounded-2xl transition-colors"
              >
                <ArrowLeft size={36} />
                Volver al curso
              </button>

              <div className="bg-white rounded-[60px] overflow-hidden shadow-xl border-4 border-fuengirola-blue/5">
                <div className="aspect-video relative cursor-pointer" onClick={handlePlay}>
                  <img src={selectedLesson.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-fuengirola-blue/10 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-full shadow-2xl">
                      <Play size={64} className="text-fuengirola-blue fill-fuengirola-blue" />
                    </div>
                  </div>
                </div>

                <div className="p-12 space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="bg-fuengirola-blue text-white px-6 py-2 rounded-2xl font-black text-xl uppercase">
                      Lección {selectedLesson.order}
                    </span>
                    <span className="bg-fuengirola-blue/5 px-6 py-2 rounded-2xl font-black text-fuengirola-blue text-xl">
                      {selectedLesson.duration} mins
                    </span>
                  </div>

                  <h2 className="text-5xl font-black text-gray-900 leading-tight">
                    {selectedLesson.title}
                  </h2>

                  <p className="text-2xl text-gray-600 leading-relaxed font-medium">
                    {selectedLesson.description}
                  </p>

                  <div className="pt-6">
                    <button
                      onClick={handlePlay}
                      className="w-full bg-fuengirola-blue hover:bg-fuengirola-blue/90 text-white py-10 rounded-[40px] text-4xl font-black shadow-2xl shadow-fuengirola-blue/30 flex items-center justify-center gap-6 transition-all active:scale-95"
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
              className="text-center space-y-12 py-16 px-8 bg-white rounded-[80px] border-4 border-fuengirola-blue/10 shadow-2xl"
            >
              <div className="flex justify-center">
                <div className="bg-green-100 p-12 rounded-[50px] text-green-600">
                  <CheckCircle size={140} strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-6xl font-black text-gray-900 tracking-tight">¡Bravo!</h2>
                <p className="text-3xl text-gray-700 font-bold leading-snug">
                  Has completado: <br />
                  <span className="text-fuengirola-blue text-4xl font-black block mt-2">"{selectedLesson.title}"</span>
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
                  className="w-full bg-white border-4 border-fuengirola-blue/20 text-fuengirola-blue py-8 rounded-[40px] text-3xl font-black active:scale-95 hover:bg-fuengirola-blue/5 transition-all shadow-xl"
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
          onClose={() => setState(prev => ({ ...prev, currentView: 'lesson' }))}
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
