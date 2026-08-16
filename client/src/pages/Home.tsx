import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Globe2, Menu, MessageSquareText, MonitorCog, MoveRight, Nfc, Quote, ScanLine, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";

const logoArt = "/manus-storage/olive_beacon_logo_animation_reference_3dddf59c.webp";
const cardArt = "/manus-storage/olive_beacon_nfc_card_mockup_47d71f17.webp";
const headerArt = "/manus-storage/olive_beacon_website_header_mockup_4d9a43c9.webp";

const navigation = [
  ["Products", "#products"],
  ["Websites", "#websites"],
  ["How it works", "#how-it-works"],
  ["Solutions", "#solutions"],
  ["About", "#about"],
  ["FAQ", "#faq"],
] as const;

const industries = ["Barbers", "Beauty & salons", "Cafés", "Restaurants", "Hospitality", "Hotels", "Automotive", "Garages", "Detailers", "Trades", "Local services", "Independent retailers"];

const faqs = [
  ["What is NFC?", "NFC is a short-range technology that lets compatible phones open a chosen digital destination when they are brought close to an NFC-enabled product."],
  ["Do customers need an app?", "No app is normally needed on a compatible NFC smartphone. Every Olive Beacon NFC solution can also use a QR code as an alternative route."],
  ["Does Olive Beacon guarantee more reviews?", "No. Olive Beacon removes friction and makes it easier for a happy customer to find the right destination. The customer always decides whether to leave a review."],
  ["Can the product connect to my review page?", "Yes, where the correct destination is provided and the product is configured for it. Olive Beacon does not require access to your Google password."],
  ["Can the product be customised?", "Yes. Your business name, logo, colours, customer message, and intended destination can all form part of the configuration."],
  ["Can Olive Beacon build my website?", "Yes. Olive Beacon creates considered, responsive digital experiences around a business and its customers. Scope and maintenance are agreed per project."],
];

