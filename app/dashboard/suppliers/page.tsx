// app/dashboard/suppliers/page.tsx
"use client";

import { Icons } from "../components/icons";
import { suppliersData } from "../lib/data";

export default function SuppliersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
                    <Icons.Plus /> <span>Add Supplier</span>
                </button>
            </div>
            <div className="glass-panel rounded-[24px] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Supplier Name</th>
                            <th className="px-8 py-5">Contact Info</th>
                            <th className="px-8 py-5">Total Distributed</th>
                            <th className="px-8 py-5 text-right">Options</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {suppliersData.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-8 py-5 font-semibold text-slate-200">{item.name}</td>
                                <td className="px-8 py-5 text-slate-400 font-mono text-sm">{item.phone}</td>
                                <td className="px-8 py-5 font-bold text-cyan-400">{item.purchases}</td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-slate-500 hover:text-cyan-400"><Icons.Edit /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
