import { useState, useEffect } from 'react';
import { profile } from '../data/content';

function GlitchTitle() {
  const [displayText, setDisplayText] = useState('YOKONADPAGE');
  const originalText = 'YOKONADPAGE';

  useEffect(() => {
    let timeout;
    let iterations = 0;
    const maxIterations = 15;

    const glitch = () => {
      if (iterations < maxIterations) {
        setDisplayText(
          originalText
            .split('')
            .map(() => (Math.random() > 0.5 ? '1' : '0'))
            .join('')
        );
        iterations++;
        timeout = setTimeout(glitch, 50);
      } else {
        setDisplayText(originalText);
        timeout = setTimeout(() => {
          iterations = 0;
          glitch();
        }, 5000 + Math.random() * 5000);
      }
    };

    glitch();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {displayText.slice(0, 4)}
      <span className="text-terminal-accent">{displayText.slice(4)}</span>
    </>
  );
}

export default function Header() {
  return (
    <header id="top" className="w-full border-b border-terminal-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7">
        {/* Título hero gigante */}
        <div className="mb-4">
          <p className="text-terminal-dim text-[10px] tracking-widest uppercase mb-2">
            {'>'}
          </p>
          <h1
            aria-label="Yokonad"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] uppercase relative inline-block"
          >
            <GlitchTitle />
            <span className="animate-blink ml-1 text-terminal-dim text-3xl sm:text-4xl md:text-5xl absolute -bottom-[2px]">_</span>
          </h1>
          <p className="text-xs sm:text-sm text-terminal-dim mt-3 tracking-wide">
            {profile.role}
          </p>
        </div>

        {/* Nav */}
        <nav className="pt-3 border-t border-terminal-border flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs uppercase tracking-widest">
          {['perfil', 'proyectos', 'equipo', 'música'].map((s, i) => (
            <a
              key={`nav-${s}-${i}`}
              href={`#${s === 'perfil' ? 'usuario' : s}`}
              className="hover:text-terminal-accent transition-colors duration-200"
            >
              [{s}]
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
