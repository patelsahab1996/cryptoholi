import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Key, HeadphonesIcon, HelpCircle, InfoIcon, LogOut, X, Crown, Send, ChevronRight, ArrowDownToLine, ArrowUpFromLine, Wallet, AlertCircle, Mail, Star, Copy, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, supabase, updateUserProfile, getPaymentAddresses } from '../lib/supabase';

interface WalletAddress {
  id: string;
  network: string;
  address: string;
  qr_code_url: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<{
    username: string;
    full_name: string | null;
  } | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showTransactionPasswordChangeModal, setShowTransactionPasswordChangeModal] = useState(false);
  const [showEmailSentMessage, setShowEmailSentMessage] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
  const [copySuccess, setCopySuccess] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState<Record<string, WalletAddress>>({});
  const [withdrawForm, setWithdrawForm] = useState({
    asset: 'usdt',
    network: 'trc20',
    amount: '',
    address: '',
    transactionPassword: ''
  });

  const networkOptions = {
    btc: ['Bitcoin Network'],
    eth: ['ERC20'],
    usdt: ['TRC20', 'ERC20']
  };

  const minWithdrawal = {
    btc: 0.001,
    eth: 0.01,
    usdt: 20
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session.data.session?.user.id) {
          const userProfile = await getUserProfile(session.data.session.user.id);
          if (userProfile) {
            setProfile({
              username: userProfile.username,
              full_name: userProfile.full_name,
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    const loadPaymentAddresses = async () => {
      try {
        const addresses = await getPaymentAddresses();
        const addressMap = addresses.reduce((acc: Record<string, WalletAddress>, curr: WalletAddress) => {
          acc[curr.network] = curr;
          return acc;
        }, {});
        setWalletAddresses(addressMap);
      } catch (error) {
        console.error('Error loading payment addresses:', error);
      }
    };

    loadProfile();
    loadPaymentAddresses();
  }, []);

  const handlePasswordChange = () => {
    setShowPasswordChangeModal(true);
  };

  const handleTransactionPasswordChange = () => {
    setShowTransactionPasswordChangeModal(true);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleWithdrawSubmit = () => {
    setShowPasswordError(true);
    setTimeout(() => setShowPasswordError(false), 3000);
  };

  const handlePasswordChangeSubmit = () => {
    setShowEmailSentMessage(true);
    setTimeout(() => {
      setShowEmailSentMessage(false);
      setShowPasswordChangeModal(false);
    }, 3000);
  };

  const handleTransactionPasswordChangeSubmit = () => {
    setShowEmailSentMessage(true);
    setTimeout(() => {
      setShowEmailSentMessage(false);
      setShowTransactionPasswordChangeModal(false);
    }, 3000);
  };

  const handleCopyAddress = async () => {
    if (!walletAddresses[selectedNetwork]) return;
    try {
      await navigator.clipboard.writeText(walletAddresses[selectedNetwork].address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const isProUser = profile?.username === 'SAM1996';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Change Login Password</h2>
              <button onClick={() => setShowPasswordChangeModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-500/10 text-blue-400 p-4 rounded-lg text-sm flex items-start gap-2">
                <Mail className="flex-shrink-0 mt-0.5" size={20} />
                <p>A verification email will be sent to your registered email address to confirm this change.</p>
              </div>
              <button
                onClick={handlePasswordChangeSubmit}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
              >
                Send Verification Email
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransactionPasswordChangeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Change Transaction Password</h2>
              <button onClick={() => setShowTransactionPasswordChangeModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-500/10 text-blue-400 p-4 rounded-lg text-sm flex items-start gap-2">
                <Mail className="flex-shrink-0 mt-0.5" size={20} />
                <p>A verification email will be sent to your registered email address to confirm this change.</p>
              </div>
              <button
                onClick={handleTransactionPasswordChangeSubmit}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
              >
                Send Verification Email
              </button>
            </div>
          </div>
        </div>
      )}

      {showEmailSentMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Mail size={20} />
          Verification email sent successfully!
        </div>
      )}

      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Deposit</h2>
              <button onClick={() => setShowDepositModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedNetwork('TRC20')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-sm transition-colors ${
                    selectedNetwork === 'TRC20'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  TRC20
                </button>
                <button
                  onClick={() => setSelectedNetwork('ERC20')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-sm transition-colors ${
                    selectedNetwork === 'ERC20'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  ERC20
                </button>
              </div>

              {walletAddresses[selectedNetwork] && (
                <>
                  <div className="flex justify-center">
                    <div className="bg-white p-2 rounded-lg">
                      <img
                        src={walletAddresses[selectedNetwork].qr_code_url}
                        alt={`${selectedNetwork} QR Code`}
                        className="w-32 h-32"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{selectedNetwork} Address</span>
                      <button
                        onClick={handleCopyAddress}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                      >
                        <Copy size={12} />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs font-mono break-all">{walletAddresses[selectedNetwork].address}</p>
                  </div>

                  <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-lg text-xs">
                    <div className="flex items-start gap-1">
                      <AlertCircle className="flex-shrink-0 mt-0.5" size={14} />
                      <div>
                        Please send only {selectedNetwork === 'TRC20' ? 'USDT-TRC20' : 'USDT-ERC20'} to this address.
                        Other cryptocurrencies may result in permanent loss.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Withdraw</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleWithdrawSubmit(); }} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Asset</label>
                <select 
                  value={withdrawForm.asset}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, asset: e.target.value, network: 'trc20' })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                  <option value="usdt">Tether (USDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Network</label>
                <select 
                  value={withdrawForm.network}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, network: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm"
                >
                  {networkOptions[withdrawForm.asset as keyof typeof networkOptions].map(network => (
                    <option key={network} value={network.toLowerCase().replace(' ', '')}>{network}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={withdrawForm.address}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, address: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter withdrawal address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm"
                  placeholder={`Min. ${minWithdrawal[withdrawForm.asset as keyof typeof minWithdrawal]} ${withdrawForm.asset.toUpperCase()}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Transaction Password</label>
                <input
                  type="password"
                  value={withdrawForm.transactionPassword}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, transactionPassword: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter transaction password"
                />
                {showPasswordError && (
                  <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} />
                    Wrong transaction password
                  </p>
                )}
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-xs">
                <div className="flex justify-between font-medium">
                  <span>You will receive</span>
                  <span>{withdrawForm.amount ? Number(withdrawForm.amount) : 0} {withdrawForm.asset.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !withdrawForm.address || !withdrawForm.amount || !withdrawForm.transactionPassword}
                  className={`flex-1 px-4 py-2 bg-blue-500 rounded-lg text-sm transition-all duration-300 ${
                    submitting || !withdrawForm.address || !withdrawForm.amount || !withdrawForm.transactionPassword
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-600'
                  }`}
                >
                  {submitting ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/market')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Profile
          </h1>
        </div>

        <div className="space-y-4">
          {/* Quick Actions Box */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Quick Actions</h3>
                <p className="text-xs text-gray-500">Manage your funds easily</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm font-medium"
                >
                  <ArrowDownToLine size={16} />
                  Deposit
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm font-medium"
                >
                  <ArrowUpFromLine size={16} />
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Box */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
                    <User size={32} className="text-gray-400 relative z-10" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold truncate">
                    @{profile?.username || 'Loading...'}
                  </h2>
                  {isProUser && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-black text-xs font-medium">
                      <Crown size={12} />
                      <span>PRO</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {profile?.full_name || 'Set your display name'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Security Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-400">Login Password</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••"
                    disabled
                  />
                  <button 
                    onClick={handlePasswordChange}
                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <Key size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-400">Transaction Password</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••"
                    disabled
                  />
                  <button 
                    onClick={handleTransactionPasswordChange}
                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <Key size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-400">Quick Actions</h3>
            <button 
              onClick={() => setShowContactModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left text-sm"
            >
              <HeadphonesIcon size={16} className="text-blue-400" />
              <span>Customer Service</span>
            </button>

            <button 
              onClick={() => setShowHelpModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left text-sm"
            >
              <HelpCircle size={16} className="text-green-400" />
              <span>Help Center</span>
            </button>

            <button 
              onClick={() => setShowAboutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left text-sm"
            >
              <InfoIcon size={16} className="text-purple-400" />
              <span>About Us</span>
            </button>

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-left text-sm"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}