import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Key,
    MapPin,
    Info,
    CheckCircle,
    Home,
    LogOut,
    ArrowRight,
    Wifi,
    ExternalLink,
    Loader2,
    Users
} from 'lucide-react';

const translations = {
    en: {
        title: "Check-in Successful!",
        subtitle: "Welcome to your apartment. Here is everything you need.",
        access_codes: "Access Codes",
        keybox_title: "Keybox Code",
        smart_lock_title: "Smart Lock Code",
        instructions: "Arrival Instructions",
        wifi: "WiFi Details",
        wifi_network: "Network",
        wifi_pass: "Password",
        checkout_title: "Check-out",
        checkout_button: "I have Checked out",
        checkout_msg: "Please click this button when you leave the apartment.",
        checkout_confirm: "Confirm Checkout?",
        checkout_done: "Check-out Complete",
        checkout_thanks: "Thank you for staying with us! Safe travels.",
        back_home: "Back to Home",
        arrival_link: "View Location Map",
        additional_guests_title: "Additional Guests",
        guests_registered: "guests registered",
        register_next: "Register Next Guest",
        multi_guest_hint: "You can optionally register other guests staying with you."
    },
    et: {
        title: "Sisseregistreerimine õnnestus!",
        subtitle: "Tere tulemast oma korterisse. Siin on kõik, mida vajate.",
        access_codes: "Juurdepääsukoodid",
        keybox_title: "Võtmekasti kood",
        smart_lock_title: "Nutika luku kood",
        instructions: "Saabumisjuhised",
        wifi: "WiFi andmed",
        wifi_network: "Võrk",
        wifi_pass: "Parool",
        checkout_title: "Väljaregistreerimine",
        checkout_button: "Olen välja registreerunud",
        checkout_msg: "Palun vajutage seda nuppu, kui lahkute korterist.",
        checkout_confirm: "Kinnita väljaregistreerimine?",
        checkout_done: "Väljaregistreerimine lõpetatud",
        checkout_thanks: "Täname meiega peatumise eest! Turvalist reisi.",
        back_home: "Tagasi koju",
        arrival_link: "Vaata asukohakaarti",
        additional_guests_title: "Lisakülalised",
        guests_registered: "külalist registreeritud",
        register_next: "Registreeri järgmine külaline",
        multi_guest_hint: "Saate soovi korral registreerida ka teised teiega peatuvad külalised."
    },
    ru: {
        title: "Заезд выполнен успешно!",
        subtitle: "Добро пожаловать в ваши апартаменты. Вот все, что вам нужно.",
        access_codes: "Коды доступа",
        keybox_title: "Код кейбокса",
        smart_lock_title: "Код смарт-замка",
        instructions: "Инструкции по прибытию",
        wifi: "Данные WiFi",
        wifi_network: "Сеть",
        wifi_pass: "Пароль",
        checkout_title: "Выселение",
        checkout_button: "Я выселился",
        checkout_msg: "Пожалуйста, нажмите эту кнопку, когда покинете апартаменты.",
        checkout_confirm: "Подтвердить выселение?",
        checkout_done: "Выселение завершено",
        checkout_thanks: "Спасибо, что остановились у нас! Счастливого пути.",
        back_home: "На главную",
        arrival_link: "Посмотреть карту проезда",
        additional_guests_title: "Дополнительные гости",
        guests_registered: "гостей зарегистрировано",
        register_next: "Зарегистрировать следующего гостя",
        multi_guest_hint: "Вы можете по желанию зарегистрировать других гостей, проживающих с вами."
    }
};

