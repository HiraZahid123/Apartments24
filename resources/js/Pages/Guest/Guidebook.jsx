import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    MapPin,
    Info,
    Key,
    Wifi,
    LogOut,
    Coffee,
    Navigation,
    Utensils,
    ShoppingBag,
    HelpCircle,
    ChevronRight,
    ArrowLeft,
    Globe,
    Menu,
    X,
    Phone,
    Mail,
    Clock
} from 'lucide-react';

const iconsMap = {
    Home,
    MapPin,
    Info,
    Key,
    Wifi,
    LogOut,
    Coffee,
    Navigation,
    Utensils,
    ShoppingBag,
    HelpCircle,
    Phone
};

const translations = {
    en: {
        welcome: "Welcome",
        guidebook: "Digital Guidebook",
        back: "Back to Dashboard",
        change_lang: "Change Language",
        home: "Home",
        sections: "Sections",
        stay_details: "Stay Details",
        contact_us: "Need Help?",
        contact_description: "Our team is available to assist you with any questions during your stay.",
        call_host: "Call Host",
        email_us: "Email Us",
        service_hours: "Service Hours",
    },
    et: {
        welcome: "Tere tulemast",
        guidebook: "Digitaalne juhis",
        back: "Tagasi töölauale",
        change_lang: "Muuda keelt",
        home: "Avaleht",
        sections: "Sektsioonid",
        stay_details: "Peatumise andmed",
        contact_us: "Vajad abi?",
        contact_description: "Meie meeskond on teie peatumise ajal abistamiseks saadaval.",
        call_host: "Helista",
        email_us: "Saada e-kiri",
        service_hours: "Teenindusaeg",
    },
    ru: {
        welcome: "Добро пожаловать",
        guidebook: "Цифровой путеводитель",
        back: "Назад в панель",
        change_lang: "Сменить язык",
        home: "Главная",
        sections: "Разделы",
        stay_details: "Детали пребывания",
        contact_us: "Нужна помощь?",
        contact_description: "Наша команда готова помочь вам во время пребывания.",
        call_host: "Позвонить",
        email_us: "Написать",
        service_hours: "Часы работы",
    }
};

