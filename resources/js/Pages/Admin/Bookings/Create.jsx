import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar, User, Mail, Building2, Users, Globe, Euro, Info } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Create({ auth, apartments }) {
    const { data, setData, post, processing, errors } = useForm({
        apartment_ids: [],
        guest_name: '',
        guest_email: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        preferred_language: 'en',
        total_price: '',
        service_fee: '',
        status: 'confirmed',
    });

    const selectedApartment = data.apartment_ids.length > 0 
        ? apartments.find(a => a.id === data.apartment_ids[0]) 
        : null;
    const ownerPercentage = selectedApartment ? parseFloat(selectedApartment.owner_revenue_percentage) / 100 : 0.65;
    const adminPercentage = 1 - ownerPercentage;

    const calculateFinancials = (total, fee, ownerPct) => {
        const t = parseFloat(total) || 0;
        const f = parseFloat(fee) || 0;

        const priceAfterVat = t / 1.13;
        const netIncome = priceAfterVat - f;
        const ownerShare = netIncome * ownerPct;
        const adminCommission = netIncome * (1 - ownerPct);

        return {
            priceAfterVat: priceAfterVat.toFixed(2),
            netIncome: netIncome.toFixed(2),
            ownerShare: ownerShare.toFixed(2),
            adminCommission: adminCommission.toFixed(2)
        };
    };

    const financials = calculateFinancials(data.total_price, data.service_fee, ownerPercentage);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.bookings.store'), {
            onSuccess: () => toast.success('Booking recorded successfully'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <>
                    <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase lg:block hidden">New Reservation</h2>
                    <h2 className="lg:hidden text-center text-xl font-black text-slate-900">New booking</h2>
                </>
            }
        >
            <Head title="Create Booking | Apartments24" />

            <div className="py-6 max-w-5xl pb-32">
                <Link
                    href={route('admin.bookings.index')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-8 group lg:flex hidden"
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
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Assign Properties (Multi-select)</label>
                            <div className="space-y-4">
                                {apartments.map(apt => {
                                    const isSelected = data.apartment_ids.includes(apt.id);
                                    return (
                                        <button
                                            key={apt.id}
                                            type="button"
                                            onClick={() => {
                                                const newIds = isSelected
                                                    ? data.apartment_ids.filter(id => id !== apt.id)
                                                    : [...data.apartment_ids, apt.id];
                                                setData('apartment_ids', newIds);
                                            }}
                                            className={`w-full p-4 rounded-2xl border flex items-center gap-3 transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                                        >
                                            <Building2 className={`w-5 h-5 ${isSelected ? 'text-indigo-200' : 'text-slate-300'}`} />
                                            <span className="font-black text-sm text-left leading-tight">{apt.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.apartment_ids && <p className="text-rose-500 text-xs font-bold mt-2">{errors.apartment_ids}</p>}
                            {data.apartment_ids.length > 0 && (
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-4">
                                    {data.apartment_ids.length} property(s) selected
                                </p>
                            )}
                        </div>

                        {/* Financials & Status */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                            <div className="flex items-center gap-3 mb-8">
                                <Euro className="w-5 h-5 text-indigo-400" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Financial Summary</h4>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Stay Price (VAT Incl.)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
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
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Fee (Booking.com/Airbnb) - Optional</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.service_fee}
                                            onChange={e => setData('service_fee', e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all font-black text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.service_fee && <p className="text-rose-400 text-xs font-bold">{errors.service_fee}</p>}
                                </div>

                                <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price after VAT (13%)</span>
                                        <span className="text-sm font-black text-indigo-300">
                                            €{financials.priceAfterVat}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Income (VAT Excl. - Fee)</span>
                                        <span className="text-sm font-black text-emerald-300">
                                            €{financials.netIncome}
                                        </span>
                                    </div>
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

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 leading-none mb-1">Owner Share ({(ownerPercentage * 100).toFixed(0)}%)</span>
                                        <span className="text-[9px] text-slate-500 font-medium">Net Income × {ownerPercentage.toFixed(2)}</span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-400">
                                        €{financials.ownerShare}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 leading-none mb-1">Admin Commission ({(adminPercentage * 100).toFixed(0)}%)</span>
                                        <span className="text-[9px] text-slate-500 font-medium">Net Income × {adminPercentage.toFixed(2)}</span>
                                    </div>
                                    <span className="text-sm font-black text-indigo-400">
                                        €{financials.adminCommission}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            Create Booking
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
