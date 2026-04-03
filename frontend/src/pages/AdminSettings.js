import { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminSettings() {
    const [settings, setSettings] = useState({ shopName: '', logo: '', carousel: [] });
    const [loading, setLoading] = useState(true);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            const res = await API.get('/admin/settings');
            if (res.data.success) {
                setSettings(res.data.settings);
                setLogoPreview(res.data.settings.logo);
            }
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleCarouselChange = (idx, field, value) => {
        const updatedCarousel = [...settings.carousel];
        updatedCarousel[idx][field] = value;
        setSettings({ ...settings, carousel: updatedCarousel });
    };

    const handleCarouselImageChange = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedCarousel = [...settings.carousel];
            updatedCarousel[idx].tempFile = file;
            updatedCarousel[idx].tempPreview = URL.createObjectURL(file);
            updatedCarousel[idx].isNewImage = true;
            setSettings({ ...settings, carousel: updatedCarousel });
        }
    };

    const addNewSlide = () => {
        setSettings({
            ...settings,
            carousel: [...settings.carousel, { image: '', title: '', subtitle: '', isNewImage: true }]
        });
    };

    const removeSlide = (idx) => {
        const updatedCarousel = settings.carousel.filter((_, i) => i !== idx);
        setSettings({ ...settings, carousel: updatedCarousel });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('shopName', settings.shopName);
            if (logoFile) formData.append('logo', logoFile);

            const carouselData = settings.carousel.map(slide => ({
                image: slide.image, title: slide.title, subtitle: slide.subtitle, isNewImage: slide.isNewImage || false
            }));
            formData.append('carouselData', JSON.stringify(carouselData));

            settings.carousel.forEach(slide => {
                if (slide.tempFile) formData.append('carousel_images', slide.tempFile);
            });

            const res = await API.put('/admin/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success('Settings updated successfully!');
                fetchSettings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setSaving(true);
            window.location.reload();
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading settings...</p>
            </div>
        </div>
    );

    const logoSrc = logoPreview.startsWith('/uploads')
        ? (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0] + logoPreview
        : logoPreview;

    return (
        <div className="admin-page">
            <h2 className="page-title" data-aos="fade-down">
                <i className="fas fa-cog mr-2" style={{ color: 'var(--secondary-dark)' }}></i>Shop Settings
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Shop Identity */}
                <div className="admin-table-container mb-4" style={{ padding: '2rem' }} data-aos="fade-up">
                    <h4 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>
                        <i className="fas fa-store mr-2" style={{ color: 'var(--primary)' }}></i>Shop Identity
                    </h4>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <div className="form-group-modern">
                                <label className="form-label-modern">Shop Name</label>
                                <input
                                    type="text"
                                    className="form-input-modern"
                                    value={settings.shopName}
                                    onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                                    required
                                    placeholder="Your shop name"
                                />
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div style={{ display: 'inline-block', position: 'relative' }}>
                                <motion.img
                                    src={logoSrc}
                                    alt="Logo Preview"
                                    style={{ height: '80px', background: 'var(--primary)', padding: '12px', borderRadius: '16px', objectFit: 'contain' }}
                                    whileHover={{ scale: 1.1, rotate: 3 }}
                                />
                            </div>
                            <div className="mt-2">
                                <label className="btn-modern" style={{ background: 'rgba(115,21,46,0.08)', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', padding: '0.4rem 1rem' }}>
                                    <i className="fas fa-upload mr-1"></i> Change Logo
                                    <input type="file" onChange={handleLogoChange} hidden accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slideshow Management */}
                <div className="admin-table-container mb-4" style={{ padding: '2rem' }} data-aos="fade-up" data-aos-delay="100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ fontWeight: 800, margin: 0 }}>
                            <i className="fas fa-images mr-2" style={{ color: 'var(--primary)' }}></i>Slideshow Management
                        </h4>
                        <motion.button 
                            type="button" 
                            onClick={addNewSlide} 
                            className="btn-modern btn-primary-modern"
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <i className="fas fa-plus mr-1"></i> Add Slide
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {settings.carousel.map((slide, idx) => (
                            <motion.div 
                                key={idx} 
                                className="d-flex gap-3 mb-4 p-3 align-items-start"
                                style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, padding: 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div style={{ width: '160px', flexShrink: 0 }}>
                                    <img
                                        src={slide.tempPreview || (slide.image?.startsWith('/uploads') ? (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0] + slide.image : slide.image) || '/images/products/1.jpg'}
                                        alt="Slide"
                                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '12px' }}
                                    />
                                    <label className="btn-modern w-100 mt-2" style={{ background: 'rgba(115,21,46,0.06)', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', padding: '0.3rem' }}>
                                        <i className="fas fa-camera mr-1"></i> Image
                                        <input type="file" onChange={(e) => handleCarouselImageChange(idx, e)} hidden accept="image/*" />
                                    </label>
                                </div>
                                <div className="flex-grow-1">
                                    <input
                                        type="text"
                                        placeholder="Slide Title"
                                        className="form-input-modern mb-2"
                                        value={slide.title}
                                        onChange={(e) => handleCarouselChange(idx, 'title', e.target.value)}
                                        style={{ fontSize: '0.9rem' }}
                                    />
                                    <textarea
                                        placeholder="Slide Subtitle"
                                        className="form-input-modern"
                                        value={slide.subtitle}
                                        onChange={(e) => handleCarouselChange(idx, 'subtitle', e.target.value)}
                                        rows="2"
                                        style={{ fontSize: '0.85rem' }}
                                    ></textarea>
                                </div>
                                <motion.button 
                                    type="button" 
                                    onClick={() => removeSlide(idx)} 
                                    className="btn-modern"
                                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.5rem', flexShrink: 0 }}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <i className="fas fa-trash"></i>
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {settings.carousel.length === 0 && (
                        <div className="text-center py-4 text-muted">
                            <div style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.5rem' }}>🖼️</div>
                            <p>No slides yet. Add one to get started!</p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="text-right" data-aos="fade-up" data-aos-delay="200">
                    <motion.button 
                        type="submit" 
                        className="btn-modern btn-primary-modern btn-shimmer"
                        style={{ padding: '1rem 3rem', fontSize: '1.05rem' }}
                        disabled={saving}
                        whileHover={!saving ? { scale: 1.03 } : {}}
                        whileTap={!saving ? { scale: 0.97 } : {}}
                    >
                        {saving ? (
                            <><i className="fas fa-spinner fa-spin mr-2"></i> Saving...</>
                        ) : (
                            <><i className="fas fa-save mr-2"></i> Save All Settings</>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
