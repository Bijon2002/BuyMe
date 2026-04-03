import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import API from '../api/axiosConfig';
import CountUpNumber from '../components/CountUpNumber';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

const COLORS = ['#73152e', '#febd69', '#38a169', '#3182ce', '#805ad5'];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({ totalRevenue: 0, avgOrderValue: 0, totalOrders: 0, deliveredOrders: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/admin/orders');
        if (data.success && data.orders) {
          processOrderData(data.orders);
        }
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const processOrderData = (orders) => {
    // Status Distribution
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'Pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
    setOrderData(pieData);

    // Revenue Over Time
    const revMap = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(order.amount || 0);
      return acc;
    }, {});
    const sortedDates = Object.keys(revMap).sort();
    const areaData = sortedDates.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revMap[date]
    }));
    setRevenueData(areaData);

    // Summary
    const totalRevenue = orders.reduce((acc, o) => acc + Number(o.amount || 0), 0);
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    setSummaryStats({
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      totalOrders: orders.length,
      deliveredOrders: delivered
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const summaryCards = [
    { title: 'Total Revenue', value: summaryStats.totalRevenue, prefix: '$', decimals: 2, icon: '💰', bg: 'linear-gradient(135deg, rgba(115,21,46,0.08), rgba(254,189,105,0.08))' },
    { title: 'Avg Order Value', value: summaryStats.avgOrderValue, prefix: '$', decimals: 2, icon: '📊', bg: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(147,197,253,0.08))' },
    { title: 'Total Orders', value: summaryStats.totalOrders, icon: '🛍️', bg: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.08))' },
    { title: 'Delivered', value: summaryStats.deliveredOrders, icon: '✅', bg: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(252,211,77,0.08))' },
  ];

  return (
    <div className="admin-page">
      <h2 className="page-title" data-aos="fade-down">Store Analytics</h2>

      {/* Summary Stat Cards */}
      <div className="admin-stats-grid mb-4">
        {summaryCards.map((card, i) => (
          <motion.div 
            key={card.title} 
            className="admin-stat-card" 
            style={{ background: card.bg }}
            data-aos="fade-up" 
            data-aos-delay={i * 100}
            whileHover={{ y: -5 }}
          >
            <div style={{ fontSize: '2rem' }}>{card.icon}</div>
            <div>
              <p className="admin-stat-label">{card.title}</p>
              <h3 className="admin-stat-value">
                <CountUpNumber end={card.value} prefix={card.prefix || ''} decimals={card.decimals || 0} />
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="row g-4">
        {/* Revenue Area Chart */}
        <div className="col-12 col-lg-8" data-aos="fade-up" data-aos-delay="100">
          <div className="admin-table-container" style={{ padding: '2rem' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              <i className="fas fa-chart-area mr-2" style={{ color: 'var(--primary)' }}></i> Revenue Trends
            </h4>
            {revenueData.length > 0 ? (
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#73152e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#73152e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12, fill: '#718096' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px 16px' }}
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                      labelStyle={{ fontWeight: 'bold', color: 'var(--primary)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#73152e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                <div className="text-center text-muted">
                  <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '0.5rem' }}>📈</div>
                  <p>Not enough data for revenue trends.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="col-12 col-lg-4" data-aos="fade-up" data-aos-delay="200">
          <div className="admin-table-container" style={{ padding: '2rem' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              <i className="fas fa-chart-pie mr-2" style={{ color: 'var(--secondary-dark)' }}></i> Order Status
            </h4>
            {orderData.length > 0 ? (
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                      {orderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} itemStyle={{ fontWeight: 'bold' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                <div className="text-center text-muted">
                  <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '0.5rem' }}>🥧</div>
                  <p>No order data available.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
