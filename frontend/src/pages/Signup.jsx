import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/signup', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Signup</button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;