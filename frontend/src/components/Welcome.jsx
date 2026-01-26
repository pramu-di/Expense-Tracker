import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[150px]"
        />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center z-10">

        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent text-sm font-black uppercase tracking-widest">
              ✨ SmartSpend v2.0
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter">
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Wealth
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
            The ultimate personal expense tracker designed for clarity, control, and peace of mind. Join the future of finance today.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-full shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all uppercase tracking-widest text-sm"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white/5 text-white font-black rounded-full border border-white/10 backdrop-blur-md hover:border-white/20 transition-all uppercase tracking-widest text-sm"
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>

        {/* Right: Abstract 3D Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md aspect-square bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl p-10 overflow-hidden group"
          >
            {/* Decorative UI Elements inside the card */}
            <div className="space-y-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                <div className="w-32 h-4 rounded-full bg-white/10" />
              </div>
              <div className="h-40 w-full rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-end p-6 gap-2">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="flex-1 bg-indigo-500 rounded-t-lg opacity-60"
                  />
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full rounded-full bg-white/5" />
                <div className="h-4 w-3/4 rounded-full bg-white/5" />
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

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Designed by Pramudi Lakshika</p>
      </div>
    </div>
  );
};

export default Welcome;