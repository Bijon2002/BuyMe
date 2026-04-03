import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/settings')
      .then(res => {
        if (!res.ok) throw new Error("Settings endpoint not found");
        return res.json();
      })
      .then(res => {
        // Force the display of 8 high-quality images regardless of DB settings
        setSlides([
              {
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
                title: "PREMIUM COLLECTIONS",
                subtitle: "Discover our latest arrivals in fashion and accessories",
                cta: "Explore Collection",
                link: "/search?category=Fashion",
                color: "#ffbd69"
              },
              {
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop",
                title: "PREMIUM FOOTWEAR",
                subtitle: "Step into luxury with our exclusive sneaker collection",
                cta: "Shop Shoes",
                link: "/search?category=Fashion",
                color: "#ff3366"
              },
              {
                image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2000&auto=format&fit=crop",
                title: "NEXT-GEN ELECTRONICS",
                subtitle: "High-performance gear for your digital life",
                cta: "Shop Tech",
                link: "/search?category=Electronics",
                color: "#73152e"
              },
              {
                image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2000&auto=format&fit=crop",
                title: "WORKSTATION ESSENTIALS",
                subtitle: "Elevate your productivity with high-end setups",
                cta: "Build Setup",
                link: "/search?category=Electronics",
                color: "#3b82f6"
              },
              {
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2000&auto=format&fit=crop",
                title: "LUXURY LIFESTYLE",
                subtitle: "Elevate your everyday with our curated premium essentials",
                cta: "View Home",
                link: "/search?category=Home & Living",
                color: "#ffffff"
              },
              {
                image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop",
                title: "MODERN LIVING",
                subtitle: "Transform your spaces with designer furniture",
                cta: "Shop Decor",
                link: "/search?category=Home & Living",
                color: "#facc15"
              },
              {
                image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2000&auto=format&fit=crop",
                title: "ATHLETIC GEAR",
                subtitle: "Perform at your absolute best with our premium sports equipment",
                cta: "Shop Sports",
                link: "/search?category=Sports & Outdoors",
                color: "#ffbd69"
              },
              {
                image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop",
                title: "BEAUTY & WELLNESS",
                subtitle: "Revitalize yourself with our top-rated cosmetic products",
                cta: "Discover Beauty",
                link: "/search?category=Beauty & Care",
                color: "#73152e"
              }
        ]);
        setLoading(false);
      })
      .catch(err => {
          console.warn('Carousel fetch fallback:', err.message);
          setSlides([
            {
              image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
              title: "PREMIUM COLLECTIONS",
              subtitle: "Experience the pinnacle of luxury and quality in every detail.",
              link: "/search?category=Fashion"
            },
            {
              image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2000&auto=format&fit=crop",
              title: "NEXT-GEN ELECTRONICS",
              subtitle: "High-performance gear for your digital life",
              link: "/search?category=Electronics"
            },
            {
              image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2000&auto=format&fit=crop",
              title: "LUXURY LIFESTYLE",
              subtitle: "Elevate your everyday with our curated premium essentials",
              link: "/search?category=Home & Living"
            },
            {
              image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2000&auto=format&fit=crop",
              title: "ATHLETIC GEAR",
              subtitle: "Perform at your absolute best with our premium sports equipment",
              link: "/search?category=Sports"
            },
            {
              image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop",
              title: "BEAUTY & WELLNESS",
              subtitle: "Revitalize yourself with our top-rated cosmetic products",
              link: "/search?category=Beauty"
            }
          ]);
          setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [slides]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate('/search?keyword=' + keyword);
    }
  };

  if (loading) return (
      <div className="carousel-wrapper-modern d-flex align-items-center justify-content-center">
          <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute' }}></div>
          <div style={{ zIndex: 1, color: 'white', fontWeight: 800, fontSize: '2rem' }}>BuyMe</div>
      </div>
  );

  return (
    <div className="carousel-wrapper-modern">
      <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            className="slide-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div 
              className="slide-bg"
              style={{ 
                backgroundImage: `url(${slides[current]?.image || slides[current]?.url || "/images/products/5.jpg"})`,
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
              }}
            ></div>
            <div className="slide-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 1 }}></div>

          <div className="slide-content">
            <motion.h2 
              className="slide-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {slides[current]?.title}
            </motion.h2>
            
            <motion.p 
              className="slide-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {slides[current]?.subtitle}
            </motion.p>

            <motion.div 
                className="hero-search-wrapper"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}
            >
                <form onSubmit={searchHandler}>
                    <i className="fas fa-search hero-search-icon"></i>
                    <input 
                        type="text" 
                        className="hero-search-input" 
                        placeholder="What are you looking for today?" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </form>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
            >
                <Link to={slides[current]?.link || "/search"} className="btn-modern btn-secondary-modern btn-shimmer" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
                    <i className="fas fa-shopping-bag mr-2"></i> Shop Now
                </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === current ? 'active' : ''}`}
                onClick={() => {
                  setCurrent(index);
                  clearInterval(intervalRef.current);
                }}
              ></button>
            ))}
          </div>
      )}
    </div>
  );
}
