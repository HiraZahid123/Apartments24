import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Users, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Index({ auth, groups }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this group?')) {
            destroy(route('admin.apartment-groups.destroy', id), {
                onSuccess: () => toast.success('Group deleted successfully'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Apartment Groups</h2>}
        >
            <Head title="Manage Apartment Groups | Apartments24" />

            <div className="py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
                    <Link
                        href={route('admin.apartment-groups.create')}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Create Group
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.length > 0 ? groups.map((group) => (
                        <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                            {group.apartments_count} Apartments
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-8 truncate group-hover:text-indigo-600 transition-colors">
                                    {group.name}
                                </h3>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('admin.apartment-groups.edit', group.id)}
                                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="Edit Group"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(group.id)}
                                            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Delete Group"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <Link
                                        href={route('admin.apartment-groups.edit', group.id)}
                                        className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
                                    >
                                        Edit <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h4 className="text-xl font-black text-slate-400 uppercase italic">No Groups Found</h4>
                            <p className="text-slate-400 font-medium mb-8">Start by creating your first apartment group.</p>
                            <Link
                                href={route('admin.apartment-groups.create')}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm uppercase border border-slate-200 shadow-sm hover:shadow-md transition-all"
                            >
                                <Plus className="w-5 h-5" /> Create Group
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
