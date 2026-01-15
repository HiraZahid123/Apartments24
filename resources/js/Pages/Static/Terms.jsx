
import { Head, Link } from '@inertiajs/react';
import { Scale, FileSignature, AlertTriangle, HelpCircle, Check } from 'lucide-react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Terms() {
    return (
        <div className="min-h-screen bg-white">
            <Head title="Terms of Use | Apartments24" />

            <PublicNavbar />

            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/terms_hero.png"
                        alt="Terms of Service"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold uppercase tracking-wider mb-6">
                        <Scale className="w-4 h-4" /> Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Service</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Please read these terms carefully before using the Apartments24 platform.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-20 max-w-5xl mx-auto px-6 lg:px-8 pb-24 z-10">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="max-w-3xl mx-auto">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12 text-center">Effective Date: January 1, 2026</p>

                            <div className="space-y-16">
                                {/* Section 1 */}
                                <section>
                                    <div className="flex items-start gap-4 mb-6">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-black text-lg">1</span>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 mb-4">Acceptance of Terms</h2>
                                            <p className="text-slate-600 leading-relaxed">
                                                By accessing and using Apartments24, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2 */}
                                <section>
                                    <div className="flex items-start gap-4 mb-6">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg">2</span>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 mb-4">Service Description</h2>
                                            <p className="text-slate-600 leading-relaxed mb-4">
                                                Apartments24 acts as a technological bridge between property owners and guests. We are responsible for:
                                            </p>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {['Platform Availability', 'Secure Payments', 'Booking Management', 'Automated Reporting'].map(item => (
                                                    <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                                                        <Check className="w-4 h-4 text-emerald-500" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3 */}
                                <section>
                                    <div className="flex items-start gap-4 mb-6">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-lg">3</span>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 mb-4">Limitations & Liability</h2>
                                            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex gap-4">
                                                <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                                <p className="text-rose-900 text-sm leading-relaxed font-medium">
                                                    Apartments24 shall not be liable for any direct, indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                                <h4 className="font-bold text-slate-900 mb-2">Still have questions?</h4>
                                <p className="text-slate-500 text-sm mb-6">Our legal team is available to clarify any doubts.</p>
                                <Link href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                    <HelpCircle className="w-4 h-4" /> Contact Legal Dept
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}

