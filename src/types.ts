/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LessonStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  order: number;
}

export interface UserProgress {
  lessonId: string;
  status: LessonStatus;
  lastPosition: number; // in seconds
}

export interface AppState {
  currentView: 'home' | 'lesson' | 'player' | 'end' | 'help';
  selectedLessonId: string | null;
  progress: Record<string, UserProgress>;
}
