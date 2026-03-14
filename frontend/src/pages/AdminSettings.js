import { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        shopName: '',
        logo: '',
        carousel: []
    });
    const [loading, setLoading] = useState(true);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');

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

    useEffect(() => {
        fetchSettings();
    }, []);

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
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('shopName', settings.shopName);
            
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            const carouselData = settings.carousel.map(slide => ({
                image: slide.image,
                title: slide.title,
                subtitle: slide.subtitle,
                isNewImage: slide.isNewImage || false
            }));

            formData.append('carouselData', JSON.stringify(carouselData));

            settings.carousel.forEach(slide => {
                if (slide.tempFile) {
                    formData.append('carousel_images', slide.tempFile);
                }
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
            setLoading(true); // reload
            window.location.reload(); // Hard reload to reflect shop name/logo changes everywhere
        }
    };

    if (loading) return (
        <div className="loading-container">
            <img src="/images/loader.gif" alt="Loading..." className="loader-img" />
        </div>
    );

    return (
        <div className="admin-page">
            <h2 className="page-title">Shop Settings</h2>
            
            <form onSubmit={handleSubmit} className="settings-form card-premium p-4">
                <div className="form-group mb-4">
                    <label className="form-label">Shop Name</label>
                    <input 
                        type="text" 
                        className="form-input-modern"
                        value={settings.shopName}
                        onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="form-label">Shop Logo</label>
                    <div className="d-flex align-items-center gap-3">
                        <img 
                            src={logoPreview.startsWith('/uploads') ? 'http://localhost:8000' + logoPreview : logoPreview} 
                            alt="Logo Preview" 
                            style={{ height: '60px', background: 'var(--maroon)', padding: '5px', borderRadius: '4px' }}
                        />
                        <input type="file" onChange={handleLogoChange} className="form-control" />
                    </div>
                </div>

                <hr className="my-5" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="m-0">Slideshow Management</h3>
                    <button type="button" onClick={addNewSlide} className="btn-modern btn-primary-modern">+ Add Slide</button>
                </div>

                <div className="carousel-settings-list">
                    {settings.carousel.map((slide, idx) => (
                        <div key={idx} className="slide-item-config card-premium p-3 mb-3" style={{ background: '#f8f9fa' }}>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="slide-preview-box">
                                        <img 
                                            src={slide.tempPreview || (slide.image.startsWith('/uploads') ? 'http://localhost:8000' + slide.image : slide.image)} 
                                            alt="Slide" 
                                            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                        <input type="file" onChange={(e) => handleCarouselImageChange(idx, e)} className="form-control form-control-sm mt-2" />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <input 
                                        type="text" 
                                        placeholder="Slide Title" 
                                        className="form-input-modern mb-2"
                                        value={slide.title}
                                        onChange={(e) => handleCarouselChange(idx, 'title', e.target.value)}
                                    />
                                    <textarea 
                                        placeholder="Slide Subtitle" 
                                        className="form-input-modern"
                                        value={slide.subtitle}
                                        onChange={(e) => handleCarouselChange(idx, 'subtitle', e.target.value)}
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div className="col-md-2 d-flex align-items-center justify-content-center">
                                    <button type="button" onClick={() => removeSlide(idx)} className="danger-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 text-right">
                    <button type="submit" className="btn-modern btn-primary-modern " style={{ padding: '1rem 3rem' }}>
                        Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
