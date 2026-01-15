import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar, User, Mail, Building2, Users, Globe, DollarSign, Info } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Create({ auth, apartments }) {
    const { data, setData, post, processing, errors } = useForm({
        apartment_id: '',
        guest_name: '',
        guest_email: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        preferred_language: 'en',
        total_price: '',
        status: 'confirmed',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.bookings.store'), {
            onSuccess: () => toast.success('Booking recorded successfully'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">New Reservation</h2>}
        >
            <Head title="Create Booking | Apartments24" />

            <div className="py-6 max-w-5xl">
                <Link
                    href={route('admin.bookings.index')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Reservations
                </Link>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Guest & Stay Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Guest Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <User className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 italic uppercase">Guest Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Main Guest Name</label>
                                    <input
                                        type="text"
                                        value={data.guest_name}
                                        onChange={e => setData('guest_name', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                        placeholder="John Doe"
                                    />
                                    {errors.guest_name && <p className="text-rose-500 text-xs font-bold">{errors.guest_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Guest Email (Secure)</label>
                                    <input
                                        type="email"
                                        value={data.guest_email}
                                        onChange={e => setData('guest_email', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                        placeholder="guest@example.com"
                                    />
                                    {errors.guest_email && <p className="text-rose-500 text-xs font-bold">{errors.guest_email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Follow-up Language</label>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={data.preferred_language}
                                            onChange={e => setData('preferred_language', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900 uppercase tracking-wider"
                                        >
                                            <option value="en">English (Global)</option>
                                            <option value="et">Estonian (Local)</option>
                                            <option value="ru">Russian (Regional)</option>
                                        </select>
                                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Travelers</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.number_of_guests}
                                            onChange={e => setData('number_of_guests', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                        />
                                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
                                            <Users className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 italic uppercase">Stay Schedule</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Check-In Date</label>
                                    <input
                                        type="date"
                                        value={data.check_in_date}
                                        onChange={e => setData('check_in_date', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                    {errors.check_in_date && <p className="text-rose-500 text-xs font-bold">{errors.check_in_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Check-Out Date</label>
                                    <input
                                        type="date"
                                        value={data.check_out_date}
                                        onChange={e => setData('check_out_date', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                    {errors.check_out_date && <p className="text-rose-500 text-xs font-bold">{errors.check_out_date}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Property & Summary */}
                    <div className="space-y-8">
                        {/* Property Selection */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Assign Property</label>
                            <div className="space-y-4">
                                {apartments.map(apt => (
                                    <button
                                        key={apt.id}
                                        type="button"
                                        onClick={() => setData('apartment_id', apt.id)}
                                        className={`w-full p-4 rounded-2xl border flex items-center gap-3 transition-all ${data.apartment_id === apt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                                    >
                                        <Building2 className={`w-5 h-5 ${data.apartment_id === apt.id ? 'text-indigo-200' : 'text-slate-300'}`} />
                                        <span className="font-black text-sm text-left leading-tight">{apt.name}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.apartment_id && <p className="text-rose-500 text-xs font-bold mt-2">{errors.apartment_id}</p>}
                        </div>

                        {/* Financials & Status */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                            <div className="flex items-center gap-3 mb-8">
                                <DollarSign className="w-5 h-5 text-indigo-400" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Financial Summary</h4>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Stay Price (VAT Incl.)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.total_price}
                                            onChange={e => setData('total_price', e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-black text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.total_price && <p className="text-rose-400 text-xs font-bold">{errors.total_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Status</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-black text-white uppercase text-xs tracking-widest cursor-pointer"
                                    >
                                        <option value="confirmed" className="bg-slate-900">Confirmed</option>
                                        <option value="pending" className="bg-slate-900">Pending</option>
                                        <option value="cancelled" className="bg-slate-900">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-400">Estimated Owner Share (65%)</span>
                                    <span className="text-sm font-black text-emerald-400">
                                        ${(data.total_price * 0.65).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-[9px] text-slate-500 leading-relaxed">
                                    Final net revenue based on VAT-exclusive price will be calculated upon save.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            Finalize Booking
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
