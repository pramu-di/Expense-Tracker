import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, PieChart, TrendingUp, ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-fuchsia-500 selection:text-white">

      {/* 1. BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-100" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10 relative">

        {/* --- LEFT: TEXT CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left space-y-8 order-2 lg:order-1"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-indigo-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em]">SmartSpend v2.0 Live</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 drop-shadow-lg">
              Wealth
            </span>
          </h1>

          <p className="text-indigo-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Experience the future of personal finance. Elegant tracking, powerful insights, and total control—all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 group transition-all"
            >
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all"
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>


        {/* --- RIGHT: PHONE MOCKUP & WAVE --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center order-1 lg:order-2 h-[500px] md:h-[600px]"
        >
          {/* GLOWING WAVE SVG BACKGROUND */}
          <div className="absolute inset-0 z-0 flex items-center justify-center scale-150 opacity-60 pointer-events-none">
            <svg viewBox="0 0 1000 1000" className="w-full h-full animate-pulse-slow">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
                  <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 500 Q 250 300 500 500 T 1000 500"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="20"
                strokeLinecap="round"
                filter="drop-shadow(0 0 20px rgba(192,132,252,0.5))"
              />
              {/* Secondary faint wave */}
              <path
                d="M 0 550 Q 250 350 500 550 T 1000 550"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="5"
                strokeOpacity="0.3"
              />
            </svg>
          </div>

          {/* FLOATING ICONS */}
          <motion.div
            animate={{ y: [-15, 15, -15] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] z-20 p-4 bg-[#1a1638]/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-lg shadow-indigo-500/20"
          >
            <Wallet className="text-indigo-400 w-8 h-8" />
          </motion.div>

          <motion.div
            animate={{ y: [20, -20, 20] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] right-[5%] z-20 p-4 bg-[#1a1638]/80 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl shadow-lg shadow-fuchsia-500/20"
          >
            <PieChart className="text-fuchsia-400 w-8 h-8" />
          </motion.div>

          <motion.div
            animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[40%] right-[15%] z-0 opacity-50 glow-indigo"
          >
            <div className="w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
          </motion.div>


          {/* PHONE MOCKUP */}
          <motion.div
            initial={{ rotate: -5 }} animate={{ rotate: 0 }} transition={{ duration: 1, type: "spring" }}
            className="relative z-10 w-[280px] h-[580px] bg-slate-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl shadow-black overflow-hidden ring-1 ring-white/10"
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-20" />

            {/* Screen Content */}
            <div className="w-full h-full bg-gradient-to-b from-[#1a1638] to-[#0f0c29] p-4 flex flex-col relative overflow-hidden">

              {/* Screen Header */}
              <div className="mt-8 mb-6 text-center">
                <div className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-1">Welcome Back</div>
                <div className="text-2xl font-bold text-white">SmartSpend</div>
              </div>

              {/* Mini Chart */}
              <div className="relative h-48 w-full mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent rounded-2xl border border-indigo-500/20 flex items-end justify-center overflow-hidden">
                  <svg viewBox="0 0 100 50" className="w-full h-full opacity-80" preserveAspectRatio="none">
                    <path d="M0 50 L0 30 Q 20 10 40 30 T 100 20 V 50 Z" file="url(#screenGradient)" className="fill-indigo-500/30 stroke-indigo-400 stroke-2" />
                  </svg>
                </div>
                {/* Floating bubble on screen */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5 text-[10px] text-white">
                  +24%
                </div>
              </div>

              {/* List Items */}
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className={`w-8 h-8 rounded-full ${i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} flex items-center justify-center`}>
                      <TrendingUp size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-16 bg-white/20 rounded-full mb-1" />
                      <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="mt-auto flex justify-around p-2 bg-black/20 rounded-2xl backdrop-blur-md">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${i === 0 ? 'bg-indigo-500 text-white' : 'text-slate-600'} flex items-center justify-center`}>
                    <div className="w-4 h-4 rounded-sm border-2 border-current" />
                  </div>
                ))}
              </div>

            </div>
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