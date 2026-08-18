import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Nfc, ScanLine } from "lucide-react";

const productArt = {
  stand: "/manus-storage/olive-beacon-review-stand-hero_6acff7d9.png",
  sticker: "/manus-storage/olive-beacon-review-sticker-hero_f8fa92ed.png",
} as const;

export function ProductScene({ kind = "stand", compact = false }: { kind?: "stand" | "sticker"; compact?: boolean }) {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || compact) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientY - bounds.top) / bounds.height - .5) * -5, y: ((event.clientX - bounds.left) / bounds.width - .5) * 6 });
  };
  const label = kind === "stand" ? "NFC + QR REVIEW STAND" : "NFC + QR REVIEW STICKER";
  const description = kind === "stand" ? "Countertop touchpoint" : "Applied surface touchpoint";
  return <motion.div className={`product-scene product-scene-${kind} ${compact ? "compact" : ""}`} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} animate={reduced || compact ? {} : { rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: "spring", stiffness: 160, damping: 21 }}>
    <div className="product-scene-backdrop" /><div className="product-scene-grid" />
    <motion.div className="product-scan-field" animate={reduced ? {} : { scale: [1, 1.08, 1], opacity: [.28, .72, .28] }} transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}><i /><i /><i /></motion.div>
    <div className="product-image-window"><motion.img src={productArt[kind]} alt={`Olive Beacon ${kind === "stand" ? "Review Stand" : "Review Sticker"} shown in its intended physical environment`} initial={reduced ? false : { opacity: 0, scale: 1.05 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: [0.23, 1, 0.32, 1] }} /></div>
    <div className="product-scene-meta"><span>{kind === "stand" ? <Nfc size={14} /> : <ScanLine size={14} />}</span><div><strong>{label}</strong><small>{description}</small></div></div>
    {!compact && <div className="product-scene-spec"><span>01</span><span>{kind === "stand" ? "Freestanding / reception / payment" : "Adhesive / glass / door / counter"}</span></div>}
  </motion.div>;
}
