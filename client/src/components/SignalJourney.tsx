import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Globe2, Nfc, ScanLine } from "lucide-react";
import { ProductScene } from "@/components/ProductScene";

export function SignalJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 76%", "end 38%"] });
  const productX = useTransform(scrollYProgress, [0, .5, 1], reduced ? [0, 0, 0] : [-70, -12, 0]);
  const signalScale = useTransform(scrollYProgress, [0, .42, .76, 1], reduced ? [1, 1, 1, 1] : [.1, .62, 1, 1]);
  const phoneX = useTransform(scrollYProgress, [0, .56, 1], reduced ? [0, 0, 0] : [90, 32, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0, .32, .68], reduced ? [1, 1, 1] : [.22, .52, 1]);
  return <section ref={ref} className="signal-journey section" aria-label="Olive Beacon physical-to-digital journey"><div className="signal-journey-intro"><p className="eyebrow"><span /> THE SIGNAL JOURNEY</p><h2>From a real-world moment to a clearer <em>next step.</em></h2><p>Scroll through the journey. Olive Beacon makes the physical touchpoint, digital destination, and customer decision feel like one considered interaction.</p></div><div className="signal-journey-stage"><motion.div className="signal-journey-product" style={{ x: productX }}><ProductScene kind="stand" compact /></motion.div><motion.div className="signal-journey-line" style={{ scaleX: signalScale }}><i /><i /><i /><i /></motion.div><motion.div className="signal-journey-phone" style={{ x: phoneX, opacity: phoneOpacity }}><div className="signal-phone-notch" /><div className="signal-phone-screen"><Globe2 size={20} /><span>Chosen destination</span><strong>Open with a tap<br />or a scan.</strong><small>Customers remain in control of what happens next.</small><div><i /><i /><i /></div></div></motion.div><div className="signal-journey-steps"><article><Nfc size={16} /><span>01</span><strong>Place the touchpoint</strong><small>At the counter, door, window, or handover.</small></article><article><ScanLine size={16} /><span>02</span><strong>Connect simply</strong><small>NFC or QR opens the route you select.</small></article><article><ArrowRight size={16} /><span>03</span><strong>Let the customer decide</strong><small>The final action is always their choice.</small></article></div></div></section>;
}

export function ProductSignalScroll({ kind }: { kind: "stand" | "sticker" }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 36%"] });
  const leftX = useTransform(scrollYProgress, [0, .7], reduced ? [0, 0] : [-42, 0]);
  const beam = useTransform(scrollYProgress, [0, .45, .9], reduced ? [1, 1, 1] : [.08, .7, 1]);
  const rightX = useTransform(scrollYProgress, [0, .7], reduced ? [0, 0] : [48, 0]);
  const isStand = kind === "stand";
  const Icon = isStand ? Nfc : ScanLine;
  const label = isStand ? "COUNTERTOP SIGNAL" : "SURFACE SIGNAL";
  const copy = isStand ? "A freestanding moment at payment, reception, or handover becomes the start of a chosen digital route." : "A discreet applied cue at a door, window, or counter becomes the start of a chosen digital route.";
  return <section ref={ref} className={`product-scroll-story section ${kind}-scroll-story`}><div className="product-scroll-heading"><p className="eyebrow"><span /> {label}</p><h2>Physical placement. Digital <em>intent.</em></h2><p>{copy}</p></div><div className="product-scroll-stage"><motion.div className="product-scroll-object" style={{ x: leftX }}><ProductScene kind={kind} compact /></motion.div><motion.div className="product-scroll-beam" style={{ scaleX: beam }}><i /><i /><i /></motion.div><motion.div className="product-scroll-route" style={{ x: rightX }}><Icon size={24} /><span>Configured<br />destination</span><strong>{isStand ? "At the point of confidence." : "At the point of notice."}</strong><small>Tap or scan. Then let the customer choose their next action.</small></motion.div></div></section>;
}
