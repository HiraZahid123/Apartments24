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
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Edit({ auth, apartments, expense }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        apartment_id: expense.apartment_id || '',
        description: expense.description || '',
        amount: expense.amount || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        proof_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('owner.expenses.update', expense.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Edit Expense</h2>}
        >
            <Head title="Edit Expense | Apartments24" />

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
                            <p className="text-slate-400 font-bold">Update maintenance, cleaning, or utility expenses.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Apartment Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Building2 className="w-4 h-4" /> Select Apartment
                                </label>
                                <select
                                    value={data.apartment_id}
                                    onChange={e => setData('apartment_id', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900"
                                >
                                    <option value="">Choose property...</option>
                                    {apartments.map(apt => (
                                        <option key={apt.id} value={apt.id}>{apt.name}</option>
                                    ))}
                                </select>
                                {errors.apartment_id && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" /> {errors.apartment_id}
                                </p>}
                            </div>

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
                            <div className="md:col-span-2 space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <FileText className="w-4 h-4" /> Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Professional Cleaning after stay"
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
                                    <Euro className="w-4 h-4" /> Amount Paid
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

                            {/* Proof Image Upload */}
                            <div className="space-y-4">
                                <label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <div className="flex items-center gap-2">
                                        <Receipt className="w-4 h-4" /> Receipt/Proof (Optional)
                                    </div>
                                    {expense.proof_image_url && (
                                        <a href={expense.proof_image_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            <ExternalLink className="w-3 h-3" /> View Current
                                        </a>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.gif"
                                        onChange={e => setData('proof_image', e.target.files[0])}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-brand-orange file:text-white hover:file:bg-orange-700 cursor-pointer"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold ml-1">Uploading a new file will replace the current one.</p>
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
                                Update Expense Entry
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
