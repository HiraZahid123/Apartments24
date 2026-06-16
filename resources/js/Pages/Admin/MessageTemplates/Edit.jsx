import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Edit({ template }) {
    const { data, setData, put, processing, errors } = useForm({
        subject: template.subject,
        content: template.content,
        is_active: template.is_active,
    });

    const typeLabels = {
        'guest_registration': 'Guest Registration (Check-in Link)',
        'welcome': 'Welcome & Access Details',
        'thank_you': 'Thank You (Checkout)',
        'checkout_reminder': 'Checkout Reminder'
    };

    const languageNames = {
        'en': 'English',
        'et': 'Estonian',
        'ru': 'Russian'
    };

    const variables = {
        'guest_registration': [
            { code: '[GUEST_NAME]', desc: 'Name of the guest' },
            { code: '[APARTMENT_NAME]', desc: 'Name of the apartment' },
            { code: '[CHECKIN_DATE]', desc: 'Scheduled check-in date' },
            { code: '[CHECKIN_LINK]', desc: 'Clickable link to the registration form' },
        ],
        'welcome': [
            { code: '[GUEST_NAME]', desc: 'Name of the guest' },
            { code: '[APARTMENT_NAME]', desc: 'Name of the apartment' },
            { code: '[KEYBOX_CODE]', desc: 'Code for the keybox' },
            { code: '[SMART_LOCK_BLOCK]', desc: 'Smart lock code (hidden if not set)' },
            { code: '[WIFI_SSID]', desc: 'WiFi network name from property info' },
            { code: '[WIFI_PASSWORD]', desc: 'WiFi password from property info' },
            { code: '[ARRIVAL_INSTRUCTIONS]', desc: 'Arrival instructions in correct language' },
        ],
        'thank_you': [
            { code: '[GUEST_NAME]', desc: 'Name of the guest' },
            { code: '[APARTMENT_NAME]', desc: 'Name of the apartment' },
        ],
        'checkout_reminder': [
            { code: '[GUEST_NAME]', desc: 'Name of the guest' },
            { code: '[APARTMENT_NAME]', desc: 'Name of the apartment' },
            { code: '[CHECKOUT_DATE]', desc: 'Scheduled check-out date' },
        ]
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.message-templates.update', template.id), {
            onSuccess: () => toast.success('Template updated successfully!'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Template</h2>
                            <div className="px-3 py-1 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {languageNames[template.language]}
                            </div>
                        </div>
                        <p className="text-slate-500 mt-1 font-medium">{typeLabels[template.type]}</p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${typeLabels[template.type]}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                    Email Subject
                                </label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all font-bold text-slate-900"
                                    placeholder="Enter email subject..."
                                />
                                {errors.subject && <p className="mt-2 text-sm text-red-500 font-bold">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                    Email Content
                                </label>
                                <textarea
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    rows={15}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all font-medium text-slate-900 font-mono text-sm leading-relaxed"
                                    placeholder="Enter template content..."
                                />
                                {errors.content && <p className="mt-2 text-sm text-red-500 font-bold">{errors.content}</p>}
                                <p className="mt-2 text-xs text-slate-400">Content supports plain text and simple line breaks. URLs will be automatically converted to clickable links.</p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    <span className="ml-3 text-sm font-black text-slate-700 uppercase tracking-widest">Active Template</span>
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-orange-100"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Template
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    {/* Help Section */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle className="w-6 h-6 text-brand-orange" />
                            <h3 className="text-xl font-black tracking-tight">Available Variables</h3>
                        </div>
                        <div className="space-y-4">
                            {variables[template.type].map(v => (
                                <div key={v.code} className="p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                    <code className="text-brand-orange font-black text-sm block mb-1">{v.code}</code>
                                    <p className="text-slate-400 text-xs font-bold leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-brand-orange/20 rounded-2xl border border-brand-orange/30">
                            <div className="flex gap-3">
                                <Info className="w-5 h-5 text-brand-orange shrink-0" />
                                <p className="text-xs font-bold text-orange-100 leading-relaxed">
                                    Ensure these variables are spelled exactly as shown. Brackets are required.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Branding Reminder */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Branding Note</h4>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed mb-4">
                            All emails are sent with professional Apartments24 branding including header and footer. Focus your content on the message body itself.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Premium Styling Active
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
