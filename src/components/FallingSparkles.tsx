import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

export interface SparkleEmitterRef {
  burst: (x: number, y: number, count?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  isHeart: boolean;
}

export const FallingSparkles = forwardRef<SparkleEmitterRef, { density?: number }>(({ density = 0.5 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Colors suitable for high contrast, romantic palette
  const COLORS = [
    '#f43f5e', // rose-500
    '#ff85a0', // romantic pink
    '#be123c', // rose-700
    '#ffb8c7', // gold-pink
    '#fbbf24', // golden sparkle
    '#ffdbe3'  // sweet pastel pink
  ];

  const spawnParticle = useCallback((x: number, y: number, isBurst = false) => {
    const isHeart = Math.random() > 0.4;
    const angle = Math.random() * Math.PI * 2;
    const speed = isBurst ? (Math.random() * 4 + 2) : (Math.random() * 1.2 + 0.3);
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isBurst ? 1 : 0.8), // general float upward
      size: Math.random() * 8 + (isHeart ? 6 : 4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      decay: isBurst ? (Math.random() * 0.02 + 0.015) : (Math.random() * 0.015 + 0.01),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      isHeart
    };
  }, []);

  useImperativeHandle(ref, () => ({
    burst(x: number, y: number, count = 25) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(spawnParticle(x, y, true));
      }
    }
  }), [spawnParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Occasional passive floating background particles
    const interval = setInterval(() => {
      if (document.hidden) return;
      if (particlesRef.current.length < 40) {
        // Spawn randomly near the bottom or top
        particlesRef.current.push(
          spawnParticle(
            Math.random() * window.innerWidth,
            window.innerHeight + 10,
            false
          )
        );
      }
    }, 400);

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + size * 0.7, x, y + size);
      c.quadraticCurveTo(x - size, y + size * 0.7, x - size, y + size / 3);
      c.quadraticCurveTo(x - size, y, x - size / 2, y);
      c.quadraticCurveTo(x, y, x, y + size / 4);
      c.closePath();
      c.fill();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y - size);
      c.quadraticCurveTo(x, y, x + size, y);
      c.quadraticCurveTo(x, y, x, y + size);
      c.quadraticCurveTo(x, y, x - size, y);
      c.quadraticCurveTo(x, y, x, y - size);
      c.closePath();
      c.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.x < -10 || p.x > canvas.width + 10 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isHeart) {
          drawHeart(ctx, 0, -p.size / 2, p.size);
        } else {
          drawSparkle(ctx, 0, 0, p.size);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    // Create interactive sparkles on mouse move
    const handlePointerMove = (e: PointerEvent) => {
      if (Math.random() < density) {
        particlesRef.current.push(spawnParticle(e.clientX, e.clientY, false));
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [density, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="sparkle-canvas pointer-events-none fixed inset-0 z-50 overflow-hidden"
    />
  );
});

FallingSparkles.displayName = 'FallingSparkles';
