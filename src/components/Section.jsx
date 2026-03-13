// ── Componente reutilizable: contenedor de sección ──
export default function Section({ id, title, children }) {
  return (
    <section
      id={id}
      className="w-full py-5 md:py-7 animate-fadeIn"
    >
      {title && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <span className="hidden sm:block h-px flex-1 max-w-[24px] bg-terminal-border" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-[0.2em]">
              <span className="text-terminal-dim mr-2">{'//'}​</span>
              {title}
            </h2>
            <span className="h-px flex-1 bg-terminal-border" />
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
