// app/dashboard/customers/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { Customer, Sale, SaleItem } from "../types";

export default function CustomersPage() {
    const { data: customers, error, mutate } = useSWR<Customer[]>(API_ENDPOINTS.customers, fetcher);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        purchases: "$0.00",
    });

    const filteredCustomers = useMemo(() => {
        if (!customers) return [];
        return customers.filter((c: Customer) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        );
    }, [customers, searchTerm]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = isEditOpen ? "PUT" : "POST";
        const url = isEditOpen ? `${API_ENDPOINTS.customers}/${selectedItem?._id}` : API_ENDPOINTS.customers;

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
                setFormData({ name: "", phone: "", purchases: "$0.00" });
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this customer?")) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.customers}/${id}`, {
                method: "DELETE",
            });
            if (res.ok) mutate();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openDetail = (item: Customer) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const openEdit = (e: React.MouseEvent, item: Customer) => {
        e.stopPropagation();
        setSelectedItem(item);
        setFormData({
            name: item.name,
            phone: item.phone,
            purchases: item.purchases,
        });
        setIsEditOpen(true);
    };

    const openHistory = (e: React.MouseEvent, item: Customer) => {
        e.stopPropagation();
        setSelectedItem(item);
        setIsHistoryOpen(true);
    };

    if (error) return <div className="p-10 text-rose-500 glass-panel rounded-3xl">Failed to load customers.</div>;
    if (!customers) return <div className="p-10 text-slate-500 glass-panel rounded-3xl animate-pulse">Loading Customers...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => { setFormData({ name: "", phone: "", purchases: "$0.00" }); setIsAddOpen(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                    <Icons.Plus /> <span>New Customer</span>
                </button>
            </div>

            <div className="glass-panel rounded-[24px] overflow-x-auto">
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
                        {filteredCustomers.map((item: Customer) => (
                            <tr key={item._id} onClick={() => openDetail(item)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-8 py-5 font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.name}</td>
                                <td className="px-8 py-5 text-slate-400 font-mono text-sm">{item.phone}</td>
                                <td className="px-8 py-5 font-bold text-teal-400">{item.purchases}</td>
                                <td className="px-8 py-5 text-right space-x-2">
                                    <button onClick={(e) => openHistory(e, item)} className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100" title="View History">
                                        <Icons.Reports className="w-4 h-4" />
                                    </button>
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

            {/* History Modal */}
            <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={`Purchase History: ${selectedItem?.name}`}>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <HistoryList customerName={selectedItem?.name || ""} />
                </div>
            </Modal>

            {/* Add / Edit Modal */}
            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isEditOpen ? "Update Profile" : "New Customer Profile"}>
                <form onSubmit={handleSave} className="space-y-5 px-1 py-1">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Initial Purchases</label>
                        <input value={formData.purchases} onChange={(e) => setFormData({ ...formData, purchases: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="$0.00" />
                    </div>
                    <button disabled={isSaving} type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-4">
                        {isSaving ? "Saving..." : isEditOpen ? "Update Profile" : "Create Profile"}
                    </button>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Customer Profile">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <Icons.Customers className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">{selectedItem.name}</h1>
                                <p className="text-slate-400 font-mono tracking-wide">{selectedItem.phone}</p>
                            </div>
                            <button onClick={(e) => { setIsDetailOpen(false); openEdit(e, selectedItem); }} className="p-3 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-xl transition-all border border-white/5">
                                <Icons.Update className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 col-span-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Lifetime Billing</p>
                                <p className="text-2xl font-bold text-teal-400">{selectedItem.purchases}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Joined Date</p>
                                <p className="text-lg font-bold text-slate-300">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Relationship</p>
                                <p className="text-lg font-bold text-emerald-400">Trusted</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function HistoryList({ customerName }: { customerName: string }) {
    const { data: sales, error } = useSWR<Sale[]>(API_ENDPOINTS.sales, fetcher);

    if (error) return <div className="text-rose-500 text-sm">Failed to load history.</div>;
    if (!sales) return <div className="text-slate-500 text-sm animate-pulse">Loading history...</div>;

    const history = sales.filter(s => s.customerName === customerName);

    if (history.length === 0) return <div className="text-slate-500 text-sm py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">No purchase records found.</div>;

    return (
        <div className="space-y-4">
            {history.map((sale) => (
                <div key={sale._id} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-mono text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                        <p className="text-sm font-bold text-emerald-400">{sale.totalAmount}</p>
                    </div>
                    <div className="space-y-1">
                        {sale.items.map((item: SaleItem, i: number) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-400">
                                <span>{item.name} x {item.quantity}</span>
                                <span className="text-slate-500">{item.price} ea</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
