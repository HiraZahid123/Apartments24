import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import { useState } from 'react';
import { Menu, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthenticatedLayout({ header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white flex font-sans selection:bg-orange-100 selection:text-orange-900">
            {/* Sidebar Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Sidebar Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Mobile */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden shadow-2xl`}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 lg:hidden px-6 h-16 shrink-0">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo_apartments24.png"
                            alt="AP24"
                            className="h-14 w-auto"
                        />
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Header */}
                <div className="shrink-0">
                    <Header />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    {header && (
                        <header className="bg-white px-8 py-10 border-b border-slate-100">
                            <div className="mx-auto max-w-7xl">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="p-4 lg:p-8">
                        <div className="mx-auto max-w-7xl pb-20">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}} />
        </div>
    );
}
