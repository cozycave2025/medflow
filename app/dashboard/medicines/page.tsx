// app/dashboard/medicines/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { BarcodeScanner } from "../components/scanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";
import { Medicine } from "../types";

export default function MedicinesPage() {
    const { data: medicines, error, mutate } = useSWR<Medicine[]>(API_ENDPOINTS.medicines, fetcher);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        batch: "",
        expiry: "",
        stock: "",
        purchasePrice: "",
        sellPrice: "",
        barcode: "",
    });

    const filteredMedicines = useMemo(() => {
        if (!medicines) return [];
        return medicines.filter((m: Medicine) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.barcode && m.barcode.includes(searchTerm))
        );
    }, [medicines, searchTerm]);

    const handleBarcodeScan = (scannedBarcode: string) => {
        if (!scannedBarcode) return;
        setFormData(prev => ({ ...prev, barcode: scannedBarcode }));

        // Try to find if medicine already exists with this barcode
        const existing = medicines?.find(m => m.barcode === scannedBarcode);
        if (existing) {
            setFormData({
                name: existing.name,
                batch: existing.batch,
                expiry: existing.expiry,
                stock: existing.stock.toString(),
                purchasePrice: existing.purchasePrice || "",
                sellPrice: existing.sellPrice || existing.price || "",
                barcode: existing.barcode,
            });
        }
    };

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
                setFormData({ name: "", batch: "", expiry: "", stock: "", purchasePrice: "", sellPrice: "", barcode: "" });
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
            purchasePrice: item.purchasePrice || "",
            sellPrice: item.sellPrice || item.price || "",
            barcode: item.barcode || "",
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
                        placeholder="Search name, batch, or barcode..."
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => { setFormData({ name: "", batch: "", expiry: "", stock: "", purchasePrice: "", sellPrice: "", barcode: "" }); setIsAddOpen(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20">
                    <Icons.Plus /> <span>New Medicine</span>
                </button>
            </div>

            <div className="glass-panel rounded-[24px] overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-8 py-5">Medicine Name</th>
                            <th className="px-8 py-5">Batch & Barcode</th>
                            <th className="px-8 py-5">Expiry</th>
                            <th className="px-8 py-5">Stock</th>
                            <th className="px-8 py-5">Sell Price</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredMedicines.map((item: Medicine) => (
                            <tr key={item._id} onClick={() => openDetail(item)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="px-8 py-5">
                                    <div className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.name}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-slate-400 font-mono text-xs">#{item.batch}</div>
                                    {item.barcode && <div className="text-[10px] text-cyan-500 font-medium mt-0.5">{item.barcode}</div>}
                                </td>
                                <td className="px-8 py-5 font-medium text-slate-300">{item.expiry}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${item.stock < 20 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{item.stock}</span>
                                </td>
                                <td className="px-8 py-5 font-bold text-teal-400">{item.sellPrice || item.price}</td>
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
            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); setIsScannerOpen(false); }} title={isEditOpen ? "Update Medicine" : "Register Medicine"}>
                {isScannerOpen ? (
                    <div className="space-y-6 py-4">
                        <div className="flex justify-between items-center bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10 mb-4">
                            <div>
                                <p className="text-white font-bold text-sm">Scan or Upload Barcode</p>
                                <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">Quick Fetch Product Info</p>
                            </div>
                            <button onClick={() => setIsScannerOpen(false)} className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/5 transition-all">Back to Form</button>
                        </div>

                        <BarcodeScanner
                            inline={true}
                            onScan={(code) => {
                                handleBarcodeScan(code);
                                setIsScannerOpen(false);
                            }}
                            onClose={() => setIsScannerOpen(false)}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-4 px-1">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Barcode (Scan to fetch info)</label>
                            <div className="flex space-x-2">
                                <div className="relative flex-1">
                                    <input
                                        value={formData.barcode}
                                        onChange={(e) => handleBarcodeScan(e.target.value)}
                                        type="text"
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
                                        placeholder="Scan or enter barcode"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500/50">
                                        <Icons.Search className="w-4 h-4" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsScannerOpen(true)}
                                    className="px-4 bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 rounded-xl hover:bg-cyan-600/30 transition-all active:scale-95 flex items-center justify-center"
                                    title="Open Scanner Inline"
                                >
                                    <Icons.Camera className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Medicine Name</label>
                            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 uppercase" placeholder="Enter medicine name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Batch ID</label>
                                <input value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="# BATCH-01" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.expiry && isValid(parseISO(formData.expiry)) ? parseISO(formData.expiry) : null}
                                        onChange={(date: Date | null) => setFormData({ ...formData, expiry: date ? format(date, "yyyy-MM-dd") : "" })}
                                        dateFormat="MMMM d, yyyy"
                                        placeholderText="Select expiry date"
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
                                        popperPlacement="bottom-start"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        portalId="root-portal"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 pointer-events-none">
                                        <Icons.Calendar className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stock</label>
                                <input value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required type="number" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="0" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Purchase ($)</label>
                                <input value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="0.00" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sell ($)</label>
                                <input value={formData.sellPrice} onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })} required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-bold text-teal-400" placeholder="0.00" />
                            </div>
                        </div>
                        <button disabled={isSaving} type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-4">
                            {isSaving ? "Saving..." : isEditOpen ? "Update Medicine" : "Add to Inventory"}
                        </button>
                    </form>
                )}
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
                                <h1 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{selectedItem.name}</h1>
                                <div className="flex items-center space-x-3">
                                    <p className="text-slate-400 font-mono text-[10px] uppercase">Batch: {selectedItem.batch}</p>
                                    {selectedItem.barcode && (
                                        <>
                                            <span className="text-slate-700">|</span>
                                            <p className="text-cyan-500/80 font-mono text-[10px]">Barcode: {selectedItem.barcode}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button onClick={(e) => { setIsDetailOpen(false); openEdit(e, selectedItem); }} className="p-3 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-xl transition-all border border-white/5">
                                <Icons.Update className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Stock</p>
                                <p className={`text-xl font-bold ${selectedItem.stock < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>{selectedItem.stock}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Purchase</p>
                                <p className="text-xl font-bold text-slate-300">{selectedItem.purchasePrice || '-'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Sell Price</p>
                                <p className="text-xl font-bold text-teal-400">{selectedItem.sellPrice || selectedItem.price}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Inventory Insights</p>
                                <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase ${selectedItem.stock > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                                    {selectedItem.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Expiry Date</span>
                                    <span className="text-slate-300 font-medium">{selectedItem.expiry}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Profit Margin</span>
                                    <span className="text-teal-400 font-bold">
                                        {selectedItem.purchasePrice && selectedItem.sellPrice
                                            ? `${((parseFloat(selectedItem.sellPrice) - parseFloat(selectedItem.purchasePrice)) / parseFloat(selectedItem.purchasePrice) * 100).toFixed(1)}%`
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
