import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParams = searchParams.get('redirect');
  const { signInWithGoogle, signInWithEmail, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Logged in successfully!');
      navigate(redirectParams || '/');
    } catch (error: any) {
      const msg = error.message || 'Failed to login';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Logged in successfully!');
      navigate(redirectParams || '/');
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to log in with Google');
      }
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto my-8 bg-white border border-slate-100">
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
          alt="Login" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
        />
        <div className="relative z-10 p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">AladaMart</h2>
          <p className="text-lg text-slate-300 max-w-xs mx-auto">Your premium destination for the best products and deals.</p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <h2 className="text-[32px] font-bold text-[#111111] mb-2 leading-tight">
            Welcome back <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default">👋</span>
          </h2>
          <p className="text-slate-500 mb-8">Please enter your details to sign in.</p>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button 
              onClick={handleGoogleLogin} 
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7253 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03296C-0.371021 20.0112 -0.371021 28.0009 3.03296 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4046 -0.068932 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2208L11.0139 19.4027C12.91 13.7323 18.2275 9.49932 24.48 9.49932Z" fill="#EA4335"/>
              </svg>
              <span className="font-semibold text-slate-700 text-[15px]">Sign in with Google</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm font-medium text-slate-400">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email address</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                placeholder="Ex. you@email.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                <span className="text-sm font-medium text-slate-600">Remember me</span>
              </label>
              <button onClick={handleForgotPassword} type="button" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-[16px] transition-colors mt-4 shadow-sm"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-[15px] text-slate-600">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
