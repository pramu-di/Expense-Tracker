import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  // Mobile & Particle Optimization
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particleCount = isMobile ? 8 : 20;

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-fuchsia-500 selection:text-white">

      {/* 1. REFINED BACKGROUND & GLOWS */}
      <div className="absolute inset-0 z-0">
        {/* Main Deep Twilight Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-100" />

        {/* Ambient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 2. PARTICLE WAVE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              y: [Math.random() * -100, Math.random() * 100],
              x: [Math.random() * -50, Math.random() * 50]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute rounded-full bg-indigo-300 shadow-[0_0_10px_rgba(165,180,252,0.4)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center z-10">

        {/* --- LEFT: TEXT CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left space-y-8"
        >
          {/* Badge */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-indigo-400/30 backdrop-blur-md shadow-lg shadow-indigo-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em]">
              SmartSpend v2.0 Live
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 drop-shadow-lg">
              Wealth
            </span>
          </h1>

          <p className="text-indigo-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
            Experience the future of personal finance. Elegant tracking, powerful insights, and total control—all in one beautiful dashboard.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 group uppercase tracking-wider transition-all"
            >
              Get Started <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all uppercase tracking-wider"
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>


        {/* --- RIGHT: 3D GLASS CARD --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center perspective-1000"
        >
          <motion.div
            animate={{ y: [-15, 15, -15], rotateX: [2, -2, 2], rotateY: [-2, 2, -2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-b from-[#1a1638]/60 to-[#1a1638]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl shadow-indigo-900/50 p-8 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl shadow-lg text-white">⚡</div>
              <div className="w-20 h-2 rounded-full bg-white/10" />
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end gap-3 mb-8 px-2">
              {[30, 50, 45, 70, 60, 90, 85].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1, type: 'spring' }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-indigo-600 to-fuchsia-500 opacity-90 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="text-[10px] text-slate-300 font-bold uppercase mb-1 tracking-wider">Income</div>
                <div className="text-emerald-400 font-bold text-lg drop-shadow-md">+$12.4k</div>
              </div>
              <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="text-[10px] text-slate-300 font-bold uppercase mb-1 tracking-wider">Savings</div>
                <div className="text-indigo-300 font-bold text-lg drop-shadow-md">+24%</div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [10, -10, 10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-[-20px] bg-white text-slate-900 px-6 py-4 rounded-xl shadow-xl font-bold flex items-center gap-3 transform rotate-12"
            >
              <span className="text-2xl">🚀</span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Savings</div>
                <div className="text-xl font-black">+24%</div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-slate-500 font-light tracking-[0.4em] text-[9px] uppercase">Designed by Pramudi Lakshika</p>
      </div>
    </div>
  );
};

export default Welcome;