import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [editId, setEditId] = useState(null);
  const [view, setView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [profileName, setProfileName] = useState(localStorage.getItem('userName') || "Pramu");
  const [savingGoal, setSavingGoal] = useState(50000); 
  const [currency, setCurrency] = useState("LKR");
  const [profilePic, setProfilePic] = useState("👩‍💻");

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses/${userId}`);
      setExpenses(res.data);
    } catch (err) { console.error(err); }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpensesList = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const historyExpensesList = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalSpentHistory = historyExpensesList.reduce((acc, curr) => acc + curr.amount, 0);
  const currentMonthSpent = currentMonthExpensesList.reduce((acc, curr) => acc + curr.amount, 0);

  const categorySummary = currentMonthExpensesList.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const chartData = Object.keys(categorySummary).map(key => ({ name: key, value: categorySummary[key] }));
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#06b6d4'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const res = await axios.put(`http://localhost:5000/api/expenses/${editId}`, { text, amount: Number(amount), category });
      setExpenses(expenses.map(exp => exp._id === editId ? res.data : exp));
      setEditId(null);
    } else {
      const res = await axios.post('http://localhost:5000/api/expenses', { text, amount: Number(amount), category, userId });
      setExpenses([...expenses, res.data]);
    }
    setText(""); setAmount("");
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    }
  };

  const downloadHistoryPDF = () => {
    const doc = new jsPDF();
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][selectedMonth];
    doc.setFontSize(18);
    doc.text(`Monthly Expense Report: ${monthName} ${selectedYear}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Date", "Description", "Category", "Amount"]],
      body: historyExpensesList.map(exp => [new Date(exp.date).toLocaleDateString(), exp.text, exp.category, exp.amount]),
    });
    doc.save(`Report_${monthName}.pdf`);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div className={`${darkMode ? 'dark bg-[#0f172a]' : 'bg-[#f8fafc]'} min-h-screen flex transition-all duration-500`}>
      
      {/* SIDEBAR */}
      <div className={`w-72 ${darkMode ? 'bg-[#1e293b]' : 'bg-[#0f172a]'} text-white hidden md:flex flex-col shadow-2xl z-50`}>
        <div className="p-10 border-b border-slate-800/30 text-center">
          <h2 className="text-3xl font-black tracking-tighter text-indigo-500">SmartSpend</h2>
        </div>
        <nav className="flex-1 p-6 space-y-3 mt-4">
          <button onClick={() => setView('dashboard')} className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${view === 'dashboard' ? 'bg-indigo-600 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>📊 Dashboard</button>
          <button onClick={() => setView('history')} className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${view === 'history' ? 'bg-indigo-600 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>📅 History</button>
          <button onClick={() => setView('profile')} className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${view === 'profile' ? 'bg-indigo-600 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>👤 Profile</button>
          <button onClick={() => setView('settings')} className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${view === 'settings' ? 'bg-indigo-600 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>⚙️ Settings</button>
          <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg flex items-center gap-3 hover:bg-red-600 mt-10">🚪 Logout</button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 h-screen overflow-y-auto p-8 lg:p-12">
        
        {/* --- 1. DASHBOARD VIEW --- */}
        {view === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-10 text-center">
              <h1 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Welcome, {profileName}!</h1>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700">{darkMode ? '☀️' : '🌙'}</button>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-b-8 border-emerald-500 shadow-lg text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Price</p>
                <h2 className={`text-2xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`}>{currency} {savingGoal.toLocaleString()}</h2>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-b-8 border-rose-500 shadow-lg text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Spent</p>
                <h2 className={`text-2xl font-black ${darkMode ? 'text-rose-400' : 'text-rose-500'}`}>{currency} {currentMonthSpent.toLocaleString()}</h2>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-b-8 border-indigo-500 shadow-lg text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</p>
                <h2 className={`text-2xl font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>{currency} {(savingGoal - currentMonthSpent).toLocaleString()}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Form */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
                <h3 className={`font-black mb-6 ${darkMode ? 'text-white' : 'text-blue-500'}`}>Add Transaction</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Description" value={text} onChange={(e) => setText(e.target.value)} className={`w-full p-4 rounded-xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border-none outline-none font-bold`} required />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full p-4 rounded-xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border-none outline-none font-bold`}>
                    <option value="Food">Food 🍔</option>
                    <option value="Transport">Transport 🚌</option>
                    <option value="Bills">Bills ⚡</option>
                    <option value="Shopping">Shopping 🛍️</option>
                    <option value="Other">Other 📁</option>
                  </select>
                  <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full p-4 rounded-xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border-none outline-none font-bold`} required />
                  <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Save Entry</button>
                </form>
              </div>

              {/* Enhanced Chart */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 text-center">
                <h3 className={`font-black mb-4 ${darkMode ? 'text-white' : 'text-blue-500'}`}>Monthly Analysis</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={chartData} 
                        cx="50%" cy="50%" 
                        innerRadius={65} outerRadius={85} 
                        paddingAngle={10} dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Expenses List with Edit/Delete */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
              <h3 className={`font-black mb-6 ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Current Month Expenses</h3>
              <div className="space-y-4">
                {currentMonthExpensesList.map(exp => (
                  <div key={exp._id} className={`group flex justify-between items-center p-5 rounded-2xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'} transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{exp.category === 'Food' ? '🍔' : '📁'}</div>
                      <div>
                        <p className={`font-black ${darkMode ? 'text-white' : 'text-slate-700'}`}>{exp.text}</p>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">{exp.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currency} {exp.amount.toLocaleString()}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => { setEditId(exp._id); setText(exp.text); setAmount(exp.amount); setCategory(exp.category); }} className="text-blue-500 text-xs font-bold hover:underline">Edit</button>
                        <button onClick={() => deleteExpense(exp._id)} className="text-rose-500 text-xs font-bold hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 2. HISTORY VIEW --- */}
        {view === 'history' && (
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Expense Ledger</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-center">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border-b-4 border-emerald-500">
                <p className="text-[10px] font-black text-slate-400 uppercase">Target Price</p>
                <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-emerald-500'}`}>{currency} {savingGoal.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border-b-4 border-rose-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</p>
                <p className="text-xl font-black text-rose-500">{currency} {totalSpentHistory.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border-b-4 border-indigo-500">
                <p className="text-[10px] font-black text-slate-400 uppercase">Remaining</p>
                <p className={`text-xl font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>{currency} {(savingGoal - totalSpentHistory).toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border-b-4 border-amber-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entries Count</p>
                <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-amber-500'}`}>{historyExpensesList.length}</p>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <select onChange={(e) => setSelectedMonth(Number(e.target.value))} value={selectedMonth} className={`p-4 rounded-xl font-bold shadow-sm outline-none ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-indigo-600'}`}>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear} className={`p-4 rounded-xl font-bold shadow-sm outline-none ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-indigo-600'}`}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button onClick={downloadHistoryPDF} className="md:ml-auto bg-indigo-600 text-white px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Download PDF Report</button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl">
              <div className="space-y-4">
                {historyExpensesList.map(exp => (
                  <div key={exp._id} className={`flex justify-between items-center p-5 rounded-2xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{exp.category === 'Food' ? '🍔' : '📁'}</div>
                      <p className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{exp.text}</p>
                    </div>
                    <span className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rs. {exp.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 3. PROFILE VIEW --- */}
        {view === 'profile' && (
          <div className="max-w-2xl mx-auto py-10">
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center border border-slate-100 dark:border-slate-700">
              <div className="relative group cursor-pointer" onClick={() => {
                const newEmoji = prompt("Change profile Emoji:", profilePic);
                if(newEmoji) setProfilePic(newEmoji);
              }}>
                <div className="w-32 h-32 bg-indigo-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl mb-6 shadow-inner border-4 border-white dark:border-slate-700 transition-transform group-hover:scale-105">
                  {profilePic}
                </div>
                <div className="absolute bottom-6 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white">✏️</div>
              </div>
              <h2 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-indigo-600'}`}>{profileName}</h2>
              <div className="w-full space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Display Name</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className={`w-full p-5 rounded-2xl border-none outline-none font-black ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-indigo-600'}`} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Monthly Saving Target ({currency})</label>
                  <input type="number" value={savingGoal} onChange={(e) => setSavingGoal(e.target.value)} className={`w-full p-5 rounded-2xl border-none outline-none font-black ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-indigo-600'}`} />
                </div>
                <button className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">Update Profile</button>
              </div>
            </div>
          </div>
        )}

        {/* --- 4. SETTINGS VIEW --- */}
        {view === 'settings' && (
          <div className="max-w-2xl mx-auto py-10">
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-slate-700 text-center">
              <h2 className={`text-2xl font-black mb-8 ${darkMode ? 'text-white' : 'text-blue-400'}`}>App Preferences</h2>
              <div className="space-y-6">
                <div className={`flex justify-between items-center p-6 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <span className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Dark Mode Theme</span>
                  <button onClick={() => setDarkMode(!darkMode)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${darkMode ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {darkMode ? "ON" : "OFF"}
                  </button>
                </div>
                <div className={`flex justify-between items-center p-6 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <span className={`font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Currency</span>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`bg-transparent font-black outline-none border-none ${darkMode ? 'text-white' : 'text-indigo-600'}`}>
                    <option value="LKR">LKR (Rs.)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="pt-8 mt-8 border-t dark:border-slate-700">
                  <h4 className="text-rose-500 font-black text-xs uppercase mb-4 tracking-widest text-left">Security</h4>
                  <input type="password" placeholder="New Password" className={`w-full p-5 rounded-2xl outline-none font-bold mb-4 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`} />
                  <button className="bg-rose-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md">Change Password</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;