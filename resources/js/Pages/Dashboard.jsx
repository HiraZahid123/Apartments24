import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Dashboard</h2>}
        >
            <Head title="Dashboard | Apartments24" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100">
                        <div className="p-12 text-center text-slate-900">
                            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Account Setup Pending</h3>
                            <p className="text-slate-500 font-medium max-w-md mx-auto">
                                You are currently logged in as a guest. Please contact support or upgrade your account to start managing apartments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
