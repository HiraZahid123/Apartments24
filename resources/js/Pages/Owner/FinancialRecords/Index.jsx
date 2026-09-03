import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    DollarSign,
    Receipt,
    TrendingUp,
    Building2,
    Layers,
    User,
    ArrowRight,
    ArrowUpRight,
    FileText,
    Info,
    Filter,
    Clock,
    CheckCircle2,
    CreditCard
} from 'lucide-react';

export default function Index({ auth, financials, bookings, expenses, filters, filterOptions }) {
    const [selectedYear, setSelectedYear] = useState(filters.year);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);
    const [selectedEntity, setSelectedEntity] = useState(filters.entity);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'expenses'

    const handleFilterChange = (updates) => {
        const nextFilters = {
            year: selectedYear,
            month: selectedMonth,
            entity: selectedEntity,
            ...updates,
        };

        if (updates.year !== undefined) setSelectedYear(updates.year);
        if (updates.month !== undefined) setSelectedMonth(updates.month);
        if (updates.entity !== undefined) setSelectedEntity(updates.entity);

        router.get(route('owner.financial-records.index'), nextFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleNavigateMonth = (direction) => {
        let newMonth = selectedMonth + direction;
        let newYear = selectedYear;

        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }

        handleFilterChange({ month: newMonth, year: newYear });
    };

    const currency = (val) =>
        new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }).format(val || 0);

    const StatCard = ({ title, value, subtext, icon: Icon, color, bg }) => (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{currency(value)}</h3>
            {subtext && <p className="text-xs font-bold text-slate-400 mt-2">{subtext}</p>}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">
                                Financial Records
                            </h2>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200/50">
                                {financials.period_label}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 mt-2">
                            Historical financial performance & payouts for {financials.entity_label}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Month Steppers */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => handleNavigateMonth(-1)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                title="Previous Month"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 text-xs font-black text-slate-700 tracking-tight">
                                {financials.month_name} {selectedYear}
                            </span>
                            <button
                                onClick={() => handleNavigateMonth(1)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                title="Next Month"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Month Picker */}
                        <select
                            value={selectedMonth}
                            onChange={(e) => handleFilterChange({ month: parseInt(e.target.value) })}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-brand-orange focus:border-brand-orange p-2.5 font-bold shadow-sm"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>

                        {/* Year Picker */}
                        <select
                            value={selectedYear}
                            onChange={(e) => handleFilterChange({ year: parseInt(e.target.value) })}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-brand-orange focus:border-brand-orange p-2.5 font-bold shadow-sm"
                        >
                            {[2024, 2025, 2026, 2027].map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>

                        {/* Export PDF Button */}
                        <a
                            href={route('owner.financial-records.export', {
                                year: selectedYear,
                                month: selectedMonth,
                                entity: selectedEntity,
                            })}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`Financial Records - ${financials.period_label} | Apartments24`} />

            <div className="py-6 space-y-8">
                {/* Property / Group Filter Bar */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                            <Filter className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter by Property</p>
                            <h4 className="text-sm font-black text-slate-800">
                                Currently Viewing: <span className="text-brand-orange">{financials.entity_label}</span>
                            </h4>
                        </div>
                    </div>

                    <div className="w-full sm:w-80">
                        <select
                            value={selectedEntity}
                            onChange={(e) => handleFilterChange({ entity: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-orange focus:border-brand-orange p-3 font-bold"
                        >
                            <option value="all">🏢 All Properties & Groups</option>

                            {filterOptions.groups && filterOptions.groups.length > 0 && (
                                <optgroup label="Apartment Groups">
                                    {filterOptions.groups.map((group) => (
                                        <option key={`group:${group.id}`} value={`group:${group.id}`}>
                                            📂 Group: {group.name} ({group.units_count} units)
                                        </option>
                                    ))}
                                </optgroup>
                            )}

                            {filterOptions.apartments && filterOptions.apartments.length > 0 && (
                                <optgroup label="Individual Apartments">
                                    {filterOptions.apartments.map((apt) => (
                                        <option key={`apartment:${apt.id}`} value={`apartment:${apt.id}`}>
                                            🏠 {apt.name}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>
                </div>

                {/* Booking.com Payout Schedule Notice */}
                <div className="bg-orange-50/70 border border-orange-200/60 p-4 rounded-2xl flex items-start gap-3 text-orange-950">
                    <Info className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div className="text-xs font-bold leading-relaxed">
                        <span className="font-black uppercase tracking-wider text-brand-orange mr-1.5">
                            Booking.com Payout Alignment:
                        </span>
                        All reservations and financial figures are attributed to the month of the guest's{' '}
                        <strong>check-out date</strong> to strictly align with Booking.com's monthly payout calendar.
                    </div>
                </div>

                {/* Key Financial Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    <StatCard
                        title={`Net Revenue (${financials.owner_revenue_percentage}%)`}
                        value={financials.net_revenue}
                        subtext="Owner payout"
                        icon={DollarSign}
                        color="text-brand-orange"
                        bg="bg-orange-50"
                    />
                    <StatCard
                        title="Operational Expenses"
                        value={financials.total_expenses}
                        subtext={`${financials.expenses_count} recorded expense(s)`}
                        icon={Receipt}
                        color="text-rose-600"
                        bg="bg-rose-50"
                    />
                    <StatCard
                        title="Net Earnings"
                        value={financials.net_earnings}
                        subtext="Net Revenue minus Expenses"
                        icon={TrendingUp}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                    />
                    <StatCard
                        title="Total Gross Revenue"
                        value={financials.total_revenue}
                        subtext={`${financials.bookings_count} completed stay(s)`}
                        icon={Building2}
                        color="text-indigo-600"
                        bg="bg-indigo-50"
                    />
                    <StatCard
                        title="Admin Management Fee"
                        value={financials.admin_commission}
                        subtext={`Admin's ${100 - financials.owner_revenue_percentage}% share`}
                        icon={FileText}
                        color="text-slate-600"
                        bg="bg-slate-100"
                    />
                    <StatCard
                        title="Service Fees"
                        value={financials.service_fees}
                        subtext="Booking.com / Airbnb platform fees"
                        icon={CreditCard}
                        color="text-sky-600"
                        bg="bg-sky-50"
                    />
                </div>

                {/* Tabbed Records Breakdown */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    {/* Header & Tabs */}
                    <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                                    activeTab === 'bookings'
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                Completed Reservations ({bookings.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('expenses')}
                                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                                    activeTab === 'expenses'
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                Logged Expenses ({expenses.length})
                            </button>
                        </div>

                        <span className="text-[11px] font-bold text-slate-400">
                            Showing records for <strong>{financials.period_label}</strong>
                        </span>
                    </div>

                    {/* Bookings Table */}
                    {activeTab === 'bookings' && (
                        <div className="overflow-x-auto">
                            {bookings.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                                            <th className="px-8 py-5 border-b border-slate-100">Guest & Apartment</th>
                                            <th className="px-8 py-5 border-b border-slate-100">Stay Dates</th>
                                            <th className="px-8 py-5 border-b border-slate-100">Check-out Date</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-right">Gross Price</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-right">Service Fee</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-right">Admin Fee</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-right">Net Revenue (Payout)</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {bookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-all">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 leading-tight">
                                                                {booking.guest_name}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                                {booking.apartment_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 font-mono">
                                                        <span>{booking.check_in}</span>
                                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                                        <span>{booking.check_out}</span>
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-400">
                                                        {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-700 font-mono">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        {booking.check_out}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-sm font-black text-slate-900 font-mono">
                                                        {currency(booking.total_price)}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-xs font-bold text-slate-500 font-mono">
                                                        {currency(booking.service_fee)}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-xs font-bold text-slate-500 font-mono">
                                                        {currency(booking.admin_commission)}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-sm font-black text-brand-orange font-mono">
                                                        {currency(booking.net_revenue)}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span
                                                        className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                                            booking.status === 'checked_in'
                                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                                                                : booking.status === 'confirmed'
                                                                ? 'bg-orange-50 text-brand-orange border border-orange-200/50'
                                                                : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {booking.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-16 px-4">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-base font-black text-slate-800">No Reservations Found</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm mx-auto">
                                        There are no reservations with check-out dates in {financials.period_label} for {financials.entity_label}.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Expenses Table */}
                    {activeTab === 'expenses' && (
                        <div className="overflow-x-auto">
                            {expenses.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                                            <th className="px-8 py-5 border-b border-slate-100">Property / Group</th>
                                            <th className="px-8 py-5 border-b border-slate-100">Description</th>
                                            <th className="px-8 py-5 border-b border-slate-100">Date Logged</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-right">Amount</th>
                                            <th className="px-8 py-5 border-b border-slate-100 text-center">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                                                            <Receipt className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 leading-tight">
                                                                {expense.target_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {expense.description}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-mono font-bold text-slate-500">
                                                        {expense.date}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-sm font-black text-rose-600 font-mono">
                                                        {currency(expense.amount)}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {expense.proof_image_url ? (
                                                        <a
                                                            href={expense.proof_image_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-black transition-colors"
                                                        >
                                                            View
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-16 px-4">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Receipt className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-base font-black text-slate-800">No Expenses Recorded</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm mx-auto">
                                        There are no operational expenses logged for {financials.period_label} for {financials.entity_label}.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
