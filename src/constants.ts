/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Primeros Pasos con Internet',
    description: 'Aprende qué es internet de forma sencilla, comparándolo con una ciudad conectada.',
    duration: '3:45',
    thumbnail: '/caratula1.png',
    videoUrl: '/video1.mp4',
    order: 1,
  },
  {
    id: '2',
    title: 'Navegar sin Miedo',
    description: 'Diferencia entre el navegador y el buscador para moverte con seguridad.',
    duration: '4:20',
    thumbnail: '/caratula2.png',
    videoUrl: '/video2.mp4',
    order: 2,
  },
];

export const BRANDING = {
  municipality: 'Ayuntamiento de Fuengirola',
  appName: 'Vecino Digital',
  colors: {
    primary: '#004b93', // Fuengirola corporate blue
    accent: '#fecb00',  // High contrast gold/yellow
    background: '#f0f4f8',
    text: '#1a1a1a',
  }
};
