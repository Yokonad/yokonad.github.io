import Section from './Section';
import ImagePlaceholder from './ImagePlaceholder';
import { profile, stats } from '../data/content';

import { useState, useEffect, useRef } from 'react';

const skillColors = {
  'Windows 11': { border: '#0078D4', bg: 'rgba(0,120,212,0.12)',   text: '#0078D4' },
  'Arch Linux': { border: '#1793D1', bg: 'rgba(23,147,209,0.12)',  text: '#1793D1' },
  Fedora:       { border: '#51A2DA', bg: 'rgba(81,162,218,0.12)',  text: '#51A2DA' },
  Debian:       { border: '#A80030', bg: 'rgba(168,0,48,0.12)',    text: '#D4375A' },
  Ubuntu:       { border: '#E95420', bg: 'rgba(233,84,32,0.12)',   text: '#E95420' },
};

const langColors = {
  JavaScript:  { border: '#F7DF1E', bg: 'rgba(247,223,30,0.12)', text: '#F7DF1E' },
  React:       { border: '#61DAFB', bg: 'rgba(97,218,251,0.12)',  text: '#61DAFB' },
  'Node.js':   { border: '#68D391', bg: 'rgba(104,211,145,0.12)', text: '#68D391' },
  Python:      { border: '#C084FC', bg: 'rgba(192,132,252,0.12)', text: '#C084FC' },
  CSS:         { border: '#F97316', bg: 'rgba(249,115,22,0.12)',  text: '#F97316' },
  Git:         { border: '#F87171', bg: 'rgba(248,113,113,0.12)', text: '#F87171' },
};

const MUSIC_KEY = 'yokonad_music_hours';
const MUSIC_START = 600;

function StatCard({ value, label }) {
  const isCounter = label.toLowerCase().includes('música');
  const [count, setCount] = useState(() => {
    if (!isCounter) return 0;
    const saved = localStorage.getItem(MUSIC_KEY);
    return saved ? parseFloat(saved) : MUSIC_START;
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isCounter) return;
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        const next = +(c + 0.01).toFixed(2);
        localStorage.setItem(MUSIC_KEY, next);
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isCounter]);

  return (
    <div className="border border-terminal-border p-3 text-center hover:bg-white/[0.03] transition-colors duration-200">
      <span className="block text-lg sm:text-xl font-bold tracking-tight tabular-nums">
        {isCounter ? count.toLocaleString('en-US', { minimumFractionDigits: 2 }) : value}
      </span>
      <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-terminal-dim mt-1">
        {label}
      </span>
    </div>
  );
}

export default function UserProfile() {
  return (
    <Section id="usuario" title="Perfil">
      {/* ── Card principal ── */}
      <div className="geo-card">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Imagen de perfil a tamaño completo — ocupa 2 cols */}
          <div className="md:col-span-2">
            <ImagePlaceholder
              src={profile.avatar}
              alt={profile.name}
              size="full"
              className="w-full h-full min-h-[280px] sm:min-h-[320px] md:min-h-0"
            />
          </div>

          {/* Contenido de la card — ocupa 3 cols */}
          <div className="md:col-span-3 p-3 sm:p-4 flex flex-col justify-between">
            {/* Nombre y rol */}
            <div className="mb-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {profile.name}
              </h3>
              <p className="text-xs text-terminal-dim tracking-wide mt-1">
                {profile.role}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-terminal-dim">
                {profile.location && <span>◈ {profile.location}</span>}
                {profile.experience && <span>◈ {profile.experience}</span>}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-2 space-y-0.5">
              {profile.bio.map((line, i) => (
                <p key={i} className="text-xs sm:text-sm text-terminal-fg">
                  {line}
                </p>
              ))}
            </div>

            {/* Sistemas Operativos */}
            <div className="mb-2">
              <h4 className="text-[10px] uppercase tracking-widest text-terminal-dim mb-1">
                Sistemas Operativos
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => {
                  const c = skillColors[skill];
                  return (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-[10px] tracking-wide transition-colors duration-200"
                      style={c ? {
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: c.border,
                        backgroundColor: c.bg,
                        color: c.text,
                      } : undefined}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
              <span className="block mt-1 text-[10px] italic text-terminal-dim opacity-60">
                & many more being tested
              </span>
            </div>

            {/* Lenguajes de Programación */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-terminal-dim mb-1">
                Lenguajes / Herramientas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.languages.map((lang) => {
                  const c = langColors[lang];
                  return (
                    <span
                      key={lang}
                      className="px-2 py-0.5 text-[10px] tracking-wide transition-colors duration-200"
                      style={c ? {
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: c.border,
                        backgroundColor: c.bg,
                        color: c.text,
                      } : undefined}
                    >
                      {lang}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats debajo de la card ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </Section>
  );
}
