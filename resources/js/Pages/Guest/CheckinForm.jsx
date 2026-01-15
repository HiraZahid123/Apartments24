import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    User,
    Calendar,
    Flag,
    CreditCard,
    Camera,
    Edit3,
    CheckCircle2,
    ChevronRight,
    Loader2
} from 'lucide-react';

const translations = {
    en: {
        title: "Guest Registration",
        subtitle: "Please provide your details to receive access codes.",
        personal_info: "Personal Information",
        first_name: "First Name",
        last_name: "Last Name",
        dob: "Date of Birth",
        nationality: "Nationality",
        document_info: "Identification",
        doc_type: "Document Type",
        doc_number: "Document Number",
        passport: "Passport",
        id_card: "ID Card",
        other: "Other",
        id_image: "ID / Passport Photo",
        id_image_hint: "Upload a clear photo of your document",
        signature: "Digital Signature",
        signature_hint: "Please sign in the box below",
        clear: "Clear",
        submit: "Complete Check-in",
        processing: "Processing...",
        success_title: "Registration Complete",
        success_msg: "Your details have been submitted successfully."
    },
    et: {
        title: "Külalise registreerimine",
        subtitle: "Juurdepääsukoodide saamiseks esitage oma andmed.",
        personal_info: "Isikuandmed",
        first_name: "Eesnimi",
        last_name: "Perekonnanimi",
        dob: "Sünniaeg",
        nationality: "Kodakondsus",
        document_info: "Identifitseerimine",
        doc_type: "Dokumendi tüüp",
        doc_number: "Dokumendi number",
        passport: "Pass",
        id_card: "ID-kaart",
        other: "Muu",
        id_image: "ID / passi foto",
        id_image_hint: "Laadige üles selge foto oma dokumendist",
        signature: "Digitaalne allkiri",
        signature_hint: "Palun kirjutage alla allpool olevasse kasti",
        clear: "Puhasta",
        submit: "Lõpeta sisseregistreerimine",
        processing: "Töötlemine...",
        success_title: "Registreerimine lõpetatud",
        success_msg: "Teie andmed on edukalt edastatud."
    },
    ru: {
        title: "Регистрация гостя",
        subtitle: "Пожалуйста, предоставьте свои данные для получения кодов доступа.",
        personal_info: "Личная информация",
        first_name: "Имя",
        last_name: "Фамилия",
        dob: "Дата рождения",
        nationality: "Гражданство",
        document_info: "Идентификация",
        doc_type: "Тип документа",
        doc_number: "Номер документа",
        passport: "Паспорт",
        id_card: "ID-карта",
        other: "Другое",
        id_image: "Фото ID / паспорта",
        id_image_hint: "Загрузите четкое фото вашего документа",
        signature: "Цифровая подпись",
        signature_hint: "Пожалуйста, распишитесь в поле ниже",
        clear: "Очистить",
        submit: "Завершить регистрацию",
        processing: "Обработка...",
        success_title: "Регистрация завершена",
        success_msg: "Ваши данные были успешно отправлены."
    }
};

