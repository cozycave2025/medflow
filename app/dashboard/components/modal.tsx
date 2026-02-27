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
