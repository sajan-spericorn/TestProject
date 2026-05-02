'use client';
// Client component: needs canvas API and requestAnimationFrame

import { useEffect, useRef } from 'react';

const STAR_COUNT = 200;
const SHOOTING_STAR_INTERVAL_MS = 3500;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createStar(canvasWidth, canvasHeight) {
  const r = Math.random();
  const color =
    r > 0.85 ? 'rgba(180,210,255,' : r > 0.7 ? 'rgba(255,240,200,' : 'rgba(255,255,255,';
  return {
    x: rand(0, canvasWidth),
    y: rand(0, canvasHeight),
    radius: rand(0.3, 1.9),
    opacity: rand(0.3, 1),
    speed: rand(0.003, 0.014),
    dir: Math.random() > 0.5 ? 1 : -1,
    color,
  };
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rafId;
    let lastShot = 0;
    let shot = null;
    const stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function populate() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar(canvas.width, canvas.height));
      }
    }

    function spawnShot(now) {
      lastShot = now;
      const startX = rand(canvas.width * 0.05, canvas.width * 0.8);
      const startY = rand(0, canvas.height * 0.35);
      const angle = rand(25, 55) * (Math.PI / 180);
      const speed = rand(9, 18);
      shot = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: rand(90, 180),
        opacity: 1,
      };
    }

    function drawBg() {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, '#030812');
      g.addColorStop(0.45, '#070f22');
      g.addColorStop(1, '#0b1530');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawStars() {
      for (const s of stars) {
        s.opacity += s.speed * s.dir;
        if (s.opacity >= 1) { s.opacity = 1; s.dir = -1; }
        if (s.opacity <= 0.08) { s.opacity = 0.08; s.dir = 1; }

        if (s.radius > 1.2) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4);
          glow.addColorStop(0, `${s.color}${s.opacity})`);
          glow.addColorStop(1, `${s.color}0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${s.opacity})`;
        ctx.fill();
      }
    }

    function drawShot(now) {
      if (shot) {
        shot.x += shot.vx;
        shot.y += shot.vy;
        shot.opacity -= 0.018;

        if (shot.opacity <= 0 || shot.x > canvas.width + 50 || shot.y > canvas.height + 50) {
          shot = null;
        } else {
          const mag = Math.hypot(shot.vx, shot.vy);
          const tailX = shot.x - (shot.vx / mag) * shot.length;
          const tailY = shot.y - (shot.vy / mag) * shot.length;

          const grad = ctx.createLinearGradient(tailX, tailY, shot.x, shot.y);
          grad.addColorStop(0, 'rgba(255,255,255,0)');
          grad.addColorStop(0.6, `rgba(200,220,255,${shot.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(255,255,255,${shot.opacity})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shot.x, shot.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const head = ctx.createRadialGradient(shot.x, shot.y, 0, shot.x, shot.y, 5);
          head.addColorStop(0, `rgba(255,255,255,${shot.opacity})`);
          head.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.arc(shot.x, shot.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = head;
          ctx.fill();
        }
      }

      if (!shot && now - lastShot > SHOOTING_STAR_INTERVAL_MS) spawnShot(now);
    }

    function frame(now) {
      drawBg();
      drawStars();
      drawShot(now);
      rafId = requestAnimationFrame(frame);
    }

    function onResize() {
      resize();
      populate();
    }

    resize();
    populate();
    rafId = requestAnimationFrame(frame);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
