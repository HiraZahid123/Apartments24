import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Users } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.apartment-groups.store'), {
            onSuccess: () => toast.success('Group created successfully'),
        });
    };

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

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Group Details</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Basic Information</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
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

                        <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
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
