import { Head, Link } from '@inertiajs/react';
import { Shield, Lock, Eye, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-white">
            <Head title="Privacy Policy | Apartments24" />

            <PublicNavbar />

            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/privacy_hero.png"
                        alt="Privacy & Security"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-6">
                        <Shield className="w-4 h-4" /> GDPR Compliant
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Your Privacy, Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Priority</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Transparency is at the core of Apartments24. We believe you have specific rights to your data, and we're committed to protecting them.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-20 max-w-5xl mx-auto px-6 lg:px-8 pb-24 z-10">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Sidebar Navigation (Sticky) */}
                        <div className="md:col-span-4 bg-slate-50 p-8 border-r border-slate-100 hidden md:block">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-6">Table of Contents</h3>
                            <nav className="space-y-2">
                                {['Information Collection', 'Data Usage', 'Information Sharing', 'Your Rights', 'Security Measures'].map((item, i) => (
                                    <a key={item} href={`#section-${i}`} className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-brand-orange hover:bg-white hover:shadow-sm transition-all">
                                        {i + 1}. {item}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-8 p-8 md:p-12">
                            <div className="prose prose-slate max-w-none">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Last Updated: January 14, 2026</p>

                                <div id="section-0" className="mb-12">
                                    <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 mb-4">
                                        <div className="p-2 bg-orange-100 rounded-lg text-brand-orange"><FileText className="w-5 h-5" /></div>
                                        1. Information We Collect
                                    </h2>
                                    <p className="text-slate-600 mb-4">We collect information to provide better services to all our users. This includes:</p>
                                    <ul className="space-y-3 list-none pl-0">
                                        {[
                                            'Personal Identification (Name, Email, ID Number)',
                                            'Booking Details (Dates, Property Info)',
                                            'Technical Data (IP Address, Browser Type)'
                                        ].map(item => (
                                            <li key={item} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-700 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div id="section-1" className="mb-12">
                                    <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Eye className="w-5 h-5" /></div>
                                        2. How We Use Data
                                    </h2>
                                    <p className="text-slate-600">
                                        Your data is primarily used to facilitate bookings, ensure compliance with Estonian Tourism Laws (Visitor Cards), and process financial transactions. We do not sell your personal data to third parties.
                                    </p>
                                </div>

                                <div id="section-3" className="mb-12">
                                    <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 mb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Lock className="w-5 h-5" /></div>
                                        3. Your Rights (GDPR)
                                    </h2>
                                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                                        <h4 className="font-bold text-purple-900 mb-2">You remain in control.</h4>
                                        <p className="text-purple-800 text-sm mb-4">
                                            Under GDPR, you have the right to access, rectifiy, or erase your personal data at any time.
                                        </p>
                                        <Link href="mailto:privacy@apartments24.com" className="text-sm font-black text-purple-600 uppercase tracking-wider hover:underline">
                                            Contact Privacy Officer &rarr;
                                        </Link>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8 mt-12">
                                    <p className="text-slate-500 text-sm">
                                        Have questions about our privacy practices? <a href="mailto:support@apartments24.com" className="text-brand-orange font-bold hover:underline">Contact Support</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
