import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({ children, delay = 0, distance = 18, className }: { children: ReactNode; delay?: number; distance?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: distance }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .64, delay, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }} variants={{ hidden: {}, show: { transition: reduced ? {} : { staggerChildren: .08 } } }}>{children}</motion.div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} variants={{ hidden: reduced ? {} : { opacity: 0, y: 16 }, show: reduced ? {} : { opacity: 1, y: 0, transition: { duration: .48, ease: [0.23, 1, 0.32, 1] } } }}>{children}</motion.div>;
}

export function PageEnter({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}
