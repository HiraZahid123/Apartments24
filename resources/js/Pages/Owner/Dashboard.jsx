import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    TrendingUp,
    DollarSign,
    Calendar,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Home,
    Clock,
    User,
    ChevronRight,
    TrendingDown,
    LayoutDashboard,
    Receipt,
    ArrowRight,
    FileText
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ auth, stats, recentBookings, monthlyRevenue }) {

    const chartData = {
        labels: monthlyRevenue.map(item => item.month),
        datasets: [
            {
                fill: true,
                label: 'Net Revenue (€)',
                data: monthlyRevenue.map(item => item.revenue),
                borderColor: '#FF5B22',
                backgroundColor: 'rgba(255, 91, 34, 0.05)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#FF5B22',
                pointBorderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: '600' }, color: '#94a3b8' }
            },
            y: {
                beginAtZero: true,
                grid: { borderDash: [4, 4], color: '#f1f5f9' },
                ticks: {
                    callback: (value) => '€' + value,
                    font: { weight: '600' },
                    color: '#94a3b8'
                }
            }
        }
    };

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, subtext }) => (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {trendValue}
                    </span>
                )}
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">€{value}</h3>
            {subtext && <p className="text-[11px] font-bold text-slate-400 mt-2">{subtext}</p>}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">
                                Owner Insights
                            </h2>
                            {stats.ongoing_month && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200/50">
                                    Ongoing Month: {stats.ongoing_month}
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-slate-400 mt-2">
                            Overview of live metrics for the ongoing month
                        </p>
                    </div>

                    <Link
                        href={route('owner.financial-records.index')}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md active:scale-95 self-start sm:self-auto"
                    >
                        <FileText className="w-4 h-4 text-brand-orange" />
                        Financial Records
                    </Link>
                </div>
            }
        >
            <Head title="Owner Dashboard | Apartments24" />

            <div className="py-6 space-y-8">
                {/* Stats Grid - Ongoing Month */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        title={`Net Revenue (${auth.user.owner_revenue_percentage || 65}%)`}
                        value={stats.total_revenue}
                        subtext={`${stats.ongoing_month || 'Ongoing Month'}`}
                        icon={DollarSign}
                        trend={stats.revenue_trend > 0 ? 'up' : stats.revenue_trend < 0 ? 'down' : null}
                        trendValue={`${Math.abs(stats.revenue_trend)}%`}
                        color="bg-orange-50 text-brand-orange"
                    />
                    <StatCard
                        title="Operational Expenses"
                        value={stats.total_expenses}
                        subtext={`${stats.ongoing_month || 'Ongoing Month'}`}
                        icon={Receipt}
                        trend={stats.expense_trend > 0 ? 'up' : stats.expense_trend < 0 ? 'down' : null}
                        trendValue={`${Math.abs(stats.expense_trend)}%`}
                        color="bg-rose-50 text-rose-600"
                    />
                    <StatCard
                        title="Net Earnings"
                        value={stats.net_earnings}
                        subtext={`${stats.ongoing_month || 'Ongoing Month'}`}
                        icon={TrendingUp}
                        color="bg-emerald-50 text-emerald-600"
                    />
                </div>

                {/* Banner to Navigate Previous Months Financial Records */}
                <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/60 p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-brand-orange text-white rounded-2xl shadow-lg shadow-orange-500/20">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-base font-black text-slate-900">
                                Need Previous Months Financial Records?
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                                Select previous months, filter by apartment or apartment group, view reservation breakdowns, and export PDF statements.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('owner.financial-records.index')}
                        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all border border-slate-200 shadow-sm self-start md:self-auto"
                    >
                        View Previous Records <ArrowRight className="w-4 h-4 text-brand-orange" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Revenue Performance</h3>
                                <p className="text-sm font-bold text-slate-400">Monthly owner earnings overview</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-brand-orange"></div> Current Year
                                </span>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Booking Stats Summary */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                        <div className="relative z-10 h-full flex flex-col">
                            <h3 className="text-xl font-black mb-8 italic uppercase">Stay Summary</h3>

                            <div className="space-y-8 flex-1">
                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-brand-orange rounded-2xl shadow-lg shadow-orange-500/20">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bookings</p>
                                            <p className="text-2xl font-black">{stats.total_bookings}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currently In</p>
                                            <p className="text-2xl font-black">{stats.active_stays}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                                            <ArrowUpRight className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upcoming</p>
                                            <p className="text-2xl font-black">{stats.upcoming_stays}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </div>
                            </div>

                            <Link
                                href={route('owner.expenses.index')}
                                className="mt-8 w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider text-center hover:bg-slate-100 transition-all shadow-xl"
                            >
                                Manage Expenses
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-orange" /> Recent Reservations
                        </h3>
                        <Link href="/" className="text-[10px] font-black text-brand-orange uppercase tracking-widest hover:underline">View All Bookings</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5 border-b border-slate-50">Guest & Apartment</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Stay Period</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Earnings</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-brand-orange group-hover:text-white transition-all">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-tight">{booking.guest_name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{booking.apartment_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-500 font-mono">
                                                <span>{booking.check_in}</span>
                                                <ArrowRight className="w-3 h-3 text-slate-200" />
                                                <span>{booking.check_out}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900 tracking-tight">€{booking.revenue}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${booking.status === 'checked_in' ? 'bg-emerald-50 text-emerald-600' :
                                                booking.status === 'confirmed' ? 'bg-orange-50 text-brand-orange' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
