// app/dashboard/layout.tsx
"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./components/icons";

const inter = Inter({ subsets: ["latin"] });

const navItems = [
    { name: "Dashboard", href: "/dashboard", Icon: Icons.Dashboard },
    { name: "Medicines", href: "/dashboard/medicines", Icon: Icons.Medicine },
    { name: "Expenses", href: "/dashboard/expenses", Icon: Icons.Expenses },
    { name: "Customers", href: "/dashboard/customers", Icon: Icons.Customers },
    { name: "Suppliers", href: "/dashboard/suppliers", Icon: Icons.Suppliers },
    { name: "Reports", href: "/dashboard/reports", Icon: Icons.Reports },
    { name: "Settings", href: "/dashboard/settings", Icon: Icons.Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Determine active page name based on pathname
    const activeItem = navItems.find((item) => item.href === pathname) || navItems[0];
    const activePage = activeItem.name;


    return (
        <div className={`flex min-h-screen bg-[#0B1220] text-slate-200 ${inter.className}`}>
            {/* --- Sidebar (Left Fixed) --- */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A]/80 backdrop-blur-3xl border-r border-white/5 transition-transform duration-500 lg:sticky lg:top-0 lg:h-screen ${sidebarOpen ? "translate-x-0" : "-translate-x-full shadow-2xl"}`}>
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
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[20px] transition-all duration-300 group ${isActive
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0px_0px_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                        }`}
                                >
                                    <span className={`transition-transform duration-300 ${isActive ? "text-cyan-400 scale-110" : "group-hover:text-slate-300"}`}>
                                        <item.Icon />
                                    </span>
                                    <span className={`${isActive ? "font-bold tracking-tight" : "font-medium"}`}>{item.name}</span>
                                </Link>
                            );
                        })}
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
            <main className="flex-1 relative w-full">
                {/* Dynamic Content Gradient background layers */}
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-blob"></div>
                <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" style={{ animation: 'blob 12s infinite reverse' }}></div>

                {/* Topbar */}
                <header className="sticky top-0 z-40 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/5 px-10 h-24 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-3 text-slate-400 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                            <Icons.Dashboard />
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

                {/* Content Container */}
                <div className="p-10 animate-fade-in focus:outline-none min-h-[calc(100vh-96px)]">
                    {children}
                </div>

                {/* Footer Quote */}
                <footer className="px-10 py-8 text-center text-[10px] font-bold text-slate-700 tracking-[0.2em] uppercase">
                    &copy; 2026 MedFlow Systems &bull; Pharmacy Management Simplified
                </footer>
            </main>
        </div>
    );
}
