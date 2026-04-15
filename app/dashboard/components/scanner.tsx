// app/dashboard/components/scanner.tsx
"use client";

import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function BarcodeScanner({ onScan, onClose, inline = false }: { onScan: (decodedText: string) => void, onClose: () => void, inline?: boolean }) {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isScanningFile, setIsScanningFile] = useState(false);
    const html5QrCode = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async () => {
        setIsCameraActive(true);
        html5QrCode.current = new Html5Qrcode("reader");
        try {
            await html5QrCode.current.start(
                { facingMode: "environment" },
                { fps: 15, qrbox: { width: 250, height: 150 } },
                (decodedText) => {
                    onScan(decodedText);
                    stopCamera();
                },
                () => { }
            );
        } catch (err) {
            console.error("Camera start failed", err);
            setIsCameraActive(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCode.current) {
            try {
                await html5QrCode.current.stop();
                html5QrCode.current.clear();
            } catch (err) { }
            html5QrCode.current = null;
        }
        setIsCameraActive(false);
        onClose();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setIsScanningFile(true);

        const qrcode = new Html5Qrcode("reader-hidden");
        try {
            const decodedText = await qrcode.scanFile(file, true);
            onScan(decodedText);
        } catch (err) {
            alert("No barcode found in this image. Please try a clearer picture.");
        } finally {
            setIsScanningFile(false);
        }
    };

    const content = (
        <div className={`space-y-6 ${inline ? "" : "p-8"}`}>
            {/* Hidden div for file scanning */}
            <div id="reader-hidden" style={{ display: 'none' }}></div>

            {isCameraActive ? (
                <div className="space-y-4 animate-fade-in">
                    <div id="reader" className="w-full rounded-3xl overflow-hidden bg-black border border-white/5 min-h-[250px] shadow-2xl"></div>
                    <button onClick={stopCamera} className="w-full py-4 bg-rose-500/10 text-rose-500 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-rose-500/20 hover:bg-rose-500/20 transition-all">Stop Camera</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center animate-fade-in">
                    <button
                        onClick={startCamera}
                        className="group p-6 rounded-3xl bg-cyan-600/10 border-2 border-dashed border-cyan-600/30 hover:border-cyan-400 transition-all flex flex-col items-center space-y-3"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Use Camera</p>
                            <p className="text-slate-500 text-[9px] font-bold uppercase mt-1 tracking-wider text-center">Real-time scan</p>
                        </div>
                    </button>

                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full group p-6 rounded-3xl bg-slate-800/50 border-2 border-dashed border-slate-700/50 hover:border-teal-400 transition-all flex flex-col items-center space-y-3"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-teal-600/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{isScanningFile ? "Analysing..." : "Upload Photo"}</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase mt-1 tracking-wider text-center">From gallery</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (inline) return content;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6">
            <div className="w-full max-w-md bg-[#0F172A] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 className="text-white font-bold text-lg">Barcode Tool</h3>
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">Scan or Upload Barcode</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5">✕</button>
                </div>
                {content}
            </div>
        </div>
    );
}
