import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Building2, Save, Loader2, Phone, HelpCircle } from 'lucide-react';

export default function Index({ auth, settings }) {
    const [activeLang, setActiveLang] = useState('en');

    const { data, setData, post, processing, errors } = useForm({
        settings: {
            company_name: settings.company_name || '',
            company_registration_code: settings.company_registration_code || '',
            company_vat_number: settings.company_vat_number || '',
            company_address: settings.company_address || '',
            bank_account_details: settings.bank_account_details || '',
            // Guest contact / Need Help section
            contact_phone: settings.contact_phone || '',
            contact_email: settings.contact_email || '',
            contact_description_en: settings.contact_description_en || '',
            contact_description_et: settings.contact_description_et || '',
            contact_description_ru: settings.contact_description_ru || '',
            contact_hours_en: settings.contact_hours_en || '',
            contact_hours_et: settings.contact_hours_et || '',
            contact_hours_ru: settings.contact_hours_ru || '',
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

                {/* Guest Contact / Need Help Section */}
                <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-8">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Guest &ldquo;Need Help?&rdquo; Section</h2>
                                    <p className="text-xs font-bold text-slate-400">Shown at the bottom of the Digital Guidebook</p>
                                </div>
                            </div>
                            {/* Language Tabs */}
                            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                                {['en', 'et', 'ru'].map(l => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setActiveLang(l)}
                                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                            activeLang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.settings.contact_phone}
                                    onChange={e => handleChange('contact_phone', e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900"
                                    placeholder="e.g. +372 555 5555"
                                />
                                {errors['settings.contact_phone'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.contact_phone']}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.settings.contact_email}
                                    onChange={e => handleChange('contact_email', e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900"
                                    placeholder="e.g. info@apartments24.ee"
                                />
                                {errors['settings.contact_email'] && <p className="text-red-500 text-xs font-bold mt-1">{errors['settings.contact_email']}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                Description ({activeLang.toUpperCase()})
                            </label>
                            <textarea
                                value={data.settings[`contact_description_${activeLang}`]}
                                onChange={e => handleChange(`contact_description_${activeLang}`, e.target.value)}
                                rows={2}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900 resize-none"
                                placeholder={activeLang === 'en' ? 'Our team is available to assist you during your stay.' : activeLang === 'et' ? 'Meie meeskond on teie peatumise ajal abistamiseks saadaval.' : 'Наша команда готова помочь вам во время пребывания.'}
                            />
                            {errors[`settings.contact_description_${activeLang}`] && <p className="text-red-500 text-xs font-bold mt-1">{errors[`settings.contact_description_${activeLang}`]}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                Customer Service Hours ({activeLang.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                value={data.settings[`contact_hours_${activeLang}`]}
                                onChange={e => handleChange(`contact_hours_${activeLang}`, e.target.value)}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-brand-orange/20 transition-all font-bold text-slate-900"
                                placeholder={activeLang === 'en' ? 'e.g. Mon–Sun 09:00–21:00' : activeLang === 'et' ? 'nt E–P 09:00–21:00' : 'напр. Пн–Вс 09:00–21:00'}
                            />
                            {errors[`settings.contact_hours_${activeLang}`] && <p className="text-red-500 text-xs font-bold mt-1">{errors[`settings.contact_hours_${activeLang}`]}</p>}
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