export default function Guidebook({ booking, apartment, guidebook, contactSettings = {} }) {
    const [lang, setLang] = useState(booking.preferred_language || 'en');
    const [activeSection, setActiveSection] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const t = translations[lang];
    const sections = guidebook.sections || [];
    
    // Sync document language tag
    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    // Auto-scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
        setIsMenuOpen(false);
    }, [activeSection]);

    const RenderIcon = ({ name, className }) => {
        const IconComponent = iconsMap[name] || Info;
        return <IconComponent className={className} />;
    };

    const getTranslation = (obj, defaultText = '') => {
        if (!obj) return defaultText;
        return obj[lang] || obj['en'] || defaultText;
    };

    // Get contact info from admin settings (fall back to defaults)
    const contactPhone = contactSettings.contact_phone || null;
    const contactEmail = contactSettings.contact_email || null;
    const contactDescription = contactSettings[`contact_description_${lang}`] 
        || contactSettings.contact_description_en 
        || t.contact_description;
    const contactHours = contactSettings[`contact_hours_${lang}`] 
        || contactSettings.contact_hours_en 
        || null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head title={`${getTranslation(guidebook.welcome_title, 'Guidebook')} | Apartments24`} />

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-slate-900 uppercase tracking-tighter italic">Apartments24</span>
                </div>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Navigation Overlay (Mobile) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-40 bg-white lg:hidden overflow-y-auto pt-24 pb-10 px-8"
                    >
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveSection('home')}
                                className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${activeSection === 'home' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Home className="w-5 h-5" /> {t.home}
                            </button>
                            
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${activeSection === section.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <RenderIcon name={section.icon} className="w-5 h-5" />
                                    {getTranslation(section.title)}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100">
                             <div className="flex gap-2 mb-8">
                                {['en', 'et', 'ru'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                            <Link
                                href={route('guest.checkin.success', { token: booking.checkin_token })}
                                className="flex items-center justify-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs"
                            >
                                <ArrowLeft className="w-4 h-4" /> {t.back}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex">
                {/* Sidebar (Desktop) — fixed position */}
                <aside className="hidden lg:flex flex-col w-80 h-screen fixed top-0 left-0 bg-white border-r border-slate-100 p-8 overflow-y-auto z-30">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-xl text-slate-900 uppercase tracking-tighter italic">Apartments24</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Digital Guest Experience</p>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 ml-4">{t.sections}</p>
                        <button
                            onClick={() => setActiveSection('home')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeSection === 'home' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:translate-x-1'}`}
                        >
                            <Home className="w-4 h-4" /> {t.home}
                        </button>

                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeSection === section.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:translate-x-1'}`}
                            >
                                <RenderIcon name={section.icon} className="w-4 h-4" />
                                {getTranslation(section.title)}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-slate-50 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex gap-1">
                                {['en', 'et', 'ru'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <Link
                            href={route('guest.checkin.success', { token: booking.checkin_token })}
                            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-600 transition-colors font-black uppercase tracking-widest text-[10px]"
                        >
                            <ArrowLeft className="w-4 h-4" /> {t.back}
                        </Link>
                    </div>
                </aside>

                {/* Spacer for fixed sidebar on desktop */}
                <div className="hidden lg:block w-80 flex-shrink-0"></div>

                {/* Main Content Column */}
                <div className="flex-1 min-w-0">
                    <main className="max-w-4xl mx-auto px-6 pt-24 lg:pt-16 pb-10">
                        <AnimatePresence mode="wait">
                            {activeSection === 'home' ? (
                                <motion.div
                                    key="home"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-12"
                                >
                                    {/* Banner */}
                                    <div className="relative h-80 rounded-[3rem] overflow-hidden shadow-2xl">
                                        {guidebook.banner_image ? (
                                            <img 
                                                src={`/storage/${guidebook.banner_image}`} 
                                                alt={apartment.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
                                                <Home className="w-24 h-24 text-white/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-12">
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <h1 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter mb-2">
                                                    {getTranslation(guidebook.welcome_title)}
                                                </h1>
                                                <p className="text-indigo-100 font-bold text-lg max-w-xl">
                                                    {getTranslation(guidebook.welcome_message)}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Quick Info Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                                    <Wifi className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 uppercase tracking-tight">WiFi Access</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Stay Connected</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Network</span>
                                                    <span className="text-sm font-black text-slate-900">{apartment.wifi_ssid || 'Apartments24_Guest'}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Password</span>
                                                    <span className="text-sm font-black text-slate-900">{apartment.wifi_password || 'Welcome24'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 uppercase tracking-tight">Location</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{apartment.city}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-4">
                                                {apartment.address}
                                            </p>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apartment.address + ', ' + apartment.city)}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:underline"
                                            >
                                                <Navigation className="w-3 h-3" /> Get Directions
                                            </a>
                                        </div>
                                    </div>

                                    {/* Menu Preview */}
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Explore Your Stay</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {sections.map(section => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => setActiveSection(section.id)}
                                                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all text-left flex items-center gap-5"
                                                >
                                                    <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center transition-colors">
                                                        <RenderIcon name={section.icon} className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-black text-slate-900 uppercase tracking-tight">{getTranslation(section.title)}</h3>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">View details</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {sections.filter(s => s.id === activeSection).map(section => (
                                        <div key={section.id} className="space-y-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-100">
                                                    <RenderIcon name={section.icon} className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 italic uppercase tracking-tighter mb-2">
                                                        {getTranslation(section.title)}
                                                    </h1>
                                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Section Information</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {section.items.map((item, idx) => (
                                                    <div 
                                                        key={item.id} 
                                                        className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative"
                                                    >
                                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                                            <span className="text-8xl font-black text-slate-900">{idx + 1}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                                                            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                                                            {getTranslation(item.title)}
                                                        </h3>
                                                        <div className="text-slate-600 text-lg leading-relaxed font-medium whitespace-pre-line prose prose-indigo max-w-none">
                                                            {item.image && (
                                                                <div className="mb-6 rounded-3xl overflow-hidden border border-slate-100 shadow-sm aspect-video">
                                                                    <img src={`/storage/${item.image}`} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                            {getTranslation(item.content)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setActiveSection('home')}
                                                className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase tracking-widest text-xs transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Back to home
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    {/* Footer Contact — aligned with main content */}
                    <footer className="max-w-4xl mx-auto px-6 pb-20">
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                 <HelpCircle className="absolute -top-10 -right-10 w-64 h-64 rotate-12" />
                            </div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{t.contact_us}</h3>
                            <p className="text-slate-400 font-bold mb-8 max-w-sm mx-auto text-sm italic">
                                {contactDescription}
                            </p>
                            {contactHours && (
                                <div className="flex items-center justify-center gap-2 text-slate-500 font-black uppercase tracking-widest text-[10px] mb-8">
                                    <Clock className="w-3 h-3" />
                                    {t.service_hours}: {contactHours}
                                </div>
                            )}
                            <div className="flex flex-wrap justify-center gap-4">
                                {contactPhone && (
                                    <a 
                                        href={`tel:${contactPhone}`}
                                        className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-100 transition-all"
                                    >
                                        <Phone className="w-4 h-4" /> {t.call_host}
                                    </a>
                                )}
                                {contactEmail && (
                                    <a 
                                        href={`mailto:${contactEmail}`}
                                        className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-700 transition-all"
                                    >
                                        <Mail className="w-4 h-4" /> {t.email_us}
                                    </a>
                                )}
                                {!contactPhone && !contactEmail && (
                                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic">Contact info not configured yet.</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-12 text-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Powered by Apartments24 Guest Suite</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