export default function CheckinForm({ booking }) {
    const [lang, setLang] = useState(booking.preferred_language || 'en');
    const t = translations[lang];
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        nationality: '',
        document_type: 'passport',
        document_number: '',
        identification_image: null,
        signature_data: '',
    });

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

        ctx.lineTo(x, y);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (e.cancelable) e.preventDefault();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        setData('signature_data', canvas.toDataURL());
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setData('signature_data', '');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('identification_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('guest.checkin.store', { token: booking.checkin_token }), {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 pb-20">
            <Head title={t.title} />

            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-12 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden mb-10">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-orange rounded-full"></div>
                </div>

                <img
                    src="/logo_apartments24.png"
                    alt="Apartments24"
                    className="h-14 mx-auto mb-8 brightness-110"
                />

                <h1 className="text-3xl font-black mb-2">{t.title}</h1>
                <p className="text-slate-400 text-sm font-medium">{t.subtitle}</p>

                {/* Language Picker */}
                <div className="mt-8 flex justify-center gap-3">
                    {['en', 'et', 'ru'].map(l => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${lang === l
                                ? 'bg-brand-orange text-white shadow-lg shadow-orange-900'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-6">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Apartment Info Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-orange">
                            <Globe className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-slate-900 font-black">{booking.apartment.name}</h3>
                            <p className="text-slate-500 text-sm font-medium">Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Section: Personal Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900">{t.personal_info}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.first_name}</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-bold text-slate-900"
                                    required
                                />
                                {errors.first_name && <p className="text-red-500 text-xs font-bold mt-1">{errors.first_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.last_name}</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-bold text-slate-900"
                                    required
                                />
                                {errors.last_name && <p className="text-red-500 text-xs font-bold mt-1">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.dob}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={e => setData('date_of_birth', e.target.value)}
                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 pl-14 pr-5 focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-bold text-slate-900"
                                        required
                                    />
                                </div>
                                {errors.date_of_birth && <p className="text-red-500 text-xs font-bold mt-1">{errors.date_of_birth}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.nationality}</label>
                                <div className="relative">
                                    <Flag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Estonian"
                                        value={data.nationality}
                                        onChange={e => setData('nationality', e.target.value)}
                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 pl-14 pr-5 focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-bold text-slate-900"
                                        required
                                    />
                                </div>
                                {errors.nationality && <p className="text-red-500 text-xs font-bold mt-1">{errors.nationality}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Document Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900">{t.document_info}</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.doc_type}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['passport', 'id_card', 'other'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setData('document_type', type)}
                                        className={`py-3 rounded-2xl text-xs font-black uppercase transition-all ${data.document_type === type
                                            ? 'bg-brand-orange text-white shadow-lg shadow-orange-100'
                                            : 'bg-slate-50 text-slate-500 border border-slate-100'
                                            }`}
                                    >
                                        {t[type]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.doc_number}</label>
                            <input
                                type="text"
                                value={data.document_number}
                                onChange={e => setData('document_number', e.target.value)}
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition-all font-bold text-slate-900"
                                required
                            />
                            {errors.document_number && <p className="text-red-500 text-xs font-bold mt-1">{errors.document_number}</p>}
                        </div>

                        {/* ID Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.id_image}</label>
                            <div
                                className={`relative border-2 border-dashed rounded-3xl transition-all h-48 flex flex-col items-center justify-center overflow-hidden cursor-pointer ${imagePreview ? 'border-brand-orange bg-orange-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                onClick={() => document.getElementById('id_upload').click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <>
                                        <Camera className="w-10 h-10 text-slate-300 mb-2" />
                                        <p className="text-slate-400 text-sm font-bold">{t.id_image_hint}</p>
                                    </>
                                )}
                                <input
                                    id="id_upload"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                            {errors.identification_image && <p className="text-red-500 text-xs font-bold mt-1 text-center">{errors.identification_image}</p>}
                        </div>
                    </div>

                    {/* Section: Signature */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900">{t.signature}</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="border border-slate-200 rounded-3xl bg-white overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseOut={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    width={600}
                                    height={200}
                                    className="w-full h-48 cursor-crosshair touch-none"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.signature_hint}</p>
                                <button
                                    type="button"
                                    onClick={clearSignature}
                                    className="text-xs font-black text-brand-orange uppercase tracking-widest hover:underline"
                                >
                                    {t.clear}
                                </button>
                            </div>
                            {errors.signature_data && <p className="text-red-500 text-xs font-bold mt-1">{errors.signature_data}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-brand-orange text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-orange-100 flex items-center justify-center gap-3 hover:bg-orange-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" /> {t.processing}
                            </>
                        ) : (
                            <>
                                {t.submit} <ChevronRight className="w-6 h-6" />
                            </>
                        )}
                    </button>

                </form>
            </main>

            {/* Verification Pattern Background (Global Mask) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
