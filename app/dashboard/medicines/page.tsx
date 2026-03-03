// app/dashboard/medicines/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { Medicine } from "../types";

export default function MedicinesPage() {
    const { data: medicines, error, mutate } = useSWR<Medicine[]>(API_ENDPOINTS.medicines, fetcher);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        batch: "",
        expiry: "",
        stock: "",
        price: "",
    });

    const filteredMedicines = useMemo(() => {
        if (!medicines) return [];
        return medicines.filter((m: Medicine) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.batch.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [medicines, searchTerm]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = isEditOpen ? "PUT" : "POST";
        const url = isEditOpen ? `${API_ENDPOINTS.medicines}/${selectedItem?._id}` : API_ENDPOINTS.medicines;

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
                setFormData({ name: "", batch: "", expiry: "", stock: "", price: "" });
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this medicine?")) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.medicines}/${id}`, {
                method: "DELETE",
            });
            if (res.ok) mutate();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openDetail = (item: Medicine) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const openEdit = (e: React.MouseEvent, item: Medicine) => {
        e.stopPropagation();
        setSelectedItem(item);
        setFormData({
            name: item.name,
            batch: item.batch,
            expiry: item.expiry,
            stock: item.stock.toString(),
            price: item.price,
        });
        setIsEditOpen(true);
    };

    if (error) return <div className="p-10 text-rose-500 glass-panel rounded-3xl">Failed to load medicines.</div>;
    if (!medicines) return <div className="p-10 text-slate-500 glass-panel rounded-3xl animate-pulse">Loading Medicines...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => { setFormData({ name: "", batch: "", expiry: "", stock: "", price: "" }); setIsAddOpen(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20">
                    <Icons.Plus /> <span>New Medicine</span>
                </button>
            </div>

            <div className="glass-panel rounded-[24px] overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Medicine Name</th>
                            <th className="px-8 py-5">Batch ID</th>
                            <th className="px-8 py-5">Expiry</th>
                            <th className="px-8 py-5">Stock</th>
                            <th className="px-8 py-5">Price</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredMedicines.map((item: Medicine) => (
                            <tr key={item._id} onClick={() => openDetail(item)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-8 py-5 font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.name}</td>
                                <td className="px-8 py-5 text-slate-400 font-mono text-sm">{item.batch}</td>
                                <td className="px-8 py-5 font-medium text-slate-300">{item.expiry}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${item.stock < 20 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{item.stock}</span>
                                </td>
                                <td className="px-8 py-5 font-bold text-teal-400">{item.price}</td>
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
            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isEditOpen ? "Update Medicine" : "Register Medicine"}>
                <form onSubmit={handleSave} className="space-y-5 px-1 py-1">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Medicine Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="Enter medicine name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Batch ID</label>
                            <input value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="# BATCH-01" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Expiry Date</label>
                            <input value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="MM/YYYY" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Stock</label>
                            <input value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required type="number" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="0" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Unit Price ($)</label>
                            <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="$0.00" />
                        </div>
                    </div>
                    <button disabled={isSaving} type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-4">
                        {isSaving ? "Saving..." : isEditOpen ? "Update Medicine" : "Add to Inventory"}
                    </button>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Medicine Details">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <Icons.Medicine className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">{selectedItem.name}</h1>
                                <p className="text-slate-400 font-mono tracking-widest text-xs uppercase">{selectedItem.batch}</p>
                            </div>
                            <button onClick={(e) => { setIsDetailOpen(false); openEdit(e, selectedItem); }} className="p-3 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-xl transition-all border border-white/5">
                                <Icons.Update className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Stock Available</p>
                                <p className={`text-2xl font-bold ${selectedItem.stock < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>{selectedItem.stock} Units</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Unit Price</p>
                                <p className="text-2xl font-bold text-teal-400">{selectedItem.price}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Compliance Information</p>
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Expiry Category</span>
                                    <span className="text-slate-300 font-medium">{selectedItem.expiry}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Last Inventory Audit</span>
                                    <span className="text-slate-300 font-medium">Checked Today</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
