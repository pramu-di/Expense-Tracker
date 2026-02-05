import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

      {/* 1. ANIMATED BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950 via-[#0f0524] to-slate-950 opacity-90" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 2. PARTICLE EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              y: [Math.random() * -100, Math.random() * 100],
              x: [Math.random() * -50, Math.random() * 50]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
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
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg shadow-indigo-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">SmartSpend v2.0 Live</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white">
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl">
              Wealth
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
            Experience the future of personal finance. Elegant tracking, powerful insights, and total control—all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.4)" }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl border border-white/10 flex items-center justify-center gap-2 group"
            >
              Get Started <span className="group-hover:translate-x-1 transition-transform">→</span>
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


        {/* --- RIGHT: 3D VISUAL --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="relative flex justify-center items-center perspective-1000"
        >
          {/* Glass Card */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-b from-slate-800/40 to-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl shadow-lg">⚡</div>
              <div className="w-20 h-2 rounded-full bg-white/10" />
            </div>

            {/* Chart Simulation */}
            <div className="flex-1 flex items-end gap-3 mb-8 px-2">
              {[30, 50, 45, 70, 60, 90, 85].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1, type: 'spring' }}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 opacity-80"
                />
              ))}
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Income</div>
                <div className="text-emerald-400 font-bold text-lg">+ $12,400</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Savings</div>
                <div className="text-indigo-400 font-bold text-lg">+ 24%</div>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-white/20 transform rotate-12"
            >
              <span className="text-2xl">🚀</span>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Designed by Pramudi Lakshika</p>
      </div>
    </div>
  );
};

export default Welcome;