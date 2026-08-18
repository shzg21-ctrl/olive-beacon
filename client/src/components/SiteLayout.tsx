import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedLogo } from "@/components/AnimatedLogo";

const productLinks = [["Products overview", "/products"], ["Review Stand", "/products/review-stand"], ["Review Sticker", "/products/review-sticker"], ["How it works", "/how-it-works"]] as const;
const industryLinks = [["Industries overview", "/industries"], ["Barbers", "/industries/barbers"], ["Beauty & salons", "/industries/beauty"], ["Hospitality", "/industries/hospitality"], ["Automotive", "/industries/automotive"], ["Trades", "/industries/trades"]] as const;

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} — Olive Beacon`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${title} — Olive Beacon`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    const url = `${window.location.origin}${window.location.pathname}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
  }, [title, description]);
  return null;
}

function Wordmark({ mark = false }: { mark?: boolean }) {
  return <Link href="/" className={`wordmark${mark ? " has-mark" : ""}`} aria-label="Olive Beacon home">{mark && <AnimatedLogo variant="nav" className="wordmark-mark" />}<span>OLIVE</span> BEACON</Link>;
}

function NavGroup({ label, links }: { label: string; links: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(false);
  return <div className="nav-group" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{label}<ChevronDown size={13} /></button><AnimatePresence>{open && <motion.div className="nav-popover" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .18 }}>{links.map(([name, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{name}</Link>)}</motion.div>}</AnimatePresence></div>;
}

function CookieChoice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(localStorage.getItem("olive-cookie-choice") === null), []);
  if (!visible) return null;
  return <aside className="cookie-choice" aria-label="Cookie notice"><div><strong>Your choices, clearly stated.</strong><p>Olive Beacon uses essential storage to remember this notice. Optional analytics and marketing cookies are not active in this build.</p></div><button className="button button-primary small" onClick={() => { localStorage.setItem("olive-cookie-choice", "essential"); setVisible(false); }}>Okay</button></aside>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const reduced = useReducedMotion();
  const primaryLinks = [["Websites", "/websites"], ["Examples", "/website-examples"], ["Solutions", "/solutions"], ["Work", "/work"], ["About", "/about"]] as const;
  return <div className="site-shell"><header className="site-header"><div className="nav-inner"><Wordmark mark /><nav className="desktop-nav site-nav" aria-label="Main navigation"><NavGroup label="Products" links={productLinks} />{primaryLinks.map(([label, href]) => <Link key={href} href={href} className={location === href ? "active" : ""}>{label}</Link>)}<NavGroup label="Industries" links={industryLinks} /></nav><div className="header-actions"><Link href="/quote" className="button button-primary nav-cta">Get a quote</Link><button className="mobile-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></div><AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={reduced ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link><Link href="/websites" onClick={() => setMenuOpen(false)}>Websites</Link><Link href="/website-examples" onClick={() => setMenuOpen(false)}>Website examples</Link><Link href="/solutions" onClick={() => setMenuOpen(false)}>Solutions</Link><Link href="/industries" onClick={() => setMenuOpen(false)}>Industries</Link><Link href="/work" onClick={() => setMenuOpen(false)}>Concept Lab</Link><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link><Link href="/quote" className="button button-primary" onClick={() => setMenuOpen(false)}>Get a quote</Link></motion.nav>}</AnimatePresence></header><motion.div className="route-signal" initial={{ scaleX: 0 }} animate={reduced ? {} : { scaleX: 1 }} transition={{ duration: .42, ease: [0.23, 1, 0.32, 1] }} /><main>{children}</main><footer className="site-footer"><div className="footer-top"><div><Wordmark mark /><p>Digital experiences that make an impact.</p></div><div className="footer-links"><div><p>Explore</p><Link href="/products">Products</Link><Link href="/websites">Websites</Link><Link href="/website-examples">Website examples</Link><Link href="/solutions">Solutions</Link><Link href="/how-it-works">How it works</Link></div><div><p>Connect</p><Link href="/industries">Industries</Link><Link href="/work">Concept Lab</Link><Link href="/about">About</Link><Link href="/quote">Get a quote</Link></div><div><p>Legal</p><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link><Link href="/client">Client area</Link></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Olive Beacon</span><span>Connect. Impact. Grow.</span><button className="text-button footer-preferences" onClick={() => { localStorage.removeItem("olive-cookie-choice"); window.location.reload(); }}>Cookie preferences</button></div></footer><CookieChoice /></div>;
}
