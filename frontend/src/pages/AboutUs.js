import { motion } from 'framer-motion';
import CountUpNumber from '../components/CountUpNumber';

const values = [
  { icon: 'fas fa-bullseye', title: 'Our Mission', text: 'To democratize premium commerce by connecting discerning customers with the world\'s finest products, delivered with unparalleled service.', color: '#3b82f6' },
  { icon: 'fas fa-eye', title: 'Our Vision', text: 'To become the most trusted global destination for curated, high-quality products — setting the standard for modern retail excellence.', color: '#10b981' },
  { icon: 'fas fa-gem', title: 'Our Promise', text: 'Every product on BuyMe is vetted for quality, authenticity, and value. We stand behind every purchase with our 100% satisfaction guarantee.', color: '#8b5cf6' },
];

const team = [
  { 
    name: 'Bijosilin Marisilin', 
    role: 'Machine Learning Researcher • BSc (Hons) Software Engineering Undergraduate at SLIIT • Salesforce Certified Trailblazer • Rotaractor • Johnian',
    image: '/images/bijon.jpg',
    icon: 'fas fa-user-tie' 
  }
];

const timeline = [
  { year: '2020', title: 'Founded', desc: 'BuyMe was born from a simple idea: premium products should be accessible to everyone.' },
  { year: '2021', title: 'Series A Funding', desc: 'Raised $12M to expand our product catalog and build our technology platform.' },
  { year: '2022', title: '1M+ Customers', desc: 'Reached our first million customers milestone with 99.2% satisfaction rate.' },
  { year: '2023', title: 'Global Expansion', desc: 'Launched in 50+ countries with localized shipping and customer support.' },
  { year: '2024', title: 'AI-Powered Shopping', desc: 'Introduced personalized recommendations and visual search powered by AI.' },
];

export default function AboutUs() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Premium Hero Section */}
      <motion.section 
        className="mb-5 position-relative text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
            height: '75vh',
            minHeight: '500px',
            background: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
            margin: '0 1rem',
            position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, padding: '3rem', maxWidth: '1000px' }}>
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'inline-block' }}
            >
              Our Premium Heritage
            </motion.span>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 mb-4 text-white" 
              style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px' }}
            >
              Defining the <span style={{ color: 'var(--secondary)', textShadow: '0 0 40px rgba(254, 189, 105, 0.4)' }}>Future of Retail</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mx-auto text-white mt-4" 
              style={{ maxWidth: '700px', fontSize: '1.4rem', lineHeight: 1.8, opacity: 0.9, fontWeight: 500 }}
            >
              BuyMe isn't just a marketplace; it's a curated experience. We bridge the gap between global craft and local convenience, delivering excellence to your doorstep.
            </motion.p>
        </div>
      </motion.section>

      {/* Stats Banner */}
      <section className="stats-banner mb-5" data-aos="zoom-in" style={{ borderRadius: '24px', margin: '0 1rem 3rem' }}>
        <div className="stat-item">
          <div className="stat-item-number"><CountUpNumber end={50} suffix="M+" /></div>
          <div className="stat-item-label">Products Sold</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-number"><CountUpNumber end={12} suffix="M+" /></div>
          <div className="stat-item-label">Happy Customers</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-number"><CountUpNumber end={50} suffix="+" /></div>
          <div className="stat-item-label">Countries</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-number"><CountUpNumber end={99} suffix="%" /></div>
          <div className="stat-item-label">Satisfaction Rate</div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mb-5">
        <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title-modern">Our Core Values</h2>
            <p className="text-muted">The principles that guide our pursuit of excellence.</p>
        </div>
        <div className="row g-4">
          {values.map((v, i) => (
            <div key={i} className="col-md-4" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="card-premium h-100 p-5 shadow-hover">
                <div className="mb-4 d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', borderRadius: '20px', background: `${v.color}15`, color: v.color, fontSize: '2.5rem' }}>
                    <i className={v.icon}></i>
                </div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>{v.title}</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-5" style={{ background: 'rgba(15,23,42,0.02)', borderRadius: '40px', margin: '0 1rem 4rem' }} data-aos="fade-up">
        <div className="container">
            <h2 className="section-title-modern text-center d-block mb-5">Our Journey</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {timeline.map((item, i) => (
                <motion.div 
                key={i}
                className="d-flex gap-5 mb-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                >
                <div style={{ flexShrink: 0 }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    {item.year}
                    </div>
                </div>
                <div className="card-premium p-4 flex-grow-1" style={{ borderLeft: '6px solid var(--secondary)' }}>
                    <h5 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.25rem' }}>{item.title}</h5>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="container" data-aos="fade-up">
        <h2 className="section-title-modern text-center d-block mb-5">Leadership</h2>
        
        <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
                {team.map((member, i) => (
                    <motion.div 
                        key={i} 
                        className="card-premium p-4 p-md-5 d-flex flex-column flex-md-row align-items-center gap-4 gap-md-5 mx-auto"
                        whileHover={{ y: -5 }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                    >
                        <div style={{ flexShrink: 0 }}>
                            <div className="position-relative" style={{ width: '200px', height: '200px' }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '40px', overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary), #3b82f6)', boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}>
                                    {member.image ? (
                                        <img src={process.env.PUBLIC_URL + member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                                            <i className={member.icon}></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center text-md-start">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '999px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                                    Founder & Visionary
                                </div>
                            </motion.div>
                            <h3 style={{ fontWeight: 900, marginBottom: '1rem', fontSize: '2.2rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{member.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>{member.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
