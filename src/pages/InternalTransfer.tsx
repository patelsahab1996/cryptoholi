import React, { useState } from 'react';
import { ArrowLeft, Send, Info, AlertCircle, Shield, Crown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../lib/supabase';

export default function InternalTransfer() {
  const navigate = useNavigate();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await getUserByUsername(username);
      if (!user) {
        setError('User not found');
        return;
      }

      // Here you would check if the user has an active plan
      // For now, we'll just show an error
      setError('This feature requires an active membership plan');
      setTimeout(() => {
        setShowUsernameModal(false);
        navigate('/membership');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Enter Username</h2>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Active Plan Member Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter username"
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
                  <p className="flex items-start gap-2">
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <button
                onClick={handleUsernameSubmit}
                disabled={loading || !username.trim()}
                className={`w-full px-6 py-3 bg-blue-500 rounded-lg font-medium transition-all duration-300 ${
                  loading || !username.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600'
                }`}
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/market')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Internal Transfer
          </h1>
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          {/* Prominent Membership Notice */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-xl p-6 border-2 border-yellow-500/50 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="text-yellow-500" size={28} />
                  <h2 className="text-2xl font-bold text-yellow-500">Membership Required</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-400/30 transform hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-3">
                        <Shield className="text-blue-400" size={24} />
                        <div>
                          <h3 className="font-semibold text-blue-400">Basic Plan</h3>
                          <p className="text-blue-300">99 USDT/year - Up to 500 USDT/month</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-400/30 transform hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-3">
                        <Shield className="text-yellow-400" size={24} />
                        <div>
                          <h3 className="font-semibold text-yellow-400">Advance Plan</h3>
                          <p className="text-yellow-300">399 USDT/year - Unlimited USDT & ETH transfers</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-400/30 transform hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-3">
                        <Shield className="text-purple-400" size={24} />
                        <div>
                          <h3 className="font-semibold text-purple-400">Pro Plan</h3>
                          <p className="text-purple-300">999 USDT/year - Unlimited all assets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/membership')}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg transition-all duration-300 font-semibold text-black flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02]"
                  >
                    <Crown size={20} />
                    Upgrade Your Membership Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Reminders */}
          <div className="mb-8">
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Info className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Security Reminders</h3>
                  <ul className="space-y-2 text-blue-200">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Transfers are instant and cannot be reversed
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Double-check recipient's username before confirming
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Keep your transaction password secure
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Contact support immediately for any issues
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Recipient Username</label>
              <input
                type="text"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipient's username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Asset</label>
              <select className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="usdt">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                min="0"
                step="0.000001"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity to transfer"
              />
            </div>
            <button
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              onClick={() => setShowUsernameModal(true)}
            >
              <Send size={18} />
              KEYLESS TRANSFER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}