"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Icons } from "../components/icons";
import { fetcher, API_ENDPOINTS } from "../lib/data";
import { Modal } from "../components/modal";
import { Setting } from "../types";

export default function SettingsPage() {
    const { data: settings, mutate } = useSWR<Setting[]>(API_ENDPOINTS.settings, fetcher);
    const [expiryMargin, setExpiryMargin] = useState("7");
    const [lowStockThreshold, setLowStockThreshold] = useState("10");
    const [defaultProfitMargin, setDefaultProfitMargin] = useState("20");
    const [isSaving, setIsSaving] = useState(false);
    const [isMedModalOpen, setIsMedModalOpen] = useState(false);

    useEffect(() => {
        if (settings) {
            const margin = settings.find(s => s.key === 'expiryMargin');
            const stock = settings.find(s => s.key === 'lowStockThreshold');
            const profit = settings.find(s => s.key === 'defaultProfitMargin');

            if (margin) setExpiryMargin(margin.value);
            if (stock) setLowStockThreshold(stock.value);
            if (profit) setDefaultProfitMargin(profit.value);
        }
    }, [settings]);

    const handleSaveSettings = async (key: string, value: string) => {
        setIsSaving(true);
        try {
            await fetch(API_ENDPOINTS.settings, {
                // Assuming the backend handles POST for both create and update
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            mutate();
        } catch (error) {
            console.error(`Failed to save setting ${key}`, error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAllMedSettings = async () => {
        setIsSaving(true);
        try {
            const settingsToSave = [
                { key: 'expiryMargin', value: expiryMargin },
                { key: 'lowStockThreshold', value: lowStockThreshold },
                { key: 'defaultProfitMargin', value: defaultProfitMargin }
            ];

            await Promise.all(settingsToSave.map(s =>
                fetch(API_ENDPOINTS.settings, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(s)
                })
            ));

            mutate();
            setIsMedModalOpen(false);
            alert("Medicine settings updated!");
        } catch (error) {
            console.error("Failed to save med settings", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            {/* Pharmacy Identity Section */}
            <div className="glass-panel p-10 rounded-[32px] space-y-8">
                <div className="flex items-center space-x-6 pb-8 border-b border-white/5">
                    <div className="h-24 w-24 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-400 cursor-pointer transition-all group">
                        <Icons.Plus className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] mt-2 font-bold uppercase tracking-tighter">Upload Logo</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Pharmacy Identity</h3>
                        <p className="text-sm text-slate-500">Update your store information appearing on invoices.</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pharmacy Name</label>
                            <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium" defaultValue="MedFlow Central" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                            <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium" defaultValue="+92 21 000 000 00" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Business Address</label>
                        <textarea className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all h-28 resize-none font-medium" defaultValue="Building 4, Sector 7-C, Healthcare District, City West."></textarea>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-bold transition-all border border-white/5 active:scale-95">Save Profile</button>
                </div>
            </div>

            {/* Quick Access Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                    onClick={() => setIsMedModalOpen(true)}
                    className="glass-panel p-8 rounded-[32px] border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer group"
                >
                    <div className="flex items-center space-x-5 mb-6">
                        <div className="p-4 rounded-[20px] bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                            <Icons.Bell />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Medicine Settings</h4>
                            <p className="text-xs text-slate-500">Alerts, stocks & margins</p>
                        </div>
                    </div>
                    <div className="flex items-center text-cyan-400 font-bold text-sm">
                        <span>Configure now</span>
                        <Icons.Reports className="w-4 h-4 ml-2 rotate-180" />
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-[32px] border border-white/5 opacity-50 grayscale cursor-not-allowed">
                    <div className="flex items-center space-x-5 mb-6">
                        <div className="p-4 rounded-[20px] bg-emerald-500/10 text-emerald-400">
                            <Icons.Customers />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">System Audit</h4>
                            <p className="text-xs text-slate-500">Track all system changes</p>
                        </div>
                    </div>
                    <div className="flex items-center text-slate-500 font-bold text-sm">
                        <span>Coming soon</span>
                    </div>
                </div>
            </div>

            {/* Med Settings Modal */}
            <Modal
                isOpen={isMedModalOpen}
                onClose={() => setIsMedModalOpen(false)}
                title="Medicine Configuration"
            >
                <div className="space-y-8">
                    {/* Expiry Margin */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-200">Expiry Alert Margin</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Days before alert</p>
                            </div>
                            <div className="text-2xl font-black text-cyan-400">{expiryMargin}d</div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="90"
                            value={expiryMargin}
                            onChange={(e) => setExpiryMargin(e.target.value)}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Low Stock Threshold */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-200">Low Stock Threshold</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Units before alert</p>
                            </div>
                            <div className="text-2xl font-black text-emerald-400">{lowStockThreshold}u</div>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={lowStockThreshold}
                            onChange={(e) => setLowStockThreshold(e.target.value)}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    {/* Default Profit Margin */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-200">Default Profit Margin</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Automatic calculation</p>
                            </div>
                            <div className="text-2xl font-black text-teal-400">{defaultProfitMargin}%</div>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={defaultProfitMargin}
                            onChange={(e) => setDefaultProfitMargin(e.target.value)}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            disabled={isSaving}
                            onClick={handleSaveAllMedSettings}
                            className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? "Saving Config..." : "Update Medicine Settings"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
