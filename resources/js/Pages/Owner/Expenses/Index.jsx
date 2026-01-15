import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Receipt,
    Trash2,
    Calendar,
    Building2,
    DollarSign,
    FileText,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Index({ auth, expenses, filters }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            router.get(route('owner.expenses.index'), { search }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            destroy(route('owner.expenses.destroy', id), {
                onSuccess: () => toast.success('Expense deleted successfully'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Expense Logs</h2>}
        >
            <Head title="Manage Expenses | Apartments24" />

            <div className="py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search by description..."
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
                        href={route('owner.expenses.create')}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 shadow-lg shadow-slate-100 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Log New Expense
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    <th className="px-8 py-5 border-b border-slate-50">Apartment & Category</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Description</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Date</th>
                                    <th className="px-8 py-5 border-b border-slate-50">Amount</th>
                                    <th className="px-8 py-5 border-b border-slate-50 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {expenses.length > 0 ? expenses.map((expense) => (
                                    <tr key={expense.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-tight mb-1">{expense.apartment_name}</p>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Operational Cost
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600 truncate max-w-xs">{expense.description}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900 font-mono">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                {expense.date}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-black text-slate-900 tracking-tight">${expense.amount}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Remove Entry"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Receipt className="w-16 h-16 text-slate-100" />
                                                <h4 className="text-xl font-black text-slate-400 uppercase italic">No Expenses Logged</h4>
                                                <p className="text-slate-400 font-medium mb-8">Track your property costs to get accurate net earnings.</p>
                                                <Link
                                                    href={route('owner.expenses.create')}
                                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-orange rounded-xl font-black text-sm uppercase border border-slate-200 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <Plus className="w-5 h-5" /> Log First Expense
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
