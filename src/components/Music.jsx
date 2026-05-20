import Section from './Section';
import { useEffect, useState } from 'react';

const TRACKS = [
  { id: 'eJLwj6FohJo', title: 'Indiana', artist: 'Hombres G', thumb: 'https://i.ytimg.com/vi/eJLwj6FohJo/hqdefault.jpg' },
  { id: 'm8u5EQhc1jQ', title: 'Fue Amor', artist: 'Fabiana Cantilo', thumb: 'https://i.ytimg.com/vi/m8u5EQhc1jQ/hqdefault.jpg' },
  { id: 'URoY2H7VhBI', title: 'Parte del Aire', artist: 'Fito Páez', thumb: 'https://i.ytimg.com/vi/URoY2H7VhBI/hqdefault.jpg' },
  { id: 'ZweylZ8uiuw', title: '11 y 6', artist: 'Fito Páez', thumb: 'https://i.ytimg.com/vi/ZweylZ8uiuw/hqdefault.jpg' },
  { id: '6hzrDeceEKc', title: 'Wonderwall', artist: 'Oasis', thumb: 'https://i.ytimg.com/vi/6hzrDeceEKc/hqdefault.jpg' },
  { id: 'tI-5uv4wryI', title: 'Champagne Supernova', artist: 'Oasis', thumb: 'https://i.ytimg.com/vi/tI-5uv4wryI/hqdefault.jpg' },
  { id: 'Ab1nJg4RKw0', title: "Don't Go Away", artist: 'Oasis', thumb: 'https://i.ytimg.com/vi/Ab1nJg4RKw0/hqdefault.jpg' },
  { id: 'xg_Y7Or_hWM', title: 'Last Night on Earth', artist: 'Green Day', thumb: 'https://i.ytimg.com/vi/xg_Y7Or_hWM/hqdefault.jpg' },
  { id: 'cmpRLQZkTb8', title: "Don't Look Back In Anger", artist: 'Oasis', thumb: 'https://i.ytimg.com/vi/cmpRLQZkTb8/hqdefault.jpg' },
  { id: 'Qy7LcH7pWZo', title: 'Díganselo', artist: 'El Kuelgue', thumb: 'https://i.ytimg.com/vi/Qy7LcH7pWZo/hqdefault.jpg' },
  { id: 'MVeiKDh4ffk', title: 'Cada Vez Que Digo Adiós', artist: 'Los Enanitos Verdes', thumb: 'https://i.ytimg.com/vi/MVeiKDh4ffk/hqdefault.jpg' },
  { id: 'ZjZecW1BvZE', title: 'Mi Primer Día Sin Ti', artist: 'Los Enanitos Verdes', thumb: 'https://i.ytimg.com/vi/ZjZecW1BvZE/hqdefault.jpg' },
];

const PLAY_DURATION = 64;
const ROTATE_MS = 8000;
const FADE_MS = 280;

export default function Music() {
  const [playlist] = useState(() => {
    // Copiar la lista y mezclarla aleatoriamente para crear la "ruleta"
    const shuffled = [...TRACKS].sort(() => Math.random() - 0.5);
    return shuffled;
  });

  const [current, setCurrent] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let timeoutId;
    const timer = setInterval(() => {
      setIsFading(true);
      timeoutId = window.setTimeout(() => {
        setCurrent((value) => (value + 1) % playlist.length);
        setIsFading(false);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      clearInterval(timer);
      clearTimeout(timeoutId);
    };
  }, [playlist.length]);

  const track = playlist[current];

  const getVisibleTracks = () => {
    const limit = 10;
    const visible = [];
    // Renderizamos 11 elementos para tener el buffer visual de la animación
    for (let i = 0; i <= limit; i++) {
      const idx = (current + i) % playlist.length;
      visible.push({ t: playlist[idx], i: idx });
    }
    return visible;
  };

  return (
    <Section id="música" title="Música">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Now Playing */}
        <div className="border border-terminal-border p-4">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-terminal-dim text-xs uppercase tracking-widest">
              ▶ Now Playing
            </span>
          </div>

          {/* Thumbnail */}
          <div
            className="w-full aspect-video mb-3 overflow-hidden border border-terminal-border"
            style={{
              opacity: isFading ? 0.3 : 1,
              transitionProperty: 'opacity',
              transitionDuration: `${FADE_MS}ms`,
              transitionTimingFunction: 'ease-in-out',
            }}
          >
            <img
              src={track.thumb}
              alt={track.title}
              className="w-full h-full object-cover opacity-80 transition-opacity duration-300"
            />
          </div>

          {/* Track info */}
          <div
            className="space-y-1 text-xs text-terminal-dim"
            style={{
              opacity: isFading ? 0.3 : 1,
              transitionProperty: 'opacity',
              transitionDuration: `${FADE_MS}ms`,
              transitionTimingFunction: 'ease-in-out',
            }}
          >
            <p className="text-terminal-fg font-bold text-sm">{track.title}</p>
            <p>{track.artist}</p>
          </div>

          {/* Progress bar - deshabilitado */}
          <div className="mt-2.5 h-px bg-terminal-border relative">
            <div
              className="absolute left-0 top-0 h-full bg-terminal-fg transition-all duration-100"
              style={{ width: '0%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-terminal-dim mt-1">
            <span>0s</span>
            <span>{PLAY_DURATION}s</span>
          </div>
        </div>

        {/* Playlist */}
        <div className="border border-dashed border-terminal-border p-4 overflow-hidden">
          <p className="text-xs uppercase tracking-widest text-terminal-dim mb-2.5">Playlist</p>
          <ul className="text-xs">
            {getVisibleTracks().map(({ t, i }, index) => {
              const isFirst = index === 0;
              const isLast = index === 10;
              const isActive = i === current;

              return (
                <li
                  key={`${t.id}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateRows: (isFading && isFirst) || (!isFading && isLast) ? '0fr' : '1fr',
                    opacity: (isFading && isFirst) || (!isFading && isLast) ? 0 : 1,
                    transition: isFading
                      ? `grid-template-rows ${FADE_MS}ms ease-in-out, opacity ${FADE_MS}ms ease-in-out`
                      : 'none',
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`flex items-center gap-2 py-1 border-b border-terminal-border/50 transition-colors ${
                        isActive ? 'text-terminal-fg' : 'text-terminal-dim'
                      }`}
                    >
                      <span className="w-4 text-right opacity-50">
                        {isActive ? '▶' : String(index === 10 ? 10 : index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 truncate">
                        {t.artist} — {t.title}
                      </span>
                      <span className="opacity-40">{PLAY_DURATION}s</span>
                    </div>
                    {/* Espaciado en lugar de space-y-2 para que se anime suavemente */}
                    <div className="h-2" />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-[10px] text-terminal-dim mt-0.5 opacity-50">
            Reproducción de audio deshabilitada.
          </p>
        </div>
      </div>
    </Section>
  );
}
