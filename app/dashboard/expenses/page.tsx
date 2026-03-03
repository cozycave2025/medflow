// app/dashboard/expenses/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { Expense } from "../types";

export default function ExpensesPage() {
    const { data: expenses, error, mutate } = useSWR<Expense[]>(API_ENDPOINTS.expenses, fetcher);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Expense | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
    });

    const filteredExpenses = useMemo(() => {
        if (!expenses) return [];
        return expenses.filter((e: Expense) =>
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.amount.includes(searchTerm)
        );
    }, [expenses, searchTerm]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = isEditOpen ? "PUT" : "POST";
        const url = isEditOpen ? `${API_ENDPOINTS.expenses}/${selectedItem?._id}` : API_ENDPOINTS.expenses;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                mutate();
                setIsAddOpen(false);
                setIsEditOpen(false);
                setFormData({ title: "", amount: "", date: new Date().toISOString().split('T')[0], notes: "" });
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this expense?")) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.expenses}/${id}`, {
                method: "DELETE",
            });
            if (res.ok) mutate();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openDetail = (item: Expense) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const openEdit = (e: React.MouseEvent, item: Expense) => {
        e.stopPropagation();
        setSelectedItem(item);
        setFormData({
            title: item.title,
            amount: item.amount,
            date: item.date,
            notes: item.notes || "",
        });
        setIsEditOpen(true);
    };

    if (error) return <div className="p-10 text-rose-500 glass-panel rounded-3xl">Failed to load expenses.</div>;
    if (!expenses) return <div className="p-10 text-slate-500 glass-panel rounded-3xl animate-pulse">Loading Expenses...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title or amount..."
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => { setFormData({ title: "", amount: "", date: new Date().toISOString().split('T')[0], notes: "" }); setIsAddOpen(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/20">
                    <Icons.Plus /> <span>Log Expense</span>
                </button>
            </div>

            <div className="glass-panel rounded-[24px] overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Expense Title</th>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Amount</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredExpenses.map((item: Expense) => (
                            <tr key={item._id} onClick={() => openDetail(item)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-8 py-5 font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">{item.title}</td>
                                <td className="px-8 py-5 text-slate-400 font-mono text-sm">{item.date}</td>
                                <td className="px-8 py-5 font-bold text-rose-400">{item.amount}</td>
                                <td className="px-8 py-5 text-right space-x-2">
                                    <button onClick={(e) => openEdit(e, item)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Icons.Update className="w-4 h-4" />
                                    </button>
                                    <button onClick={(e) => handleDelete(e, item._id)} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Icons.Delete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Modal */}
            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isEditOpen ? "Update Expense" : "Log New Expense"}>
                <form onSubmit={handleSave} className="space-y-5 px-1 py-1">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Title</label>
                        <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. Electricity Bill" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Amount ($)</label>
                            <input value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="0.00" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                            <input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required type="date" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Notes (Optional)</label>
                        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 resize-none" placeholder="Additional details..." />
                    </div>
                    <button disabled={isSaving} type="submit" className="w-full bg-gradient-to-r from-rose-600 to-orange-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 mt-4">
                        {isSaving ? "Saving..." : isEditOpen ? "Update Expense" : "Save Expense"}
                    </button>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Expense Details">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                                <Icons.Expenses className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">{selectedItem.title}</h1>
                                <p className="text-slate-400 font-mono tracking-wide">{selectedItem.date}</p>
                            </div>
                            <button onClick={(e) => { setIsDetailOpen(false); openEdit(e, selectedItem); }} className="p-3 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-all border border-white/5">
                                <Icons.Update className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-rose-400">{selectedItem.amount}</p>
                            </div>
                            {selectedItem.notes && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Notes</p>
                                    <p className="text-slate-300 leading-relaxed font-medium">{selectedItem.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Category</p>
                                <p className="text-lg font-bold text-slate-300">Operational</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Audit Status</p>
                                <p className="text-lg font-bold text-emerald-400">Verified</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
