import { Link, useForm, usePage } from "@inertiajs/react";
import { Building2, LogOut, LayoutDashboard, ArrowRight, Menu } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
    const { auth } = usePage().props;
    const { post } = useForm();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        post(route("logout"));
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 h-20 flex items-center shadow-lg">
            <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
                <Link href={route("home")} className="flex items-center group">
                    <img
                        src="/logo_apartments24.png"
                        alt="Apartments24"
                        className="h-20 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href={route("home")} className="text-sm font-bold text-slate-300 hover:text-white transition">Home</Link>
                    <Link href={route("about")} className="text-sm font-bold text-slate-300 hover:text-white transition">About</Link>

                    {auth?.user ? (
                        <div className="flex items-center gap-6 border-l border-slate-200 pl-6">
                            <Link
                                href={route("dashboard")}
                                className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition"
                            >
                                <LayoutDashboard className="h-4 w-4" /> Dashboard
                            </Link>
                            <form onSubmit={handleLogout} className="inline">
                                <button
                                    type="submit"
                                    className="text-sm font-bold text-red-500 hover:text-red-600 transition"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                            <Link
                                href={route("login")}
                                className="text-sm font-bold text-slate-300 hover:text-white transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={route("register")}
                                className="px-5 py-2.5 bg-brand-orange text-white font-bold text-sm rounded-xl shadow-md shadow-orange-100 hover:bg-orange-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Simple Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-slate-900 border-b border-slate-800 p-6 md:hidden animate-fadeIn">
                    <div className="flex flex-col gap-4">
                        <Link href={route("home")} className="text-sm font-bold text-slate-300 hover:text-white transition">Home</Link>
                        <Link href={route("login")} className="text-sm font-bold text-slate-300 hover:text-white transition">Sign In</Link>
                        <Link href={route("register")} className="text-sm font-bold text-brand-orange">Get Started</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
