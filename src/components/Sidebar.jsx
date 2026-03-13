// ── Sidebar fijo minimalista ──
import { profile } from '../data/content';

const navItems = [
  { label: 'Perfil', href: '#usuario' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Música', href: '#música' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Sidebar() {
  return (
    <aside className="hidden xl:flex fixed left-0 top-0 h-full w-48 border-r border-terminal-border bg-terminal-bg z-20 flex-col justify-between py-6 px-4">
      {/* Logo / Marca */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-terminal-dim mb-1">
          Portfolio
        </div>
        <div className="text-xs font-bold tracking-wide mb-6">
          YOKONAD
        </div>

        <hr className="retro-hr mb-5" />

        {/* Navegación */}
        <nav className="space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-[10px] uppercase tracking-widest text-terminal-dim hover:text-terminal-accent transition-colors duration-200 border-0"
            >
              <span className="text-terminal-border mr-1">─</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Bloque inferior: estado + links */}
      <div className="space-y-4">
        {/* Status */}
        <div className="text-[9px] text-terminal-dim">
          <p className="uppercase tracking-widest mb-1">Estado</p>
          <div className="flex gap-px">
            {'████████░░'.split('').map((c, i) => (
              <span key={i} className={c === '░' ? 'opacity-20' : 'opacity-60'}>{c}</span>
            ))}
          </div>
          <p className="opacity-50 mt-1">Disponible</p>
        </div>

        <hr className="retro-hr" />

        {/* Links rápidos */}
        <div className="space-y-1.5">
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[9px] text-terminal-dim hover:text-terminal-accent tracking-widest uppercase transition-colors"
            >
              → {link.label}
            </a>
          ))}
        </div>

        {/* Línea decorativa */}
        <div className="text-[8px] text-terminal-dim opacity-20 tracking-[0.3em]">
          {'░▒▓█▓▒░'}
        </div>
      </div>
    </aside>
  );
}
