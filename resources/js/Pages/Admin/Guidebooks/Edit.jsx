import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Save, 
    Plus, 
    Trash2, 
    GripVertical, 
    ChevronDown, 
    ChevronUp, 
    Image as ImageIcon,
    Info,
    Home,
    MapPin,
    Key,
    Wifi,
    LogOut,
    Coffee,
    Navigation,
    Utensils,
    ShoppingBag,
    HelpCircle,
    Phone,
    Globe
} from 'lucide-react';
import { toast } from 'react-toastify';

const iconOptions = [
    { name: 'Home', icon: Home },
    { name: 'MapPin', icon: MapPin },
    { name: 'Info', icon: Info },
    { name: 'Key', icon: Key },
    { name: 'Wifi', icon: Wifi },
    { name: 'LogOut', icon: LogOut },
    { name: 'Coffee', icon: Coffee },
    { name: 'Navigation', icon: Navigation },
    { name: 'Utensils', icon: Utensils },
    { name: 'ShoppingBag', icon: ShoppingBag },
    { name: 'HelpCircle', icon: HelpCircle },
    { name: 'Phone', icon: Phone }
];

export default function Edit({ auth, apartment, guidebook }) {
    const [activeLang, setActiveLang] = useState('en');
    const [fileInputKey, setFileInputKey] = useState(0);
    const [savedBannerImage, setSavedBannerImage] = useState(guidebook.banner_image || null);
    // Images whose file is missing on the server. Without this a broken <img> would
    // cover the drop zone with an invisible box, hiding the "click to upload" prompt
    // and making it look like the image can no longer be changed.
    const [bannerBroken, setBannerBroken] = useState(false);
    const [brokenItemImages, setBrokenItemImages] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        welcome_title: guidebook.welcome_title || { en: '', et: '', ru: '' },
        welcome_message: guidebook.welcome_message || { en: '', et: '', ru: '' },
        banner_image: null,
        banner_image_removed: false,
        sections: guidebook.sections || [],
    });

    // Local preview for a freshly picked banner file. Built once per file (and
    // revoked afterwards) rather than on every render.
    const [bannerPreview, setBannerPreview] = useState(null);
    useEffect(() => {
        if (!data.banner_image) {
            setBannerPreview(null);
            return;
        }
        const url = URL.createObjectURL(data.banner_image);
        setBannerPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.banner_image]);

    // Sync state when the guidebook prop changes (e.g. after a successful save / Inertia revisit)
    useEffect(() => {
        setSavedBannerImage(guidebook.banner_image || null);
        setBannerBroken(false);
        setBrokenItemImages({});
        setData(prev => ({
            ...prev,
            welcome_title: guidebook.welcome_title || { en: '', et: '', ru: '' },
            welcome_message: guidebook.welcome_message || { en: '', et: '', ru: '' },
            banner_image: null,
            banner_image_removed: false,
            sections: guidebook.sections || [],
        }));
        setFileInputKey(k => k + 1);
    }, [guidebook.id, guidebook.banner_image, guidebook.updated_at]);

    const addSection = () => {
        const newSection = {
            id: 'section_' + Date.now(),
            title: { en: 'New Section', et: '', ru: '' },
            icon: 'Info',
            items: []
        };
        setData('sections', [...data.sections, newSection]);
    };

    const removeSection = (sectionId) => {
        setData('sections', data.sections.filter(s => s.id !== sectionId));
    };

    const updateSection = (sectionId, field, value) => {
        setData('sections', data.sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const updateSectionLang = (sectionId, field, lang, value) => {
        setData('sections', data.sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, [field]: { ...s[field], [lang]: value } };
            }
            return s;
        }));
    };

    const addItem = (sectionId) => {
        setData('sections', data.sections.map(s => {
            if (s.id === sectionId) {
                const newItem = {
                    id: 'item_' + Date.now(),
                    title: { en: 'New Item', et: '', ru: '' },
                    content: { en: '', et: '', ru: '' },
                    image: null
                };
                return { ...s, items: [...s.items, newItem] };
            }
            return s;
        }));
    };

    const removeItem = (sectionId, itemId) => {
        setData('sections', data.sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, items: s.items.filter(i => i.id !== itemId) };
            }
            return s;
        }));
    };

    const updateItemLang = (sectionId, itemId, field, lang, value) => {
        setData('sections', data.sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    items: s.items.map(i => {
                        if (i.id === itemId) {
                            return { ...i, [field]: { ...i[field], [lang]: value } };
                        }
                        return i;
                    })
                };
            }
            return s;
        }));
    };

    const moveSection = (index, direction) => {
        const newSections = [...data.sections];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newSections.length) return;
        
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        setData('sections', newSections);
    };

    const submit = (e) => {
        e.preventDefault();
        // forceFormData ensures Inertia always uses multipart/form-data so the
        // backend can see file uploads on every save — not just the first one.
        post(route('admin.apartments.guidebook.update', apartment.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Guidebook updated successfully');
                // State will be synced by the useEffect when Inertia refreshes the guidebook prop
                setData(prev => ({ ...prev, banner_image: null, banner_image_removed: false }));
                setFileInputKey(k => k + 1);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-3xl text-slate-900 tracking-tight leading-none italic uppercase">Guidebook: {apartment.name}</h2>}
        >
            <Head title={`Edit Guidebook | ${apartment.name}`} />

            <div className="py-6 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={route('admin.apartments.edit', apartment.id)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Property
                    </Link>

                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        {['en', 'et', 'ru'].map(l => (
                            <button
                                key={l}
                                onClick={() => setActiveLang(l)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeLang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8 pb-20">
                    {/* Welcome Header Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Home className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Welcome Screen</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Welcome Title ({activeLang})</label>
                                    <input
                                        type="text"
                                        value={data.welcome_title[activeLang] || ''}
                                        onChange={e => setData('welcome_title', { ...data.welcome_title, [activeLang]: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 font-bold"
                                        placeholder="e.g. Welcome to your home away from home"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Welcome Message ({activeLang})</label>
                                    <textarea
                                        value={data.welcome_message[activeLang] || ''}
                                        onChange={e => setData('welcome_message', { ...data.welcome_message, [activeLang]: e.target.value })}
                                        rows="3"
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 font-bold"
                                        placeholder="Brief welcome note..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Banner Image</label>
                                <div className="relative group rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                                    {bannerPreview ? (
                                        <>
                                            <img src={bannerPreview} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                                                <ImageIcon className="w-6 h-6 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Click to change</span>
                                            </div>
                                        </>
                                    ) : savedBannerImage && !bannerBroken ? (
                                        <>
                                            <img
                                                src={`/storage/${savedBannerImage}`}
                                                onError={() => setBannerBroken(true)}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                                                <ImageIcon className="w-6 h-6 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Click to change</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {bannerBroken ? 'Image missing — click to re-upload' : 'Click to upload'}
                                            </span>
                                        </>
                                    )}
                                    <input
                                        key={fileInputKey}
                                        type="file"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Clear the "removed" flag and set the new file
                                                setData(prev => ({
                                                    ...prev,
                                                    banner_image: file,
                                                    banner_image_removed: false,
                                                }));
                                                // Reset input key so the same file can be re-selected later
                                                setFileInputKey(k => k + 1);
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                    />
                                    {(data.banner_image || savedBannerImage) && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // If there's a saved (server-side) image, mark it for removal on save
                                                if (savedBannerImage && !data.banner_image) {
                                                    setData(prev => ({ ...prev, banner_image: null, banner_image_removed: true }));
                                                } else {
                                                    setData(prev => ({ ...prev, banner_image: null, banner_image_removed: false }));
                                                }
                                                setSavedBannerImage(null);
                                                setFileInputKey(k => k + 1);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-rose-500 rounded-lg shadow-sm z-20 backdrop-blur-sm transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sections Manager */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-6">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Guidebook Sections</h3>
                            <button
                                type="button"
                                onClick={addSection}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                <Plus className="w-4 h-4" /> Add Section
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.sections.map((section, sIndex) => (
                                <div key={section.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                    {/* Section Header */}
                                    <div className="p-8 bg-slate-50/50 flex items-center gap-6 border-b border-slate-50">
                                        <div className="flex flex-col gap-1">
                                            <button 
                                                type="button" 
                                                onClick={() => moveSection(sIndex, -1)}
                                                className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-30"
                                                disabled={sIndex === 0}
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => moveSection(sIndex, 1)}
                                                className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-30"
                                                disabled={sIndex === data.sections.length - 1}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 flex-1 gap-6">
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Title ({activeLang})</label>
                                                <input
                                                    type="text"
                                                    value={section.title[activeLang] || ''}
                                                    onChange={e => updateSectionLang(section.id, 'title', activeLang, e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon</label>
                                                <select
                                                    value={section.icon}
                                                    onChange={e => updateSection(section.id, 'icon', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-bold text-sm"
                                                >
                                                    {iconOptions.map(opt => (
                                                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(section.id)}
                                                    className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Items */}
                                    <div className="p-8 space-y-8">
                                        {section.items.map((item, iIndex) => (
                                            <div key={item.id} className="relative pl-12 border-l-2 border-slate-50 group">
                                                <div className="absolute top-0 left-[-11px] w-5 h-5 bg-white border-4 border-indigo-100 rounded-full group-hover:border-indigo-400 transition-all"></div>
                                                
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Title ({activeLang})</label>
                                                            <input
                                                                type="text"
                                                                value={item.title[activeLang] || ''}
                                                                onChange={e => updateItemLang(section.id, item.id, 'title', activeLang, e.target.value)}
                                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 font-bold"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Content ({activeLang})</label>
                                                            <textarea
                                                                value={item.content[activeLang] || ''}
                                                                onChange={e => updateItemLang(section.id, item.id, 'content', activeLang, e.target.value)}
                                                                rows="4"
                                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 font-medium"
                                                                placeholder="Detailed information, rules, or instructions..."
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Image (Optional)</label>
                                                            <div className="relative group rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 aspect-[3/1] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                                                                {item.image && typeof item.image !== 'string' ? (
                                                                     <img src={URL.createObjectURL(item.image)} className="absolute inset-0 w-full h-full object-cover" />
                                                                ) : item.image && typeof item.image === 'string' && !brokenItemImages[`${section.id}:${item.id}`] ? (
                                                                    <img
                                                                        src={`/storage/${item.image}`}
                                                                        onError={() => setBrokenItemImages(prev => ({ ...prev, [`${section.id}:${item.id}`]: true }))}
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                            {brokenItemImages[`${section.id}:${item.id}`] ? 'Image missing — click to re-upload' : 'Click to upload image'}
                                                                        </span>
                                                                    </>
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    onChange={e => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            const newSections = [...data.sections];
                                                                            const sec = newSections.find(s => s.id === section.id);
                                                                            const itm = sec.items.find(i => i.id === item.id);
                                                                            itm.image = file;
                                                                            setData('sections', newSections);
                                                                        }
                                                                    }}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                    accept="image/*"
                                                                />
                                                                {item.image && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            const newSections = [...data.sections];
                                                                            const sec = newSections.find(s => s.id === section.id);
                                                                            const itm = sec.items.find(i => i.id === item.id);
                                                                            // Mark as explicitly removed so controller knows to delete it
                                                                            itm.image = null;
                                                                            itm.image_removed = true;
                                                                            setData('sections', newSections);
                                                                        }}
                                                                        className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-rose-500 rounded-lg shadow-sm z-20 backdrop-blur-sm transition-all"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(section.id, item.id)}
                                                        className="ml-6 p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => addItem(section.id)}
                                            className="w-full py-4 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
                                        >
                                            <Plus className="w-3 h-3 inline mr-2" /> Add Item to {section.title.en}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {data.sections.length === 0 && (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
                                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-black text-slate-400 uppercase italic">No sections created yet</h4>
                                    <p className="text-sm text-slate-400 mb-8">Start building your guidebook by adding your first section.</p>
                                    <button
                                        type="button"
                                        onClick={addSection}
                                        className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-600 border-2 border-indigo-50 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-200 transition-all shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Create First Section
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating Save Button */}
                    <div className="fixed bottom-10 right-10 z-50">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-3 px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                            Save Guidebook
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
