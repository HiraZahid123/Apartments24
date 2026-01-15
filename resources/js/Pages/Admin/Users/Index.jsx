import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    UserCheck,
    UserX,
    Shield,
    Mail,
    Building2,
    Search,
    Filter,
    MoreVertical,
    Edit3,
    Trash2,
    UserCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function Index({ auth, users, filters }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState(filters.search || '');

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user? All associated data might be affected.')) {
            destroy(route('admin.users.destroy', id), {
                onSuccess: () => toast.success('User deleted successfully'),
            });
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admin.users.index'), { search }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Users & Roles</h2>}
        >
            <Head title="Staff & Owners Management | Apartments24" />

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
                                placeholder="Search by name, email or role..."
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-medium text-slate-600"
                            />
                        </div>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 shadow-lg shadow-slate-100 transition-all hover:-translate-y-0.5"
                    >
                        <UserPlus className="w-5 h-5" />
                        Create New User
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    <th className="px-8 py-5 border-b border-slate-50 font-black">User Profile</th>
                                    <th className="px-8 py-5 border-b border-slate-50 font-black">Role</th>
                                    <th className="px-8 py-5 border-b border-slate-50 font-black">Apartments</th>
                                    <th className="px-8 py-5 border-b border-slate-50 font-black">Status</th>
                                    <th className="px-8 py-5 border-b border-slate-50 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${user.user_type === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-brand-orange'
                                                    }`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-tight mb-0.5">{user.name}</p>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.user_type === 'admin'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : user.user_type === 'owner'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {user.user_type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                                                    <Building2 className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-slate-900 text-sm">
                                                    {user.apartments_count} <span className="text-slate-400 font-bold ml-1 italic text-xs capitalize">units</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.is_active ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-rose-500">
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">Deactivated</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={user.id === auth.user.id}
                                                    className={`p-3 rounded-xl transition-all ${user.id === auth.user.id
                                                        ? 'text-slate-200 cursor-not-allowed'
                                                        : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
