import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Receipt,
    Euro,
    Calendar,
    FileText,
    Building2,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Create({ auth, apartments, groups = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        apartment_ids: [],
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        proof_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('owner.expenses.store'));
    };

    const toggleApartment = (id) => {
        if (data.apartment_ids.includes(id)) {
            setData('apartment_ids', data.apartment_ids.filter(aId => aId !== id));
        } else {
            setData('apartment_ids', [...data.apartment_ids, id]);
        }
    };

    const toggleGroup = (groupId) => {
        const groupApartments = apartments.filter(a => a.apartment_group_id === groupId).map(a => a.id);
        const allSelected = groupApartments.every(id => data.apartment_ids.includes(id));
        
        if (allSelected) {
            setData('apartment_ids', data.apartment_ids.filter(id => !groupApartments.includes(id)));
        } else {
            const newIds = new Set([...data.apartment_ids, ...groupApartments]);
            setData('apartment_ids', Array.from(newIds));
        }
    };

    const groupedApartments = groups.map(group => ({
        ...group,
        apartments: apartments.filter(a => a.apartment_group_id === group.id)
    }));
    
    const unassignedApartments = apartments.filter(a => !a.apartment_group_id);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">New Expense</h2>}
        >
            <Head title="Log Expense | Apartments24" />

            <div className="py-6 max-w-3xl">
                <Link
                    href={route('owner.expenses.index')}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-orange font-black text-xs uppercase tracking-widest transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to History
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12 border-b border-slate-50 flex items-center gap-6">
                        <div className="p-5 bg-orange-50 text-brand-orange rounded-3xl">
                            <Receipt className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">Operational Cost</h3>
                            <p className="text-slate-400 font-bold">Log maintenance, cleaning, or utility expenses.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        <div className="grid grid-cols-1 gap-10">
                            {/* Apartment Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Building2 className="w-4 h-4" /> Select Apartments
                                </label>
                                
                                <div className="space-y-6">
                                    {groupedApartments.map(group => group.apartments.length > 0 && (
                                        <div key={group.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                                <h4 className="font-black text-slate-700 uppercase tracking-tight">{group.name}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(group.id)}
                                                    className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-widest"
                                                >
                                                    Toggle All
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {group.apartments.map(apt => (
                                                    <label key={apt.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-colors">
                                                        <input 
                                                            type="checkbox"
                                                            checked={data.apartment_ids.includes(apt.id)}
                                                            onChange={() => toggleApartment(apt.id)}
                                                            className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 border-slate-300"
                                                        />
                                                        <span className="font-bold text-slate-700 text-sm">{apt.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {unassignedApartments.length > 0 && (
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                                <h4 className="font-black text-slate-700 uppercase tracking-tight">Other Apartments</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {unassignedApartments.map(apt => (
                                                    <label key={apt.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-colors">
                                                        <input 
                                                            type="checkbox"
                                                            checked={data.apartment_ids.includes(apt.id)}
                                                            onChange={() => toggleApartment(apt.id)}
                                                            className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 border-slate-300"
                                                        />
                                                        <span className="font-bold text-slate-700 text-sm">{apt.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.apartment_ids && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" /> {errors.apartment_ids}
                                </p>}
                                {data.apartment_ids.length > 1 && (
                                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <Info className="w-3 h-3" /> The total amount will be split evenly across selected apartments.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Date Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Calendar className="w-4 h-4" /> Expense Date
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900"
                                />
                                {errors.date && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" /> {errors.date}
                                </p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <FileText className="w-4 h-4" /> Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Professional Cleaning"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                />
                                {errors.description && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" /> {errors.description}
                                </p>}
                            </div>

                            {/* Amount */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Euro className="w-4 h-4" /> Total Amount Paid
                                </label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                    />
                                </div>
                                {errors.amount && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" /> {errors.amount}
                                </p>}
                            </div>

                            {/* Proof Image Placeholder */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Receipt className="w-4 h-4" /> Receipt/Proof (PDF/Image)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.gif"
                                        onChange={e => setData('proof_image', e.target.files[0])}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-brand-orange file:text-white hover:file:bg-orange-700 cursor-pointer"
                                    />
                                </div>
                                {errors.proof_image && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" /> {errors.proof_image}
                                </p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                disabled={processing}
                                className="w-full md:w-auto px-12 py-5 bg-brand-orange text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Save Expense Entry
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
