// app/dashboard/analytics/page.tsx
"use client";

import React, { useMemo } from 'react';
import useSWR from 'swr';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { fetcher, API_ENDPOINTS } from '../lib/data';
import { Icons } from '../components/icons';
import { Sale, Expense, Medicine } from '../types';

export default function AnalyticsPage() {
    const { data: sales } = useSWR<Sale[]>(API_ENDPOINTS.sales, fetcher);
    const { data: expenses } = useSWR<Expense[]>(API_ENDPOINTS.expenses, fetcher);
    const { data: medicines } = useSWR<Medicine[]>(API_ENDPOINTS.medicines, fetcher);

    // Process Sales Data for Chart
    const chartData = useMemo(() => {
        if (!sales || !expenses) return [];

        // Group by date (last 7 days or all available)
        const groups: Record<string, { date: string; revenue: number; expenses: number; profit: number }> = {};

        sales.forEach(sale => {
            const date = new Date(sale.date).toLocaleDateString();
            if (!groups[date]) groups[date] = { date, revenue: 0, expenses: 0, profit: 0 };
            groups[date].revenue += parseFloat(sale.totalAmount.replace('$', ''));
            groups[date].profit += parseFloat(sale.profit.replace('$', ''));
        });

        expenses.forEach(exp => {
            const date = new Date(exp.date).toLocaleDateString();
            if (!groups[date]) groups[date] = { date, revenue: 0, expenses: 0, profit: 0 };
            groups[date].expenses += parseFloat(exp.amount.replace('$', ''));
        });

        return Object.values(groups).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
    }, [sales, expenses]);

    // Stock distribution data
    const stockData = useMemo(() => {
        if (!medicines) return [];
        const lowStock = medicines.filter(m => m.stock < 20).length;
        const healthyStock = medicines.length - lowStock;
        return [
            { name: 'Healthy', value: healthyStock, color: '#10b981' },
            { name: 'Low Stock', value: lowStock, color: '#f43f5e' }
        ];
    }, [medicines]);

    const stats = useMemo(() => {
        const totalRevenue = sales?.reduce((acc, s) => acc + parseFloat(s.totalAmount.replace('$', '')), 0) || 0;
        const totalExpenses = expenses?.reduce((acc, e) => acc + parseFloat(e.amount.replace('$', '')), 0) || 0;
        const totalProfit = sales?.reduce((acc, s) => acc + parseFloat(s.profit.replace('$', '')), 0) || 0;

        return {
            revenue: `$${totalRevenue.toLocaleString()}`,
            expenses: `$${totalExpenses.toLocaleString()}`,
            profit: `$${totalProfit.toLocaleString()}`,
            margin: totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'
        };
    }, [sales, expenses]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={stats.revenue} icon={<Icons.Customers className="w-5 h-5" />} color="cyan" />
                <StatCard title="Total Expenses" value={stats.expenses} icon={<Icons.Expenses className="w-5 h-5" />} color="rose" />
                <StatCard title="Net Profit" value={stats.profit} icon={<Icons.Reports className="w-5 h-5" />} color="emerald" />
                <StatCard title="Avg. Margin" value={stats.margin} icon={<Icons.Medicine className="w-5 h-5" />} color="teal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue vs Expenses Trend */}
                <div className="lg:col-span-2 glass-panel rounded-[32px] p-8 border border-white/5 h-[450px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Performance Overview</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Revenue vs Expenses (Last 7 Days)</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock distribution */}
                <div className="glass-panel rounded-[32px] p-8 border border-white/5 h-[450px] flex flex-col uppercase">
                    <h3 className="text-xl font-bold text-white mb-1">Inventory Health</h3>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-6">Stock Level Distribution</p>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockData}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {stockData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-3xl font-black text-white">{medicines?.length || 0}</p>
                            <p className="text-[10px] text-slate-500 font-medium lowercase">Total Items</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profit Trend */}
                <div className="glass-panel rounded-[32px] p-8 border border-white/5 h-[400px] flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-1">Profit Trend</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">Net Gains Over Time</p>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                                />
                                <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Efficiency Insight */}
                <div className="glass-panel rounded-[32px] p-8 border border-white/5 h-[400px] flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-1">Operational Efficiency</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">Profit Margin Stability</p>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={3} dot={{ fill: '#2dd4bf', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: 'cyan' | 'rose' | 'emerald' | 'teal' }) {
    const colorClasses = {
        cyan: "from-cyan-500/10 to-transparent text-cyan-400 border-cyan-500/20",
        rose: "from-rose-500/10 to-transparent text-rose-400 border-rose-500/20",
        emerald: "from-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/20",
        teal: "from-teal-500/10 to-transparent text-teal-400 border-teal-500/20",
    };

    return (
        <div className={`glass-panel p-6 rounded-[28px] border bg-gradient-to-br ${colorClasses[color]} transition-all hover:scale-105 duration-500`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    {icon}
                </div>
                <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Live</span>
                </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter mb-1">{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
        </div>
    );
}
