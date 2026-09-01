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
    Info,
    Layers,
    Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Create({ auth, apartments, groups = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        group_id: '',
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

    // Toggle individual apartment
    const toggleApartment = (id) => {
        let newIds;
        if (data.apartment_ids.includes(id)) {
            newIds = data.apartment_ids.filter(aId => aId !== id);
        } else {
            newIds = [...data.apartment_ids, id];
        }

        // Check if all apartments of any group are selected
        const matchedGroup = groups.find(g => {
            const gAptIds = (g.apartments || apartments.filter(a => a.apartment_group_id === g.id)).map(a => a.id);
            return gAptIds.length > 0 && gAptIds.every(gid => newIds.includes(gid)) && newIds.length === gAptIds.length;
        });

        setData({
            ...data,
            apartment_ids: newIds,
            group_id: matchedGroup ? matchedGroup.id : ''
        });
    };

    // Select or toggle entire group
    const toggleGroup = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        const groupApartments = (group?.apartments || apartments.filter(a => a.apartment_group_id === groupId)).map(a => a.id);
        const isCurrentlySelected = data.group_id === groupId || (groupApartments.length > 0 && groupApartments.every(id => data.apartment_ids.includes(id)));

        if (isCurrentlySelected) {
            // Deselect group
            setData({
                ...data,
                group_id: '',
                apartment_ids: data.apartment_ids.filter(id => !groupApartments.includes(id))
            });
        } else {
            // Select entire group
            const mergedIds = Array.from(new Set([...data.apartment_ids, ...groupApartments]));
            setData({
                ...data,
                group_id: groupId,
                apartment_ids: mergedIds
            });
        }
    };

    const groupedApartments = groups.map(group => ({
        ...group,
        apartments: group.apartments || apartments.filter(a => a.apartment_group_id === group.id)
    }));

    const unassignedApartments = apartments.filter(a => !a.apartment_group_id);

    // Determine current selection display text
    const activeGroup = groups.find(g => g.id === data.group_id);
    const selectedCount = data.apartment_ids.length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">New Expense</h2>}
        >
            <Head title="Log Expense | Apartments24" />

            <div className="py-6 max-w-4xl">
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
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">Log Operational Expense</h3>
                            <p className="text-slate-400 font-bold">Record single-property, multi-property, or whole group expenses.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        {/* Section: Select by Group (Quick Select) */}
                        {groups.length > 0 && (
                            <div className="space-y-4">
                                <label className="flex items-center justify-between text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                                    <span className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-indigo-600" />
                                        Select by Group (1-Click)
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        Creates 1 unified row for group
                                    </span>
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {groupedApartments.map(group => {
                                        const groupAptIds = group.apartments.map(a => a.id);
                                        const isGroupSelected = groupAptIds.length > 0 && groupAptIds.every(id => data.apartment_ids.includes(id));
                                        
                                        return (
                                            <div
                                                key={group.id}
                                                onClick={() => toggleGroup(group.id)}
                                                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                                    isGroupSelected
                                                        ? 'bg-indigo-50/70 border-indigo-600 shadow-md shadow-indigo-100'
                                                        : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`p-2 rounded-xl ${isGroupSelected ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-slate-200'}`}>
                                                            <Layers className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="font-black text-slate-900 text-base">{group.name}</h4>
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                                        isGroupSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {group.apartments.length} Units
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 mb-3">
                                                    {group.apartments.map(a => a.name).join(', ')}
                                                </p>

                                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                                                    <span className={`font-black uppercase tracking-widest text-[10px] ${
                                                        isGroupSelected ? 'text-indigo-700' : 'text-slate-400'
                                                    }`}>
                                                        {isGroupSelected ? '✓ Entire Group Selected' : 'Click to select group'}
                                                    </span>
                                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                                        isGroupSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                                    }`}>
                                                        {isGroupSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Section: Individual Apartments Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                                    <Building2 className="w-4 h-4 text-indigo-600" />
                                    Or Select Specific Apartment(s)
                                    {selectedCount > 0 && (
                                        <span className="ml-2 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black">
                                            {selectedCount} selected
                                        </span>
                                    )}
                                </label>
                                {selectedCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setData({ ...data, apartment_ids: [], group_id: '' })}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600"
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {groupedApartments.map(group => group.apartments.length > 0 && (
                                    <div key={group.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                                            <span className="font-black text-slate-800 text-sm uppercase tracking-tight flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                {group.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(group.id)}
                                                className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-widest"
                                            >
                                                Toggle All
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {group.apartments.map(apt => (
                                                <label key={apt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                    data.apartment_ids.includes(apt.id)
                                                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                                                        : 'bg-white border-slate-100 hover:border-slate-300'
                                                }`}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={data.apartment_ids.includes(apt.id)}
                                                        onChange={() => toggleApartment(apt.id)}
                                                        className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 border-slate-300"
                                                    />
                                                    <span className={`font-bold text-sm truncate ${
                                                        data.apartment_ids.includes(apt.id) ? 'text-indigo-900 font-black' : 'text-slate-700'
                                                    }`}>
                                                        {apt.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {unassignedApartments.length > 0 && (
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <div className="mb-4 pb-3 border-b border-slate-200">
                                            <span className="font-black text-slate-800 text-sm uppercase tracking-tight">Other Apartments</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {unassignedApartments.map(apt => (
                                                <label key={apt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                    data.apartment_ids.includes(apt.id)
                                                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                                                        : 'bg-white border-slate-100 hover:border-slate-300'
                                                }`}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={data.apartment_ids.includes(apt.id)}
                                                        onChange={() => toggleApartment(apt.id)}
                                                        className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 border-slate-300"
                                                    />
                                                    <span className={`font-bold text-sm truncate ${
                                                        data.apartment_ids.includes(apt.id) ? 'text-indigo-900 font-black' : 'text-slate-700'
                                                    }`}>
                                                        {apt.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {errors.apartment_ids && (
                                <p className="text-rose-600 text-xs font-bold flex items-center gap-1.5 mt-2">
                                    <AlertCircle className="w-4 h-4" /> {errors.apartment_ids}
                                </p>
                            )}

                            {/* Summary banner: Explaining single-row non-divided entry */}
                            {selectedCount > 0 && (
                                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3 mt-4">
                                    <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-xs text-indigo-950 space-y-0.5">
                                        <p className="font-black uppercase tracking-wider">
                                            Single Expense Row Logging:
                                        </p>
                                        <p className="font-medium text-slate-700">
                                            This expense will display as <strong>one single entry</strong> for{' '}
                                            <strong className="text-indigo-700 font-black">
                                                {activeGroup ? activeGroup.name : (selectedCount > 1 ? `${selectedCount} apartments` : apartments.find(a => a.id === data.apartment_ids[0])?.name)}
                                            </strong>{' '}
                                            for the total entered amount. The cost will <strong>not</strong> be automatically divided.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details Grid: Date, Description, Amount, Proof */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                            {/* Date Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                                    <Calendar className="w-4 h-4 text-slate-400" /> Expense Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-black text-slate-900"
                                    required
                                />
                                {errors.date && <p className="text-rose-600 text-xs font-bold mt-1">{errors.date}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                                    <FileText className="w-4 h-4 text-slate-400" /> Description / Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Monthly Cleaning or Utilities"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                    required
                                />
                                {errors.description && <p className="text-rose-600 text-xs font-bold mt-1">{errors.description}</p>}
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                                    <Euro className="w-4 h-4 text-slate-400" /> Total Entered Amount (€) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-black text-slate-900 placeholder:text-slate-300 text-lg"
                                        required
                                    />
                                </div>
                                {errors.amount && <p className="text-rose-600 text-xs font-bold mt-1">{errors.amount}</p>}
                            </div>

                            {/* Proof Image Upload */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest ml-1">
                                    <Receipt className="w-4 h-4 text-slate-400" /> Receipt / Proof Document (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.gif"
                                        onChange={e => setData('proof_image', e.target.files[0])}
                                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-bold text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                                    />
                                </div>
                                {errors.proof_image && <p className="text-rose-600 text-xs font-bold mt-1">{errors.proof_image}</p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex items-center justify-end">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                disabled={processing || selectedCount === 0}
                                className="w-full sm:w-auto px-12 py-5 bg-brand-orange text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
