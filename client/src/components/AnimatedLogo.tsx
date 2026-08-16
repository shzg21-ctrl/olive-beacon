import { motion, useReducedMotion } from "framer-motion";

const logoArt = "/manus-storage/olive_beacon_logo_animation_reference_3dddf59c.webp";

export function AnimatedLogo({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return <div className={`animated-logo ${className}`} aria-label="Olive Beacon beacon mark">
    <motion.div className="logo-core" initial={reduced ? false : { opacity: 0, scale: .22 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12, duration: .52, ease: [0.23, 1, 0.32, 1] }} />
    <motion.div className="logo-ring-mask" initial={reduced ? false : { opacity: 0, rotate: -115, scale: .66 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: .24, duration: .7, ease: [0.23, 1, 0.32, 1] }} />
    <motion.div className="logo-beacon" initial={reduced ? false : { opacity: 0, scale: .36 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .7, duration: .46, ease: "easeOut" }} />
    <motion.div className="logo-beam" initial={reduced ? false : { opacity: 0, scaleX: .06 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 1.04, duration: .57, ease: [0.23, 1, 0.32, 1] }} />
    <motion.img src={logoArt} alt="Olive Beacon beacon logo" initial={reduced ? false : { opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .52, duration: .7, ease: [0.23, 1, 0.32, 1] }} />
  </div>;
}
