import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Building2,
    Calendar,
    Users,
    Settings,
    LogOut,
    PlusCircle,
    ChevronRight,
    PieChart,
    Shield,
    UserCircle
} from 'lucide-react';

const SidebarItem = ({ href, icon: Icon, label, active, disabled }) => (
    <div className="px-2 py-0.5">
        <Link
            href={disabled ? '#' : href}
            className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${active
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-100'
                : disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            onClick={disabled ? (e) => e.preventDefault() : undefined}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-orange'}`} />
                <span className="tracking-tight">{label}</span>
            </div>
            {active && <ChevronRight className="w-4 h-4 text-white opacity-80" />}
        </Link>
    </div>
);

export default function Sidebar() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <aside className="w-[17.5rem] bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col z-30">
            {/* Branding - Dark Background for Logo Clarity */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900 mb-4">
                <Link href={route('dashboard')} className="flex items-center group">
                    <img
                        src="/logo_apartments24.png"
                        alt="Apartments24"
                        className="h-16 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-2">
                <div className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Overview
                </div>

                <SidebarItem
                    href={route('dashboard')}
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={route().current('dashboard')}
                />

                {user.user_type === 'admin' && (
                    <>
                        <div className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Management
                        </div>
                        <SidebarItem
                            href={route('admin.apartments.index')}
                            icon={Building2}
                            label="Apartments"
                            active={route().current('admin.apartments.*')}
                        />
                        <SidebarItem
                            href={route('admin.reports.index')}
                            icon={PieChart}
                            label="Financial Reports"
                            active={route().current('admin.reports.*')}
                        />
                        <SidebarItem
                            href={route('admin.bookings.index')}
                            icon={Calendar}
                            label="Bookings"
                            active={route().current('admin.bookings.*')}
                        />
                        <SidebarItem
                            href={route('admin.visitor-cards.index')}
                            icon={PieChart}
                            label="Visitor Cards"
                            active={route().current('admin.visitor-cards.*')}
                        />
                        <SidebarItem
                            href={route('admin.users.index')}
                            icon={Users}
                            label="Users & Roles"
                            active={route().current('admin.users.*')}
                        />
                    </>
                )}

                {user.user_type === 'owner' && (
                    <>
                        <div className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            My Portfolio
                        </div>
                        <SidebarItem
                            href={route('owner.dashboard')}
                            icon={PieChart}
                            label="Revenue"
                            active={route().current('owner.dashboard')}
                        />
                        <SidebarItem
                            href={route('owner.expenses.index')}
                            icon={PlusCircle}
                            label="Expenses"
                            active={route().current('owner.expenses.*')}
                        />
                    </>
                )}
            </nav>

            {/* User Footer */}
            <div className="p-4 bg-slate-50 mx-4 mb-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange font-bold border border-orange-100">
                        {user.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h5 className="text-slate-900 text-xs font-black truncate">{user.name}</h5>
                        <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest">{user.user_type}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-brand-orange transition-colors"
                    >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Link>
                </div>
            </div>
        </aside>
    );
}
