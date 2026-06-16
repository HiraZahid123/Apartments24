import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar, User, Mail, Building2, Users, Globe, Euro, Info, Trash2, CheckCircle, Clock, AlertTriangle, Fingerprint, FileText, Send, PlusCircle, Copy } from 'lucide-react';
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
        service_fee: booking.service_fee || '',
        status: booking.status || 'confirmed',
        wants_invoice: booking.wants_invoice || false,
        invoice_name: booking.invoice_name || '',
        invoice_registration_code: booking.invoice_registration_code || '',
        invoice_address: booking.invoice_address || '',
        invoice_vat_number: booking.invoice_vat_number || '',
        invoice_accommodated_guests: booking.invoice_accommodated_guests || '',
    });

    const selectedApartment = apartments.find(a => a.id === parseInt(data.apartment_id));
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

    const resendInvoice = () => {
        post(route('admin.bookings.invoice.resend', booking.id), {
            onSuccess: () => toast.success('Invoice sent to guest email'),
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

                    <div className="flex items-center gap-6">
                        <a
                            href={route('admin.bookings.invoice', booking.id)}
                            className="inline-flex items-center gap-2 text-sm font-black text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest"
                        >
                            <FileText className="w-4 h-4" />
                            Download Invoice
                        </a>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 text-sm font-black text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-widest"
                        >
                            <Trash2 className="w-4 h-4" />
                            Cancel Booking
                        </button>
                    </div>
                </div>

                {/* Mobile Check-in Actions */}
                <div className="lg:hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8 space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Online Check-in:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                const url = `${window.location.origin}/guest/checkin/${booking.checkin_token}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Link copied!');
                            }}
                            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-indigo-600 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                        >
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </button>
                        <button
                            type="button"
                            onClick={sendCheckinForm}
                            className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Send by Email
                        </button>
                    </div>
                </div>

                {/* Desktop Resend Actions Bar */}
                <div className="hidden lg:flex flex-wrap gap-4 mb-8">
                    <button
                        type="button"
                        onClick={sendCheckinForm}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all group"
                    >
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Resend Check-in Link
                    </button>
                    
                    <button
                        type="button"
                        onClick={resendInvoice}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all group"
                    >
                        <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Resend Invoice
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
                                        <CheckCircle className="w-6 h-6" />
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

                        {/* Operational Details (Guest Data) */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
                                    <Fingerprint className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 italic uppercase">Guests:</h3>
                            </div>

                            {booking.checkins && booking.checkins.length > 0 ? (
                                <div className="space-y-12">
                                    {booking.checkins.map((guest, index) => (
                                        <div key={guest.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="font-black text-slate-900 uppercase italic leading-tight">{guest.first_name} {guest.last_name}</p>
                                                <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-wider border border-slate-100">
                                                    Completed
                                                </span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => toast.info('Guest removal from record is not permitted for completed check-ins.')}
                                                className="p-3 bg-rose-50 text-rose-500 rounded-xl"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => toast.info('To add more guests, please update the "Total Travelers" count in the profile section.')}
                                        className="w-full py-6 bg-indigo-50 border-2 border-dashed border-indigo-100 rounded-[2rem] text-indigo-600 flex flex-col items-center gap-2 hover:bg-indigo-100 transition-all group"
                                    >
                                        <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                            <PlusCircle className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Add Guest</span>
                                    </button>

                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                                        <CheckCircle className="w-5 h-5" />
                                        <p className="text-xs font-bold font-mono italic">Registration data submitted for all guests.</p>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                                        <CheckCircle className="w-5 h-5" />
                                        <p className="text-xs font-bold font-mono italic">Check-in data submitted for all guests.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-medium mb-6">Detailed guest travel documents and IDs will appear here once the check-in form is submitted.</p>
                                    <button
                                        type="button"
                                        onClick={sendCheckinForm}
                                        className="px-8 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl font-black text-xs uppercase shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto"
                                    >
                                        <Mail className="w-4 h-4" /> Send Form Manual Link
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Invoice & Billing Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 italic uppercase">Invoice & Billing</h3>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-2xl px-4 py-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wants Invoice</span>
                                    <button
                                        type="button"
                                        onClick={() => setData('wants_invoice', !data.wants_invoice)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${data.wants_invoice ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.wants_invoice ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className={`space-y-8 transition-all duration-500 ${data.wants_invoice ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Company / Recipient Name</label>
                                        <input
                                            type="text"
                                            value={data.invoice_name}
                                            onChange={e => setData('invoice_name', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-bold text-slate-900"
                                            placeholder="Guest Name or Company Name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Registration Code</label>
                                        <input
                                            type="text"
                                            value={data.invoice_registration_code}
                                            onChange={e => setData('invoice_registration_code', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-bold text-slate-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">VAT Number</label>
                                        <input
                                            type="text"
                                            value={data.invoice_vat_number}
                                            onChange={e => setData('invoice_vat_number', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-bold text-slate-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Accommodated Guests (for Invoice)</label>
                                        <textarea
                                            value={data.invoice_accommodated_guests}
                                            onChange={e => setData('invoice_accommodated_guests', e.target.value)}
                                            rows="1"
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-bold text-slate-900"
                                            placeholder="Names of all guests..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Billing Address</label>
                                    <textarea
                                        value={data.invoice_address}
                                        onChange={e => setData('invoice_address', e.target.value)}
                                        rows="3"
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-bold text-slate-900"
                                        placeholder="Street, City, Postcode, Country"
                                    />
                                </div>
                            </div>
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
                                    <span className="font-black text-sm">{booking.linked_apartment_names}</span>
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
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Price (VAT Incl.)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
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
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Fee (Booking.com/Airbnb)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.service_fee}
                                            onChange={e => setData('service_fee', e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-rose-500 font-black text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
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
                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 leading-none mb-1">Owner Share ({(ownerPercentage * 100).toFixed(0)}%)</span>
                                        <span className="text-[9px] text-slate-500 font-medium tracking-tight">Net Income × {ownerPercentage.toFixed(2)}</span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-400">
                                        €{financials.ownerShare}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 leading-none mb-1">Admin Commission ({(adminPercentage * 100).toFixed(0)}%)</span>
                                        <span className="text-[9px] text-slate-500 font-medium tracking-tight">Net Income × {adminPercentage.toFixed(2)}</span>
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
                            Edit Booking
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all flex items-center justify-center gap-3"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete Booking
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