const RenderInstructions = ({ text }) => {
    if (!text) return 'No special instructions provided.';

    // Simple regex to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-bold hover:underline break-all"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export default function Success({ booking, checkins_count }) {
    const [lang, setLang] = useState(booking.preferred_language || 'en');
    const t = translations[lang];
    const apartment = booking.apartment;
    const currentCount = Number(checkins_count || 0);
    const totalNeeded = Number(booking.number_of_guests || 1);
    const canRegisterMore = currentCount < totalNeeded;

    const { post, processing } = useForm();

    const handleCheckout = () => {
        if (confirm(t.checkout_confirm)) {
            post(route('guest.checkin.checkout', { token: booking.checkin_token }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 pb-20">
            <Head title={booking.is_checked_out ? t.checkout_done : t.title} />

            {/* Success Header */}
            <div className={`text-white px-6 py-16 text-center rounded-b-[3.5rem] shadow-xl relative overflow-hidden mb-12 transition-colors duration-500 ${booking.is_checked_out ? 'bg-slate-900' : 'bg-brand-orange'}`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-15 pointer-events-none">
                    <CheckCircle className="absolute -top-10 -right-10 w-64 h-64 rotate-12" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
                >
                    {booking.is_checked_out ? (
                        <LogOut className="w-12 h-12 text-slate-900" />
                    ) : (
                        <CheckCircle className="w-12 h-12 text-brand-orange" />
                    )}
                </motion.div>

                <h1 className="text-3xl font-black mb-3">
                    {booking.is_checked_out ? t.checkout_done : t.title}
                </h1>
                <p className="text-orange-50 text-sm font-medium max-w-xs mx-auto">
                    {booking.is_checked_out ? t.checkout_thanks : t.subtitle}
                </p>

                {/* Language Picker */}
                <div className="mt-8 flex justify-center gap-2">
                    {['en', 'et', 'ru'].map(l => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === l
                                ? 'bg-white text-brand-orange shadow-md'
                                : 'bg-orange-600/30 text-orange-50 hover:bg-orange-600/50'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-xl mx-auto px-6 space-y-8">

                {!booking.is_checked_out ? (
                    <>
                        {/* Access Code Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden mb-6"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-slate-900 text-white p-2 rounded-xl">
                                    <Key className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">{t.access_codes}</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.keybox_title}</p>
                                    <span className="text-6xl font-black text-brand-orange tracking-tighter">
                                        {apartment.keybox_code || '----'}
                                    </span>
                                </div>

                                {apartment.smart_lock_code && (
                                    <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.smart_lock_title}</p>
                                        <span className="text-6xl font-black text-indigo-600 tracking-tighter">
                                            {apartment.smart_lock_code}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-rose-50 text-rose-600 p-2 rounded-xl">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">{t.checkout_title}</h2>
                            </div>

                            <p className="text-sm font-bold text-slate-500 mb-8 px-2">
                                {t.checkout_msg}
                            </p>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout}
                                disabled={processing}
                                className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-lg border-2 border-slate-800 shadow-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogOut className="w-6 h-6" />}
                                {t.checkout_button}
                            </motion.button>
                        </motion.div>

                        {/* Digital Guidebook Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.18 }}
                            className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex flex-col gap-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Home className="w-32 h-32 rotate-12" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Info className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tight">Digital Guidebook</h3>
                            </div>
                            <p className="text-indigo-100 text-sm font-bold leading-relaxed italic">
                                Everything you need to know about your stay, local recommendations, house rules, and more.
                            </p>
                            <Link
                                href={route('guest.guidebook', { token: booking.checkin_token })}
                                className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-lg"
                            >
                                View Digital Guidebook <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Apartment Info Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-slate-100 text-slate-600 p-2 rounded-xl">
                                    <Home className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">{apartment.name}</h3>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="w-4 h-4 text-brand-orange" />
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.instructions}</h4>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">
                                        <RenderInstructions text={lang === 'et' ? apartment.instructions_et : (lang === 'ru' ? apartment.instructions_ru : apartment.instructions)} />
                                    </div>
                                </div>

                                {(lang === 'et' ? apartment.arrival_url_et : (lang === 'ru' ? apartment.arrival_url_ru : apartment.arrival_url_en)) && (
                                    <a
                                        href={lang === 'et' ? apartment.arrival_url_et : (lang === 'ru' ? apartment.arrival_url_ru : apartment.arrival_url_en)}
                                        target="_blank"
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                    >
                                        <ExternalLink className="w-4 h-4" /> {t.arrival_link}
                                    </a>
                                )}

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Wifi className="w-4 h-4 text-brand-orange" />
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.wifi}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.wifi_network}</p>
                                            <p className="text-sm font-black text-slate-900">{apartment.wifi_ssid || 'Apartments24_Guest'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.wifi_pass}</p>
                                            <p className="text-sm font-black text-slate-900">{apartment.wifi_password || 'Welcome24'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Old Checkout Button Location - Removed */}

                        {/* Multi-guest Registration Section */}
                        {canRegisterMore && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">{t.additional_guests_title}</h3>
                                    </div>
                                    <div className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {currentCount} / {totalNeeded}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentCount / totalNeeded) * 100}%` }}
                                            className="h-full bg-white"
                                        />
                                    </div>
                                    <p className="text-indigo-100 text-xs font-bold leading-relaxed italic">
                                        {t.multi_guest_hint}
                                    </p>
                                </div>

                                <Link
                                    href={route('guest.checkin', { token: booking.checkin_token, add_guest: 1 })}
                                    className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-lg"
                                >
                                    {t.register_next} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{t.checkout_thanks}</h2>
                        <a
                            href="https://apartments24.ee/"
                            className="inline-flex items-center gap-2 text-brand-orange font-black uppercase tracking-widest hover:underline"
                        >
                            {t.back_home} <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                )}

                <div className="text-center pt-8">
                    <a href="https://apartments24.ee/" className="text-slate-400 text-sm font-black uppercase tracking-widest hover:text-brand-orange transition-colors inline-flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 rotate-180" /> {t.back_home}
                    </a>
                </div>

            </main>
        </div>
    );
}
