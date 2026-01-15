import { Link } from "@inertiajs/react";
import { Building2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function PublicFooter() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="md:col-span-1 space-y-6">
                        <Link href={route("home")} className="flex items-center">
                            <img
                                src="/logo_apartments24.png"
                                alt="Apartments24"
                                className="h-20 w-auto brightness-110"
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Complete automation for property owners and managers. Manage assets with confidence and scale without friction.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:col-span-2 gap-8">
                        <div>
                            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link href={route('login')} className="text-slate-400 hover:text-brand-orange text-sm transition font-medium">Dashboard</Link>
                                </li>
                                <li>
                                    <Link href={route('security')} className="text-slate-400 hover:text-brand-orange text-sm transition font-medium">Security</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link href={route('about')} className="text-slate-400 hover:text-brand-orange text-sm transition font-medium">About</Link>
                                </li>
                                <li>
                                    <Link href={route('privacy')} className="text-slate-400 hover:text-brand-orange text-sm transition font-medium">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href={route('terms')} className="text-slate-400 hover:text-brand-orange text-sm transition font-medium">Terms of Use</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">Contact</h4>
                        <p className="text-slate-400 text-sm mb-4">support@apartments24.com</p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <Link key={idx} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-orange transition-colors">
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs font-semibold">
                        © {new Date().getFullYear()} Apartments24. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
}
