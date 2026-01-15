import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FileText, Download, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function VisitorCards({ auth, apartments }) {
    const [data, setData] = useState({
        apartment_id: '',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
    });

    const handleDownload = () => {
        if (!data.apartment_id) {
            alert('Please select an apartment first');
            return;
        }

        // Use standard window.location to trigger PDF download
        const url = route('admin.visitor-cards.generate', {
            apartment_id: data.apartment_id,
            month: data.month
        });
        window.location.href = url;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Reporting & Compliance</h2>}
        >
            <Head title="Visitor Cards | Apartments24" />

            <div className="py-6 max-w-4xl">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Visitor Card Generation</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Monthly Guest Registration Exports</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-3 h-3" /> Select Property
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {apartments.map(apt => (
                                    <button
                                        key={apt.id}
                                        type="button"
                                        onClick={() => setData({ ...data, apartment_id: apt.id })}
                                        className={`p-4 rounded-2xl border text-left transition-all ${data.apartment_id === apt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                                    >
                                        <p className="font-black text-sm">{apt.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Target Period
                                </label>
                                <input
                                    type="month"
                                    value={data.month}
                                    onChange={e => setData({ ...data, month: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-black text-slate-900"
                                />
                            </div>

                            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <p className="text-xs font-black text-amber-900 uppercase tracking-wide mb-1">Compliance Check</p>
                                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                        Only confirmed check-ins with completed digital registration forms will be included in the official card export.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={!data.apartment_id}
                            className="inline-flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black shadow-xl transition-all hover:-translate-y-1 disabled:opacity-30 disabled:translate-y-0"
                        >
                            <Download className="w-5 h-5" />
                            Generate Official PDF
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Legal Format</h4>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">
                            Standard EU hospitality cards (2 per A4 page) with mandatory guest data fields.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Data privacy</h4>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">
                            Reports are encrypted and contain PII. Handle generated documents with care.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
