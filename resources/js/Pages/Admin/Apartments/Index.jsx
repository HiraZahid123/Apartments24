import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Building2, Plus, Edit2, Trash2, CheckCircle2, XCircle, Search, MapPin, User, Key, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Index({ auth, apartments, filters }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admin.apartments.index'), { search }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this apartment?')) {
            destroy(route('admin.apartments.destroy', id), {
                onSuccess: () => toast.success('Apartment deleted successfully'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Property Portfolio</h2>}
        >
            <Head title="Manage Apartments | Apartments24" />

            <div className="py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search apartments, cities, or owners..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-600"
                        />
                    </div>
                    <Link
                        href={route('admin.apartments.create')}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Property
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apartments.length > 0 ? apartments.map((apartment) => (
                        <div key={apartment.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {apartment.is_active ? (
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 className="w-3 h-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <XCircle className="w-3 h-3" /> Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                    {apartment.name}
                                </h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                        <MapPin className="w-4 h-4 text-slate-300" />
                                        {apartment.city}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                        <User className="w-4 h-4 text-slate-300" />
                                        Owner: <span className="text-slate-900 font-bold">{apartment.owner_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                        <Key className="w-4 h-4 text-slate-300" />
                                        Keybox: <span className="bg-slate-50 px-2 py-0.5 rounded-md font-mono text-indigo-600 font-bold">{apartment.keybox_code || '---'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('admin.apartments.edit', apartment.id)}
                                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="Edit Property"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(apartment.id)}
                                            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Delete Property"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <Link
                                        href={route('admin.apartments.edit', apartment.id)}
                                        className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
                                    >
                                        Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h4 className="text-xl font-black text-slate-400 uppercase italic">No Properties Found</h4>
                            <p className="text-slate-400 font-medium mb-8">Start by adding your first apartment portfolio entry.</p>
                            <Link
                                href={route('admin.apartments.create')}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm uppercase border border-slate-200 shadow-sm hover:shadow-md transition-all"
                            >
                                <Plus className="w-5 h-5" /> Add Property
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
