import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Building2, MapPin, User, Key, Info, FileText, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Create({ auth, owners }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        city: '',
        instructions: '',
        rental_terms: '',
        owner_id: '',
        owner_name: '',
        keybox_code: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.apartments.store'), {
            onSuccess: () => toast.success('Apartment created successfully'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">New Property</h2>}
        >
            <Head title="Add Apartment | Apartments24" />

            <div className="py-6 max-w-4xl">
                <Link
                    href={route('admin.apartments.index')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

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
                                    placeholder="e.g., Skyview Penthouse"
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
                                    placeholder="e.g., Tallinn"
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
                                    placeholder="Enter complete street address..."
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
                                    placeholder="Enter reference name..."
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
                                    placeholder="e.g., 1234"
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
                                    placeholder="Detailed instructions for the guest..."
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
                                    placeholder="Standard terms and conditions for this property..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href={route('admin.apartments.index')}
                            className="px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            Create Property
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
