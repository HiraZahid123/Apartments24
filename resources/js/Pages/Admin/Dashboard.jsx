import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShieldAlert,
    Building2,
    UserCheck,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Clock,
    Mail,
    Filter,
    CalendarDays,
    X
} from 'lucide-react';

export default function Dashboard({ bookings, stats, filters }) {
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState(filters?.filter || 'all');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    const applyFilter = (filter) => {
        setActiveFilter(filter);
        router.get(route('admin.dashboard'), {
            filter: filter,
            date_from: dateFrom,
            date_to: dateTo
        }, { preserveState: true, preserveScroll: true });
    };

    const applyDateFilter = () => {
        router.get(route('admin.dashboard'), {
            filter: activeFilter,
            date_from: dateFrom,
            date_to: dateTo
        }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setActiveFilter('all');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.dashboard'), {}, { preserveState: true, preserveScroll: true });
    };

    const filterButtons = [
        { key: 'all', label: 'All', color: 'slate' },
        { key: 'today', label: 'Today', color: 'orange' },
        { key: 'active', label: 'Active', color: 'emerald' },
        { key: 'upcoming', label: 'Upcoming', color: 'blue' },
        { key: 'past', label: 'Past', color: 'gray' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 rounded-full">Active</span>;
            case 'upcoming':
                return <span className="px-2 py-1 text-[10px] font-black uppercase bg-blue-50 text-blue-600 rounded-full">Upcoming</span>;
            case 'past':
                return <span className="px-2 py-1 text-[10px] font-black uppercase bg-slate-100 text-slate-400 rounded-full">Past</span>;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Admin Control</h2>}
        >
            <Head title="Admin Dashboard | Apartments24" />

            <div className="py-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Active Bookings', value: stats.active_bookings, icon: Calendar, color: 'text-brand-orange', bg: 'bg-orange-50' },
                        { label: 'Completed Check-ins', value: stats.todays_checkins, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Pending Registrations', value: stats.pending_checkins, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Total Apartments', value: stats.total_apartments, icon: Building2, color: 'text-rose-600', bg: 'bg-rose-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Filter</span>
                        </div>

                        {/* Quick Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {filterButtons.map(btn => (
                                <button
                                    key={btn.key}
                                    onClick={() => applyFilter(btn.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeFilter === btn.key
                                            ? 'bg-brand-orange text-white shadow-lg shadow-orange-100'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition-all"
                        >
                            <CalendarDays className="w-4 h-4" />
                            Date Range
                        </button>
                    </div>

                    {/* Date Range Filters */}
                    {showFilters && (
                        <div className="px-6 pb-6 border-t border-slate-50 pt-4">
                            <div className="flex flex-wrap items-end gap-4">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">From Date</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">To Date</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>
                                <button
                                    onClick={applyDateFilter}
                                    className="px-6 py-3 bg-brand-orange text-white rounded-xl font-black text-sm hover:bg-orange-700 transition-all"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-3 text-slate-500 hover:text-slate-700 rounded-xl font-black text-sm transition-all flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Operational Overview</h3>
                            <p className="text-sm text-slate-500 font-medium">
                                {activeFilter === 'all' ? 'Active & Upcoming' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings
                                {(dateFrom || dateTo) && ` • ${dateFrom || '...'} to ${dateTo || '...'}`}
                            </p>
                        </div>
                        <Link href={route('admin.bookings.index')} className="text-brand-orange font-bold text-sm flex items-center gap-1 hover:underline">
                            Manage All Bookings <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                                    <th className="px-8 py-5 border-b border-slate-50">Apartment & Guest</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Check-in / Out</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Status</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Registration</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Form Sent</th>
                                    <th className="px-8 py-5 border-b border-slate-50 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.length > 0 ? bookings.map((booking) => (
                                    <tr key={booking.id} className={`group hover:bg-slate-50/50 transition-colors ${booking.is_today ? 'bg-orange-50/30' : ''}`}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${booking.is_today ? 'bg-orange-100 text-brand-orange' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{booking.apartment_name}</p>
                                                    <p className="text-xs font-medium text-slate-500">{booking.guest_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-bold text-slate-900">{booking.check_in_date}</span>
                                                <span className="text-slate-300">→</span>
                                                <span className="font-bold text-slate-500">{booking.check_out_date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-8 py-6">
                                            {booking.is_checked_in ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Checked In
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-wider">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            {booking.checkin_form_sent ? (
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    <span className="text-xs font-bold uppercase">Success</span>
                                                </div>
                                            ) : (
                                                <button className="flex items-center gap-2 text-brand-orange hover:text-orange-700 font-bold text-xs uppercase group/btn">
                                                    <Mail className="w-4 h-4 group-hover/btn:-rotate-12 transition-transform" />
                                                    Send Form
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={route('admin.bookings.edit', booking.id)}
                                                className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm inline-block"
                                            >
                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Calendar className="w-12 h-12 text-slate-200" />
                                                <p className="text-slate-500 font-bold italic">No bookings found for selected filters</p>
                                                <button onClick={clearFilters} className="text-brand-orange font-bold text-sm hover:underline">
                                                    Clear Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Banner */}
                <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-black mb-2 italic uppercase">Quick Actions</h3>
                            <p className="text-slate-400 font-medium max-w-md">
                                Jump directly to key management sections to add new property or reconcile monthly visitor cards.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link href={route('admin.apartments.create')} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-all uppercase tracking-tight">
                                New Apartment
                            </Link>
                            <Link href={route('admin.bookings.create')} className="px-6 py-3 bg-brand-orange text-white rounded-xl font-black text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-900 uppercase tracking-tight">
                                New Booking
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
