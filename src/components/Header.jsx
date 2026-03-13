import { profile } from '../data/content';

export default function Header() {
  return (
    <header id="top" className="w-full border-b border-terminal-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7">
        {/* Título hero gigante */}
        <div className="mb-4">
          <p className="text-terminal-dim text-[10px] tracking-widest uppercase mb-2">
            {'>'} sistema iniciado
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] uppercase">
            YOKONAD<span className="text-terminal-accent">PAGE</span>
            <span className="animate-blink ml-1 text-terminal-dim text-3xl sm:text-4xl md:text-5xl">_</span>
          </h1>
          <p className="text-xs sm:text-sm text-terminal-dim mt-3 tracking-wide">
            {profile.role}
          </p>
        </div>

        {/* Nav */}
        <nav className="pt-3 border-t border-terminal-border flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs uppercase tracking-widest">
          {['perfil', 'proyectos', 'equipo', 'música'].map((s) => (
            <a
              key={s}
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
