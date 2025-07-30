import { useEffect, useRef } from "react";


const STAR_COUNT = 220; // More stars for denser field
const STAR_COLOR = "rgba(255,255,255,0.85)";
const STAR_SIZE = 1.3;
const STAR_MIN_SCALE = 0.15;
const OVERFLOW_THRESHOLD = 50;

// Nebula/planet overlays (more vibrant for dark mode)
const NEBULAS = [
  // Purple nebula
  {
    x: 0.7, y: 0.25, r: 260, color: 'rgba(160,100,255,0.18)', blur: 100
  },
  // Blue nebula
  {
    x: 0.18, y: 0.7, r: 200, color: 'rgba(0,220,255,0.13)', blur: 80
  },
  // Pink nebula
  {
    x: 0.5, y: 0.5, r: 150, color: 'rgba(255,80,200,0.13)', blur: 70
  },
  // (Removed glowing planet in bottom right)
  // Glowing ring (center left)
  {
    x: 0.22, y: 0.45, r: 80, color: 'rgba(255,255,180,0.10)', blur: 40
  },
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createStar(canvasWidth: number, canvasHeight: number) {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
  };
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const stars = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create stars
    stars.current = Array.from({ length: STAR_COUNT }, () => createStar(width, height));


    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Draw nebula/planet overlays (more vibrant for dark mode)
      for (const nebula of NEBULAS) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(width * nebula.x, height * nebula.y, nebula.r, 0, 2 * Math.PI);
        ctx.fillStyle = nebula.color;
        ctx.filter = `blur(${nebula.blur}px)`;
        ctx.fill();
        ctx.filter = 'none';
        ctx.restore();
      }
      // (Removed glowing planet highlight in bottom right)
      // Add a subtle ring (center left)
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(width * 0.22, height * 0.45, 100, 0, 2 * Math.PI);
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255,255,180,0.13)';
      ctx.shadowColor = 'rgba(255,255,180,0.18)';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();
      // Draw stars with twinkle
      for (const star of stars.current) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, STAR_SIZE * star.z, 0, 2 * Math.PI);
        // Twinkle effect
        const twinkle = 0.7 + 0.3 * Math.sin(Date.now() / 400 + star.x + star.y);
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = STAR_COLOR;
        ctx.shadowColor = '#a7c7ff';
        ctx.shadowBlur = 8 * star.z;
        ctx.fill();
        ctx.restore();
      }
    }

    function update() {
      for (const star of stars.current) {
        star.x += 0.05 * star.z;
        star.y += 0.02 * star.z;
        if (star.x > width + OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
          // Reset star to random position
          Object.assign(star, createStar(width, height));
        }
      }
    }

    function animate() {
      update();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars.current = Array.from({ length: STAR_COUNT }, () => createStar(width, height));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at 60% 40%, #181c2b 70%, #0a0c18 100%)"
      }}
      aria-hidden="true"
    />
  );
} 