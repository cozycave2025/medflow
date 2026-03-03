// app/dashboard/layout.tsx
"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./components/icons";

import useSWR from "swr";
import { fetcher, API_ENDPOINTS } from "./lib/data";
import { Notification } from "./types";

const inter = Inter({ subsets: ["latin"] });

const navItems = [
    { name: "Dashboard", href: "/dashboard", Icon: Icons.Dashboard },
    { name: "Medicines", href: "/dashboard/medicines", Icon: Icons.Medicine },
    { name: "Expenses", href: "/dashboard/expenses", Icon: Icons.Expenses },
    { name: "Customers", href: "/dashboard/customers", Icon: Icons.Customers },
    { name: "Suppliers", href: "/dashboard/suppliers", Icon: Icons.Suppliers },
    { name: "Reports", href: "/dashboard/reports", Icon: Icons.Reports },
    { name: "Analytics", href: "/dashboard/analytics", Icon: Icons.Analytics },
    { name: "Settings", href: "/dashboard/settings", Icon: Icons.Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed for mobile-first
    const [mounted, setMounted] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { data: notifications, mutate: mutateNotifications } = useSWR<Notification[]>(API_ENDPOINTS.notifications, fetcher);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        // Open sidebar by default on large screens
        if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const unreadCount = notifications?.filter(n => n.status === 'unread').length || 0;

    const markAsRead = async (id: string) => {
        try {
            await fetch(API_ENDPOINTS.notifications, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'read' })
            });
            mutateNotifications();
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const clearAllRead = async () => {
        try {
            await fetch(API_ENDPOINTS.notifications, { method: 'DELETE' });
            mutateNotifications();
        } catch (error) {
            console.error("Failed to clear read notifications", error);
        }
    };

    if (!mounted) return null;

    // Determine active page name based on pathname
    const activeItem = navItems.find((item) => item.href === pathname) || navItems[0];
    const activePage = activeItem.name;

    return (
        <div className={`flex min-h-screen bg-[#0B1220] text-slate-200 ${inter.className}`}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- Sidebar (Left Fixed) --- */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A]/90 lg:bg-[#0F172A]/80 backdrop-blur-3xl border-r border-white/5 transition-transform duration-500 lg:sticky lg:top-0 lg:h-screen ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-8 lg:p-10 flex items-center space-x-4">
                        <div className="h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 shadow-2xl shadow-cyan-500/40 transform -rotate-6">
                            <span className="text-white scale-90 lg:scale-100"><Icons.Cross /></span>
                        </div>
                        <div>
                            <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">MedFlow</span>
                            <div className="text-[9px] lg:text-[10px] font-bold text-cyan-400/80 tracking-widest uppercase mt-0.5">Premium ERP</div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 lg:px-6 space-y-1 lg:space-y-2 font-medium">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-4 px-5 lg:px-6 py-3.5 lg:py-4 rounded-[18px] lg:rounded-[20px] transition-all duration-300 group ${isActive
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0px_0px_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                        }`}
                                >
                                    <span className={`transition-transform duration-300 ${isActive ? "text-cyan-400 scale-110" : "group-hover:text-slate-300"}`}>
                                        <item.Icon className="w-5 h-5" />
                                    </span>
                                    <span className={`text-sm lg:text-base ${isActive ? "font-bold tracking-tight" : "font-medium"}`}>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / Profile */}
                    <div className="p-6 lg:p-8 mt-auto">
                        <div className="p-5 lg:p-6 rounded-[24px] lg:rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-white text-xs">A</div>
                                <div>
                                    <p className="text-xs lg:text-sm font-bold text-white">Owner Admin</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">Pro Account</p>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/10 transition-colors">
                                <Icons.Logout className="w-3.5 h-3.5" /> <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Area --- */}
            <main className="flex-1 relative w-full overflow-x-hidden min-w-0">
                {/* Dynamic Content Gradient background layers */}
                <div className="fixed top-0 right-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-cyan-500/5 rounded-full blur-[100px] lg:blur-[140px] pointer-events-none -z-10 animate-blob"></div>
                <div className="fixed bottom-0 left-1/4 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-teal-500/5 rounded-full blur-[80px] lg:blur-[100px] pointer-events-none -z-10" style={{ animation: 'blob 12s infinite reverse' }}></div>

                {/* Topbar */}
                <header className="sticky top-0 z-40 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-10 h-20 lg:h-24 flex items-center justify-between">
                    <div className="flex items-center space-x-3 lg:space-x-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2.5 text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
                        >
                            <Icons.Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">{activePage}</h2>
                            <p className="text-[9px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest truncate max-w-[150px] sm:max-w-none">
                                {activePage === "Dashboard" ? "Overview" : `Manage ${activePage}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 lg:space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-2 lg:p-3 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl lg:rounded-2xl transition-all"
                            >
                                <Icons.Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 lg:top-3 lg:right-3 h-2 w-2 lg:h-2.5 lg:w-2.5 bg-rose-500 rounded-full ring-2 ring-[#0B1220] animate-pulse"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-4 w-72 sm:w-80 glass-panel rounded-[24px] lg:rounded-3xl p-5 lg:p-6 shadow-2xl border border-white/10 animate-fade-in divide-y divide-white/5 overflow-hidden">
                                    <div className="flex justify-between items-center pb-4 mb-1">
                                        <h4 className="font-bold text-white text-sm lg:text-base">Notifications</h4>
                                        <button onClick={clearAllRead} className="text-[10px] font-bold text-cyan-400 hover:underline">Clear</button>
                                    </div>
                                    <div className="max-h-80 lg:max-h-96 overflow-y-auto pr-2 custom-scrollbar space-y-2 lg:space-y-3 pt-4">
                                        {notifications && notifications.length > 0 ? notifications.map((n) => (
                                            <div
                                                key={n._id}
                                                onClick={() => markAsRead(n._id)}
                                                className={`p-2.5 lg:p-3 rounded-xl transition-all cursor-pointer border border-transparent ${n.status === 'unread' ? 'bg-cyan-500/5 border-cyan-500/10' : 'opacity-60 hover:bg-white/5'}`}
                                            >
                                                <div className="flex gap-2.5 lg:gap-3">
                                                    <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${n.type === 'expiry' ? 'bg-orange-500' : n.type === 'stock' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                                                    <div>
                                                        <p className="text-[11px] lg:text-xs text-slate-200 leading-relaxed font-medium">{n.message}</p>
                                                        <p className="text-[10px] text-slate-600 mt-1 font-mono">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-6 lg:py-8 text-center text-slate-600 text-[10px] lg:text-xs italic font-medium">No alerts today</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-8 lg:h-10 w-px bg-white/5 mx-1 lg:mx-2"></div>
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs lg:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Pharmacy Admin</p>
                                <p className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Main Hospital</p>
                            </div>
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 font-bold group-hover:border-cyan-500 transition-all">
                                <Icons.Settings className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="p-4 sm:p-6 lg:p-10 animate-fade-in focus:outline-none min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)]">
                    {children}
                </div>

                {/* Footer Quote */}
                <footer className="px-6 lg:px-10 py-6 lg:py-8 text-center text-[9px] lg:text-[10px] font-bold text-slate-700 tracking-[0.2em] uppercase">
                    &copy; 2026 MedFlow &bull; Simplified Pharmacy ERP
                </footer>
            </main>
        </div>
    );
}
