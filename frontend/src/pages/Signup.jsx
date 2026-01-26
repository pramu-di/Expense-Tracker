import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/register', formData);
            alert("Registration Successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
            setIsLoading(false);
        }
    };

    const inputClass = "w-full p-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-bold";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative overflow-hidden text-white selection:bg-indigo-500 selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                className="w-full max-w-md p-10 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-2xl border border-white/10 shadow-2xl z-10 mx-4"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-4 text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tighter hover:scale-105 transition-transform">
                        SmartSpend
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-200">Create Account 🚀</h2>
                    <p className="text-slate-500 mt-2">Join us to start tracking your wealth.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input type="text" placeholder="Full Name" className={inputClass}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <input type="email" placeholder="Email Address" className={inputClass}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" className={inputClass}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="w-full py-4 rounded-full font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Sign Up'}
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-4">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;