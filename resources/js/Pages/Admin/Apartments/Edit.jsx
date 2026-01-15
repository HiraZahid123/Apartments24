import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Building2, MapPin, User, Key, Info, FileText, ToggleRight, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Edit({ auth, apartment, owners }) {
    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        name: apartment.name || '',
        address: apartment.address || '',
        city: apartment.city || '',
        instructions: apartment.instructions || '',
        rental_terms: apartment.rental_terms || '',
        owner_id: apartment.owner_id || '',
        owner_name: apartment.owner_name || '',
        keybox_code: apartment.keybox_code || '',
        is_active: apartment.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.apartments.update', apartment.id), {
            onSuccess: () => toast.success('Apartment updated successfully'),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this property?')) {
            destroy(route('admin.apartments.destroy', apartment.id), {
                onSuccess: () => toast.success('Apartment deleted successfully'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Edit Property</h2>}
        >
            <Head title={`Edit ${apartment.name} | Apartments24`} />

            <div className="py-6 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={route('admin.apartments.index')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Portfolio
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 text-sm font-black text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-widest"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Property
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Property Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-3 h-3" /> Apartment Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                />
                                {errors.name && <p className="text-rose-500 text-xs font-bold">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> City
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                />
                                {errors.city && <p className="text-rose-500 text-xs font-bold">{errors.city}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Full Address
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    rows="2"
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                />
                                {errors.address && <p className="text-rose-500 text-xs font-bold">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Operational Details Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Key className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Management Info</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3" /> Assign Owner Account
                                </label>
                                <select
                                    value={data.owner_id}
                                    onChange={e => setData('owner_id', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                >
                                    <option value="">Select an Owner</option>
                                    {owners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.name}</option>
                                    ))}
                                </select>
                                {errors.owner_id && <p className="text-rose-500 text-xs font-bold">{errors.owner_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3" /> Reference Owner Name
                                </label>
                                <input
                                    type="text"
                                    value={data.owner_name}
                                    onChange={e => setData('owner_name', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                />
                                {errors.owner_name && <p className="text-rose-500 text-xs font-bold">{errors.owner_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Key className="w-3 h-3" /> Keybox Code
                                </label>
                                <input
                                    type="text"
                                    value={data.keybox_code}
                                    onChange={e => setData('keybox_code', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900 font-mono"
                                />
                                {errors.keybox_code && <p className="text-rose-500 text-xs font-bold">{errors.keybox_code}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ToggleRight className="w-3 h-3" /> Visibility Status
                                </label>
                                <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 rounded-2xl">
                                    <span className={`text-sm font-black uppercase tracking-widest ${data.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {data.is_active ? 'Published' : 'Draft'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${data.is_active ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Guest Information</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    Arrival Instructions
                                </label>
                                <textarea
                                    value={data.instructions}
                                    onChange={e => setData('instructions', e.target.value)}
                                    rows="4"
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    Rental Terms & Conditions
                                </label>
                                <textarea
                                    value={data.rental_terms}
                                    onChange={e => setData('rental_terms', e.target.value)}
                                    rows="4"
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-slate-900"
                                />
                            </div>

                            <div className="pt-4 px-6 py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Public Guest Link</p>
                                <div className="flex items-center justify-between">
                                    <code className="text-xs text-indigo-600 font-bold break-all">
                                        {apartment.arrival_url ? route('guest.checkin', { token: apartment.arrival_url }) : 'pending'}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (apartment.arrival_url) {
                                                navigator.clipboard.writeText(route('guest.checkin', { token: apartment.arrival_url }));
                                                toast.info('Link copied to clipboard');
                                            }
                                        }}
                                        className="text-indigo-600 font-black text-[10px] uppercase hover:underline"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href={route('admin.apartments.index')}
                            className="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Cancel Changes
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            Update Property
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
