import { Link } from '@inertiajs/react';

export default function ClubNavbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <img
                    src="/matchbase.png"
                    alt="EventBase Logo"
                    className="h-24 object-contain"
                />

                <div className="space-x-6 flex items-center">
                    {/* Dashboard */}
                    <Link
                        href={route("club.dashboard")}
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Dashboard
                    </Link>

                    {/* Athletes */}
                    <Link
                        href={route("athletes.index")}
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Athletes
                    </Link>

                    {/* Registrations (requires tournament ID, handle dynamically)
                    <Link
                        href={route("registrations.index", 1)} // replace 1 dynamically
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Registrations
                    </Link> */}

                    {/* Logout */}
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
}
