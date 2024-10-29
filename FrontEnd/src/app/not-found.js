'use client'
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const NotFound = () => {
  const [rotation, setRotation] = useState(0);
  const [hoverEmoji, setHoverEmoji] = useState('🤔');

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const changeEmoji = () => {
    const emojis = ['🧐', '😅', '🤯', '🙃', '😎', '🤠', '🥸'];
    setHoverEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-white text-center p-4 ${inter.className}`}
         style={{
           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7303c0 100%)',
         }}>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-5px, 5px) }
          40% { transform: translate(-5px, -5px) }
          60% { transform: translate(5px, 5px) }
          80% { transform: translate(5px, -5px) }
          100% { transform: translate(0) }
        }
      `}</style>
      <div className="relative mb-8">
        <h1 className="text-9xl font-extrabold tracking-widest">
          <span className="inline-block animate-[glitch_0.3s_infinite]">4</span>
          <span className="inline-block animate-[glitch_0.3s_infinite] animation-delay-100">0</span>
          <span className="inline-block animate-[glitch_0.3s_infinite] animation-delay-200">4</span>
        </h1>
        <span className="absolute top-0 right-0 text-6xl animate-bounce">💥</span>
      </div>
      <p className="text-3xl mb-8 font-bold">Oops! You&apos;ve entered the cosmic void. Or did the void enter you? 🌌</p>
      <div className="text-6xl mb-8 animate-[float_3s_ease-in-out_infinite] cursor-pointer" 
           onMouseEnter={changeEmoji} 
           onTouchStart={changeEmoji}>
        <span style={{ display: 'inline-block', transform: `rotate(${rotation}deg)` }}>
          {hoverEmoji}
        </span>
      </div>
      <p className="text-xl mb-4 max-w-2xl">
        Congratulations, space explorer! You&apos;ve stumbled upon our elusive 404 nebula. 
        It&apos;s like discovering a new galaxy, but less exciting and more... non-existent.
      </p>
      <p className="text-xl mb-8 max-w-2xl">
        While you&apos;re floating in this digital abyss, why not contemplate the vastness of the internet? 
        Or just hover over that spinning emoji. It&apos;s got more personality than the black hole that ate your desired page!
      </p>
      <a href="/"
         className="px-8 py-4 bg-white text-gray-800 rounded-full font-bold text-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
        Engage Warp Drive! 🚀
      </a>
    </div>
  );
};

export default NotFound;