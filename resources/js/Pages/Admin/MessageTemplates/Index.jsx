import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Mail, Edit2, CheckCircle2, XCircle, Languages } from 'lucide-react';

export default function Index({ templates }) {
    // Group templates by type
    const groupedTemplates = templates.reduce((acc, template) => {
        if (!acc[template.type]) {
            acc[template.type] = [];
        }
        acc[template.type].push(template);
        return acc;
    }, {});

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Automatic Messages</h2>
                        <p className="text-slate-500 mt-1 font-medium">Manage and customize your automated guest emails.</p>
                    </div>
                </div>
            }
        >
            <Head title="Automatic Messages" />

            <div className="space-y-8">
                {Object.entries(typeLabels).map(([type, label]) => (
                    <div key={type} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-brand-orange/10 rounded-2xl text-brand-orange">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{label}</h3>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {['en', 'et', 'ru'].map(lang => {
                                const template = groupedTemplates[type]?.find(t => t.language === lang);

                                return (
                                    <div key={lang} className="px-8 py-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                <Languages className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">{languageNames[lang]}</span>
                                            </div>

                                            {template ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 truncate max-w-md">
                                                        {template.subject}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {template.is_active ? (
                                                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Active
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                <XCircle className="w-3 h-3" />
                                                                Draft
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium text-slate-400 italic">No template created for this language</span>
                                            )}
                                        </div>

                                        {template && (
                                            <Link
                                                href={route('admin.message-templates.edit', template.id)}
                                                className="p-2 text-slate-400 hover:text-brand-orange hover:bg-orange-50 rounded-xl transition-all"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
