import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, CheckCircle, Clock, Check, UserPlus, Building2, LogOut } from 'lucide-react';

export default function Index({ notifications }) {

    const markAsRead = (id) => {
        router.post(route('admin.notifications.read', id));
    };

    const markAllRead = () => {
        router.post(route('admin.notifications.read-all'));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'booking': return <Building2 className="w-5 h-5" />;
            case 'checkin': return <CheckCircle className="w-5 h-5" />;
            case 'checkout': return <LogOut className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">
                        Notifications
                    </h2>
                    <button
                        onClick={markAllRead}
                        className="text-sm font-bold text-brand-orange hover:text-orange-700 hover:underline flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                </div>
            }
        >
            <Head title="Notifications | Apartments24" />

            <div className="py-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    {notifications.data.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {notifications.data.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-6 transition-colors ${notification.read_at ? 'bg-white' : 'bg-orange-50/10'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${notification.data.bg_color || 'bg-slate-100'} ${notification.data.icon_color || 'text-slate-500'}`}>
                                            {getIcon(notification.data.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={`text-base font-bold text-slate-900 ${!notification.read_at ? 'flex items-center gap-2' : ''}`}>
                                                        {notification.data.title}
                                                        {!notification.read_at && (
                                                            <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
                                                        )}
                                                    </h3>
                                                    <p className="text-slate-500 mt-1">{notification.data.message}</p>
                                                    <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {notification.data.action_url && (
                                                        <Link
                                                            href={notification.data.action_url}
                                                            className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors"
                                                        >
                                                            View
                                                        </Link>
                                                    )}
                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                            <p className="text-slate-500 mt-1">You have no booking notifications.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {notifications.data.length > 0 && notifications.links && (
                        <div className="p-6 border-t border-slate-50 bg-slate-50/50">
                            <div className="flex justify-center gap-2">
                                {notifications.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold ${link.active
                                                ? 'bg-brand-orange text-white shadow-lg shadow-orange-100'
                                                : 'bg-white text-slate-500 hover:bg-slate-100'
                                                }`}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-50"
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
