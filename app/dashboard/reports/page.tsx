// app/dashboard/reports/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { Sale, Medicine, SaleItem } from "../types";

export default function ReportsPage() {
    const { data: sales, error, mutate } = useSWR<Sale[]>(API_ENDPOINTS.sales, fetcher);
    const { data: medicines } = useSWR<Medicine[]>(API_ENDPOINTS.medicines, fetcher);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Sale | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Sale Form State
    const [formData, setFormData] = useState({
        customerName: "",
        customerId: "",
        items: [{ medicineId: "", name: "", quantity: 1, price: "" }],
        totalAmount: "$0.00",
        profit: "$0.00",
        date: new Date().toISOString().split('T')[0],
    });

    const filteredSales = useMemo(() => {
        if (!sales) return [];
        return sales.filter((s: Sale) =>
            s.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sales, searchTerm]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = isEditOpen ? "PUT" : "POST";
        const url = isEditOpen ? `${API_ENDPOINTS.sales}/${selectedItem?._id}` : API_ENDPOINTS.sales;

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
                setFormData({ customerName: "", customerId: "", items: [{ medicineId: "", name: "", quantity: 1, price: "" }], totalAmount: "$0.00", profit: "$0.00", date: new Date().toISOString().split('T')[0] });
            }
        } catch (error) {
            console.error("Sale recording failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Delete this sale record?")) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.sales}/${id}`, { method: "DELETE" });
            if (res.ok) mutate();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openDetail = (item: Sale) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const openEdit = (e: React.MouseEvent, item: Sale) => {
        e.stopPropagation();
        setSelectedItem(item);
        setFormData({
            customerName: item.customerName,
            customerId: item.customerId || "",
            items: item.items,
            totalAmount: item.totalAmount,
            profit: item.profit,
            date: item.date,
        });
        setIsEditOpen(true);
    };

    const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
        const newItems = [...formData.items];
        if (field === "medicineId") {
            const med = medicines?.find((m: Medicine) => m._id === value);
            newItems[index] = { ...newItems[index], medicineId: value as string, name: med?.name || "", price: med?.price || "" };
        } else {
            newItems[index] = { ...newItems[index], [field]: value } as SaleItem;
        }

        // Calculate totals
        let total = 0;
        newItems.forEach(item => {
            const price = parseFloat(item.price.replace('$', '')) || 0;
            total += price * item.quantity;
        });

        setFormData({ ...formData, items: newItems, totalAmount: `$${total.toFixed(2)}`, profit: `$${(total * 0.2).toFixed(2)}` });
    };

    if (error) return <div className="p-10 text-rose-500 glass-panel rounded-3xl">Failed to load sales data.</div>;
    if (!sales) return <div className="p-10 text-slate-500 glass-panel rounded-3xl animate-pulse">Loading Reports...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by customer..."
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => { setFormData({ customerName: "", customerId: "", items: [{ medicineId: "", name: "", quantity: 1, price: "" }], totalAmount: "$0.00", profit: "$0.00", date: new Date().toISOString().split('T')[0] }); setIsAddOpen(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                    <Icons.Plus /> <span>New Sale Record</span>
                </button>
            </div>

            <div className="glass-panel rounded-[24px] overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Customer</th>
                            <th className="px-8 py-5">Items</th>
                            <th className="px-8 py-5">Total Amount</th>
                            <th className="px-8 py-5">Profit</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredSales.map((item: Sale) => (
                            <tr key={item._id} onClick={() => openDetail(item)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-8 py-5 text-slate-400 font-mono text-xs">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="px-8 py-5 font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.customerName}</td>
                                <td className="px-8 py-5 text-slate-400 text-sm">{item.items.length} Medicines</td>
                                <td className="px-8 py-5 font-bold text-emerald-400">{item.totalAmount}</td>
                                <td className="px-8 py-5 font-bold text-cyan-400">{item.profit}</td>
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

            {/* Add / Edit Sale Modal */}
            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isEditOpen ? "Modify Sale Record" : "Record Transaction"}>
                <form onSubmit={handleSave} className="space-y-5 px-1 py-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Customer Name</label>
                            <input value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. John Doe" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sale Date</label>
                            <input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required type="date" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Line Items</label>
                            <button type="button" onClick={() => setFormData({ ...formData, items: [...formData.items, { medicineId: "", name: "", quantity: 1, price: "" }] })} className="text-xs text-cyan-400 font-bold hover:underline">Add Medicine</button>
                        </div>
                        {formData.items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-white/5 p-3 rounded-2xl border border-white/5">
                                <div className="col-span-6 space-y-1">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase ml-1">Medicine</p>
                                    <select
                                        value={item.medicineId}
                                        onChange={(e) => updateItem(idx, "medicineId", e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {medicines?.map((m: Medicine) => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.stock})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-4 space-y-1">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase ml-1">Qty</p>
                                    <input value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 0)} type="number" min="1" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" required />
                                </div>
                                <div className="col-span-2 pb-0.5">
                                    <button type="button" onClick={() => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) })} className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Icons.Delete className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Bill</p>
                            <p className="text-2xl font-bold text-emerald-400">{formData.totalAmount}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Est. Profit</p>
                            <p className="text-2xl font-bold text-cyan-400">{formData.profit}</p>
                        </div>
                    </div>

                    <button disabled={isSaving} type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2">
                        {isSaving ? "Processing..." : isEditOpen ? "Update Transaction" : "Finalize Sale"}
                    </button>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Sale Receipt">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Icons.Reports className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">{selectedItem.customerName}</h1>
                                <p className="text-slate-400 font-mono tracking-wide text-xs uppercase">{new Date(selectedItem.date).toDateString()}</p>
                            </div>
                            <button onClick={(e) => { setIsDetailOpen(false); openEdit(e, selectedItem); }} className="p-3 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-xl transition-all border border-white/5">
                                <Icons.Update className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="glass-panel border-white/5 p-5 rounded-[24px]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 px-1">Invoice Items</p>
                            <div className="space-y-3">
                                {selectedItem.items.map((item, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 mb-0.5">{item.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono italic">{item.price} x {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-cyan-400">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Grand Total</p>
                                <p className="text-3xl font-bold text-emerald-400">{selectedItem.totalAmount}</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Margin Earned</p>
                                <p className="text-3xl font-bold text-cyan-400">{selectedItem.profit}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
