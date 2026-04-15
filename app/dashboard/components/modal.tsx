// app/dashboard/components/modal.tsx
"use client";

import { ReactNode } from "react";
import { Icons } from "./icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-[#0F172A] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-fade-in border border-white/5 max-h-[95vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                        <div className="h-1 w-12 bg-cyan-500 rounded-full mt-2"></div>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5">
                        <Icons.Close className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};
