// app/dashboard/page.tsx
"use client";

import { Icons } from "./components/icons";
import { statCards, medicinesData, weeklySales } from "./lib/data";

const StatGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
            <div key={card.id} className="glass-panel group relative p-6 rounded-[24px] overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.03] blur-3xl transition-opacity group-hover:opacity-[0.08] ${card.color === 'cyan' ? 'bg-cyan-500' : card.color === 'blue' ? 'bg-blue-500' : card.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${card.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : card.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : card.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : 'bg-teal-500/10 text-teal-400'}`}>
                        {card.id === 1 && <Icons.Expenses />}
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
    return (
        <div className="space-y-8">
            <StatGrid />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-[24px]">
                    <h3 className="text-lg font-bold text-white mb-6">Expiry Alerts</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="pb-4">Medicine</th>
                                    <th className="pb-4">Batch</th>
                                    <th className="pb-4 text-center">Expiry</th>
                                    <th className="pb-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {medicinesData.slice(0, 4).map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-medium text-slate-200">{item.name}</td>
                                        <td className="py-4 text-sm text-slate-500 font-mono">{item.batch}</td>
                                        <td className="py-4 text-center text-sm text-slate-300">{item.expiry}</td>
                                        <td className="py-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.stock < 20 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {item.stock < 20 ? 'Low Stock' : 'Safe'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-[24px]">
                    <h3 className="text-lg font-bold text-white mb-6">Weekly Sales</h3>
                    <div className="flex items-end justify-between h-32 space-x-2">
                        {weeklySales.map((val, idx) => (
                            <div key={idx} className="flex-1 group relative">
                                <div className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-lg transition-all duration-700 ease-out hover:scale-x-110" style={{ height: `${val}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] text-slate-600 font-bold">
                        <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
