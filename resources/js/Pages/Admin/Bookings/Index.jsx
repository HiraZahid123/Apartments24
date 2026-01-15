import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Mail, Edit2, Trash2, CheckCircle2, Clock, User, Building2, ArrowRight, Search, Filter, Copy, ExternalLink, X, CheckSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Index({ auth, bookings, filters }) {
    const { post, delete: destroy } = useForm();
    const [copiedId, setCopiedId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    // Bulk Actions State
    const [selectedIds, setSelectedIds] = useState([]);
    const [processingBulk, setProcessingBulk] = useState(false);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            router.get(route('admin.bookings.index'), { search }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            destroy(route('admin.bookings.destroy', id), {
                onSuccess: () => toast.success('Booking deleted successfully'),
            });
        }
    };

    const handleSendForm = (id) => {
        post(route('admin.bookings.send-checkin', id), {
            onSuccess: () => toast.success('Check-in link sent to guest email'),
        });
    };

    const copyCheckinLink = (id, token) => {
        const url = `${window.location.origin}/guest/checkin/${token}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.success('Check-in link copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Bulk Action Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(bookings.map(b => b.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} bookings?`)) return;

        setProcessingBulk(true);
        router.delete(route('admin.bookings.bulk-destroy'), {
            data: { ids: selectedIds },
            onSuccess: () => {
                toast.success(`${selectedIds.length} bookings deleted!`);
                setSelectedIds([]);
                setProcessingBulk(false);
            },
            onError: () => setProcessingBulk(false)
        });
    };

    const handleBulkStatus = (status) => {
        setProcessingBulk(true);
        router.post(route('admin.bookings.bulk-update-status'), { ids: selectedIds, status }, {
            onSuccess: () => {
                toast.success(`Bookings updated to ${status}!`);
                setSelectedIds([]);
                setProcessingBulk(false);
            },
            onError: () => setProcessingBulk(false)
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-50 text-blue-600';
            case 'checked_in': return 'bg-brand-orange/10 text-brand-orange';
            case 'checked_out': return 'bg-slate-100 text-slate-500';
            case 'cancelled': return 'bg-rose-50 text-rose-600';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Reservations</h2>}
        >
            <Head title="Manage Bookings | Apartments24" />

            <div className="py-6 pb-24 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search by guest, apartment, or email..."
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-medium text-slate-600"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-orange transition-colors shadow-sm"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                    <Link
                        href={route('admin.bookings.create')}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        New Reservation
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    <th className="px-6 py-5 border-b border-slate-50 w-12">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={bookings.length > 0 && selectedIds.length === bookings.length}
                                            className="w-5 h-5 rounded-lg border-slate-300 text-brand-orange focus:ring-brand-orange"
                                        />
                                    </th>
                                    <th className="px-6 py-5 border-b border-slate-50">Guest & Property</th>
                                    <th className="px-6 py-5 border-b border-slate-50">Stay Dates</th>
                                    <th className="px-6 py-5 border-b border-slate-50">Financials</th>
                                    <th className="px-6 py-5 border-b border-slate-50">Status</th>
                                    <th className="px-6 py-5 border-b border-slate-50 text-right">Operational Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.length > 0 ? bookings.map((booking) => (
                                    <tr key={booking.id} className={`group transition-colors ${selectedIds.includes(booking.id) ? 'bg-orange-50/40' : 'hover:bg-slate-50/50'}`}>
                                        <td className="px-6 py-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(booking.id)}
                                                onChange={() => handleSelect(booking.id)}
                                                className="w-5 h-5 rounded-lg border-slate-300 text-brand-orange focus:ring-brand-orange"
                                            />
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-orange-50 text-brand-orange rounded-xl">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-tight mb-1">{booking.guest_name}</p>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                        <Building2 className="w-3 h-3" />
                                                        {booking.apartment_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-black text-slate-900 font-mono">{booking.check_in_date}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-px flex-1 bg-slate-100"></div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase italic">To</span>
                                                    <div className="h-px flex-1 bg-slate-100"></div>
                                                </div>
                                                <p className="text-sm font-black text-slate-500 font-mono">{booking.check_out_date}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-slate-900 tracking-tight">${booking.total_price}</p>
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase">Paid / Confirmed</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!booking.is_checked_in && (
                                                    <>
                                                        <button
                                                            onClick={() => copyCheckinLink(booking.id, booking.checkin_token)}
                                                            className={`p-3 rounded-xl transition-all border border-transparent ${copiedId === booking.id
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                : 'text-brand-orange hover:bg-orange-50 hover:border-orange-100'
                                                                }`}
                                                            title={copiedId === booking.id ? 'Copied!' : 'Copy Check-in Link'}
                                                        >
                                                            {copiedId === booking.id ? <CheckCircle2 className="w-5 h-5 animate-in zoom-in duration-300" /> : <Copy className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleSendForm(booking.id)}
                                                            className={`p-3 rounded-xl transition-all ${booking.checkin_form_sent
                                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                                : 'text-slate-400 hover:text-brand-orange hover:bg-orange-50'
                                                                }`}
                                                            title={booking.checkin_form_sent ? `Sent ${booking.checkin_form_sent_at}` : 'Send Check-in Mail'}
                                                        >
                                                            <Mail className="w-5 h-5" />
                                                            {booking.checkin_form_sent && (
                                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                                {booking.is_checked_in && (
                                                    <Link
                                                        href={route('guest.checkin', { token: booking.checkin_token })}
                                                        target="_blank"
                                                        className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="View Guest Portal"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </Link>
                                                )}
                                                <Link
                                                    href={route('admin.bookings.edit', booking.id)}
                                                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm"
                                                    title="Edit Registration"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Cancel/Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Calendar className="w-16 h-16 text-slate-200" />
                                                <h4 className="text-xl font-black text-slate-400 uppercase italic">No Active Reservations</h4>
                                                <p className="text-slate-400 font-medium mb-8">Start by synchronizing your property calendar.</p>
                                                <Link
                                                    href={route('admin.bookings.create')}
                                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-orange rounded-xl font-black text-sm uppercase border border-slate-200 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <Plus className="w-5 h-5" /> Create Booking
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Floating Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300 border border-slate-700 w-auto max-w-full mx-4">
                        <div className="flex items-center gap-3 pl-2">
                            <div className="bg-brand-orange text-white text-xs font-black rounded-lg px-2 py-1">
                                {selectedIds.length}
                            </div>
                            <span className="font-bold text-sm whitespace-nowrap">Selected</span>
                        </div>

                        <div className="h-8 w-px bg-slate-700"></div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkStatus('confirmed')}
                                disabled={processingBulk}
                                className="px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Confirm
                            </button>
                            <button
                                onClick={() => handleBulkStatus('cancelled')}
                                disabled={processingBulk}
                                className="px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4 text-slate-400" /> Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={processingBulk}
                                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-2 shadow-lg shadow-rose-900/50"
                            >
                                {processingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                        </div>

                        <button
                            onClick={() => setSelectedIds([])}
                            className="ml-2 p-1 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
