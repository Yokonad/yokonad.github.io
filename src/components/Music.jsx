import Section from './Section';
import { useState } from 'react';

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
];

const PLAY_DURATION = 64;

export default function Music() {
  const [current, setCurrent] = useState(0);

  const track = TRACKS[current];

  const selectTrack = (i) => {
    setCurrent(i);
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
          <div className="w-full aspect-video mb-3 overflow-hidden border border-terminal-border">
            <img
              src={track.thumb}
              alt={track.title}
              className="w-full h-full object-cover opacity-80"
            />
          </div>

          {/* Track info */}
          <div className="space-y-1 text-xs text-terminal-dim">
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
        <div className="border border-dashed border-terminal-border p-4">
          <p className="text-xs uppercase tracking-widest text-terminal-dim mb-2.5">Playlist</p>
          <ul className="space-y-2 text-xs">
            {TRACKS.map((t, i) => (
              <li
                key={t.id}
                onClick={() => selectTrack(i)}
                className={`flex items-center gap-2 py-1 border-b border-terminal-border/50 cursor-pointer hover:text-terminal-accent transition-colors ${
                  i === current ? 'text-terminal-fg' : 'text-terminal-dim'
                }`}
              >
                <span className="w-4 text-right opacity-50">
                  {i === current ? '▶' : String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 truncate">
                  {t.artist} — {t.title}
                </span>
                <span className="opacity-40">{PLAY_DURATION}s</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-terminal-dim mt-2.5 opacity-50">
            Reproducción de audio deshabilitada.
          </p>
        </div>
      </div>
    </Section>
  );
}
