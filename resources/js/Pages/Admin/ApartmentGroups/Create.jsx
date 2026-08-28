import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Users, Building2, CheckCircle2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState, useMemo } from 'react';

export default function Create({ auth, apartments }) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        apartment_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.apartment-groups.store'), {
            onSuccess: () => toast.success('Group created successfully'),
        });
    };

    const toggleApartment = (id) => {
        if (data.apartment_ids.includes(id)) {
            setData('apartment_ids', data.apartment_ids.filter(a => a !== id));
        } else {
            setData('apartment_ids', [...data.apartment_ids, id]);
        }
    };

    const selectAll = () => {
        setData('apartment_ids', filteredApartments.map(a => a.id));
    };

    const clearAll = () => {
        setData('apartment_ids', []);
    };

    const filteredApartments = useMemo(() => {
        if (!search.trim()) return apartments;
        const q = search.toLowerCase();
        return apartments.filter(
            a => a.name.toLowerCase().includes(q) || (a.owner_name && a.owner_name.toLowerCase().includes(q))
        );
    }, [apartments, search]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Create Group</h2>}
        >
            <Head title="Create Apartment Group | Apartments24" />

            <div className="py-6 max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route('admin.apartment-groups.index')}
                        className="inline-flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Groups
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Group Details</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Basic Information</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Group Name */}
                        <div>
                            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 transition-all"
                                placeholder="e.g. Apartments24 Spordi"
                            />
                            {errors.name && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        {/* Apartment Assignment */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest">
                                    <Building2 className="w-4 h-4 text-indigo-600" />
                                    Assign Apartments
                                    {data.apartment_ids.length > 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black">
                                            {data.apartment_ids.length} selected
                                        </span>
                                    )}
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={selectAll}
                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        Select All
                                    </button>
                                    <span className="text-slate-200">|</span>
                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search apartments..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-2xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            {/* Apartment List */}
                            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                                {filteredApartments.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No apartments found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                                        {filteredApartments.map(apt => {
                                            const isSelected = data.apartment_ids.includes(apt.id);
                                            const isInOtherGroup = apt.apartment_group_id && !data.apartment_ids.includes(apt.id);
                                            return (
                                                <label
                                                    key={apt.id}
                                                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50' : 'bg-white hover:bg-slate-50'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
                                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleApartment(apt.id)}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-black text-sm truncate ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                            {apt.name}
                                                        </p>
                                                        {apt.owner_name && (
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                Owner: {apt.owner_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {isInOtherGroup && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0">
                                                            In another group
                                                        </span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {errors.apartment_ids && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.apartment_ids}</p>}
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Save Group
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
