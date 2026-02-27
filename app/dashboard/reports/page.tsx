// app/dashboard/reports/page.tsx
"use client";

import { Icons } from "../components/icons";

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <input type="date" className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                    <span className="text-slate-600 font-bold">TO</span>
                    <input type="date" className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
                <button className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                    <Icons.Download /> <span>Export PDF</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-[24px]">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total Period Sales</p>
                    <p className="text-3xl font-bold text-white">$45,200.00</p>
                </div>
                <div className="glass-panel p-6 rounded-[24px]">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total Period Profit</p>
                    <p className="text-3xl font-bold text-emerald-400">$12,450.00</p>
                </div>
                <div className="glass-panel p-6 rounded-[24px]">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Expenses Total</p>
                    <p className="text-3xl font-bold text-rose-400">$3,200.00</p>
                </div>
            </div>
            <div className="glass-panel p-8 rounded-[32px]">
                <h3 className="text-lg font-bold text-white mb-8">Monthly Sales Revenue</h3>
                <div className="flex items-end justify-between h-48 space-x-4">
                    {[30, 45, 60, 40, 75, 90, 85, 70, 50, 65, 80, 95].map((val, idx) => (
                        <div key={idx} className="flex-1 bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-xl transition-all duration-1000 group relative" style={{ height: `${val}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">Month {idx + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
