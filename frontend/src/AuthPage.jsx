import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthPage({ loginUser }) {
  const [authMode, setAuthMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
      if (authMode === 'login') {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Login failed');

        if(loginUser) loginUser(data.email, data.access_token);
        navigate('/', { state: { openProfile: true } });

      } else if (authMode === 'register') {
        const name = e.target.querySelector('input[type="text"]').value;
        
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Registration failed');

        const loginRes = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const loginData = await loginRes.json();
        if(loginUser) loginUser(loginData.email, loginData.access_token);
        navigate('/', { state: { openProfile: true } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    if(loginUser) loginUser(`${platform.toLowerCase()}@verified.com`, 'dummy_social_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <div className="hidden lg:flex w-1/2 bg-blue-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tight mb-6">Unlock Premium Travel Experiences.</h1>
          <p className="text-blue-200 text-lg mb-8 max-w-md">Join millions of travelers who trust AeroX for the lowest fares, instant refunds, and 24/7 global support.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><CheckCircle2 className="text-blue-400"/> <span>Zero Convenience Fees on Domestic Flights</span></div>
            <div className="flex items-center gap-3"><CheckCircle2 className="text-blue-400"/> <span>Complimentary Lounge Access for Pro Members</span></div>
            <div className="flex items-center gap-3"><CheckCircle2 className="text-blue-400"/> <span>Secure, 256-bit Encrypted Transactions</span></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <Plane className="w-8 h-8 rotate-45" />
            <span className="text-2xl font-black text-gray-900">AERO<span className="text-blue-600">X</span></span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle className="w-5 h-5"/> {error}
            </div>
          )}

          {authMode === 'login' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-2 text-gray-900">Sign in to your account</h2>
              <p className="text-gray-500 text-sm font-medium mb-6">Access your bookings, saved details, and exclusive offers.</p>
              
              <button onClick={() => handleSocialLogin('Google')} className="w-full mb-3 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 p-3 rounded-xl font-bold hover:bg-gray-50 transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" alt="Google"/> Google
              </button>
              <button onClick={() => handleSocialLogin('Facebook')} className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white p-3 rounded-xl font-bold hover:bg-[#166fe5] transition cursor-pointer">
                 Facebook
              </button>
              
              <div className="flex items-center gap-4 mb-6 mt-4"><div className="h-[1px] bg-gray-200 flex-1"/><span className="text-xs font-bold text-gray-400 uppercase">OR EMAIL</span><div className="h-[1px] bg-gray-200 flex-1"/></div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input type="email" required placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input type="password" required minLength="6" placeholder="Password" className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition" />
                </div>
                
                <div className="flex justify-end">
                  <span onClick={() => setAuthMode('forgot')} className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">Forgot Password?</span>
                </div>
                
                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70">
                  {loading ? 'Authenticating...' : 'Secure Log In'} <ArrowRight className="w-5 h-5"/>
                </button>
              </form>
              
              <p className="text-center text-sm text-gray-500 font-medium mt-8">
                Don't have an account? <span onClick={() => {setAuthMode('register'); setError('');}} className="text-blue-600 font-bold cursor-pointer hover:underline">Create Account</span>
              </p>
            </div>
          )}

          {authMode === 'register' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-2 text-gray-900">Create your account</h2>
              <p className="text-gray-500 text-sm font-medium mb-8">Join today and get 10% off your first flight booking.</p>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input type="text" required placeholder="Full Legal Name" className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input type="email" required placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input type="password" required minLength="6" placeholder="Create Password" className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition" />
                </div>
                
                <button disabled={loading} type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-gray-800 transition shadow-lg flex justify-center items-center gap-2 mt-2 cursor-pointer disabled:opacity-70">
                  {loading ? 'Creating...' : 'Create Account'} <ArrowRight className="w-5 h-5"/>
                </button>
              </form>
              
              <p className="text-center text-sm text-gray-500 font-medium mt-8">
                Already have an account? <span onClick={() => {setAuthMode('login'); setError('');}} className="text-blue-600 font-bold cursor-pointer hover:underline">Sign In</span>
              </p>
            </div>
          )}

          {authMode === 'forgot' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-2 text-gray-900">Reset Password</h2>
              <p className="text-gray-500 text-sm font-medium mb-8">Enter your registered email and we'll send you a secure reset link.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Reset link sent to your email.'); setAuthMode('login'); }} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input type="email" required placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium transition" />
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2 cursor-pointer">
                  Send Reset Link <ShieldCheck className="w-5 h-5"/>
                </button>
              </form>
              
              <p className="text-center text-sm text-gray-500 font-medium mt-8">
                Remember your password? <span onClick={() => setAuthMode('login')} className="text-blue-600 font-bold cursor-pointer hover:underline">Back to Login</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}