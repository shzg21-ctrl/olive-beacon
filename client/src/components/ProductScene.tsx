import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Nfc, ScanLine } from "lucide-react";

const cardArt = "/manus-storage/olive_beacon_nfc_card_mockup_47d71f17.webp";

export function ProductScene({ kind = "stand", compact = false }: { kind?: "stand" | "sticker"; compact?: boolean }) {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientY - bounds.top) / bounds.height - .5) * -7, y: ((event.clientX - bounds.left) / bounds.width - .5) * 9 });
  };
  return <motion.div className={`product-scene ${kind} ${compact ? "compact" : ""}`} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} animate={reduced ? {} : { rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: "spring", stiffness: 180, damping: 20 }}>
    <div className="scene-glow" /><div className="scene-grid" />
    <motion.div className="nfc-rings" animate={reduced ? {} : { scale: [1, 1.16, 1], opacity: [.24, .68, .24] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}><i /><i /><i /></motion.div>
    {kind === "stand" ? <div className="stand-object"><img src={cardArt} alt="Olive Beacon Review Stand visual" /><span className="reflection" /></div> : <div className="sticker-object"><div className="sticker-logo">OB</div><Nfc size={25} /><span>Tap or scan</span><div className="sticker-qr"><i /><i /><i /><i /></div></div>}
    <div className="scene-caption">{kind === "stand" ? <><Nfc size={14} /> NFC + QR COUNTERTOP</> : <><ScanLine size={14} /> NFC + QR SURFACE</>}</div>
  </motion.div>;
}
