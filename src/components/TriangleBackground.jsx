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
    const spacing = 78;
    const jitter = 24;
    const influenceRadius = 220;
    const pullStrength = 32;

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
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const offsetX = row % 2 === 0 ? 0 : spacing * 0.5;
          const baseX = col * spacing + offsetX + (Math.random() - 0.5) * jitter;
          const baseY = row * spacing + (Math.random() - 0.5) * jitter;

          points.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
          });
        }
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

        let targetX = p.baseX;
        let targetY = p.baseY;

        if (pointer.active) {
          const dx = pointer.x - p.baseX;
          const dy = pointer.y - p.baseY;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceRadius && dist > 0.001) {
            const influence = ((influenceRadius - dist) / influenceRadius) ** 2;
            const pull = influence * pullStrength;
            targetX += (dx / dist) * pull;
            targetY += (dy / dist) * pull;
          }
        }

        p.vx += (targetX - p.x) * 0.09;
        p.vy += (targetY - p.y) * 0.09;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const linkDistance = spacing * 1.35;

      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const d = distance(a.x, a.y, b.x, b.y);
          if (d < linkDistance) {
            const centerX = (a.x + b.x) * 0.5;
            const centerY = (a.y + b.y) * 0.5;
            const pointerDist = pointer.active
              ? distance(centerX, centerY, pointer.x, pointer.y)
              : Infinity;
            const proximity = pointerDist < influenceRadius
              ? (1 - pointerDist / influenceRadius)
              : 0;
            const alpha = 0.2 * (1 - d / linkDistance) + proximity * 0.16;
            ctx.strokeStyle = `rgba(168, 168, 168, ${Math.min(alpha, 0.4).toFixed(3)})`;
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
        const proximity = d < influenceRadius ? (1 - d / influenceRadius) : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 196, 196, ${(0.16 + proximity * 0.24).toFixed(3)})`;
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
