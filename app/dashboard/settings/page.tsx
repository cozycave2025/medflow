// app/dashboard/settings/page.tsx
"use client";

import { Icons } from "../components/icons";

export default function SettingsPage() {
    return (
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
}
