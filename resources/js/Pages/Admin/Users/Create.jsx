import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    UserPlus,
    Shield,
    Mail,
    Lock,
    User,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'owner',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Register User</h2>}
        >
            <Head title="Create New User | Apartments24" />

            <div className="py-6 max-w-4xl">
                <Link
                    href={route('admin.users.index')}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-orange font-black text-xs uppercase tracking-widest transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12 border-b border-slate-50 flex items-center gap-6 bg-slate-50/30">
                        <div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight italic uppercase">Access Configuration</h3>
                            <p className="text-slate-400 font-bold">Register a new property owner or system administrator.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Name */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <User className="w-4 h-4" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter user's full name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                    />
                                    {errors.name && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" /> {errors.name}
                                    </p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Mail className="w-4 h-4" /> Email address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                    />
                                    {errors.email && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" /> {errors.email}
                                    </p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* User Type */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Shield className="w-4 h-4" /> System Role
                                    </label>
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
                                    {errors.user_type && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" /> {errors.user_type}
                                    </p>}
                                </div>

                                {/* Status Toggle */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <UserCheck className="w-4 h-4" /> Account Status
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${data.is_active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-rose-50 text-rose-700'
                                            }`}
                                    >
                                        <span className="font-black text-xs uppercase tracking-widest">
                                            {data.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                        {data.is_active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Security */}
                        <div className="space-y-4 pt-10 border-t border-slate-50">
                            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                                Security Credentials
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Password */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Lock className="w-4 h-4" /> Initial Password
                                    </label>
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

                                {/* Password Confirmation */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Lock className="w-4 h-4" /> Confirm Password
                                    </label>
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
                                className="w-full md:w-auto px-12 py-5 bg-brand-orange text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                Provisional Account Registration
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
