// app/dashboard/medicines/page.tsx
"use client";

import { useState } from "react";
import { Icons } from "../components/icons";
import { medicinesData } from "../lib/data";
import { Modal } from "../components/modal";

export default function MedicinesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input type="text" placeholder="Search medicines..." className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium" />
                </div>
                <button onClick={() => setIsAddOpen(true)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 font-bold transition-all hover:scale-105 active:scale-95">
                    <Icons.Plus /> <span>Add Medicine</span>
                </button>
            </div>
            <div className="glass-panel rounded-[24px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-5">Batch</th>
                                <th className="px-8 py-5">Expiry</th>
                                <th className="px-8 py-5">Stock</th>
                                <th className="px-8 py-5">Price</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {medicinesData.map((item) => (
                                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5 font-semibold text-slate-200">{item.name}</td>
                                    <td className="px-8 py-5 text-sm font-mono text-slate-500">{item.batch}</td>
                                    <td className="px-8 py-5 text-sm text-slate-400">{item.expiry}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <span className={`h-1.5 w-1.5 rounded-full ${item.stock < 20 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></span>
                                            <span className="text-sm font-medium text-slate-300">{item.stock} Units</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-teal-400">{item.price}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"><Icons.Edit /></button>
                                            <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Icons.Delete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Medicine">
                <form className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Medicine Name</label>
                        <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. Panadol" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Batch Number</label>
                            <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="BT-123" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Expiry Date</label>
                            <input type="date" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Initial Stock</label>
                            <input type="number" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="100" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price ($)</label>
                            <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="0.00" />
                        </div>
                    </div>
                    <button type="button" className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 py-4 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">Save Medicine</button>
                </form>
            </Modal>
        </div>
    );
}
