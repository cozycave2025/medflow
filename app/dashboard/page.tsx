"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// --- Icons (Inline SVGs) ---
const Icons = {
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    Medicine: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>,
    Expenses: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    Customers: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Suppliers: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    Reports: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>,
    Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
    Cross: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
};

// --- Mock Data ---
const statCards = [
    { id: 1, title: "Today Sales", value: "$1,240", trend: "+12.5%", color: "cyan" },
    { id: 2, title: "Total Inventory", value: "842 Items", trend: "0.2%", color: "blue" },
    { id: 3, title: "Expiring Soon", value: "12 Items", trend: "-2", color: "orange", warning: true },
    { id: 4, title: "Monthly Expenses", value: "$4,850", trend: "+5.1%", color: "teal" },
];

const medicinesData = [
    { id: 1, name: "Amoxicillin 500mg", batch: "AMX-102", expiry: "2026-03-12", stock: 120, price: "$12.00" },
    { id: 2, name: "Paracetamol Syrup", batch: "PAR-992", expiry: "2026-04-05", stock: 45, price: "$8.50" },
    { id: 3, name: "Ibuprofen Tabs", batch: "IBU-551", expiry: "2026-06-20", stock: 300, price: "$5.20" },
    { id: 4, name: "Cetrizine Drops", batch: "CET-004", expiry: "2026-03-20", stock: 12, price: "$15.00" },
];

const expensesData = [
    { id: 1, date: "2026-02-14", title: "Shop Electricity", amount: "$120.00", notes: "Monthly utility bill" },
    { id: 2, date: "2026-02-12", title: "Cleaning Supplies", amount: "$45.50", notes: "Floor cleaner and soap" },
    { id: 3, date: "2026-02-10", title: "Internet Subscription", amount: "$60.00", notes: "Monthly fiber connection" },
];

const customersData = [
    { id: 1, name: "Hassan Raza", phone: "+92 300 1234567", purchases: "$1,200.00" },
    { id: 2, name: "Fatima Amin", phone: "+92 321 7654321", purchases: "$850.50" },
    { id: 3, name: "Omar Khalid", phone: "+92 333 9988776", purchases: "$2,400.00" },
];

const suppliersData = [
    { id: 1, name: "MediLife Pharma Ltd.", phone: "+92 42 111 222 33", purchases: "$15,000.00" },
    { id: 2, name: "Z-Pills Distributors", phone: "+92 21 34567890", purchases: "$8,200.50" },
    { id: 3, name: "SafeCare Wholesalers", phone: "+92 51 0987654", purchases: "$12,400.00" },
];

const weeklySales = [40, 70, 45, 90, 65, 80, 55];

// --- Sub-Components ---

const StatGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
            <div key={card.id} className="glass-panel group relative p-6 rounded-[24px] overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.03] blur-3xl transition-opacity group-hover:opacity-[0.08] ${card.color === 'cyan' ? 'bg-cyan-500' : card.color === 'blue' ? 'bg-blue-500' : card.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${card.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : card.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : card.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : 'bg-teal-500/10 text-teal-400'}`}>
                        {card.id === 1 && <Icons.Expenses />}
                        {card.id === 2 && <Icons.Medicine />}
                        {card.id === 3 && <Icons.Bell />}
                        {card.id === 4 && <Icons.Expenses />}
                    </div>
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${card.warning ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {card.trend}
                    </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
                <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden mt-4">
                    <div className={`h-full opacity-60 rounded-full ${card.color === 'cyan' ? 'bg-cyan-500' : card.color === 'blue' ? 'bg-blue-500' : card.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'}`} style={{ width: '65%' }}></div>
                </div>
            </div>
        ))}
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-lg glass-panel rounded-[32px] p-8 shadow-2xl animate-fade-in border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl">
                        <Icons.Close />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// --- Page Content Components ---

