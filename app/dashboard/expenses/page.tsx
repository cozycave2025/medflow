// app/dashboard/expenses/page.tsx
"use client";

import { useState } from "react";
import { Icons } from "../components/icons";
import { expensesData } from "../lib/data";
import { Modal } from "../components/modal";

export default function ExpensesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setIsAddOpen(true)} className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 font-bold transition-all hover:scale-105 active:scale-95">
                    <Icons.Plus /> <span>New Expense</span>
                </button>
            </div>
            <div className="glass-panel rounded-[24px] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Title</th>
                            <th className="px-8 py-5">Amount</th>
                            <th className="px-8 py-5">Notes</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {expensesData.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-8 py-5 text-sm text-slate-400">{item.date}</td>
                                <td className="px-8 py-5 font-semibold text-slate-200">{item.title}</td>
                                <td className="px-8 py-5 font-bold text-rose-400">{item.amount}</td>
                                <td className="px-8 py-5 text-sm text-slate-500 italic">{item.notes}</td>
                                <td className="px-8 py-5 text-right"><button className="p-2 text-slate-600 hover:text-rose-500 rounded-lg"><Icons.Delete /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record Expense">
                <form className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Title</label>
                        <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="Expense description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Amount ($)</label>
                            <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="0.00" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                            <input type="date" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Notes (Optional)</label>
                        <textarea className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 h-24 resize-none"></textarea>
                    </div>
                    <button type="button" className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all">Add Expense</button>
                </form>
            </Modal>
        </div>
    );
}
