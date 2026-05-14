import { useEffect, useRef } from 'react';

export default function PixelBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    const pixels = [];
    const glyphs = '01';
    const desktopDensity = 1 / 8000;
    const mobileDensity = 1 / 12000;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rebuildPixels = () => {
      pixels.length = 0;
      const density = width < 768 ? mobileDensity : desktopDensity;
      const total = Math.max(30, Math.floor(width * height * density));

      for (let i = 0; i < total; i++) {
        pixels.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.floor(Math.random() * 8) + 10,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.08 + 0.02,
          pulseSpeed: (Math.random() - 0.5) * 0.002,
          rotation: (Math.random() - 0.5) * 0.5,
          char: glyphs[Math.floor(Math.random() * glyphs.length)],
        });
      }
    };

    const updateAndDraw = () => {
      // Fondo sutil
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#030303');
      bg.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      pixels.forEach((p) => {
        // Mover
        p.x += p.vx;
        p.y += p.vy;

        // Rebotar en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulso de opacidad
        p.alpha += p.pulseSpeed;
        if (p.alpha <= 0.02 || p.alpha >= 0.1) {
          p.pulseSpeed *= -1;
        }

        // Dibujar el carácter
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha.toFixed(3)})`;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px "Courier New", monospace`;
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animationId = requestAnimationFrame(updateAndDraw);
    };

    const handleResize = () => {
      setCanvasSize();
      rebuildPixels();
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecución inicial
    updateAndDraw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#0a0a0a' }}
    />
  );
}