const DashboardHome = () => (
    <div className="space-y-8">
        <StatGrid />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-8 rounded-[24px]">
                <h3 className="text-lg font-bold text-white mb-6">Expiry Alerts</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                                <th className="pb-4">Medicine</th>
                                <th className="pb-4">Batch</th>
                                <th className="pb-4 text-center">Expiry</th>
                                <th className="pb-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {medicinesData.slice(0, 4).map((item) => (
                                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-medium text-slate-200">{item.name}</td>
                                    <td className="py-4 text-sm text-slate-500 font-mono">{item.batch}</td>
                                    <td className="py-4 text-center text-sm text-slate-300">{item.expiry}</td>
                                    <td className="py-4 text-right">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.stock < 20 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {item.stock < 20 ? 'Low Stock' : 'Safe'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="glass-panel p-8 rounded-[24px]">
                <h3 className="text-lg font-bold text-white mb-6">Weekly Sales</h3>
                <div className="flex items-end justify-between h-32 space-x-2">
                    {weeklySales.map((val, idx) => (
                        <div key={idx} className="flex-1 group relative">
                            <div className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-lg transition-all duration-700 ease-out hover:scale-x-110" style={{ height: `${val}%` }}></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-3 text-[10px] text-slate-600 font-bold">
                    <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                </div>
            </div>
        </div>
    </div>
);

const MedicinesPage = () => {
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
};

const ExpensesPage = () => {
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
};

const CustomersPage = () => (
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

const SuppliersPage = () => (
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

const ReportsPage = () => (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <input type="date" className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                <span className="text-slate-600 font-bold">TO</span>
                <input type="date" className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none" />
            </div>
            <button className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                <Icons.Download /> <span>Export PDF</span>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-[24px]">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total Period Sales</p>
                <p className="text-3xl font-bold text-white">$45,200.00</p>
            </div>
            <div className="glass-panel p-6 rounded-[24px]">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total Period Profit</p>
                <p className="text-3xl font-bold text-emerald-400">$12,450.00</p>
            </div>
            <div className="glass-panel p-6 rounded-[24px]">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Expenses Total</p>
                <p className="text-3xl font-bold text-rose-400">$3,200.00</p>
            </div>
        </div>
        <div className="glass-panel p-8 rounded-[32px]">
            <h3 className="text-lg font-bold text-white mb-8">Monthly Sales Revenue</h3>
            <div className="flex items-end justify-between h-48 space-x-4">
                {[30, 45, 60, 40, 75, 90, 85, 70, 50, 65, 80, 95].map((val, idx) => (
                    <div key={idx} className="flex-1 bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-xl transition-all duration-1000 group relative" style={{ height: `${val}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">Month {idx + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SettingsPage = () => (
    <div className="max-w-2xl">
        <div className="glass-panel p-10 rounded-[32px] space-y-8">
            <div className="flex items-center space-x-6 pb-8 border-b border-white/5">
                <div className="h-24 w-24 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-400 cursor-pointer transition-all">
                    <Icons.Plus />
                    <span className="text-[10px] mt-2 font-bold uppercase">Logo</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Pharmacy Identity</h3>
                    <p className="text-sm text-slate-500">Update your store information appearing on invoices.</p>
                </div>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pharmacy Name</label>
                        <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all" defaultValue="MedFlow Central" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all" defaultValue="+92 21 000 000 00" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Business Address</label>
                    <textarea className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all h-28 resize-none" defaultValue="Building 4, Sector 7-C, Healthcare District, City West."></textarea>
                </div>
                <div className="pt-4 flex justify-end">
                    <button className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-cyan-500/20 active:scale-95">Save Settings</button>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Dashboard Implementation ---

export default function Dashboard() {
    const [activePage, setActivePage] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const navItems = [
        { name: "Dashboard", Icon: Icons.Dashboard },
        { name: "Medicines", Icon: Icons.Medicine },
        { name: "Expenses", Icon: Icons.Expenses },
        { name: "Customers", Icon: Icons.Customers },
        { name: "Suppliers", Icon: Icons.Suppliers },
        { name: "Reports", Icon: Icons.Reports },
        { name: "Settings", Icon: Icons.Settings },
    ];

    const renderPageContent = () => {
        switch (activePage) {
            case "Dashboard": return <DashboardHome />;
            case "Medicines": return <MedicinesPage />;
            case "Expenses": return <ExpensesPage />;
            case "Customers": return <CustomersPage />;
            case "Suppliers": return <SuppliersPage />;
            case "Reports": return <ReportsPage />;
            case "Settings": return <SettingsPage />;
            default: return <DashboardHome />;
        }
    };

    return (
        <div className={`flex min-h-screen bg-[#0B1220] text-slate-200 ${inter.className}`}>

            {/* --- Sidebar (Left Fixed) --- */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A]/80 backdrop-blur-3xl border-r border-white/5 transition-transform duration-500 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full shadow-2xl"}`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-10 flex items-center space-x-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 shadow-2xl shadow-cyan-500/40 transform -rotate-6">
                            <span className="text-white"><Icons.Cross /></span>
                        </div>
                        <div>
                            <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">MedFlow</span>
                            <div className="text-[10px] font-bold text-cyan-400/80 tracking-widest uppercase mt-0.5">Premium ERP</div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-6 space-y-2 font-medium">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActivePage(item.name);
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[20px] transition-all duration-300 group ${activePage === item.name
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0px_0px_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                    }`}
                            >
                                <span className={`transition-transform duration-300 ${activePage === item.name ? "text-cyan-400 scale-110" : "group-hover:text-slate-300"}`}>
                                    <item.Icon />
                                </span>
                                <span className={`${activePage === item.name ? "font-bold tracking-tight" : "font-medium"}`}>{item.name}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Footer / Profile */}
                    <div className="p-8 mt-auto">
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-white text-xs">A</div>
                                <div>
                                    <p className="text-sm font-bold text-white">Owner Admin</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Pro Account</p>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/10 transition-colors">
                                <Icons.Logout /> <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Area --- */}
            <main className="flex-1 overflow-y-auto relative h-screen">

                {/* Dynamic Content Gradient background layers */}
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-blob"></div>
                <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" style={{ animation: 'blob 12s infinite reverse' }}></div>

                {/* Topbar */}
                <header className="sticky top-0 z-40 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/5 px-10 h-24 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-3 text-slate-400 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                            <Icons.Dashboard /> {/* Icon used for Menu alternate */}
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">{activePage}</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activePage === "Dashboard" ? "Overview & Insights" : `Manage your ${activePage.toLowerCase()}`}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-3 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-2xl transition-all">
                            <Icons.Bell />
                            <span className="absolute top-3.5 right-3.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-[#0B1220] animate-pulse"></span>
                        </button>
                        <div className="h-10 w-px bg-white/5 mx-2"></div>
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Pharmacy Admin</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Main Hospital</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 font-bold group-hover:border-cyan-500 transition-all">
                                <Icons.Settings />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container with Animation Key */}
                <div key={activePage} className="p-10 animate-fade-in focus:outline-none min-h-[calc(100vh-96px)]">
                    {renderPageContent()}
                </div>

                {/* Footer Quote */}
                <footer className="px-10 py-8 text-center text-[10px] font-bold text-slate-700 tracking-[0.2em] uppercase">
                    &copy; 2026 MedFlow Systems &bull; Pharmacy Management Simplified
                </footer>
            </main>
        </div>
    );
}
