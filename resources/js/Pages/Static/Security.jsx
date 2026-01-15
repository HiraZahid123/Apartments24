import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Lock, Server, FileCheck, Key, RefreshCcw, ArrowRight } from 'lucide-react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Security() {
    return (
        <div className="min-h-screen bg-white">
            <Head title="Security Center | Apartments24" />

            <PublicNavbar />

            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/security_hero.png"
                        alt="Cybersecurity"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider mb-6">
                        <ShieldCheck className="w-4 h-4" /> Bank-Grade Security
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
                        Uncompromised <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Protection</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-300 leading-relaxed mb-10">
                        We deploy state-of-the-art encryption and security protocols to ensure your property and guest data never falls into the wrong hands.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="relative -mt-20 max-w-7xl mx-auto px-6 lg:px-8 z-10 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Lock,
                            title: "AES-256 Encryption",
                            desc: "All sensitive data is encrypted at rest and in transit using industry-standard protocols.",
                            bg: "bg-blue-50", text: "text-blue-600"
                        },
                        {
                            icon: Key,
                            title: "Access Control",
                            desc: "Strict Role-Based Access Control (RBAC) ensures users only see what they are authorized to.",
                            bg: "bg-emerald-50", text: "text-emerald-600"
                        },
                        {
                            icon: Server,
                            title: "Secure Infrastructure",
                            desc: "Hosted on enterprise-grade cloud servers with 24/7 monitoring and automated backups.",
                            bg: "bg-slate-100", text: "text-slate-600"
                        },
                        {
                            icon: FileCheck,
                            title: "GDPR Compliance",
                            desc: "Built from the ground up to respect user privacy and European data protection laws.",
                            bg: "bg-purple-50", text: "text-purple-600"
                        },
                        {
                            icon: RefreshCcw,
                            title: "Regular Audits",
                            desc: "We perform routine security audits and penetration testing to identify vulnerabilities.",
                            bg: "bg-orange-50", text: "text-brand-orange"
                        },
                        {
                            icon: ShieldCheck,
                            title: "Fraud Prevention",
                            desc: "AI-driven algorithms detect and block suspicious booking activities in real-time.",
                            bg: "bg-rose-50", text: "text-rose-600"
                        }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 ${feature.bg} ${feature.text} rounded-2xl flex items-center justify-center mb-6`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-white py-24 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-6">Responsible Disclosure</h2>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                        We value the security research community. If you believe you’ve found a vulnerability, please report it to us immediately.
                    </p>
                    <a href="mailto:security@apartments24.com" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Report Vulnerability
                    </a>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
