import { Link } from '@inertiajs/react';

export default function AdminNavbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <img
                    src="/matchbase.png"
                    alt="EventBase Logo"
                    className="h-24 object-contain"
                />

                <div className="space-x-6 flex items-center">

                    {/* Tournaments */}
                    <Link
                        href={route("tournaments.index")}
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Tournaments
                    </Link>

                    {/* Clubs */}
                    <Link
                        href={route("admin.clubs.index")}
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Clubs
                    </Link>

                    {/* Registrations */}
                    <Link
                        href={route("admin.registrations.index")}
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Registrations
                    </Link>

                    {/* Athletes */}
                    <Link
                        href={route("admin.athletes.index")}
                        className="text-slate-700 hover:text-brand-blue font-medium transition-colors duration-200"
                    >
                        Athletes
                    </Link>

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
