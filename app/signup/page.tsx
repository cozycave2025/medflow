"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// Inline SVGs for no-dependency solution
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
    Mail: () => (
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
    Phone: () => (
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
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
};

export default function Signup() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = () => {
        // Here you would normally add validation and API calls
        router.push("/dashboard");
    };

    return (
        <main className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0F172A] p-4 ${inter.className}`}>

            {/* Background Blobs (Soft Glassmorphism Effect) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-screen opacity-20 blur-3xl animate-blob" style={{ animationDelay: "2s" }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen opacity-20 blur-3xl animate-blob" style={{ animationDelay: "4s" }}></div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo Section */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 shadow-lg shadow-blue-500/20">
                        <div className="text-white">
                            <Icons.Cross />
                        </div>
                    </div>
                    <h1 className="bg-gradient-to-r from-blue-100 to-teal-100 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                        Let&apos;s get started
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Create your MedFlow account today
                    </p>
                </div>

                {/* Signup Form Card */}
                <div className="glass-panel overflow-hidden rounded-[24px] p-8 shadow-2xl ring-1 ring-white/10">
                    <form className="space-y-5">

                        {/* Full Name */}
                        <div className="group relative">
                            <div className="absolute left-4 top-3.5 z-10 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Icons.User />
                            </div>
                            <input
                                type="text"
                                id="fullname"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 pl-11 pr-4 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="fullname"
                                className="pointer-events-none absolute left-11 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-400"
                            >
                                Full Name
                            </label>
                        </div>

                        {/* Mobile Number */}
                        <div className="group relative">
                            <div className="absolute left-4 top-3.5 z-10 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Icons.Phone />
                            </div>
                            <input
                                type="tel"
                                id="mobile"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 pl-11 pr-4 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="mobile"
                                className="pointer-events-none absolute left-11 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-400"
                            >
                                Mobile Number
                            </label>
                        </div>

                        {/* Email Address */}
                        <div className="group relative">
                            <div className="absolute left-4 top-3.5 z-10 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Icons.Mail />
                            </div>
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 pl-11 pr-4 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute left-11 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-400"
                            >
                                Email Address
                            </label>
                        </div>

                        {/* Password */}
                        <div className="group relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 px-4 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                            />
                            <label
                                htmlFor="password"
                                className="pointer-events-none absolute left-4 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-400"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                            >
                                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="group relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder=" "
                                className="peer w-full rounded-xl bg-slate-900/50 border border-slate-700/50 px-4 py-3.5 text-white placeholder-transparent shadow-sm backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                            />
                            <label
                                htmlFor="confirmPassword"
                                className="pointer-events-none absolute left-4 top-3.5 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-400"
                            >
                                Confirm Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                            >
                                {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSignup}
                            className="mt-2 w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/40 hover:from-blue-500 hover:to-teal-400 active:scale-[0.98]"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>

                {/* Footer/Copyright */}
                <p className="mt-8 text-center text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} MedFlow Inc. All rights reserved.
                </p>
            </div>
        </main>
    );
}
