import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserIcon, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Email registration is not configured. Please use Google Sign In.');
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to log in with Google');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create an Account</h2>
        <p className="text-slate-500 mb-8 text-center">Sign up to get started</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon size={20} />
              </span>
              <input 
                id="name"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={20} />
              </span>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">Password</label>
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </span>
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
             </div>
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-primary transition-colors shadow-lg mt-4">
            Sign Up
          </button>
        </form>
        
        <div className="mt-8 flex items-center gap-4 before:flex-1 before:h-px before:bg-slate-200 after:flex-1 after:h-px after:bg-slate-200">
          <span className="text-sm font-medium text-slate-400">OR REGISTER WITH</span>
        </div>
        
        <div className="mt-6">
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
            <Chrome size={20} /> Continue with Google
          </button>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
