import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/settings')
      .then(res => {
        if (!res.ok) throw new Error("Settings endpoint not found");
        return res.json();
      })
      .then(res => {
        if (res.success && res.settings.carousel && res.settings.carousel.length > 0) {
          setSlides(res.settings.carousel);
        } else {
            // Fallback default slides
            setSlides([
                {
                    image: '/images/products/5.jpg',
                    title: 'Welcome to BuyMe Premium',
                    subtitle: 'Discover our curated elegant collections.',
                    link: '/'
                }
            ]);
        }
        setLoading(false);
      })
      .catch(err => {
          console.warn('Carousel fetch falling back to default:', err.message);
          setSlides([
              {
                  image: '/images/products/5.jpg',
                  title: 'Welcome to BuyMe Premium',
                  subtitle: 'Discover our curated elegant collections.',
                  link: '/'
              }
          ]);
          setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (loading) return (
      <div className="carousel-wrapper-modern d-flex align-items-center justify-content-center">
          <img src="/images/loader.gif" alt="Loading..." style={{ width: '80px' }} />
      </div>
  );

  return (
    <div className="carousel-wrapper-modern animate-fade-in">
      {slides.map((slide, index) => {
          const pathValue = slide ? (slide.image || slide.url || (typeof slide === 'string' ? slide : "")) : "";
          const cleanPath = typeof pathValue === 'string' ? pathValue : "";
          
          let imageSrc = "/images/products/5.jpg"; // Fallback URL
          if (cleanPath) {
              if (cleanPath.startsWith('/uploads')) {
                  const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0];
                  imageSrc = baseUrl + cleanPath;
              } else {
                  imageSrc = cleanPath;
              }
          }
          
          return (
            <div 
              key={index} 
              className={`slide-item ${index === current ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${imageSrc})` }}
            >
              <div className="slide-content">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <Link to={slide.link || "/"} className="btn-modern carousel-btn" style={{ background: 'var(--secondary)', color: 'var(--primary)', fontWeight: 'bold', padding: '1rem 2.5rem' }}>
                  Explore Collection
                </Link>
              </div>
            </div>
          );
      })}
      
      {slides.length > 1 && (
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === current ? 'active' : ''}`}
                onClick={() => setCurrent(index)}
              ></button>
            ))}
          </div>
      )}
    </div>
  );
}
