import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';
import { Building2, Key, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({ status, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Head title="Sign In | Apartments24" />

            <PublicNavbar />

            <div className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
                <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[600px]">

                    {/* Visual Side */}
                    <div className="hidden lg:flex flex-col justify-between p-16 text-white relative overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0"
                            style={{ backgroundImage: 'url("/apartment_hero_custom.jpg")' }}
                        />
                        <div className="absolute inset-0 bg-brand-orange/90 z-1" />

                        <div className="relative z-10">
                            <div className="bg-white/10 w-fit p-3 rounded-2xl mb-8">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Your Portfolio,<br />One Dashboard.</h2>
                            <p className="text-orange-100 font-medium text-lg leading-relaxed">
                                Join our network of professional property owners and automate your growth.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold tracking-tight">Secure Management</span>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                                © Apartments24 v2.0
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 lg:p-20 flex flex-col justify-center">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700 animate-fadeIn">
                                {status}
                            </div>
                        )}

                        {usePage().props.flash?.info && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm font-bold text-blue-700 animate-fadeIn">
                                {usePage().props.flash.info}
                            </div>
                        )}

                        {usePage().props.flash?.error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold text-rose-700 animate-fadeIn">
                                {usePage().props.flash.error}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <InputLabel htmlFor="email" value="Email Address" className="font-bold text-slate-700 ml-1" />
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-12 block w-full rounded-xl border-slate-200 bg-slate-50 py-4 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-medium"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between px-1">
                                    <InputLabel htmlFor="password" value="Password" className="font-bold text-slate-700" />
                                    <Link href={route('password.request')} className="text-xs font-bold text-brand-orange hover:text-orange-700 transition">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="pl-12 block w-full rounded-xl border-slate-200 bg-slate-50 py-4 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-medium"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                                    />
                                    <span className="ms-2 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                                </label>
                            </div>

                            <div className="pt-2">
                                <PrimaryButton
                                    className="w-full justify-center bg-brand-orange hover:bg-orange-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all text-lg flex items-center gap-2"
                                    disabled={processing}
                                >
                                    Sign In <ArrowRight className="h-5 w-5" />
                                </PrimaryButton>
                            </div>

                            <p className="text-center font-medium text-slate-500 text-sm mt-8">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-brand-orange font-extrabold hover:underline decoration-2">
                                    Create one free
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
