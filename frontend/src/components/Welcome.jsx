import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Text Content */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="text-indigo-600 text-xs font-black uppercase tracking-widest">SmartSpend v2.0</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
            Master Your <br />
            <span className="text-indigo-600 font-black">Finances</span> Today.
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
            The ultimate personal expense tracker designed for clarity and control. Join thousands managing their wealth smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all uppercase tracking-widest text-xs"
            >
              Get Started Now
            </button>
            <button className="px-8 py-4 bg-white text-slate-600 font-black rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side: Visual/Illustration */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-full max-w-[400px] aspect-square bg-white rounded-[3rem] shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden border border-slate-50">
            {/* Simulation of a small chart or financial visual */}
            <div className="space-y-6">
               <div className="h-4 w-2/3 bg-slate-100 rounded-full"></div>
               <div className="grid grid-cols-3 gap-3">
                  <div className="h-20 bg-emerald-50 rounded-2xl border border-emerald-100"></div>
                  <div className="h-20 bg-rose-50 rounded-2xl border border-rose-100"></div>
                  <div className="h-20 bg-indigo-50 rounded-2xl border border-indigo-100"></div>
               </div>
               <div className="h-40 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-dashed border-slate-200">
                  <span className="text-4xl">📊</span>
               </div>
            </div>
            {/* Floating Element */}
            <div className="absolute top-10 right-10 bg-white shadow-xl p-4 rounded-2xl animate-bounce">
               <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em]">
        Designed by Pramudi Lakshika
      </div>
    </div>
  );
};

export default Welcome;