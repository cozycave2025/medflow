"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// Icons (Inline for simplicity)
const Icons = {
    Cross: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal-400"
        >
            <path d="M12 6v12" />
            <path d="M6 12h12" />
        </svg>
    ),
    User: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Eye: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    EyeOff: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
    ),
    Lock: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    Check: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
};

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        // Here you would normally add validation and API calls
        router.push("/dashboard");
    };

    return (
        <main className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0F172A] p-4 ${inter.className}`}>

            {/* Background Blobs (Soft Glassmorphism Effect) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-blob" style={{ animationDelay: "2s" }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-blob" style={{ animationDelay: "4s" }}></div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-sm"> {/* Slightly narrower for login */}

                {/* Logo Section */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/20 transform transition-transform duration-500 hover:rotate-12">
                        <div className="text-white">
                            <Icons.Cross />
                        </div>
                    </div>
                    <h1 className="bg-gradient-to-r from-cyan-100 to-blue-100 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Pharmacy Management Simplified
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="glass-panel overflow-hidden rounded-[24px] p-8 shadow-2xl ring-1 ring-white/10 animate-fade-in">
                    <form className="space-y-5">

                        {/* Email/Mobile */}
                        <div className="group relative">
                            <div className="absolute left-4 top-3.5 z-10 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                <Icons.User />
                            </div>
                            <input
                                type="text"
                                id="identifier"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 pl-11 pr-4 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <label
                                htmlFor="identifier"
                                className="pointer-events-none absolute left-11 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cyan-400"
                            >
                                Email or Mobile Number
                            </label>
                        </div>

                        {/* Password */}
                        <div className="group relative">
                            <div className="absolute left-4 top-3.5 z-10 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                <Icons.Lock />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 pl-11 pr-10 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <label
                                htmlFor="password"
                                className="pointer-events-none absolute left-11 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cyan-400"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                            </button>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${rememberMe
                                        ? "bg-cyan-500 border-cyan-500 text-white"
                                        : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                                        }`}
                                    aria-pressed={rememberMe}
                                    aria-label="Remember me"
                                >
                                    {rememberMe && <Icons.Check />}
                                </button>
                                <span
                                    className="ml-2 cursor-pointer text-sm text-slate-400 select-none hover:text-slate-300"
                                    onClick={() => setRememberMe(!rememberMe)}
                                >
                                    Remember me
                                </span>
                            </div>
                            <Link href="/forgot-password" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="mt-2 w-full transform rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98]"
                        >
                            Login to Dashboard
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative mt-8 mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#162032] px-2 text-slate-500 rounded-full border border-slate-800/50">Or</span>
                        </div>
                    </div>


                    {/* Create Account Link */}
                    <div className="text-center text-sm text-slate-400">
                        <Link href="/signup" className="group inline-flex items-center font-medium text-slate-300 transition-colors hover:text-white">
                            Create new account
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Footer/Copyright */}
                <p className="mt-8 text-center text-xs text-slate-600 animate-fade-in [animation-delay:0.3s]">
                    &copy; {new Date().getFullYear()} MedFlow Inc.
                </p>
            </div>
        </main>
    );
}
