import React, { useState, useEffect } from 'react';
import { Building2, Recycle, Leaf, Wallet, TrendingUp, Package, Users, DollarSign } from 'lucide-react';

const CompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    company: {
      name: '',
      companyType: '',
      walletAddress: '',
      isVerified: false
    },
    stats: {
      totalProcessedItems: 0,
      totalCarbonCredits: 0,
      totalEthBalance: 0,
      totalInvestment: 0
    },
    recentItems: []
  });
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [processingItem, setProcessingItem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailableItems();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/company/dashboard/${companyId}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableItems = async () => {
    try {
      const response = await fetch('/api/company/available-items');
      const data = await response.json();
      setAvailableItems(data);
    } catch (error) {
      console.error('Error fetching available items:', error);
    }
  };

  const handleProcessItem = async (itemId) => {
    try {
      setProcessingItem(itemId);
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/company/process-item/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId,
          carbonCreditsGenerated: Math.floor(Math.random() * 3) + 1
        })
      });

      if (response.ok) {
        await fetchDashboardData();
        await fetchAvailableItems();
      }
    } catch (error) {
      console.error('Error processing item:', error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleInvestment = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch('/api/company/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId,
          amount: parseFloat(investmentAmount)
        })
      });

      if (response.ok) {
        setInvestmentAmount('');
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error making investment:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {dashboardData.company.name}
                </h1>
                <p className="text-sm text-gray-500">{dashboardData.company.companyType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {dashboardData.company.walletAddress.slice(0, 6)}...{dashboardData.company.walletAddress.slice(-4)}
                </span>
              </div>
              {dashboardData.company.isVerified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Items Processed"
            value={dashboardData.stats.totalProcessedItems}
            subtitle="Total recycled"
            color="bg-blue-500"
          />
          <StatCard
            icon={Leaf}
            title="Carbon Credits"
            value={dashboardData.stats.totalCarbonCredits}
            subtitle="Credits earned"
            color="bg-green-500"
          />
          <StatCard
            icon={DollarSign}
            title="ETH Balance"
            value={`${dashboardData.stats.totalEthBalance.toFixed(2)}`}
            subtitle="Available balance"
            color="bg-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Investment"
            value={`${dashboardData.stats.totalInvestment.toFixed(2)} ETH`}
            subtitle="Platform investment"
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Items for Processing */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Recycle className="w-5 h-5 text-green-600 mr-2" />
              Available Items for Processing
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items available for processing</p>
              ) : (
                availableItems.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.type}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}kg</p>
                        <p className="text-sm text-gray-500">
                          User: {item.user?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Collector: {item.assignedMiddleman?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {item.ethValue.toFixed(3)} ETH
                        </p>
                        <button
                          onClick={() => handleProcessItem(item._id)}
                          disabled={processingItem === item._id}
                          className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingItem === item._id ? 'Processing...' : 'Process Item'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Investment Section (for Climate Investors) */}
          {dashboardData.company.companyType === 'Climate Investor' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                Platform Investment
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleInvestment}
                  disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Invest in Platform
                </button>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Investment Benefits:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Earn carbon credits from recycling activities</li>
                    <li>• Support sustainable waste management</li>
                    <li>• Transparent blockchain tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Recent Processed Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 text-purple-600 mr-2" />
              Recent Processed Items
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dashboardData.recentItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items processed yet</p>
              ) : (
                dashboardData.recentItems.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.type}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}kg</p>
                        <p className="text-sm text-gray-500">
                          From: {item.user?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Processed
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Carbon Credits Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              Carbon Credits Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Credits Earned</span>
                <span className="font-semibold text-green-600">{dashboardData.stats.totalCarbonCredits}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Credits per Item (Avg)</span>
                <span className="font-semibold text-gray-900">
                  {dashboardData.stats.totalProcessedItems > 0 
                    ? (dashboardData.stats.totalCarbonCredits / dashboardData.stats.totalProcessedItems).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Carbon Impact:</strong>
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Your company has contributed to recycling {dashboardData.stats.totalProcessedItems} items, 
                  earning {dashboardData.stats.totalCarbonCredits} carbon credits and supporting environmental sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;