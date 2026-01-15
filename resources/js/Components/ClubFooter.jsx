import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ClubFooter() {
    return (
        <footer className="bg-blue-100/90 border-t border-blue-200 mt-16 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo & Tagline */}
                <motion.div
                    className="flex flex-col items-start space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <img
                        src="/matchbase.png"
                        alt="Club Logo"
                        className="h-24 object-contain mb-2"
                    />
                    <p className="text-slate-700 text-sm max-w-xs">
                        ML SPORT Technologies OÜ — helping clubs manage athletes, tournaments, and registrations smoothly.
                    </p>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    className="flex flex-col space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <h4 className="text-slate-800 font-semibold mb-2">
                        Quick Links
                    </h4>

                    <Link
                        href={route("club.dashboard")}
                        className="text-slate-700 hover:text-brand-blue transition-colors"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href={route("athletes.index")}
                        className="text-slate-700 hover:text-brand-blue transition-colors"
                    >
                        Athletes
                    </Link>
{/* 
                    <Link
                        href={route("registrations.index", 1)} // replace 1 dynamically
                        className="text-slate-700 hover:text-brand-blue transition-colors"
                    >
                        Registrations
                    </Link> */}

                    <Link
                        as="button"
                        method="post"
                        href={route("logout")}
                        className="text-slate-700 hover:text-brand-blue transition-colors text-left"
                    >
                        Logout
                    </Link>
                </motion.div>

                {/* Legal & Social */}
                <motion.div
                    className="flex flex-col space-y-2 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-12 object-contain mb-2"
                    />

                    <p className="text-slate-600 text-xs mt-4">
                        © {new Date().getFullYear()} ML SPORT Technologies OÜ. All
                        rights reserved.
                        <br />
                        <Link
                            href="#"
                            className="hover:text-brand-blue transition-colors mx-1 hover:underline"
                        >
                            Privacy
                        </Link>{" "}
                        |{" "}
                        <Link
                            href="#"
                            className="hover:text-brand-blue transition-colors mx-1 hover:underline"
                        >
                            Terms
                        </Link>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
