// app/dashboard/page.tsx
"use client";

import useSWR from "swr";
import { Icons } from "./components/icons";
import { fetcher, API_ENDPOINTS } from "./lib/data";
import { Medicine, Expense, Sale, Setting } from "./types";
import { getExpiryStatus } from "./lib/utils";

interface Stat {
    id: number;
    title: string;
    value: string;
    trend: string;
    color: string;
    warning?: boolean;
}

const StatGrid = ({ stats }: { stats: Stat[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card) => (
            <div key={card.id} className="glass-panel group relative p-6 rounded-[24px] overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.03] blur-3xl transition-opacity group-hover:opacity-[0.08] ${card.color === 'cyan' ? 'bg-cyan-500' : card.color === 'blue' ? 'bg-blue-500' : card.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${card.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : card.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : card.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : 'bg-teal-500/10 text-teal-400'}`}>
                        {card.id === 1 && <Icons.Reports />}
                        {card.id === 2 && <Icons.Medicine />}
                        {card.id === 3 && <Icons.Bell />}
                        {card.id === 4 && <Icons.Expenses />}
                    </div>
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${card.warning ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {card.trend}
                    </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
                <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden mt-4">
                    <div className={`h-full opacity-60 rounded-full ${card.color === 'cyan' ? 'bg-cyan-500' : card.color === 'blue' ? 'bg-blue-500' : card.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'}`} style={{ width: '65%' }}></div>
                </div>
            </div>
        ))}
    </div>
);

export default function DashboardHome() {
    const { data: medicines } = useSWR<Medicine[]>(API_ENDPOINTS.medicines, fetcher);
    const { data: expenses } = useSWR<Expense[]>(API_ENDPOINTS.expenses, fetcher);
    const { data: sales } = useSWR<Sale[]>(API_ENDPOINTS.sales, fetcher);
    const { data: settings } = useSWR<Setting[]>(API_ENDPOINTS.settings, fetcher);

    const marginSetting = settings?.find(s => s.key === 'expiryMargin');
    const expiryMargin = marginSetting ? parseInt(marginSetting.value) : 7;

    const totalInventory = medicines ? medicines.length : 0;
    const expiringMedicines = medicines ? medicines.filter((m: Medicine) => {
        const { status } = getExpiryStatus(m.expiry, expiryMargin);
        return status !== 'Safe';
    }) : [];

    const totalExpenses = expenses ? expenses.reduce((acc: number, curr: Expense) => acc + parseFloat(curr.amount.replace('$', '').replace(',', '')), 0) : 0;

    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales ? sales.filter((s: Sale) => s.date === today).reduce((acc: number, curr: Sale) => acc + parseFloat(curr.totalAmount.replace('$', '').replace(',', '')), 0) : 0;

    const stats = [
        { id: 1, title: "Today Sales", value: `$${todaySales.toLocaleString()}`, trend: "Live", color: "cyan" },
        { id: 2, title: "Total Inventory", value: `${totalInventory} Items`, trend: `${medicines?.length || 0} Reg`, color: "blue" },
        { id: 3, title: "Expiry Alerts", value: `${expiringMedicines.length} Items`, trend: expiringMedicines.length > 0 ? "Alert" : "Safe", color: "orange", warning: expiringMedicines.length > 0 },
        { id: 4, title: "Total Expenses", value: `$${totalExpenses.toLocaleString()}`, trend: "Updated", color: "teal" },
    ];

    // Dummy weekly sales distribution for chart
    const dummyChartData = [45, 60, 55, 75, 50, 85, 90];

    return (
        <div className="space-y-8">
            <StatGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-[24px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Critical Alerts</h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Threshold: {expiryMargin} Days</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="pb-4">Medicine</th>
                                    <th className="pb-4">Issue</th>
                                    <th className="pb-4 text-center">Detail</th>
                                    <th className="pb-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {expiringMedicines.length > 0 ? expiringMedicines.map((item: Medicine) => {
                                    const { status, color, days } = getExpiryStatus(item.expiry, expiryMargin);
                                    return (
                                        <tr key={item._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 font-medium text-slate-200">{item.name}</td>
                                            <td className="py-4">
                                                <span className={`text-xs font-bold ${color === 'rose' ? 'text-rose-400' : 'text-orange-400'}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center text-[10px] font-mono text-slate-500 uppercase">
                                                {days < 0 ? `${Math.abs(days)}d Overdue` : `In ${days} Days`}
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">Review</span>
                                            </td>
                                        </tr>
                                    );
                                }) : medicines ? (
                                    medicines.filter(m => m.stock < 20).slice(0, 5).map((item: Medicine) => (
                                        <tr key={item._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 font-medium text-slate-200">{item.name}</td>
                                            <td className="py-4"><span className="text-xs font-bold text-rose-400">Low Stock</span></td>
                                            <td className="py-4 text-center text-sm font-bold text-slate-300">{item.stock} left</td>
                                            <td className="py-4 text-right">
                                                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">Refill</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="py-10 text-center text-slate-500 animate-pulse">Scanning inventory...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-[24px]">
                    <h3 className="text-lg font-bold text-white mb-6">Weekly Performance</h3>
                    <div className="flex items-end justify-between h-32 space-x-2">
                        {dummyChartData.map((val: number, idx: number) => (
                            <div key={idx} className="flex-1 group relative">
                                <div className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-lg transition-all duration-700 ease-out hover:scale-x-110" style={{ height: `${val}%` }}></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


