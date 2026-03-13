// ── Carrusel rectangular sin flechas, auto-avance suave ──

import { useState, useEffect, useCallback } from 'react';

const defaultSlides = [
  { id: 1, label: 'Slide 01' },
  { id: 2, label: 'Slide 02' },
  { id: 3, label: 'Slide 03' },
];

export default function Carousel({ slides = defaultSlides, interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  const slide = slides[current];

  return (
    <div className="w-full">
      {/* Contenedor rectangular 16:9 */}
      <div className="relative w-full aspect-video border border-terminal-border bg-white/[0.02] overflow-hidden">
        {/* Slide content */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {slide.src ? (
            <img
              src={slide.src}
              alt={slide.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center select-none">
              <div className="text-terminal-dim mb-2">
                <span className="block text-xl sm:text-2xl leading-none">┌────────────────┐</span>
                <span className="block text-xl sm:text-2xl leading-none">│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</span>
                <span className="block text-xl sm:text-2xl leading-none">│&nbsp;&nbsp;&nbsp;&nbsp;{'  ▪ ▪  '}&nbsp;&nbsp;&nbsp;&nbsp;│</span>
                <span className="block text-xl sm:text-2xl leading-none">│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</span>
                <span className="block text-xl sm:text-2xl leading-none">└────────────────┘</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-terminal-dim opacity-50">
                {slide.label}
              </span>
            </div>
          )}
        </div>

        {/* Scanline deco overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.01)_3px,rgba(255,255,255,0.01)_6px)]" />
      </div>
    </div>
  );
}
