// app/dashboard/suppliers/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { Supplier } from "../types";

export default function SuppliersPage() {
    const { data: suppliers, error, mutate } = useSWR<Supplier[]>(API_ENDPOINTS.suppliers, fetcher);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Supplier | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        purchases: "",
    });

    const filteredSuppliers = useMemo(() => {
        if (!suppliers) return [];
        return suppliers.filter((s: Supplier) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone.includes(searchTerm)
        );
    }, [suppliers, searchTerm]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = isEditOpen ? "PUT" : "POST";
        const url = isEditOpen ? `${API_ENDPOINTS.suppliers}/${selectedItem?._id}` : API_ENDPOINTS.suppliers;

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
                setFormData({ name: "", phone: "", purchases: "" });
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this supplier?")) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.suppliers}/${id}`, {
                method: "DELETE",
            });
            if (res.ok) mutate();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openDetail = (item: Supplier) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const openEdit = (e: React.MouseEvent, item: Supplier) => {
        e.stopPropagation();
        setSelectedItem(item);
        setFormData({
            name: item.name,
            phone: item.phone,
            purchases: item.purchases,
        });
        setIsEditOpen(true);
    };

    if (error) return <div className="p-10 text-rose-500 glass-panel rounded-3xl">Failed to load suppliers.</div>;
    if (!suppliers) return <div className="p-10 text-slate-500 glass-panel rounded-3xl animate-pulse">Loading Suppliers...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => { setFormData({ name: "", phone: "", purchases: "" }); setIsAddOpen(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                    <Icons.Plus /> <span>New Supplier</span>
                </button>
            </div>

            <div className="glass-panel rounded-[24px] overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Supplier Name</th>
                            <th className="px-8 py-5">Contact Phone</th>
                            <th className="px-8 py-5">Total Orders</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredSuppliers.map((item: Supplier) => (
                            <tr key={item._id} onClick={() => openDetail(item)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-8 py-5 font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.name}</td>
                                <td className="px-8 py-5 text-slate-400 font-mono text-sm">{item.phone}</td>
                                <td className="px-8 py-5 font-bold text-teal-400">{item.purchases}</td>
                                <td className="px-8 py-5 text-right space-x-2">
                                    <button onClick={(e) => openEdit(e, item)} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
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
            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isEditOpen ? "Update Supplier" : "Register Supplier"}>
                <form onSubmit={handleSave} className="space-y-5 px-1 py-1">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Supplier Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="Global Pharma Solutions" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contact Phone</label>
                        <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Total Purchases</label>
                        <input value={formData.purchases} onChange={(e) => setFormData({ ...formData, purchases: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="$0.00" />
                    </div>
                    <button disabled={isSaving} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-4">
                        {isSaving ? "Saving..." : isEditOpen ? "Update Supplier" : "Register Supplier"}
                    </button>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Supplier Profile">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Icons.Suppliers className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">{selectedItem.name}</h1>
                                <p className="text-slate-400 font-mono tracking-wide text-xs">{selectedItem.phone}</p>
                            </div>
                            <button onClick={(e) => { setIsDetailOpen(false); openEdit(e, selectedItem); }} className="p-3 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-xl transition-all border border-white/5">
                                <Icons.Update className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 col-span-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Lifetime Order Value</p>
                                <p className="text-3xl font-bold text-teal-400">{selectedItem.purchases}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
                                <p className="text-lg font-bold text-emerald-400">Verified</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rating</p>
                                <p className="text-lg font-bold text-amber-400">Premium</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
