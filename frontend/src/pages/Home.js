import { Fragment, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

export default function Home() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(process.env.REACT_APP_API_URL + '/products?' + searchParams)
            .then(res => res.json())
            .then(res => {
                setProducts(res.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, [searchParams])

    // Featured section logic: Show top 4 products or specific curated ones
    const featuredProducts = products.slice(0, 4);

    return (
        <Fragment>
            <div className="animate-fade-in home-premium-bg" style={{ paddingBottom: '3rem' }}>
                {/* Background Image Layer */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: "url('/images/bg/premium_ecommerce_bg.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    zIndex: -2
                }}></div>
                {/* Gradient Overlay Layer */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,249,250,0.85) 100%)',
                    zIndex: -1
                }}></div>

                {!searchParams.get('keyword') && <Carousel />}

                <div className="mb-5">
                    <h2 className="section-title-modern">Featured Products</h2>
                    <motion.div 
                        className="products-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product, idx) => (
                                <motion.div key={`featured-${product._id}`} variants={itemVariants} custom={idx}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))
                        ) : (
                            <img src="/images/loader.gif" alt="Loading..." style={{ width: '50px', display: 'block', margin: '20px auto' }} />
                        )}
                    </motion.div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-5 pt-4 border-top">
                    <h2 className="section-title-modern m-0">Classic Collections</h2>
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {products.length} products found
                    </div>
                </div>

                {loading ? (
                    <img src="/images/loader.gif" alt="Loading..." style={{ width: '80px', display: 'block', margin: '40px auto' }} />
                ) : (
                    <section id="products" className="mt-4">
                        <motion.div 
                            className="products-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {products.length > 0 ? (
                                products.map((product, idx) => (
                                    <motion.div key={product._id} variants={itemVariants} custom={idx}>
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-5 w-100">
                                    <h3>No products found matching your criteria.</h3>
                                </div>
                            )}
                        </motion.div>
                    </section>
                )}
            </div>
        </Fragment>
    );
}
