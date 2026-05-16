import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-[80vh] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        <h2 className="text-[32px] font-bold text-[#111111] mb-8 leading-tight">
          Welcome back to<br />AladaMart <span className="inline-block origin-bottom-right rotate-12">🙌</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button 
            onClick={handleGoogleLogin} 
            type="button"
            className="flex items-center justify-center gap-3 w-full py-3.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
              <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7253 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
              <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03296C-0.371021 20.0112 -0.371021 28.0009 3.03296 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
              <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4046 -0.068932 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2208L11.0139 19.4027C12.91 13.7323 18.2275 9.49932 24.48 9.49932Z" fill="#EA4335"/>
            </svg>
            <span className="font-semibold text-[#333333] text-[15px]">Google</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-sm font-medium text-slate-400 lowercase">or</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#111111]" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all bg-white"
              placeholder="budarina@gmail.com"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#111111]" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all bg-white font-medium"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[5px] checked:bg-[#111111] checked:border-[#111111] transition-colors cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[15px] font-medium text-[#111111]">Remember me</span>
            </label>
            <button onClick={handleForgotPassword} type="button" className="text-[15px] font-medium text-slate-500 hover:text-[#111111] underline decoration-slate-300 hover:decoration-[#111111] underline-offset-4 transition-all">
              Forgot password?
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-[#111111] hover:bg-black text-white rounded-xl font-semibold text-[16px] transition-colors mt-2"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[15px] font-medium text-slate-500">
          Don't have an account? <Link to="/register" className="text-[#111111] hover:underline underline-offset-4 decoration-[#111111]">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
