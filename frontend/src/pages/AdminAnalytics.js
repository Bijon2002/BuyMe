import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import API from '../api/axiosConfig';

const COLORS = ['#73152e', '#febd69', '#38a169', '#3182ce', '#805ad5'];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/admin/orders'); // Fetch all orders for analytics
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
    // Process Status Distribution (Pie Chart)
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'Pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    setOrderData(pieData);

    // Process Revenue Over Time (Area Chart)
    // Group by Date (YYYY-MM-DD)
    const revMap = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(order.amount || 0);
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(revMap).sort();
    
    // Format for Recharts
    const areaData = sortedDates.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revMap[date]
    }));

    setRevenueData(areaData);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="section-top mb-4">
        <div>
          <h3 className="section-title">Store Analytics</h3>
          <p className="section-desc">Interactive insights into your sales performance</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Revenue Area Chart */}
        <div className="col-12 col-lg-8">
          <div className="card-premium p-4 h-100">
            <h4 className="mb-4" style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.25rem' }}>Revenue Trends</h4>
            {revenueData.length > 0 ? (
                <div style={{ height: '350px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
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
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                        labelStyle={{ fontWeight: 'bold', color: 'var(--secondary)' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#73152e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            ) : (
                <div className="d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                    <p className="text-muted">Not enough data to display revenue trends.</p>
                </div>
            )}
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="col-12 col-lg-4">
          <div className="card-premium p-4 h-100">
            <h4 className="mb-4" style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.25rem' }}>Order Status</h4>
            {orderData.length > 0 ? (
                <div style={{ height: '350px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
            ) : (
                <div className="d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                    <p className="text-muted">No order status data available.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
