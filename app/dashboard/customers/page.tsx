// app/dashboard/customers/page.tsx
"use client";

import { Icons } from "../components/icons";
import { customersData } from "../lib/data";

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input type="text" placeholder="Search customers..." className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none" />
                </div>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
                    <Icons.Plus /> <span>New Customer</span>
                </button>
            </div>
            <div className="glass-panel rounded-[24px] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Customer Name</th>
                            <th className="px-8 py-5">Phone Number</th>
                            <th className="px-8 py-5">Total Purchases</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {customersData.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-8 py-5 font-semibold text-slate-200 leading-tight">{item.name}</td>
                                <td className="px-8 py-5 text-slate-400 font-mono text-sm">{item.phone}</td>
                                <td className="px-8 py-5 font-bold text-teal-400">{item.purchases}</td>
                                <td className="px-8 py-5 text-right">
                                    <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700">View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
