import { motion } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";

export default function Transition() {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 40 }}      
      animate={{ opacity: 1, y: 0 }}         
      transition={{
        duration: 0.35,                      
        ease: [0.25, 0.1, 0.25, 1],          
      }}
      onAnimationStart={() => window.scrollTo({ top: 0 })} 
    >
      <Outlet />
    </motion.div>
  );
}
