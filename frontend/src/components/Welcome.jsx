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

  const particleCount = isMobile ? 8 : 25;

  return (
    <div className="min-h-screen bg-[#0d0221] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-[#00f2ff] selection:text-[#0d0221]">

      {/* 1. CYBER BACKGROUND & GLOWS */}
      <div className="absolute inset-0 z-0">
        {/* Main Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a0b2e] via-[#130725] to-[#0d0221] opacity-100" />

        {/* Neon Ambient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00f2ff]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 2. PARTICLE WAVE / FLOATING LIGHTS */}
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
            className="absolute rounded-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"
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
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-[#00f2ff]/20 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,255,0.1)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2ff]"></span>
            </span>
            <span className="text-[#00f2ff] text-xs font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(0,242,255,0.5)]">
              SmartSpend v2.0
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white drop-shadow-xl">
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-white to-[#00f2ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              Wealth
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
            Experience the future of personal finance. Elegant tracking, powerful insights, and total control—wrapped in a beautiful cyber-interface.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px -5px rgba(0, 242, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#00f2ff] text-[#0d0221] font-black rounded-sm shadow-[0_0_20px_rgba(0,242,255,0.2)] flex items-center justify-center gap-2 group uppercase tracking-wider relative overflow-hidden"
            >
              <span className="relative z-10 group-hover:translate-x-1 transition-transform">Get Started</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-transparent text-white font-bold rounded-sm border border-[#00f2ff]/30 hover:bg-[#00f2ff]/10 hover:border-[#00f2ff]/60 transition-all uppercase tracking-wider"
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
            className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-b from-white/5 to-transparent backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/20 border border-[#00f2ff]/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,242,255,0.2)]">⚡</div>
              <div className="w-20 h-1 rounded-full bg-white/10" />
            </div>

            {/* Neon Bars */}
            <div className="flex-1 flex items-end gap-3 mb-8 px-2">
              {[30, 50, 45, 70, 60, 90, 85].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1, type: 'spring' }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-[#00f2ff]/80 to-[#00f2ff]/10 shadow-[0_0_10px_rgba(0,242,255,0.3)]"
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Income</div>
                <div className="text-[#00f2ff] font-bold text-lg drop-shadow-[0_0_5px_rgba(0,242,255,0.5)]">+$12.4k</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Growth</div>
                <div className="text-white font-bold text-lg">+24%</div>
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