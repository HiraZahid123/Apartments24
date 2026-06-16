import { Head, Link } from '@inertiajs/react';
import { Users, Target, Shield, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            <Head title="About Us | Apartments24" />

            <PublicNavbar />

            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/about_us_hero.png"
                        alt="Office Team"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
                        Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">Hospitality</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed mb-10">
                        We are bridging the gap between property investment and exceptional guest experiences through intelligent automation and local expertise.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href={route('register')} className="px-8 py-4 bg-brand-orange text-white rounded-2xl font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                            Join Our Network
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats / Mission Grid */}
            <div className="relative -mt-20 max-w-7xl mx-auto px-6 lg:px-8 z-10 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Users, label: "Happy Guests", value: "10k+", desc: "Served across Tallinn" },
                        { icon: Target, label: "Properties", value: "150+", desc: "Under management" },
                        { icon: Shield, label: "Compliance", value: "100%", desc: "Legal & Tax ready" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center mb-6">
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{stat.label}</p>
                            <p className="text-slate-500 text-sm">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-brand-orange font-black text-sm uppercase tracking-widest">Our Story</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-8 leading-tight">
                                Built for Modern <br /> Property Managers.
                            </h2>
                            <div className="space-y-6 text-lg text-slate-600">
                                <p>
                                    Born in the digital capital of Europe, Tallinn, Apartments24 started with a simple mission: to remove the friction from short-term rentals.
                                </p>
                                <p>
                                    We noticed that property owners were overwhelmed by paperwork, compliance, and guest communication. So, we built a platform that handles it all automatically—from visitor cards to tax reports.
                                </p>
                            </div>

                            <ul className="mt-10 space-y-4">
                                {['Automated Check-ins', 'Tax Compliance', '24/7 Guest Support'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 font-bold text-slate-900">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-brand-orange/20 rounded-[3rem] rotate-3 blur-xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                                alt="Conference Room"
                                className="relative rounded-[2.5rem] shadow-2xl border-4 border-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to automate your property?</h2>
                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">Join hundreds of property owners who trust Apartments24 for their daily operations.</p>
                    <Link href={route('register')} className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-brand-orange transition-colors">
                        Get Started Today <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
