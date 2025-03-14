import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bitcoin, Feather as Ethereum, Wallet, DollarSign, Eye, EyeOff, Square, Lock } from 'lucide-react';
import { supabase, getUserByUsername, createUserProfile, setupRealtimeSubscriptions } from './lib/supabase';
import ProtectedRoute from './components/ProtectedRoute';
import Market from './pages/Market';
import TotalAssets from './pages/TotalAssets';
import InternalTransfer from './pages/InternalTransfer';
import Profile from './pages/Profile';
import Membership from './pages/Membership';

function FloatingLogo({ icon: Icon, className }: { icon: any, className: string }) {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    speed: 0.5 + Math.random() * 0.5
  });

  useEffect(() => {
    const animate = () => {
      setPosition(prev => ({
        ...prev,
        y: (prev.y + prev.speed) % 100
      }));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`absolute opacity-5 ${className} hidden md:block`}
      style={{ 
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Icon size={48} />
    </div>
  );
}

function CageLogo() {
  return (
    <div className="relative w-16 h-16 transform hover:scale-105 transition-transform duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl transform rotate-45"></div>
      <div className="absolute inset-2 bg-gray-900 rounded-lg transform rotate-45"></div>
      <div className="absolute inset-0 transform -rotate-45">
        <div className="absolute inset-0 flex flex-col justify-between p-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-0.5 bg-blue-400 opacity-50"></div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-row justify-between p-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-full w-0.5 bg-blue-400 opacity-50"></div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
        <Bitcoin className="w-8 h-8 text-yellow-500 animate-pulse" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg">
        <Lock className="w-4 h-4 text-white" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-10 rounded-xl transform rotate-45"></div>
    </div>
  );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showTransactionPassword, setShowTransactionPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    transactionPassword: '',
    confirmTransactionPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const userProfile = await getUserByUsername(formData.username);
        if (!userProfile) {
          throw new Error('Invalid username or password');
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userProfile.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
        window.location.href = '/market';
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.transactionPassword !== formData.confirmTransactionPassword) {
          throw new Error('Transaction passwords do not match');
        }

        const existingUser = await getUserByUsername(formData.username);
        if (existingUser) {
          throw new Error('Username already taken');
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              email_confirmed: true
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('Failed to create user');

        await createUserProfile(signUpData.user.id, {
          username: formData.username,
          email: formData.email,
          full_name: formData.fullName,
          transaction_password: formData.transactionPassword
        });

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
        window.location.href = '/market';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <FloatingLogo icon={Bitcoin} className="text-yellow-500" />
        <FloatingLogo icon={Ethereum} className="text-purple-400" />
        <FloatingLogo icon={Wallet} className="text-blue-400" />
        <FloatingLogo icon={DollarSign} className="text-green-400" />
        <FloatingLogo icon={Bitcoin} className="text-yellow-500" />
        <FloatingLogo icon={Ethereum} className="text-purple-400" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CageLogo />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              CryptoKit
            </h1>
            <p className="text-gray-400">Your fortress for digital assets</p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-xl p-6 md:p-8 shadow-xl border border-gray-700">
            <div className="flex mb-8">
              <button
                className={`flex-1 py-2 text-center transition-colors ${isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 border-b border-gray-700'}`}
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                  setFormData({
                    ...formData,
                    username: '',
                    password: ''
                  });
                }}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 text-center transition-colors ${!isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 border-b border-gray-700'}`}
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                  setFormData({
                    fullName: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    transactionPassword: '',
                    confirmTransactionPassword: ''
                  });
                }}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {!isLogin ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transaction Password
                      <span className="text-xs text-gray-400 ml-2">(for secure transactions)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showTransactionPassword ? 'text' : 'password'}
                        name="transactionPassword"
                        value={formData.transactionPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Create transaction password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowTransactionPassword(!showTransactionPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showTransactionPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Transaction Password</label>
                    <div className="relative">
                      <input
                        type={showTransactionPassword ? 'text' : 'password'}
                        name="confirmTransactionPassword"
                        value={formData.confirmTransactionPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Confirm transaction password"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-medium transition-colors ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-assets"
          element={
            <ProtectedRoute>
              <TotalAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internal-transfer"
          element={
            <ProtectedRoute>
              <InternalTransfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membership"
          element={
            <ProtectedRoute>
              <Membership />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;