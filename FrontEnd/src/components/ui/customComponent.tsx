"use client";
import React, { useCallback, useRef, useEffect } from 'react';

interface CustomComponentProps {
  buttonText: string;
  onComplete?: () => void;
  onProcess: () => Promise<void>;
  isProcessing: boolean;
  progress:number;
}

const ANIMATION_SPEED = 1/10; // As specified by the user
const FRAME_SKIP = 10; // As specified by the user

const CustomComponent: React.FC<CustomComponentProps> = ({
  buttonText,
  onComplete,
  onProcess,
  isProcessing,
  progress
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{x: number, y: number, r: number, color: string}>>([]);
  const animationFrameRef = useRef<number>();
  const frameCountRef = useRef(0);
  
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(buttonText, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const particles: typeof particlesRef.current = [];

    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const i = (y * canvas.width + x) * 4;
        if (pixels[i + 3] > 128) {
          particles.push({
            x,
            y,
            r: 1,
            color: `rgba(${pixels[i]}, ${pixels[i + 1]}, ${pixels[i + 2]}, ${pixels[i + 3]})`
          });
        }
      }
    }

    particlesRef.current = particles;
  }, [buttonText]);

  const animate = useCallback(() => {
    if (!isProcessing) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    frameCountRef.current++;
    if (frameCountRef.current % FRAME_SKIP !== 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x -= ANIMATION_SPEED;
      particle.y += Math.random() > 0.5 ? 0.5 : -0.5;
      particle.r -= 0.02;

      if (particle.r <= 0 || particle.x < 0) return false;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      return true;
    });

    if (particlesRef.current.length > 0 && isProcessing) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      onComplete && onComplete();
    }
  }, [isProcessing, onComplete]);

  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  useEffect(() => {
    if (isProcessing) {
      frameCountRef.current = 0;
      initializeParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clear the canvas when processing stops
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isProcessing, animate, initializeParticles]);

  const handleClick = useCallback(async () => {
    if (!isProcessing) {
      await onProcess();
    }
  }, [isProcessing, onProcess]);

  return (
    <button
      disabled={isProcessing}
      onClick={handleClick}
      className={`relative overflow-hidden text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
        isProcessing ? 'cursor-not-allowed' : ''
      }`}
    >
      <span className={`transition-opacity duration-500 ${isProcessing ? 'opacity-0' : 'opacity-100'}`}>
        {buttonText}
      </span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      ></canvas>
    </button>
  );
};

export default CustomComponent;