function scrollTo(target: string) {
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Wordmark() {
  return <Link href="/" className="wordmark" aria-label="Olive Beacon home"><span>OLIVE</span> BEACON</Link>;
}

function CookieChoice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(localStorage.getItem("olive-cookie-choice") === null), []);
  if (!visible) return null;
  const decide = (choice: "essential" | "analytics") => {
    localStorage.setItem("olive-cookie-choice", choice);
    setVisible(false);
  };
  return <aside className="cookie-choice" aria-label="Cookie preferences"><div><strong>Your choices, clearly stated.</strong><p>This build uses essential storage for your preference. Optional analytics are not active until selected.</p></div><div className="cookie-actions"><button className="text-button" onClick={() => decide("essential")}>Essential only</button><button className="button button-primary small" onClick={() => decide("analytics")}>Allow analytics</button></div></aside>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pointer, setPointer] = useState({ x: 55, y: 45 });
  const demo = [
    ["01", "Tap or scan", "A customer brings a compatible phone close to the Olive Beacon product, or scans its QR code."],
    ["02", "Connect", "The chosen review or feedback destination opens cleanly in the customer’s browser."],
    ["03", "Share", "The customer decides whether to share feedback or leave a review. Their choice remains theirs."],
  ];
  const currentDemo = demo[demoStep] as [string, string, string];

  return <div className="site-shell" onMouseMove={(event) => setPointer({ x: Math.round((event.clientX / window.innerWidth) * 100), y: Math.round((event.clientY / window.innerHeight) * 100) })} style={{ "--mouse-x": `${pointer.x}%`, "--mouse-y": `${pointer.y}%` } as React.CSSProperties}>
    <header className="site-header"><div className="nav-inner"><Wordmark /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, target]) => <a key={label} href={target}>{label}</a>)}</nav><div className="header-actions"><a className="button button-primary nav-cta" href="#quote">Get a quote <ArrowUpRight size={15} /></a><button className="mobile-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></div>{menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(([label, target]) => <a key={label} href={target} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></a>)}<a href="#quote" className="button button-primary" onClick={() => setMenuOpen(false)}>Get a quote <ArrowUpRight size={15} /></a></nav>}</header>

    <main>
      <section className="hero" id="home"><div className="hero-grid" aria-hidden="true" /><div className="hero-content"><div className="hero-copy"><p className="eyebrow"><span /> DIGITAL EXPERIENCES WITH INTENT</p><h1><span>One tap.</span><br />Stronger <em>connections.</em></h1><p className="hero-lede">Olive Beacon helps businesses turn great customer experiences into stronger reputation, digital presence and growth.</p><div className="hero-actions"><a className="button button-primary" href="#quote">Get a quote <ArrowRight size={16} /></a><a className="button button-ghost" href="#how-it-works">See how it works <MoveRight size={16} /></a></div><p className="hero-note">NFC / QR reputation products · websites · tailored digital solutions</p></div><div className="hero-mark" aria-label="Olive Beacon logo visual"><div className="beam beam-one" /><div className="beam beam-two" /><img src={logoArt} alt="Olive Beacon beacon logo in olive, white, and gold" /></div></div><div className="hero-anchors"><a href="#products"><Nfc size={20} /><div><strong>NFC technology</strong><span>Instant connections. Lasting impressions.</span></div><ArrowUpRight size={16} /></a><a href="#websites"><MonitorCog size={20} /><div><strong>Website development</strong><span>Modern, fast, and built to perform.</span></div><ArrowUpRight size={16} /></a><a href="#solutions"><Globe2 size={20} /><div><strong>Digital solutions</strong><span>Tailored experiences that drive results.</span></div><ArrowUpRight size={16} /></a></div></section>

      <section className="section statement-section"><div className="statement-line" /><div className="statement-grid"><p className="eyebrow"><span /> THE OPPORTUNITY</p><h2>Great businesses create moments worth <em>remembering.</em></h2><div><p className="body-large">A positive customer experience can disappear the moment someone walks out the door. Not because the experience was not worthwhile, but because sharing it often takes more effort than the moment allows.</p><p>Olive Beacon makes the next step easier, with considered physical touchpoints and digital experiences that feel natural to use.</p></div></div></section>

      <section id="products" className="section product-section"><div className="section-head"><div><p className="eyebrow"><span /> CURRENT PRODUCTS</p><h2>Designed for the <em>moment.</em></h2></div><p>Focused products, professionally configured to create a seamless path from a great in-person experience to the right online destination.</p></div><div className="product-layout"><article className="product-feature"><div className="product-image-wrap"><img src={cardArt} alt="Olive Beacon NFC product mockup with olive and gold beacon detailing" /><div className="product-reflection" /></div><div className="product-copy"><div className="number">01</div><p className="product-label">OLIVE BEACON REVIEW STAND</p><h3>Make the right moment easy to <em>act on.</em></h3><p>Premium NFC + QR countertop signage for reception desks, payment counters, service areas, and the point where a customer feels the value of what you have delivered.</p><ul><li>Custom business branding and destination setup</li><li>NFC and QR access in one considered product</li><li>Tested before delivery, with placement guidance</li></ul><a href="#quote" className="text-link">Request a quote <ArrowRight size={16} /></a></div></article><div className="product-side"><article className="product-mini"><div className="mini-icon"><ScanLine /></div><p className="product-label">OLIVE BEACON REVIEW STICKER</p><h3>Small footprint. Clear invitation.</h3><p>A compact NFC + QR solution for windows, counters, doors, and other customer-facing surfaces.</p><a href="#quote" className="text-link">Explore options <ArrowRight size={16} /></a></article><article className="customise-card"><p className="eyebrow"><span /> YOUR IDENTITY</p><h3>Configured around your business.</h3><p>Your name, logo, colours, customer messaging, QR code, and the appropriate destination can all be thoughtfully incorporated.</p><div className="customise-tags"><span>Business name</span><span>Brand colours</span><span>Review destination</span><span>QR configuration</span></div></article></div></div></section>

      <section id="how-it-works" className="section demo-section"><div className="demo-intro"><p className="eyebrow"><span /> HOW IT WORKS</p><h2>A simple signal. A clear <em>next step.</em></h2><p>It should be immediately clear to your customers, even if they have never heard of NFC. Olive Beacon keeps the journey focused.</p></div><div className="demo-stage"><div className="demo-controls" role="tablist" aria-label="How Olive Beacon works">{demo.map(([number, title], index) => <button key={number} className={demoStep === index ? "active" : ""} onClick={() => setDemoStep(index)} role="tab" aria-selected={demoStep === index}><span>{number}</span>{title}</button>)}</div><div className="demo-screen"><div className="nfc-object" onClick={() => setDemoStep((current) => (current + 1) % 3)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setDemoStep((current) => (current + 1) % 3); } }} aria-label="Advance the NFC demonstration"><div className="nfc-ripple r-one" /><div className="nfc-ripple r-two" /><div className="nfc-card-mini"><span>OB</span><Nfc size={24} /></div><small>Click to advance</small></div><div className="signal-path"><i /><i /><i /></div><div className={demoStep > 0 ? "phone-frame lit" : "phone-frame"}><div className="phone-top" /><div className="phone-body">{demoStep === 0 ? <><Nfc /><strong>Ready to connect</strong><small>Bring your phone closer</small></> : demoStep === 1 ? <><div className="browser-dot" /><strong>Opening destination</strong><small>Securely connecting in browser</small></> : <><MessageSquareText /><strong>Your experience matters</strong><small>Share feedback when you are ready</small><div className="review-bars"><i /><i /><i /></div></>}</div></div></div><div className="demo-caption"><span>{currentDemo[0]}</span><div><h3>{currentDemo[1]}</h3><p>{currentDemo[2]}</p></div></div></div></section>

      <section id="websites" className="section website-section"><div className="website-visual"><div className="browser-shell"><div className="browser-nav"><i /><i /><i /><span>olivebeacon.com</span></div><img src={headerArt} alt="Olive Beacon website header visual reference" /></div><div className="visual-orbit" /></div><div className="website-copy"><p className="eyebrow"><span /> WEBSITE DEVELOPMENT</p><h2>Digital experiences designed around the <em>business.</em></h2><p className="body-large">Your website should feel like a clear extension of the experience you deliver. Olive Beacon combines distinctive design, responsive build quality, and practical conversion paths.</p><div className="capability-list"><div><MonitorCog size={18} /><span>Responsive design & considered interaction</span></div><div><MessageSquareText size={18} /><span>Lead, contact & quote journeys</span></div><div><Zap size={18} /><span>Fast foundations, SEO & analytics readiness</span></div><div><ShieldCheck size={18} /><span>Maintenance and expansion where required</span></div></div><a href="#quote" className="button button-outline">Request a website quote <ArrowRight size={16} /></a></div></section>

      <section id="solutions" className="section solutions-section"><div className="solutions-grid"><div className="solutions-copy"><p className="eyebrow"><span /> DIGITAL SOLUTIONS</p><h2>Technology should remove friction, not create <em>more of it.</em></h2><p>Olive Beacon brings together physical touchpoints, purposeful websites, and smart digital ideas to make interactions with your business feel simpler and more valuable.</p></div><div className="solution-list"><article><span>01</span><div><h3>Customer interaction</h3><p>Thoughtful ways to help a customer move from a good experience to a useful next step.</p></div><ArrowUpRight /></article><article><span>02</span><div><h3>Digital touchpoints</h3><p>Clear, branded moments that connect physical spaces, online presence, and customer intent.</p></div><ArrowUpRight /></article><article><span>03</span><div><h3>Workflow improvement</h3><p>Tailored digital thinking that reduces friction for your team and your customers.</p></div><ArrowUpRight /></article></div></div></section>

      <section className="section industry-section"><div className="industry-spotlight"><p className="eyebrow"><span /> BUILT FOR REAL BUSINESSES</p><h2>Connection looks different in every <em>space.</em></h2><p>From the final mirror check in a barbershop to the handover of a completed service, Olive Beacon products are designed around the moments where customer confidence is already high.</p><a href="#quote" className="text-link">Discuss your business <ArrowRight size={16} /></a></div><div className="industry-grid">{industries.map((industry, index) => <div key={industry} className="industry-item"><span>{String(index + 1).padStart(2, "0")}</span>{industry}</div>)}</div></section>

      <section id="work" className="section work-section"><div className="concept-card"><div><p className="eyebrow"><span /> FUTURE WORK</p><h2>Evidence should be earned.</h2><p>Olive Beacon will share client work, installations, and outcomes when there are real stories to tell. Until then, this space remains deliberately clear.</p></div><div className="concept-status"><Sparkles size={20} /><strong>Customer stories coming soon</strong><span>Concept / demonstration project space</span></div></div></section>

      <section id="about" className="section about-section"><div className="about-badge">OB</div><div className="about-copy"><p className="eyebrow"><span /> ABOUT OLIVE BEACON</p><h2>Connect.<br /><em>Impact.</em> Grow.</h2><p className="body-large">Olive Beacon started with a simple observation: a business can deliver an excellent experience, yet much of that positive customer sentiment disappears once the customer leaves.</p><p>We are building practical technology and digital experiences that help businesses turn those moments into stronger connections. Today, that begins with beautifully considered NFC/QR products, premium websites, and tailored digital solutions. The wider platform is being designed to grow responsibly from there.</p></div><div className="future-card"><div className="future-icon"><Sparkles size={20} /></div><p className="product-label">BEYOND THE TAP</p><h3>Future Olive Beacon technology.</h3><p>We are developing future-facing tools for feedback, review support, business insights, and reputation management.</p><span>In development — not currently available</span></div></section>

      <section id="faq" className="section faq-section"><div className="faq-heading"><p className="eyebrow"><span /> FAQ</p><h2>Clear answers, from the <em>start.</em></h2><p>Something else on your mind? Send an enquiry and we will talk it through.</p><a href="#quote" className="button button-outline">Ask a question <CircleHelp size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <article key={question} className={openFaq === index ? "faq-item open" : "faq-item"}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={18} /></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section>

      <QuoteForm />
    </main>

    <footer className="site-footer"><div className="footer-top"><div><Wordmark /><p>Digital experiences that make an impact.</p></div><div className="footer-links"><div><p>Explore</p><a href="#products">Products</a><a href="#websites">Websites</a><a href="#solutions">Solutions</a><a href="#how-it-works">How it works</a></div><div><p>Connect</p><a href="#about">About</a><a href="#faq">FAQ</a><a href="#quote">Get a quote</a><a href="#quote">Contact</a></div><div><p>Legal</p><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Olive Beacon</span><span>Build with intent.</span><button className="text-button footer-preferences" onClick={() => { localStorage.removeItem("olive-cookie-choice"); window.location.reload(); }}>Cookie preferences</button></div></footer>
    <CookieChoice />
  </div>;
}
