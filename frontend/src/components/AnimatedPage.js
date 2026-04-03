import { motion } from 'framer-motion';

const animations = {
    initial: { opacity: 0, y: 30, scale: 0.98, filter: "blur(5px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, scale: 0.98, filter: "blur(5px)" },
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
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
