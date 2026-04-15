import { useEffect, useRef } from 'react';

export default function TriangleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let animationId = null;

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const points = [];
    const desktopPointDensity = 1 / 16000;
    const mobilePointDensity = 1 / 22000;
    const desktopMaxDistance = 185;
    const mobileMaxDistance = 145;
    const influenceRadius = 180;
    const attraction = 0.035;
    let currentPointDensity = desktopPointDensity;
    let currentMaxDistance = desktopMaxDistance;

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

    const rebuildPoints = () => {
      points.length = 0;
      const minPoints = width < 768 ? 36 : 55;
      const total = Math.max(minPoints, Math.floor(width * height * currentPointDensity));

      for (let i = 0; i < total; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          size: Math.random() * 0.9 + 1,
        });
      }
    };

    const distance = (ax, ay, bx, by) => {
      const dx = ax - bx;
      const dy = ay - by;
      return Math.hypot(dx, dy);
    };

    const updatePoints = () => {
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);

          if (d > 0.001 && d < influenceRadius) {
            const influence = (1 - d / influenceRadius) ** 2;
            p.vx += (dx / d) * influence * attraction;
            p.vy += (dy / d) * influence * attraction;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        p.vx *= 0.995;
        p.vy *= 0.995;
      }
    };

    const draw = () => {
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#030303');
      bg.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];

        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const d = distance(a.x, a.y, b.x, b.y);

          if (d < currentMaxDistance) {
            const alpha = (1 - d / currentMaxDistance) * 0.26;
            ctx.strokeStyle = `rgba(166, 213, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const d = pointer.active ? distance(p.x, p.y, pointer.x, pointer.y) : Infinity;
        const glow = d < influenceRadius ? (1 - d / influenceRadius) * 0.42 : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(208, 233, 255, ${(0.28 + glow).toFixed(3)})`;
        ctx.fill();
      }
    };

    const animate = () => {
      updatePoints();
      draw();
      animationId = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onResize = () => {
      setCanvasSize();
      const isMobile = width < 768;
      currentPointDensity = isMobile ? mobilePointDensity : desktopPointDensity;
      currentMaxDistance = isMobile ? mobileMaxDistance : desktopMaxDistance;
      rebuildPoints();
    };

    onResize();
    animate();

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      if (animationId) {
        window.cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
