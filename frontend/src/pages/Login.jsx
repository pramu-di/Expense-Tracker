import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', formData);
            localStorage.setItem('token', res.data.token); // Token එක save කරගන්නවා
            localStorage.setItem('userName', res.data.user.name);
            // Login.jsx ඇතුළේ handleSubmit එකේ මේක වෙනස් කරන්න
            localStorage.setItem('userId', res.data.user.id);
            navigate('/dashboard'); // Dashboard එකට යනවා
        } catch (err) {
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;