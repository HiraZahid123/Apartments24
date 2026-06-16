import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Building2, Save, Loader2 } from 'lucide-react';

export default function Index({ auth, settings }) {
    const { data, setData, post, processing, errors } = useForm({
        settings: {
            company_name: settings.company_name || '',
            company_registration_code: settings.company_registration_code || '',
            company_vat_number: settings.company_vat_number || '',
            company_address: settings.company_address || '',
            bank_account_details: settings.bank_account_details || '',
        }
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    const handleChange = (field, value) => {
        setData('settings', {
            ...data.settings,
            [field]: value
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Company Settings</h2>}
        >
            <Head title="Company Settings" />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-brand-orange">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Settings</h1>
                        <p className="text-sm font-bold text-slate-500">Manage your company details for invoices.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 space-y-6">
                        
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                            <input
                                type="text"
                                value={data.settings.company_name}
                                onChange={e => handleChange('company_name', e.target.value)}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900"
                                placeholder="Your Company Name"
                            />
                            {errors['settings.company_name'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.company_name']}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Registration Code</label>
                                <input
                                    type="text"
                                    value={data.settings.company_registration_code}
                                    onChange={e => handleChange('company_registration_code', e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900"
                                    placeholder="e.g. 12345678"
                                />
                                {errors['settings.company_registration_code'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.company_registration_code']}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">VAT Number</label>
                                <input
                                    type="text"
                                    value={data.settings.company_vat_number}
                                    onChange={e => handleChange('company_vat_number', e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900"
                                    placeholder="e.g. EE123456789"
                                />
                                {errors['settings.company_vat_number'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.company_vat_number']}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Address</label>
                            <textarea
                                value={data.settings.company_address}
                                onChange={e => handleChange('company_address', e.target.value)}
                                rows={2}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900 resize-none"
                                placeholder="Full company address"
                            />
                            {errors['settings.company_address'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.company_address']}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bank Account Details</label>
                            <textarea
                                value={data.settings.bank_account_details}
                                onChange={e => handleChange('bank_account_details', e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900 resize-none"
                                placeholder="Bank Name, IBAN, SWIFT, etc."
                            />
                            {errors['settings.bank_account_details'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.bank_account_details']}</p>}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-brand-orange text-white px-8 py-3 rounded-xl font-black text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center gap-2"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
