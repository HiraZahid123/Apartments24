import React, { useEffect } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Building2, Calendar, Users, Key, ArrowRight, Shield, Layout, DollarSign, CheckCircle } from "lucide-react";
import PublicNavbar from "@/Components/PublicNavbar";
import PublicFooter from "@/Components/PublicFooter";

export default function Welcome() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
            <Head>
                <title>Apartments24 | Modern Apartment Management</title>
                <meta name="description" content="Professional apartment management platform for property owners and admins." />
            </Head>

            <PublicNavbar />

            {/* Hero Section */}
            <section className="pt-24 pb-20 lg:pt-32 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-brand-orange text-sm font-bold mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                            </span>
                            Trusted by 1,200+ Property Owners
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                            Manage Your <span className="text-brand-orange">Apartments</span> with Ease & Style
                        </h1>

                        <p className="text-lg text-slate-600 max-w-2xl lg:mx-0 mx-auto leading-relaxed mb-10">
                            The most intuitive platform to automate guest check-ins, track revenue, and manage multiple properties from a single dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                Get Started Free <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all text-center"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-brand-orange" />
                                <span className="text-sm font-semibold">24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-brand-orange" />
                                <span className="text-sm font-semibold">No Credit Card Required</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full lg:max-w-5xl relative lg:-mr-20">
                        {/* Seamless mask to remove square edges */}
                        <div className="mask-building-seamless">
                            <img
                                src="/apartment_hero_final.png"
                                alt="Modern Apartment Management"
                                className="w-full h-auto object-contain scale-110 lg:scale-125 transition-transform duration-700 hover:scale-115"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-slate-50 py-24 px-6">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4">Core Benefits</h2>
                    <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Built for Modern Rental Business</h3>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                        Everything you need to manage bookings, guests, and finances without the headache of manual spreadsheets.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "Automated Check-in", desc: "Send automated arrival instructions and digital keys directly to your guests." },
                        { icon: Layout, title: "Multi-Asset Dashboard", desc: "Manage 5 or 500 apartments with the same level of ease and localized control." },
                        { icon: Key, title: "Revenue Sharing", desc: "Transparent calculations for property owners with automated expense deductions." }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="bg-brand-orange w-12 h-12 rounded-xl flex items-center justify-center mb-8 shadow-orange-200 shadow-lg">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                            <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto bg-brand-orange rounded-3xl p-12 lg:p-20 shadow-xl shadow-orange-200 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/4 translate-y-1/4"></div>
                    </div>

                    <h3 className="text-4xl font-extrabold text-white mb-6 relative z-10">Ready to scale your portfolio?</h3>
                    <p className="text-orange-50 mb-10 text-lg max-w-xl mx-auto relative z-10">
                        Join hundreds of property managers who have increased their efficiency by 40%.
                    </p>
                    <Link
                        href={route('register')}
                        className="bg-white text-brand-orange px-10 py-5 rounded-xl font-black shadow-lg hover:bg-orange-50 transition relative z-10 inline-flex items-center gap-3"
                    >
                        Create Your Free Account <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            <PublicFooter />
            <ToastContainer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .mask-building-seamless {
                    mask-image: radial-gradient(ellipse at 50% 50%, black 70%, transparent 100%);
                    -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 70%, transparent 100%);
                }
            `}} />
        </div>
    );
}
