import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Check, X, Star, Shield, Bitcoin, Coins, Copy, QrCode, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPaymentAddresses, submitMembershipTransaction } from '../lib/supabase';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  recommended?: boolean;
  icon: any;
  amount: number;
}

interface WalletAddress {
  id: string;
  network: string;
  address: string;
  qr_code_url: string;
  created_at: string;
  updated_at: string;
}

function Membership() {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
  const [copySuccess, setCopySuccess] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState<Record<string, WalletAddress>>({});
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentAddresses = async () => {
      const addresses = await getPaymentAddresses();
      const addressMap = addresses.reduce((acc: Record<string, WalletAddress>, curr: WalletAddress) => {
        acc[curr.network] = curr;
        return acc;
      }, {});
      setWalletAddresses(addressMap);
    };
    loadPaymentAddresses();
  }, []);

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

  const handleSubmitTransaction = async () => {
    if (!selectedPlan || !transactionId.trim()) {
      setError('Please enter a valid transaction ID');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await submitMembershipTransaction({
        plan: selectedPlan.name.toLowerCase(),
        transaction_id: transactionId,
        network: selectedNetwork,
        amount: selectedPlan.amount
      });

      setShowPaymentModal(false);
      setTransactionId('');
      alert('Transaction submitted successfully! Our team will verify your payment shortly.');
    } catch (err) {
      setError('Failed to submit transaction. Please try again.');
      console.error('Transaction submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const plans: Plan[] = [
    {
      name: 'Basic',
      price: '99 USDT',
      period: 'per year',
      icon: Shield,
      amount: 99,
      features: [
        { text: 'Transfer up to 500 USDT per month', included: true },
        { text: 'Basic market data', included: true },
        { text: 'Email support', included: true },
        { text: 'Single device access', included: true },
        { text: 'Basic analytics dashboard', included: true },
        { text: 'Ethereum transfers', included: false },
        { text: 'Bitcoin transfers', included: false },
        { text: 'Priority support', included: false },
      ]
    },
    {
      name: 'Advance',
      price: '399 USDT',
      period: 'per year',
      icon: Coins,
      amount: 399,
      recommended: true,
      features: [
        { text: 'Unlimited USDT transfers', included: true },
        { text: 'Unlimited Ethereum transfers', included: true },
        { text: 'Real-time market data', included: true },
        { text: 'Priority support', included: true },
        { text: 'Multi-device access', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Custom price alerts', included: true },
        { text: 'Bitcoin transfers', included: false },
      ]
    },
    {
      name: 'Pro',
      price: '999 USDT',
      period: 'per year',
      icon: Crown,
      amount: 999,
      features: [
        { text: 'Unlimited Bitcoin transfers', included: true },
        { text: 'Unlimited Ethereum transfers', included: true },
        { text: 'Unlimited USDT transfers', included: true },
        { text: 'Premium market insights', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'API access', included: true },
        { text: 'Custom reports', included: true },
        { text: 'Trading automation', included: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Purchase {selectedPlan.name} Plan</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-xl font-bold text-blue-400">{selectedPlan.price}</p>
                <p className="text-sm text-gray-400">{selectedPlan.period}</p>
              </div>

              <div className="flex gap-2 mb-3">
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
                  <div className="flex justify-center mb-4">
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
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID"
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 p-2 rounded-lg text-xs">
                  <p className="flex items-start gap-1">
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={14} />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-lg text-xs">
                <p className="flex items-start gap-1">
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={14} />
                  <span>
                    Please send only {selectedNetwork === 'TRC20' ? 'USDT-TRC20' : 'USDT-ERC20'} to this address.
                    Other cryptocurrencies may result in permanent loss.
                  </span>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTransaction}
                  disabled={submitting || !transactionId.trim()}
                  className={`flex-1 px-4 py-2 bg-blue-500 rounded-lg text-sm transition-all duration-300 ${
                    submitting || !transactionId.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-600'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/market')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Membership Plans
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`bg-gray-800 rounded-xl p-8 relative transform hover:scale-105 transition-all duration-300 ${
                  plan.recommended ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full font-medium text-sm flex items-center gap-1">
                    <Star size={14} />
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-gray-700 rounded-full mb-4">
                    <Icon size={24} className={`${
                      plan.name === 'Basic' ? 'text-blue-400' :
                      plan.name === 'Advance' ? 'text-yellow-400' :
                      'text-purple-400'
                    }`} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <div className="text-4xl font-bold mb-1">{plan.price}</div>
                  <div className="text-gray-400">{plan.period}</div>
                  <div className="mt-2 text-sm text-gray-400">
                    {plan.name === 'Basic' ? 'Perfect for USDT traders' :
                     plan.name === 'Advance' ? 'Ideal for ETH & USDT traders' :
                     'Complete access to all cryptocurrencies'}
                  </div>
                </div>
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 ${
                        feature.included ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {feature.included ? (
                        <Check
                          size={18}
                          className={
                            plan.name === 'Basic' ? 'text-blue-400' :
                            plan.name === 'Advance' ? 'text-yellow-400' :
                            'text-purple-400'
                          }
                        />
                      ) : (
                        <X
                          size={18}
                          className="text-red-500"
                        />
                      )}
                      {feature.text}
                    </div>
                  ))}
                </div>
                <button
                  className={`w-full mt-8 px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                    plan.name === 'Basic' 
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : plan.name === 'Advance'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowPaymentModal(true);
                  }}
                >
                  BUY NOW
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>All plans include:</p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              24/7 Security
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              99.9% Uptime
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              Secure Wallet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membership;