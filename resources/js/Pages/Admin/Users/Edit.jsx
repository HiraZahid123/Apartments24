import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Shield,
    Mail,
    Lock,
    User,
    AlertCircle,
    UserCheck,
    ToggleLeft,
    ToggleRight,
    KeyRound
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Edit({ auth, user }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        user_type: user.user_type,
        is_active: user.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Edit Profile</h2>}
        >
            <Head title={`Modify User: ${user.name} | Apartments24`} />

            <div className="py-6 max-w-4xl">
                <Link
                    href={route('admin.users.index')}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-orange font-black text-xs uppercase tracking-widest transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> User Catalog
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12 border-b border-slate-50 flex items-center gap-6 bg-slate-50/30">
                        <div className={`p-5 rounded-3xl ${user.user_type === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-brand-orange'}`}>
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight italic uppercase">{user.name}</h3>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Shield className="w-3 h-3" /> System Role: {user.user_type}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                        {/* Basic Info */}
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900"
                                    />
                                    {errors.name && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" /> {errors.name}
                                    </p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Access</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900"
                                    />
                                    {errors.email && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" /> {errors.email}
                                    </p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                                    <div className="flex gap-4">
                                        {['owner', 'admin'].map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setData('user_type', role)}
                                                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${data.user_type === role
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                                    }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Access</label>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${data.is_active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-rose-50 text-rose-700'
                                            }`}
                                    >
                                        <span className="font-black text-xs uppercase tracking-widest">
                                            {data.is_active ? 'Active Status' : 'Account Suspended'}
                                        </span>
                                        {data.is_active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Override */}
                        <div className="space-y-4 pt-10 border-t border-slate-50">
                            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                                <KeyRound className="w-4 h-4" /> Password Management
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 italic mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl">
                                Leave password fields blank if you do not want to change the user's current password.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900"
                                    />
                                    {errors.password && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" /> {errors.password}
                                    </p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                disabled={processing}
                                className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Synchronize Profile Changes
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
