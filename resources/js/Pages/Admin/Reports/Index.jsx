import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Wallet,
    PieChart,
    Download,
    Calendar,
    ArrowUpRight,
    Building2,
    DollarSign
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Index({ financials, chartData, topApartments, filters }) {
    const [selectedYear, setSelectedYear] = useState(filters.year);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);

    const handleFilterChange = (key, value) => {
        if (key === 'year') setSelectedYear(value);
        if (key === 'month') setSelectedMonth(value);

        router.get(route('admin.reports.index'), {
            year: key === 'year' ? value : selectedYear,
            month: key === 'month' ? value : selectedMonth
        }, { preserveState: true, preserveScroll: true });
    };

    const revenueChartData = {
        labels: chartData.map(d => d.month),
        datasets: [
            {
                label: 'Total Revenue',
                data: chartData.map(d => d.total_revenue),
                borderColor: '#6366f1', // Indigo
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
            },
            {
                label: 'Admin Commission (35%)',
                data: chartData.map(d => d.admin_commission),
                borderColor: '#10b981', // Emerald
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                borderColor: '#334155',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                boxPadding: 4
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { borderDash: [4, 4], color: '#f1f5f9' },
                ticks: { callback: (value) => '$' + value }
            }
        }
    };

    const StatCard = ({ title, value, subtext, icon: Icon, color, bg }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            {subtext && <p className="text-xs font-bold text-slate-400 mt-2">{subtext}</p>}
        </div>
    );

    const currency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">
                        Financial Reports
                    </h2>
                    <div className="flex gap-2">
                        <select
                            value={selectedMonth}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold"
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <a
                            href={route('admin.reports.export', { year: selectedYear, month: selectedMonth })}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Reports | Apartments24" />

            <div className="py-6 max-w-7xl mx-auto space-y-6">

                {/* Monthly Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={`Total Revenue (${financials.month})`}
                        value={currency(financials.total_revenue)}
                        subtext="Gross before split"
                        icon={BarChart3}
                        color="text-indigo-600"
                        bg="bg-indigo-50"
                    />
                    <StatCard
                        title="Admin Commission (35%)"
                        value={currency(financials.admin_commission)}
                        subtext="Net income for platform"
                        icon={Wallet}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                    />
                    <StatCard
                        title="Owner Payout (65%)"
                        value={currency(financials.owner_share)}
                        subtext="To be distributed"
                        icon={Building2}
                        color="text-brand-orange"
                        bg="bg-orange-50"
                    />
                    <StatCard
                        title={`Owner Expenses (${financials.month})`}
                        value={currency(financials.expenses)}
                        subtext="Logged by owners"
                        icon={PieChart}
                        color="text-rose-600"
                        bg="bg-rose-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900">Revenue Trends ({selectedYear})</h3>
                        </div>
                        <div className="h-[350px]">
                            <Line data={revenueChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Top Apartments */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-brand-orange" />
                            Top Performers ({selectedYear})
                        </h3>
                        <div className="space-y-4">
                            {topApartments.map((apt, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-500'}`}>
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{apt.name}</p>
                                            <p className="text-xs font-medium text-slate-500">{apt.bookings_count} bookings</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-emerald-600">{currency(apt.revenue)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
