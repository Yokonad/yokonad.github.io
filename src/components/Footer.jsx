import { footer } from '../data/content';

export default function Footer() {
  return (
    <footer className="w-full border-t border-terminal-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {/* Línea decorativa superior */}
        <div className="text-terminal-dim text-[10px] tracking-[0.4em] opacity-40 text-center">
          {'░▒▓█▓▒░'.repeat(3)}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-terminal-dim tracking-wide">
          <span>{footer.text}</span>
          <span className="hidden md:inline opacity-40">
            {'█'.repeat(8)}
          </span>
        </div>
      </div>
    </footer>
  );
}
