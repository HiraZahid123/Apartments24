import React, { useState, useEffect, useRef } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import {
    User,
    LogOut,
    ChevronDown,
    Bell,
    Search,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    UserPlus,
    X,
    Loader2
} from 'lucide-react';

export default function Header() {
    const { user, impersonated_by } = usePage().props.auth;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const searchRef = useRef(null);
    const notificationRef = useRef(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (impersonated_by) return; // Skip notification fetch when impersonating as it hits admin-only route
        try {
            const response = await fetch(route('admin.notifications.latest'));
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    // Poll for notifications
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                setSearchResults(data.results || []);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (url) => {
        setSearchQuery('');
        setShowResults(false);
        router.visit(url);
    };

    const markAsRead = async (id) => {
        try {
            await router.post(route('admin.notifications.read', id), {}, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => fetchNotifications()
            });
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'booking': return <Calendar className="w-4 h-4" />;
            case 'checkin': return <CheckCircle className="w-4 h-4" />;
            case 'checkout': return <LogOut className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    return (
        <header className="h-20 bg-white px-8 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md" ref={searchRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for bookings, guests..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setShowResults(false); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                            <div className="p-2">
                                {searchResults.map((result, index) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleResultClick(result.url)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                    >
                                        <div className={`p-2 rounded-lg ${result.type === 'booking' ? 'bg-orange-50 text-brand-orange' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {result.type === 'booking' ? <Calendar className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{result.title}</p>
                                            <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase">{result.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center z-50">
                            <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-5">
                {/* Impersonation Return */}
                {impersonated_by && (
                    <button
                        onClick={() => router.post(route('admin.impersonate.leave'))}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Return to Admin
                    </button>
                )}
                {/* Actions */}
                <div className="flex items-center gap-1 md:gap-2 pr-4 border-r border-slate-100">
                    {/* Notifications Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                                    <h4 className="text-sm font-black text-slate-900">Notifications</h4>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                                            {unreadCount} New
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!notif.read_at ? 'bg-slate-50/50' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${notif.data.bg_color || 'bg-slate-100'} ${notif.data.icon_color || 'text-slate-500'}`}>
                                                        {getIcon(notif.data.type)}
                                                    </div>
                                                    <div className="flex-1 cursor-pointer" onClick={() => notif.data.action_url && router.visit(notif.data.action_url)}>
                                                        <p className={`text-sm text-slate-900 ${!notif.read_at ? 'font-bold' : 'font-medium'}`}>
                                                            {notif.data.message}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                                                            <span>{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            {!notif.read_at && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                                                    className="text-brand-orange hover:underline font-bold"
                                                                >
                                                                    Mark Read
                                                                </button>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 text-sm font-medium">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-slate-50 bg-slate-50/50">
                                    <Link
                                        href={route('admin.notifications.index')}
                                        className="block w-full text-center text-xs font-black text-brand-orange uppercase tracking-widest hover:underline"
                                    >
                                        View All Notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User */}
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="w-9 h-9 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-100">
                                {user.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                                <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mt-1">{user.user_type || 'Admin'}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="right" width="48">
                        <div className="px-4 py-3 border-b border-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                            <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{user.email}</p>
                        </div>

                        <Dropdown.Link href={route('profile.edit')}>
                            <div className="flex items-center gap-2 py-0.5">
                                <User className="w-4 h-4" />
                                <span className="font-bold text-sm">Account Settings</span>
                            </div>
                        </Dropdown.Link>

                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            <div className="flex items-center gap-2 py-0.5 text-red-500">
                                <LogOut className="w-4 h-4" />
                                <span className="font-bold text-sm">Sign Out</span>
                            </div>
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
