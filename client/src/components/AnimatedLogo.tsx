import { motion, useReducedMotion } from "framer-motion";

const logoArt = "/manus-storage/olive_beacon_logo_animation_reference_3dddf59c.webp";

export function AnimatedLogo({ className = "", variant = "hero" }: { className?: string; variant?: "hero" | "nav" }) {
  const reduced = useReducedMotion();
  const shouldAnimate = !reduced;
  return <div className={`animated-logo ${variant} ${className}`} aria-label="Olive Beacon beacon mark">
    <motion.div className="logo-core" initial={shouldAnimate ? { opacity: 0, scale: .22 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12, duration: .52, ease: [0.23, 1, 0.32, 1] }} />
    <motion.div className="logo-ring-mask" initial={shouldAnimate ? { opacity: 0, rotate: -115, scale: .66 } : false} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: .24, duration: .7, ease: [0.23, 1, 0.32, 1] }} />
    <motion.div className="logo-beacon" initial={shouldAnimate ? { opacity: 0, scale: .36 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .7, duration: .46, ease: "easeOut" }} />
    <motion.div className="logo-beam" initial={shouldAnimate ? { opacity: 0, scaleX: .06 } : false} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 1.04, duration: .57, ease: [0.23, 1, 0.32, 1] }} />
    {variant === "hero" && <motion.img src={logoArt} alt="Olive Beacon beacon logo" initial={shouldAnimate ? { opacity: 0, scale: .94 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .52, duration: .7, ease: [0.23, 1, 0.32, 1] }} />}
  </div>;
}
