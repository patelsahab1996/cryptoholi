import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CryptoAsset {
  name: string;
  symbol: string;
  logo: string;
  quantity: number;
}

export default function TotalAssets() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (profile?.username === 'SAM1996') {
          setAssets([
            {
              name: 'Bitcoin',
              symbol: 'BTC',
              logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              quantity: 7.346621
            },
            {
              name: 'Ethereum',
              symbol: 'ETH',
              logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              quantity: 32.1195
            },
            {
              name: 'Tether',
              symbol: 'USDT',
              logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
              quantity: 484597.02
            }
          ]);
        } else {
          setAssets([
            {
              name: 'Bitcoin',
              symbol: 'BTC',
              logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              quantity: 0
            },
            {
              name: 'Ethereum',
              symbol: 'ETH',
              logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              quantity: 0
            },
            {
              name: 'Tether',
              symbol: 'USDT',
              logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
              quantity: 0
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/market')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Total Assets
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {assets.map((asset) => (
              <div key={asset.symbol} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={asset.logo} alt={asset.name} className="w-12 h-12" />
                    <div>
                      <h3 className="text-xl font-semibold">{asset.name}</h3>
                      <p className="text-gray-400">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{asset.quantity.toLocaleString('en-US', { maximumFractionDigits: 8 })}</div>
                    <div className="text-sm text-gray-400">{asset.symbol}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}