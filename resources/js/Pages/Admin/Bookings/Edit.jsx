import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar, User, Mail, Building2, Users, Globe, DollarSign, Info, Trash2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Edit({ auth, booking, apartments }) {
    const { data, setData, put, processing, errors, delete: destroy, post } = useForm({
        apartment_id: booking.apartment_id || '',
        guest_name: booking.guest_name || '',
        guest_email: booking.guest_email || '',
        check_in_date: booking.check_in_date || '',
        check_out_date: booking.check_out_date || '',
        number_of_guests: booking.number_of_guests || 1,
        preferred_language: booking.preferred_language || 'en',
        total_price: booking.total_price || '',
        status: booking.status || 'confirmed',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.bookings.update', booking.id), {
            onSuccess: () => toast.success('Booking updated successfully'),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to cancel/delete this reservation?')) {
            destroy(route('admin.bookings.destroy', booking.id), {
                onSuccess: () => toast.success('Booking deleted'),
            });
        }
    };

    const sendCheckinForm = () => {
        post(route('admin.bookings.send-checkin', booking.id), {
            onSuccess: () => toast.success('Check-in form sent to guest'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Edit Reservation</h2>}
        >
            <Head title={`Edit Booking - ${booking.guest_name} | Apartments24`} />

            <div className="py-6 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={route('admin.bookings.index')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Reservations
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 text-sm font-black text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-widest"
                    >
                        <Trash2 className="w-4 h-4" />
                        Cancel Booking
                    </button>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Alert Banner */}
                        {booking.is_checked_in && (
                            <div className="bg-emerald-600 text-white rounded-[2rem] p-6 flex items-center justify-between shadow-lg shadow-emerald-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-500 rounded-lg">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-wider text-sm">Guest In-House</p>
                                        <p className="text-emerald-100 text-xs font-bold leading-tight">Digital check-in form was submitted successfully.</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">Verified</span>
                            </div>
                        )}

                        {!booking.is_checked_in && booking.checkin_form_sent && (
                            <div className="bg-amber-500 text-white rounded-[2rem] p-6 flex items-center justify-between shadow-lg shadow-amber-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-amber-400 rounded-lg">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-wider text-sm">Form Sent, Pending Submission</p>
                                        <p className="text-amber-100 text-xs font-bold leading-tight">Link sent on {booking.checkin_form_sent_at}.</p>
                                    </div>
                                </div>
                                <button type="button" onClick={sendCheckinForm} className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase hover:bg-white/30 transition-all">Resend</button>
                            </div>
                        )}

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
                                    />
                                    {errors.guest_name && <p className="text-rose-500 text-xs font-bold">{errors.guest_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Guest Email</label>
                                    <input
                                        type="email"
                                        value={data.guest_email}
                                        onChange={e => setData('guest_email', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                    {errors.guest_email && <p className="text-rose-500 text-xs font-bold">{errors.guest_email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Language Preference</label>
                                    <select
                                        value={data.preferred_language}
                                        onChange={e => setData('preferred_language', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900 uppercase tracking-wider"
                                    >
                                        <option value="en">English (Global)</option>
                                        <option value="et">Estonian (Local)</option>
                                        <option value="ru">Russian (Regional)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Guests</label>
                                    <input
                                        type="number"
                                        value={data.number_of_guests}
                                        onChange={e => setData('number_of_guests', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Operational Details (Placeholder for Guest Data) */}
                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 border-dashed text-center">
                            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h4 className="text-lg font-black text-slate-400 uppercase italic">Registration Data</h4>
                            <p className="text-slate-400 font-medium mb-6">Detailed guest travel documents and IDs will appear here once the check-in form is submitted.</p>
                            {!booking.is_checked_in && (
                                <button
                                    type="button"
                                    onClick={sendCheckinForm}
                                    className="px-8 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl font-black text-xs uppercase shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto"
                                >
                                    <Mail className="w-4 h-4" /> Send Form Manual Link
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Property & Schedule */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <div className="mb-6">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Selected Property</label>
                                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                    <span className="font-black text-sm">{booking.apartment?.name}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-In</label>
                                    <input
                                        type="date"
                                        value={data.check_in_date}
                                        onChange={e => setData('check_in_date', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold text-slate-900 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-Out</label>
                                    <input
                                        type="date"
                                        value={data.check_out_date}
                                        onChange={e => setData('check_out_date', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold text-slate-900 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financials & Status */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                            <div className="space-y-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.total_price}
                                            onChange={e => setData('total_price', e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-black text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stay Status</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-black text-white uppercase text-xs tracking-widest"
                                    >
                                        <option value="confirmed" className="bg-slate-900">Confirmed</option>
                                        <option value="checked_in" className="bg-slate-900">Checked In</option>
                                        <option value="checked_out" className="bg-slate-900">Checked Out</option>
                                        <option value="cancelled" className="bg-slate-900">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-900 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
