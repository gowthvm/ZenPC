'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ImmersiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple animated gradient background
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const hue1 = (Math.sin(time) * 60 + 220) % 360;
      const hue2 = (Math.cos(time) * 60 + 280) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 10%, 0.8)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 15%, 0.6)`);
      gradient.addColorStop(1, `hsla(${hue1 + 60}, 70%, 10%, 0.8)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-bg/50 via-bg/30 to-bg/50" />
    </motion.div>
  );
};

export default ImmersiveBackground;
