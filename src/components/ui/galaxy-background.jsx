import { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Detect theme
    const getTheme = () =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    // Stars array
    const stars = [];
    const starCount = window.innerWidth < 768 ? 100 : 200; // Fewer stars on mobile

    // Create stars (with twinkle phase)
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.2,
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.012
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const theme = getTheme();

      // Draw stars with twinkle
      stars.forEach(star => {
        const twinkle = 0.6 + 0.4 * Math.sin(performance.now() * star.twinkleSpeed + star.twinklePhase);
        ctx.save();
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark'
          ? 'rgba(255,255,255,0.92)'
          : 'rgba(255,255,255,0.92)'; // white stars in light mode
        ctx.shadowColor = theme === 'dark' ? '#fff6' : '#e0eaff'; // cool white shadow in light mode
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Update star position
        star.x += star.vx / 100;
        star.y += star.vy / 100;

        // Reset stars that go off screen
        if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      // Draw galaxy core with color based on theme
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.6
      );
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(138,43,226,0.14)'); // Purple
        gradient.addColorStop(0.5, 'rgba(75,0,130,0.09)'); // Indigo
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
      } else {
        gradient.addColorStop(0, 'rgba(255,255,255,0.18)'); // White core
        gradient.addColorStop(0.3, 'rgba(200,225,255,0.11)'); // Soft blue
        gradient.addColorStop(0.6, 'rgba(180,200,255,0.08)'); // Blue haze
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 opacity-100 transition-opacity duration-500 pointer-events-none"
    />
  );
};

export default GalaxyBackground;
