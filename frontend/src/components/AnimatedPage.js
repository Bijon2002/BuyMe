import { motion } from 'framer-motion';

const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
};

const AnimatedPage = ({ children, className = "" }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={animations.transition}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
