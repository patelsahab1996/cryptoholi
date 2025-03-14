import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw, Send, UserCircle, Crown, Wallet, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

function Market() {
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setCryptoData(data);
      setError('');
    } catch (err) {
      setError('Failed to load cryptocurrency data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(marketCap);
  };

  const navigationButtons = [
    {
      icon: Wallet,
      label: 'Total Assets',
      path: '/total-assets',
      className: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Send,
      label: 'Internal Transfer',
      path: '/internal-transfer',
      className: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: UserCircle,
      label: 'Profile',
      path: '/profile',
      className: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Crown,
      label: 'Membership',
      path: '/membership',
      className: 'bg-yellow-500 hover:bg-yellow-600 text-black'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Navigation Bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            {navigationButtons.map((button) => (
              <button
                key={button.label}
                onClick={() => navigate(button.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${button.className}`}
              >
                <button.icon size={16} />
                <span>{button.label}</span>
              </button>
            ))}
          </div>

          {/* Market Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Crypto Market
            </h1>

            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search cryptocurrency..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={fetchCryptoData}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Crypto Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="py-4 px-4 text-left">Asset</th>
                  <th className="py-4 px-4 text-right">Price</th>
                  <th className="py-4 px-4 text-right">24h Change</th>
                  <th className="hidden md:table-cell py-4 px-4 text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={20} className="animate-spin" />
                        Loading market data...
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No cryptocurrencies found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((crypto) => (
                    <tr key={crypto.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-sm text-gray-400 uppercase">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatPrice(crypto.current_price)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-4 px-4 text-right text-gray-300">
                        {formatMarketCap(crypto.market_cap)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Market;