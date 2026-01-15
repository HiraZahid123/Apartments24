import ClubSidebar from '@/Components/ClubSidebar';
import Header from '@/Components/Header';
import { useState } from 'react';
import { Menu } from 'lucide-react';

export default function ClubLayout({ header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Desktop */}
            <div className="hidden lg:block">
                <ClubSidebar />
            </div>

            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Mobile */}
            <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:hidden`}>
                <ClubSidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center bg-white border-b border-gray-200 lg:hidden px-4 h-16">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 hover:text-orange-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="ml-4">
                        <img src="/matchbase.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                </div>

                <Header />

                {header && (
                    <header className="bg-white border-b border-gray-200 px-8 py-4">
                        <div className="mx-auto max-w-7xl">
                            {header}
                        </div>
                    </header>
                )}

                <main className="p-8 flex-1">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
