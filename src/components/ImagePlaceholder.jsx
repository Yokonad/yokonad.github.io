// ── Placeholder reutilizable para imágenes ──
// Si src es válido, muestra la imagen. Si no, muestra un placeholder ASCII art.

export default function ImagePlaceholder({
  src = null,
  alt = '',
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-32 sm:h-32',
    lg: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
    wide: 'w-full h-32 sm:h-40',
    full: 'w-full h-full',
  };

  const sizeClass = sizes[size] || sizes.md;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} object-cover border border-terminal-border ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} border border-terminal-border border-dashed flex items-center justify-center bg-white/[0.02] ${className}`}
      aria-label={alt || 'Image placeholder'}
    >
      <div className="text-center text-terminal-dim select-none">
        <span className="block text-lg leading-none">┌─┐</span>
        <span className="block text-lg leading-none">│▪│</span>
        <span className="block text-lg leading-none">└─┘</span>
        <span className="block text-[9px] uppercase tracking-widest mt-1 opacity-60">img</span>
      </div>
    </div>
  );
}
