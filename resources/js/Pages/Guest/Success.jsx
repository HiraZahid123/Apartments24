import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Key,
    MapPin,
    Info,
    CheckCircle2,
    Home,
    LogOut,
    ArrowRight,
    Wifi,
    ExternalLink,
    Loader2
} from 'lucide-react';

const translations = {
    en: {
        title: "Check-in Successful!",
        subtitle: "Welcome to your apartment. Here is everything you need.",
        access_codes: "Access Codes",
        keybox_title: "Keybox Code",
        instructions: "Arrival Instructions",
        wifi: "WiFi Details",
        wifi_network: "Network",
        wifi_pass: "Password",
        checkout_button: "I have Checked out",
        checkout_msg: "Please click this button when you leave the apartment.",
        checkout_confirm: "Confirm Checkout?",
        checkout_done: "Check-out Complete",
        checkout_thanks: "Thank you for staying with us! Safe travels.",
        back_home: "Back to Home",
        arrival_link: "View Location Map"
    },
    et: {
        title: "Sisseregistreerimine õnnestus!",
        subtitle: "Tere tulemast oma korterisse. Siin on kaikki, mida vajate.",
        access_codes: "Juurdepääsukoodid",
        keybox_title: "Võtmekasti kood",
        instructions: "Saabumisjuhised",
        wifi: "WiFi andmed",
        wifi_network: "Võrk",
        wifi_pass: "Parool",
        checkout_button: "Olen välja registreerunud",
        checkout_msg: "Palun vajutage seda nuppu, kui lahkute korterist.",
        checkout_confirm: "Kinnita väljaregistreerimine?",
        checkout_done: "Väljaregistreerimine lõpetatud",
        checkout_thanks: "Täname meiega peatumise eest! Turvalist reisi.",
        back_home: "Tagasi koju",
        arrival_link: "Vaata asukohakaarti"
    },
    ru: {
        title: "Заезд выполнен успешно!",
        subtitle: "Добро пожаловать в ваши апартаменты. Вот все, что вам нужно.",
        access_codes: "Коды доступа",
        keybox_title: "Код кейбокса",
        instructions: "Инструкции по прибытию",
        wifi: "Данные WiFi",
        wifi_network: "Сеть",
        wifi_pass: "Пароль",
        checkout_button: "Я выселился",
        checkout_msg: "Пожалуйста, нажмите эту кнопку, когда покинете апартаменты.",
        checkout_confirm: "Подтвердить выселение?",
        checkout_done: "Выселение завершено",
        checkout_thanks: "Спасибо, что остановились у нас! Счастливого пути.",
        back_home: "На главную",
        arrival_link: "Посмотреть карту проезда"
    }
};

export default function Success({ booking }) {
    const [lang, setLang] = useState(booking.preferred_language || 'en');
    const t = translations[lang];
    const apartment = booking.apartment;

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
                    <CheckCircle2 className="absolute -top-10 -right-10 w-64 h-64 rotate-12" />
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
                        <CheckCircle2 className="w-12 h-12 text-brand-orange" />
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
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-slate-900 text-white p-2 rounded-xl">
                                    <Key className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">{t.access_codes}</h2>
                            </div>

                            <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.keybox_title}</p>
                                <span className="text-6xl font-black text-brand-orange tracking-tighter">
                                    {apartment.keybox_code || '----'}
                                </span>
                            </div>

                            <div className="mt-8 flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                    <Info className="w-5 h-5 text-brand-orange" />
                                </div>
                                <p className="text-xs font-bold text-orange-900 leading-relaxed">
                                    {t.checkout_msg}
                                </p>
                            </div>
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
                                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed font-medium">
                                        {apartment.instructions || 'No special instructions provided.'}
                                    </div>
                                </div>

                                {apartment.arrival_url && (
                                    <a
                                        href={apartment.arrival_url}
                                        target="_blank"
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
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
                                            <p className="text-sm font-black text-slate-900">Apartments24_Guest</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.wifi_pass}</p>
                                            <p className="text-sm font-black text-slate-900">Welcome24</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Checkout Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCheckout}
                            disabled={processing}
                            className="w-full bg-white text-red-600 py-6 rounded-[2.5rem] font-black text-lg border-2 border-red-50 shadow-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogOut className="w-6 h-6" />}
                            {t.checkout_button}
                        </motion.button>
                    </>
                ) : (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{t.checkout_thanks}</h2>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-brand-orange font-black uppercase tracking-widest hover:underline"
                        >
                            {t.back_home} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}

                <div className="text-center pt-8">
                    <Link href="/" className="text-slate-400 text-sm font-black uppercase tracking-widest hover:text-brand-orange transition-colors inline-flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 rotate-180" /> {t.back_home}
                    </Link>
                </div>

            </main>
        </div>
    );
}
