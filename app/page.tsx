import Link from "next/link";

const Icons = {
  Cross: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#0B1220] overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-8 flex justify-center">
          <div className="h-20 w-20 flex items-center justify-center rounded-[24px] bg-gradient-to-tr from-cyan-600 to-teal-400 shadow-2xl shadow-cyan-500/20 animate-pulse">
            <Icons.Cross />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          MedFlow <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent italic">Pro</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
          The ultimate SaaS pharmacy management platform. Smart inventory, automated billing, and detailed analytics in one premium dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="px-8 py-4 w-full sm:w-auto rounded-2xl bg-white text-[#0B1220] font-bold text-lg hover:bg-cyan-50 transition-all hover:scale-105 shadow-xl">
            Login to Dashboard
          </Link>
          <Link href="/signup" className="px-8 py-4 w-full sm:w-auto rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all hover:scale-105">
            Get Started Free
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center space-x-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-white font-bold tracking-widest text-xs uppercase">Trusted by 500+ Pharmacies</span>
        </div>
      </div>

      <div className="absolute bottom-8 text-slate-600 text-xs tracking-widest uppercase font-bold">
        Built with Premium Edge UI
      </div>
    </main>
  );
}
