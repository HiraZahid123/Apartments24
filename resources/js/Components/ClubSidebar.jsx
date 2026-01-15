import React from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut
} from 'lucide-react';

const SidebarItem = ({ href, icon: Icon, label, active }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
            ? 'bg-orange-500 text-white'
            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </Link>
);

export default function ClubSidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <img
                    src="/matchbase.png"
                    alt="Matchbase Logo"
                    className="h-12 w-auto object-contain"
                />
            </div>

            <nav className="flex-1 mt-4">
                <SidebarItem
                    href={route('club.dashboard')}
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={route().current('club.dashboard')}
                />
                <SidebarItem
                    href={route('athletes.index')}
                    icon={Users}
                    label="Athletes"
                    active={route().current('athletes.*')}
                />
            </nav>

            <div className="p-4 border-t border-gray-100">
                <SidebarItem
                    href={route('profile.edit')}
                    icon={Settings}
                    label="Account Settings"
                    active={route().current('profile.edit')}
                />
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
