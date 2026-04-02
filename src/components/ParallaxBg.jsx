import { useEffect, useRef } from 'react';
import './ParallaxBg.css';

/** Generate deterministic star positions */
function makeStars(count, seed = 1) {
  const stars = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 16807 + 0) % 2147483647;
    const x = (s % 10000) / 100;
    s = (s * 16807 + 0) % 2147483647;
    const y = (s % 10000) / 100;
    s = (s * 16807 + 0) % 2147483647;
    const size = 1 + (s % 3);
    s = (s * 16807 + 0) % 2147483647;
    const opacity = 0.3 + (s % 70) / 100;
    stars.push({ x, y, size, opacity });
  }
  return stars;
}

const STARS_BACK = makeStars(80, 1);
const STARS_MID = makeStars(50, 42);
const STARS_FRONT = makeStars(25, 99);

export default function ParallaxBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    let raf;
    let time = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function drawStars(stars, speed, baseSize) {
      for (const star of stars) {
        const y = ((star.y + time * speed) % 120) - 10;
        const x = star.x;
        const flicker = 0.7 + 0.3 * Math.sin(time * 0.02 + star.x * 0.5);
        c.globalAlpha = star.opacity * flicker;
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(
          (x / 100) * canvas.width,
          (y / 100) * canvas.height,
          star.size * baseSize,
          0,
          Math.PI * 2
        );
        c.fill();
      }
    }

    function drawNebula(cx, cy, rx, ry, color, phase) {
      const px = cx + Math.sin(time * 0.003 + phase) * 30;
      const py = cy + Math.cos(time * 0.004 + phase) * 20;
      const grad = c.createRadialGradient(px, py, 0, px, py, Math.max(rx, ry));
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'transparent');
      c.globalAlpha = 0.12 + 0.04 * Math.sin(time * 0.005 + phase);
      c.fillStyle = grad;
      c.beginPath();
      c.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      c.fill();
    }

    function tick() {
      time += 0.5;
      c.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula clouds
      const w = canvas.width;
      const h = canvas.height;
      drawNebula(w * 0.2, h * 0.25, w * 0.18, h * 0.15, '#7c3aed', 0);
      drawNebula(w * 0.75, h * 0.6, w * 0.22, h * 0.12, '#2563eb', 2);
      drawNebula(w * 0.5, h * 0.8, w * 0.15, h * 0.2, '#059669', 4);

      // Star layers — back moves slowest, front fastest
      drawStars(STARS_BACK, 0.3, 0.6);
      drawStars(STARS_MID, 0.6, 0.8);
      drawStars(STARS_FRONT, 1.0, 1.0);

      // Occasional shooting star
      c.globalAlpha = 1;
      const shootChance = Math.sin(time * 0.01) * 0.5 + 0.5;
      if (shootChance > 0.995) {
        const sx = Math.random() * w;
        const sy = Math.random() * h * 0.5;
        const grad2 = c.createLinearGradient(sx, sy, sx + 80, sy + 80);
        grad2.addColorStop(0, 'rgba(255,255,255,0.8)');
        grad2.addColorStop(1, 'rgba(255,255,255,0)');
        c.strokeStyle = grad2;
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(sx, sy);
        c.lineTo(sx + 80, sy + 80);
        c.stroke();
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="parallax-bg" />;
}
