import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import toast, { Toaster } from 'react-hot-toast';
import 'regenerator-runtime/runtime';
import {
  LayoutDashboard,
  History,
  UserCircle,
  Settings,
  LogOut,
  Mic,
  MicOff,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  Search,
  FileText,
  Award,
  Shield,
  Zap,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Calendar,
  X,
  CreditCard,
  Repeat,
  Coffee,
  Fuel,
  ShoppingCart,
  Filter,
  BarChart2,
  Edit2,
  Save,
  Download,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [transactionType, setTransactionType] = useState("expense");
  const [editId, setEditId] = useState(null);
  const [view, setView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Recurring state
  const [isRecurring, setIsRecurring] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Profile & User State
  const [profileName, setProfileName] = useState(localStorage.getItem('userName') || "Pramu");
  const [savingGoal, setSavingGoal] = useState(50000);
  const [currency, setCurrency] = useState("LKR");
  const [profileAvatar, setProfileAvatar] = useState("👩‍💻");
  const [joinedDate, setJoinedDate] = useState(null);
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Budget State
  const [budgets, setBudgets] = useState({});

  // Editing Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const defaultCategories = ["Food", "Transport", "Bills", "Shopping", "Other"];
  const allCategories = [...defaultCategories, ...customCategories];

  const avatars = ["👩‍💻", "🦸‍♂️", "🦄", "🚀", "🐱", "🐶", "🦁", "🤖", "👽", "👻"];

  // --- VOICE RECOGNITION SETUP ---
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const amountMatch = transcript.match(/(\d+)/);
      if (amountMatch) setAmount(amountMatch[0]);

      const matchedCategory = allCategories.find(cat => transcript.toLowerCase().includes(cat.toLowerCase()));
      if (matchedCategory) setCategory(matchedCategory);

      if (transcript.toLowerCase().includes('income')) setTransactionType('income');
      if (transcript.toLowerCase().includes('expense')) setTransactionType('expense');

      if (transcript.toLowerCase().includes('monthly') || transcript.toLowerCase().includes('subscription')) {
        setIsRecurring(true);
        setBillingCycle('monthly');
      }

      setText(transcript);
    }
  }, [transcript, allCategories]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      toast.success("Voice command captured!");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
      toast("Listening...", { icon: '🎙️' });
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else {
      fetchExpenses();
      fetchUserData();
    }
  }, [navigate, userId]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${userId}`);
      const { settings, customCategories, name, budgets, avatar, createdAt } = res.data;
      if (settings) {
        setCurrency(settings.currency || "LKR");
        setDarkMode(settings.darkMode !== undefined ? settings.darkMode : true);
        setSavingGoal(settings.savingGoal || 50000);
      }
      if (customCategories) setCustomCategories(customCategories);
      if (budgets) setBudgets(budgets);
      if (name) { setProfileName(name); setTempName(name); }
      if (avatar) setProfileAvatar(avatar);
      if (createdAt) setJoinedDate(new Date(createdAt));
    } catch (err) { console.error(err); }
  };

  const updateSettings = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}/settings`, {
        settings: { currency, darkMode, savingGoal }
      });
      toast.success("Settings Saved Successfully!");
    } catch (err) { toast.error("Failed to save settings."); }
  };

  const saveBudgets = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}/budgets`, { budgets });
      toast.success("Budgets Updated!");
    } catch (err) { toast.error("Failed to save budgets."); }
  };

  const updateProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}/profile`, { name: tempName, avatar: profileAvatar });
      setProfileName(tempName);
      setIsEditingProfile(false);
      toast.success("Profile Updated!");
    } catch (err) { toast.error("Failed to update profile."); }
  };

  const addCustomCategory = async () => {
    if (!newCategory || allCategories.includes(newCategory)) return;
    const updatedCategories = [...customCategories, newCategory];
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}/categories`, { customCategories: updatedCategories });
      setCustomCategories(updatedCategories);
      setNewCategory("");
      toast.success(`Category "${newCategory}" added!`);
    } catch (err) { toast.error("Failed to add category."); }
  };

  const removeCustomCategory = async (cat) => {
    const updatedCategories = customCategories.filter(c => c !== cat);
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}/categories`, { customCategories: updatedCategories });
      setCustomCategories(updatedCategories);
      toast.success("Category removed.");
    } catch (err) { toast.error("Failed to remove category."); }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses/${userId}`);
      setExpenses(res.data);
    } catch (err) { console.error(err); }
  };

  // --- SMART DATA LOGIC ---
  const processChartData = () => {
    const dataMap = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      if (!dataMap[date]) dataMap[date] = { date, income: 0, expense: 0 };
      if (exp.type === 'income') dataMap[date].income += exp.amount;
      else dataMap[date].expense += exp.amount;
    });
    return Object.values(dataMap).slice(-7);
  };
  const trendData = processChartData();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Week Comparison Logic
  const getWeeklySpending = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekTotal = expenses.filter(e => e.type === 'expense' && new Date(e.date) >= oneWeekAgo).reduce((a, c) => a + c.amount, 0);
    const lastWeekTotal = expenses.filter(e => e.type === 'expense' && new Date(e.date) >= twoWeeksAgo && new Date(e.date) < oneWeekAgo).reduce((a, c) => a + c.amount, 0);

    if (lastWeekTotal === 0) return { trend: 'neutral', pct: 0 };
    const pctChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    return { trend: pctChange > 0 ? 'up' : 'down', pct: Math.abs(pctChange).toFixed(0) };
  };
  const weeklyTrend = getWeeklySpending();

  // History Filtering Logic
  const historyExpensesList = expenses.filter(exp => {
    const d = new Date(exp.date);
    const matchesSearch = exp.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || exp.category === filterCategory;
    const matchesDate = (startDate && endDate) ? (d >= new Date(startDate) && d <= new Date(endDate)) : (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear);

    return matchesSearch && matchesCategory && matchesDate;
  });

  const recurringExpenses = expenses.filter(exp => exp.isRecurring);

  const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const categorySummary = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const quickAdd = (label, amt, cat) => {
    setText(label);
    setAmount(amt);
    setCategory(cat);
    setTransactionType('expense');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("Amount must be positive!");
      return;
    }
    if (!text.trim()) {
      toast.error("Description cannot be empty!");
      return;
    }

    // Budget Check logic
    if (transactionType === 'expense' && budgets[category]) {
      const currentSpent = categorySummary[category] || 0;
      const limit = budgets[category];
      if (currentSpent + Number(amount) > limit) {
        toast("Warning: You are exceeding your budget!", { icon: '⚠️', duration: 4000 });
      }
    }

    const payload = {
      text, amount: Number(amount), category, type: transactionType, userId,
      isRecurring, billingCycle, nextBillingDate: isRecurring ? nextBillingDate : null
    };

    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/api/expenses/${editId}`, payload);
        setExpenses(expenses.map(exp => exp._id === editId ? res.data : exp));
        setEditId(null);
        toast.success("Transaction Updated!");
      } else {
        const res = await axios.post('http://localhost:5000/api/expenses', payload);
        setExpenses([...expenses, res.data]);
        toast.success("Transaction Added!");
      }
      setText(""); setAmount(""); setIsRecurring(false); setNextBillingDate("");
    } catch (err) {
      toast.error("Failed to save transaction.");
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
      toast.success("Deleted Successfully");
    }
  };

  const downloadHistoryPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Transaction Report`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Date", "Description", "Type", "Category", "Amount"]],
      body: historyExpensesList.map(exp => [
        new Date(exp.date).toLocaleDateString(), exp.text, exp.type, exp.category, exp.amount
      ]),
    });
    doc.save(`Report.pdf`);
    toast.success("Report Downloaded!");
  };

  const exportAllData = () => {
    const dataStr = JSON.stringify({ user: { name: profileName, settings: { currency, darkMode, savingGoal }, budgets, customCategories }, expenses }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SmartSpend_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data Exported!");
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); toast.success("Logged Out"); };

  // --- GAMIFICATION ---
  const badges = [
    { id: 'saver', name: 'Saver Streak', icon: <Shield size={32} />, description: 'Net balance is positive.', unlocked: netBalance > 0 },
    { id: 'warrior', name: 'Budget Warrior', icon: <Target size={32} />, description: 'Expenses < 50% of income.', unlocked: totalIncome > 0 && totalExpense < (totalIncome * 0.5) },
    { id: 'high-roller', name: 'High Roller', icon: <Award size={32} />, description: 'Earned > 50k in one go.', unlocked: currentMonthTransactions.some(e => e.type === 'income' && e.amount >= 50000) },
    { id: 'power-user', name: 'Power User', icon: <Zap size={32} />, description: 'Added > 5 transactions.', unlocked: currentMonthTransactions.length > 5 },
    { id: 'goal-crusher', name: 'Goal Crusher', icon: <TrendingUp size={32} />, description: 'Hit saving goal!', unlocked: netBalance >= savingGoal }
  ];
  const unlockedCount = badges.filter(b => b.unlocked).length;

  // --- INSIGHTS ---
  const getInsights = () => {
    const tips = [];
    if (totalExpense > 0) {
      const sortedCats = Object.entries(categorySummary).sort((a, b) => b[1] - a[1]);
      if (sortedCats.length > 0) {
        const topCat = sortedCats[0];
        const pct = ((topCat[1] / totalExpense) * 100).toFixed(0);
        if (pct > 40) tips.push({ icon: <AlertTriangle size={20} />, text: `Heads up! ${topCat[0]} makes up ${pct}% of your spending.` });
      }
    }
    if (savingGoal > 0) {
      const progress = (netBalance / savingGoal) * 100;
      if (progress >= 80 && progress < 100) tips.push({ icon: <TrendingUp size={20} />, text: `So close! You're ${progress.toFixed(0)}% of the way to your saving goal.` });
      if (progress < 0) tips.push({ icon: <AlertTriangle size={20} />, text: `Careful! You are exceeding your budget by ${currency} ${Math.abs(netBalance)}.` });
    }

    // Week over Week Trend
    if (weeklyTrend.trend !== 'neutral') {
      tips.push({
        icon: weeklyTrend.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />,
        text: `You spent ${weeklyTrend.pct}% ${weeklyTrend.trend === 'up' ? 'MORE' : 'LESS'} this week compared to last week.`
      });
    }

    if (tips.length === 0) tips.push({ icon: <Lightbulb size={20} />, text: `Your spending looks balanced this month. Keep it up!` });
    return tips;
  };
  const insights = getInsights();

  // --- UI CONSTANTS ---
  const glassCard = `backdrop-blur-xl ${darkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white/70 border-black/5'} border shadow-2xl rounded-3xl p-8 transition-all hover:bg-opacity-80 duration-300`;
  const glassInput = `w-full p-4 px-6 rounded-2xl ${darkMode ? 'bg-black/20 text-white placeholder-white/30 focus:bg-black/30' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-white'} border border-transparent focus:border-indigo-500 outline-none font-medium transition-all`;
  const primaryBtn = `w-full py-4 rounded-2xl font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all`;

  return (
    <div className={`min-h-screen flex transition-colors duration-700 font-sans selection:bg-indigo-500/30 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Toaster position="top-right" toastOptions={{ style: { background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000', borderRadius: '12px' } }} />

      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className={`w-20 lg:w-72 flex-shrink-0 z-20 hidden md:flex flex-col p-6 gap-2 ${darkMode ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-2xl border-r border-white/5`}
      >
        <div className="p-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg">S</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight hidden lg:block">SmartSpend</h1>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'subscriptions', icon: Repeat, label: 'Subscriptions' },
            { id: 'profile', icon: UserCircle, label: 'Profile' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(item => (
            <motion.button
              key={item.id}
              onClick={() => setView(item.id)}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl font-medium text-sm flex items-center gap-4 transition-all
                ${view === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`
              }
            >
              <item.icon size={22} className={view === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
              <span className="hidden lg:block">{item.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          className="mt-auto p-4 rounded-xl font-medium text-sm flex items-center gap-4 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={22} /> <span className="hidden lg:block">Logout</span>
        </motion.button>
      </motion.div>

      {/* MAIN VIEW */}
      <div className="flex-1 h-screen overflow-y-auto z-10 p-4 md:p-8 lg:p-12 scrollbar-none relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <motion.h2
              key={view} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </motion.h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, {profileName}</p>
          </div>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full shadow-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-800'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </motion.button>
        </header>

        <AnimatePresence mode="wait">
          {/* --- DASHBOARD VIEW --- */}
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Revenue', value: totalIncome, color: 'text-emerald-400', icon: TrendingUp, bg: 'bg-emerald-500/10' },
                  { label: 'Expenses', value: totalExpense, color: 'text-rose-400', icon: TrendingDown, bg: 'bg-rose-500/10' },
                  { label: 'Balance', value: netBalance, color: 'text-indigo-400', icon: Wallet, bg: 'bg-indigo-500/10' },
                  { label: 'Goal', value: savingGoal, color: 'text-amber-400', icon: Target, bg: 'bg-amber-500/10' },
                ].map((metric, i) => (
                  <motion.div
                    key={i} whileHover={{ y: -4 }}
                    className={glassCard}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                        <metric.icon size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{metric.label}</span>
                    </div>
                    <h3 className={`text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currency} {metric.value.toLocaleString()}</h3>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* INSIGHTS */}
                {insights.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${glassCard} !p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-indigo-500/20 md:col-span-1`}>
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400 text-sm uppercase tracking-wider"><Lightbulb size={18} /> Smart Insights</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {insights.slice(0, 2).map((insight, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-indigo-400 mt-0.5">{insight.icon}</div>
                          <p className="text-sm font-medium text-slate-300 leading-relaxed">{insight.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* BUDGET TRACKER */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${glassCard} !p-6 md:col-span-1`}>
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-400 text-sm uppercase tracking-wider"><BarChart2 size={18} /> Monthly Budget</h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-none">
                    {Object.keys(budgets).length > 0 ? Object.entries(budgets).map(([cat, limit]) => {
                      const spent = categorySummary[cat] || 0;
                      const pct = Math.min(100, (spent / limit) * 100);
                      let color = 'bg-emerald-500';
                      if (pct > 50) color = 'bg-yellow-500';
                      if (pct > 80) color = 'bg-rose-500';

                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>{cat}</span>
                            <span className={`${pct > 100 ? 'text-rose-500' : 'text-slate-400'}`}>{spent} / {limit}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-700/30 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="text-xs text-slate-500 text-center py-8">No budgets set. Go to Settings to add limits.</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* CHARTS & FORM */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CHART */}
                <div className={`lg:col-span-2 ${glassCard} flex flex-col`}>
                  <h3 className="font-bold mb-8 flex items-center gap-2 text-lg">
                    Spending Analysis
                  </h3>
                  <div className="w-full flex justify-center overflow-x-auto">
                    <AreaChart width={600} height={300} data={trendData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.05} vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)', padding: '12px' }} />
                      <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </div>
                </div>

                {/* TRANSACTION FORM */}
                <div className={glassCard}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">New Entry</h3>
                    <motion.button
                      onClick={toggleListening}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-full flex items-center justify-center transition-all ${listening ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30' : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'}`}
                    >
                      {listening ? <MicOff size={20} /> : <Mic size={20} />}
                    </motion.button>
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="flex gap-2 py-2 mb-2 overflow-x-auto scrollbar-none">
                    <span onClick={() => quickAdd("Lunch", 1500, "Food")} className="cursor-pointer px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 flex items-center gap-1 hover:bg-orange-500/30"><Coffee size={12} /> Lunch</span>
                    <span onClick={() => quickAdd("Fuel", 3000, "Transport")} className="cursor-pointer px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-1 hover:bg-blue-500/30"><Fuel size={12} /> Fuel</span>
                    <span onClick={() => quickAdd("Groceries", 5000, "Shopping")} className="cursor-pointer px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1 hover:bg-emerald-500/30"><ShoppingCart size={12} /> Shop</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-500/10 rounded-2xl mb-4 relative">
                      <button type="button" onClick={() => setTransactionType('expense')} className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${transactionType === 'expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Expense</button>
                      <button type="button" onClick={() => setTransactionType('income')} className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${transactionType === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Income</button>
                    </div>

                    <input type="text" placeholder={listening ? "Listening..." : "Description (e.g. Netflix)"} value={text} onChange={(e) => setText(e.target.value)} className={glassInput} required />

                    <div className="relative">
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${glassInput} appearance-none cursor-pointer`}>
                        {allCategories.map(cat => <option key={cat} value={cat} className="text-black">{cat}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><span className="text-xs">▼</span></div>
                    </div>

                    <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={glassInput} required />

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setIsRecurring(!isRecurring)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isRecurring ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                        {isRecurring && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recurring Subscription</span>
                    </div>

                    <AnimatePresence>
                      {isRecurring && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                          <select value={billingCycle} onChange={e => setBillingCycle(e.target.value)} className={glassInput}>
                            <option value="monthly" className="text-black">Monthly</option>
                            <option value="yearly" className="text-black">Yearly</option>
                          </select>
                          <input type="date" value={nextBillingDate} onChange={e => setNextBillingDate(e.target.value)} className={glassInput} required />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={primaryBtn}>
                      <Plus size={18} className="inline mr-2 mb-0.5" /> Add Transaction
                    </motion.button>
                  </form>
                </div>
              </div>

              {/* TABLE */}
              <div className={glassCard}>
                <h3 className="font-bold mb-6 text-lg">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-light/5">
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Description</th>
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold text-right">Amount</th>
                        <th className="p-4 font-bold text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {currentMonthTransactions.map(exp => (
                        <tr key={exp._id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none group">
                          <td className="p-4 text-slate-400 font-medium">{new Date(exp.date).toLocaleDateString()}</td>
                          <td className="p-4 font-semibold">
                            <div className="flex items-center gap-2">
                              {exp.text}
                              {exp.isRecurring && <span className="bg-indigo-500/20 text-indigo-400 p-1 rounded"><Repeat size={12} /></span>}
                            </div>
                          </td>
                          <td className="p-4"><span className="px-3 py-1 rounded-full bg-slate-500/10 text-xs font-bold uppercase tracking-wider text-slate-400">{exp.category}</span></td>
                          <td className={`p-4 text-right font-bold text-base ${exp.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {exp.type === 'income' ? '+' : '-'} {currency} {exp.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => deleteExpense(exp._id)} className="p-2 rounded-full hover:bg-rose-500/20 text-rose-500 transition-colors"><X size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {currentMonthTransactions.length === 0 && <div className="p-8 text-center text-slate-500 font-medium text-sm">No transactions yet.</div>}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- SUBSCRIPTIONS VIEW --- */}
          {view === 'subscriptions' && (
            <motion.div
              key="subscriptions"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${glassCard} flex flex-col justify-center`}>
                  <h3 className="font-bold mb-2 text-slate-500 uppercase tracking-wider text-xs flex items-center gap-2"><CreditCard size={14} /> Fixed Monthly Cost</h3>
                  <div className="text-5xl font-bold text-white tracking-tight">
                    {currency} {recurringExpenses.reduce((a, c) => a + (c.billingCycle === 'monthly' ? c.amount : c.amount / 12), 0).toFixed(0).toLocaleString()}
                  </div>
                </div>
                <div className={`${glassCard} border-dashed border-2 flex flex-col justify-center items-center text-center opacity-70 hover:opacity-100 cursor-pointer transition-all hover:bg-indigo-500/5 hover:border-indigo-500/30`} onClick={() => setView('dashboard')}>
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4"><Plus size={24} /></div>
                  <h3 className="font-bold text-lg">Add Subscription</h3>
                  <p className="text-sm mt-1 text-slate-500">Go to Dashboard & toggle "Recurring"</p>
                </div>
              </div>

              <h3 className="font-bold text-2xl flex items-center gap-3"><Repeat className="text-indigo-400" /> Active Subscriptions</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recurringExpenses.length > 0 ? recurringExpenses.map(sub => {
                  const daysLeft = sub.nextBillingDate ? Math.ceil((new Date(sub.nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24)) : 30;
                  const isUrgent = daysLeft <= 3;
                  return (
                    <motion.div key={sub._id} whileHover={{ y: -4 }} className={`${glassCard} border-l-4 ${isUrgent ? 'border-l-rose-500' : 'border-l-indigo-500'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="font-bold text-xl">{sub.text}</h4>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-slate-400">{sub.billingCycle}</span>
                      </div>
                      <div className="text-3xl font-bold mb-6">{currency} {sub.amount.toLocaleString()}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                          <span>Next Bill</span>
                          <span className={isUrgent ? 'text-rose-500' : 'text-emerald-500'}>{daysLeft} Days Left</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isUrgent ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${Math.max(0, Math.min(100, (30 - daysLeft) / 30 * 100))}%` }} />
                        </div>
                        <div className="text-xs text-right text-slate-500">{new Date(sub.nextBillingDate).toLocaleDateString()}</div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="col-span-3 text-center py-12 text-slate-500 font-medium">
                    <div className="text-6xl mb-4">🧘</div>
                    No active subscriptions found.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* --- HISTORY VIEW --- */}
          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* FILTERS */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className={`md:w-1/3 ${glassCard}`}>
                  <h3 className="font-bold mb-6 text-xl">Filter Ledger</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${glassInput} pl-12`} />
                    </div>

                    <div className="flex gap-2">
                      <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={`${glassInput} cursor-pointer`}>
                        <option value="All" className="text-black">All Categories</option>
                        {allCategories.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-2 block pl-2">Date Range</label>
                      <div className="flex gap-3">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={glassInput} />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={glassInput} />
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadHistoryPDF} className={primaryBtn}>Download Report</motion.button>
                  </div>
                </div>

                {/* SUMMARY METRICS */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Income', value: historyExpensesList.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0), color: 'text-emerald-400', icon: TrendingUp },
                    { label: 'Expenses', value: historyExpensesList.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0), color: 'text-rose-400', icon: TrendingDown },
                    { label: 'Net Flow', value: historyExpensesList.reduce((a, c) => c.type === 'income' ? a + c.amount : a - c.amount, 0), color: 'text-indigo-400', icon: Wallet },
                  ].map((metric, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className={`${glassCard} flex flex-col justify-center items-center text-center`}>
                      <div className={`p-4 rounded-full bg-white/5 mb-4 ${metric.color}`}>
                        <metric.icon size={32} />
                      </div>
                      <h3 className={`text-2xl font-bold ${metric.color}`}>{currency} {metric.value.toLocaleString()}</h3>
                      <p className="text-xs font-bold uppercase text-slate-500 mt-2 tracking-wider">{metric.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* TABLE */}
              <div className={glassCard}>
                <h3 className="font-bold mb-8 text-xl">Full Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-light/5">
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Description</th>
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {historyExpensesList.map(exp => (
                        <tr key={exp._id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                          <td className="p-4 text-slate-400 font-medium">{new Date(exp.date).toLocaleDateString()}</td>
                          <td className="p-4 font-semibold">{exp.text}</td>
                          <td className="p-4"><span className="px-3 py-1 rounded-full bg-slate-500/10 text-xs font-bold uppercase tracking-wider text-slate-400">{exp.category}</span></td>
                          <td className={`p-4 text-right font-bold text-base ${exp.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {exp.type === 'income' ? '+' : '-'} {currency} {exp.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {historyExpensesList.length === 0 && (
                    <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center">
                      <div className="text-6xl mb-4">👻</div>
                      <p className="text-lg">No transactions found.</p>
                      <p className="text-sm opacity-50">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* IDENTITY CARD */}
                <div className={`md:col-span-1 ${glassCard} flex flex-col items-center text-center relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20" />

                  <div className="relative mt-8 mb-4 group cursor-pointer" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                    <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-white/10 flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden">
                      {profileAvatar}
                      {isEditingProfile && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold uppercase">Change</div>}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-indigo-500 rounded-full p-2 text-white shadow-lg"><Edit2 size={14} /></div>
                  </div>

                  <AnimatePresence>
                    {isEditingProfile ? (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full space-y-4 mb-4 overflow-hidden">
                        <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className={`${glassInput} text-center`} autoFocus />
                        <div className="flex gap-2 justify-center flex-wrap">
                          {avatars.map(a => (
                            <button key={a} onClick={() => setProfileAvatar(a)} className={`text-2xl p-2 rounded-xl hover:bg-white/10 transition-colors ${profileAvatar === a ? 'bg-indigo-500/50' : ''}`}>{a}</button>
                          ))}
                        </div>
                        <motion.button onClick={updateProfile} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/20">Save Profile</motion.button>
                      </motion.div>
                    ) : (
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">{profileName}</h2>
                        <p className="text-slate-500 text-sm font-medium">Member since {joinedDate ? joinedDate.getFullYear() : '2023'}</p>
                      </div>
                    )}
                  </AnimatePresence>

                  <div className="w-full space-y-2">
                    <button onClick={exportAllData} className="w-full py-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"><Download size={16} /> Export Data</button>
                    {/* <button className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"><Trash2 size={16}/> Reset Account</button> */}
                  </div>
                </div>

                {/* FINANCIAL PASSPORT */}
                <div className={`md:col-span-2 ${glassCard}`}>
                  <h3 className="font-bold mb-6 text-xl flex items-center gap-3"><Wallet className="text-emerald-400" /> Financial Passport</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Total Income</p>
                      <p className="text-2xl font-bold text-white">{currency} {expenses.filter(e => e.type === 'income').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Total Spent</p>
                      <p className="text-2xl font-bold text-white">{currency} {expenses.filter(e => e.type === 'expense').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 col-span-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Net Worth</p>
                          <p className="text-4xl font-bold text-white">{currency} {(expenses.filter(e => e.type === 'income').reduce((a, c) => a + c.amount, 0) - expenses.filter(e => e.type === 'expense').reduce((a, c) => a + c.amount, 0)).toLocaleString()}</p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                          <Shield size={32} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TROPHY CASE */}
              <div className={glassCard}>
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-bold text-2xl flex items-center gap-3"><Award className="text-amber-400" /> Trophy Room</h3>
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    {unlockedCount} / {badges.length} Unlocked
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ y: -4 }}
                      className={`p-6 rounded-2xl border transition-all relative overflow-hidden group ${badge.unlocked ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20' : 'bg-slate-500/5 border-white/5 opacity-40 grayscale'}`}
                    >
                      <div className={`mb-3 ${badge.unlocked ? 'text-indigo-400' : 'text-slate-500'}`}>{badge.icon}</div>
                      <h4 className={`font-bold text-base mb-1 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed">{badge.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`max-w-2xl mx-auto ${glassCard}`}
            >
              <h3 className="font-bold mb-8 text-xl flex items-center gap-3"><Settings className="text-slate-400" /> App Preferences</h3>
              <div className="space-y-8">
                {/* Currency */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <span className="font-bold ml-2">Currency</span>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent font-bold outline-none border-none text-right cursor-pointer text-indigo-400">
                    <option value="LKR" className="text-black">LKR (Rs.)</option>
                    <option value="USD" className="text-black">USD ($)</option>
                    <option value="EUR" className="text-black">EUR (€)</option>
                    <option value="GBP" className="text-black">GBP (£)</option>
                  </select>
                </div>

                {/* Budget Settings */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block font-bold mb-6 ml-2">Category Budgets</span>
                  <div className="space-y-4">
                    {allCategories.map(cat => (
                      <div key={cat} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-400">{cat}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="No Limit"
                            value={budgets[cat] || ''}
                            onChange={e => setBudgets({ ...budgets, [cat]: Number(e.target.value) })}
                            className={`w-32 bg-slate-900/50 rounded-lg p-2 text-right text-sm outline-none border border-transparent focus:border-indigo-500`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveBudgets} className="mt-6 w-full py-3 bg-indigo-500/20 text-indigo-400 font-bold rounded-xl text-sm border border-indigo-500/30">Save Budgets</motion.button>
                </div>

                {/* Custom Categories */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block font-bold mb-6 ml-2">Custom Categories</span>
                  <div className="flex gap-3 mb-6">
                    <input type="text" placeholder="Add new category..." value={newCategory} onChange={e => setNewCategory(e.target.value)} className={glassInput} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addCustomCategory} className="w-14 h-14 flex items-center justify-center bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20"><Plus size={24} /></motion.button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                      {customCategories.map(cat => (
                        <motion.span
                          key={cat}
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-3 border border-indigo-500/20"
                        >
                          {cat} <button onClick={() => removeCustomCategory(cat)} className="text-rose-400 hover:text-rose-500 p-1 hover:bg-rose-500/20 rounded-full transition-all"><X size={14} /></button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={updateSettings} className={primaryBtn}>
                  Save All Settings
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;