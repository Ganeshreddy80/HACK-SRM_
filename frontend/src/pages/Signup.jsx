import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.detail || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Is backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-6">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 transform transition-all hover:scale-[1.01] duration-500">
                <div className="flex justify-center mb-8">
                    <div className="bg-black text-white p-3 rounded-2xl shadow-lg">
                        <ShieldCheck size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-500 text-center mb-8">Join AI Content Detector today</p>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 focus:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                    >
                        {loading ? 'Sign Up' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
