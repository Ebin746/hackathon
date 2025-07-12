import React, { useState, useEffect } from 'react';
import {
  Building2, Recycle, Leaf, Wallet,
  TrendingUp, Package, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CompanyDashboard() {
  const [dashboardData, setDashboardData] = useState({
    company: { name: '', companyType: '', walletAddress: '', isVerified: false },
    stats: { totalProcessedItems: 19, totalCarbonCredits: 5, totalEthBalance: 10, totalInvestment: 1000 },
    recentItems: []
  });
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [processingItem, setProcessingItem] = useState(null);
  const navigate = useNavigate();

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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, amount: parseFloat(investmentAmount) })
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
    <div style={{
      backgroundColor: '#fff', borderRadius: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '1.5rem', border: '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{title}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{value}</p>
          {subtitle && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{subtitle}</p>}
        </div>
        <div style={{
          padding: '0.75rem', borderRadius: '9999px', backgroundColor: color
        }}>
          <Icon style={{ width: 24, height: 24, color: 'white' }} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #d1fae5', borderTop: '4px solid #10b981', borderRadius: '50%',
            width: 48, height: 48, margin: '0 auto', animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', marginTop: '1rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Building2 style={{ width: 32, height: 32, color: '#10b981', marginRight: '0.75rem' }} />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{dashboardData.company.name}</h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{dashboardData.company.companyType}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
            <Wallet style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: '0.875rem' }}>
              {dashboardData.company.walletAddress.slice(0, 6)}...{dashboardData.company.walletAddress.slice(-4)}
            </span>
          </div>
          {dashboardData.company.isVerified && (
            <span style={{
              backgroundColor: '#d1fae5', color: '#065f46', fontSize: '0.75rem',
              padding: '0.25rem 0.5rem', borderRadius: '9999px'
            }}>
              Verified
            </span>
          )}
          <button
            style={{
              marginLeft: '1rem',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => navigate('/company-verify-delivery')}
          >
            Verify Deliveries
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        maxWidth: '1200px', margin: '2rem auto', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem'
      }}>
        <StatCard icon={Package} title="Items Processed" value={dashboardData.stats.totalProcessedItems} subtitle="Total recycled" color="#3b82f6" />
        <StatCard icon={Leaf} title="Carbon Credits" value={dashboardData.stats.totalCarbonCredits} subtitle="Credits earned" color="#10b981" />
        <StatCard icon={DollarSign} title="ETH Balance" value={dashboardData.stats.totalEthBalance.toFixed(2)} subtitle="Available balance" color="#8b5cf6" />
        <StatCard icon={TrendingUp} title="Total Investment" value={`${dashboardData.stats.totalInvestment.toFixed(2)} ETH`} subtitle="Platform investment" color="#f97316" />
      </div>

      {/* Add more inline-styled blocks here like RecentItems, Investment, Carbon Overview if needed */}
    </div>
  );
}

export default CompanyDashboard;
