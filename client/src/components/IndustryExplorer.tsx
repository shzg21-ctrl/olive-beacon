import { useState } from "react";
import { ArrowRight, MapPin, MonitorCog, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { industryData, type IndustrySlug } from "@/lib/siteData";

export function IndustryExplorer({ initial = "barbers" as IndustrySlug }: { initial?: IndustrySlug }) {
  const [selected, setSelected] = useState(initial);
  const industry = industryData.find((item) => item.slug === selected) ?? industryData[0];
  const Icon = industry.Icon;
  return <div className="industry-explorer"><div className="industry-tabs" role="tablist" aria-label="Industry solutions">{industryData.map((item) => <button key={item.slug} type="button" role="tab" aria-selected={selected === item.slug} className={selected === item.slug ? "active" : ""} onClick={() => setSelected(item.slug)}><item.Icon size={16} /><span>{item.label}</span></button>)}</div><AnimatePresence mode="wait"><motion.div key={industry.slug} className={`industry-detail ${industry.theme}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3, ease: [0.23, 1, 0.32, 1] }}><div className="industry-detail-visual"><Icon size={54} /><span className="signal-dot" /><span className="signal-line" /></div><div className="industry-detail-copy"><p className="eyebrow"><span /> FOR {industry.label.toUpperCase()}</p><h3>Designed around the moment your customer already <em>remembers.</em></h3><div className="industry-detail-grid"><div><Sparkles size={15} /><strong>Typical moment</strong><p>{industry.moment}</p></div><div><MapPin size={15} /><strong>Recommended placement</strong><p>{industry.placement}</p></div><div><MonitorCog size={15} /><strong>Digital opportunity</strong><p>{industry.opportunity}</p></div></div><div className="industry-services">{industry.services.map((service) => <span key={service}>{service}</span>)}</div><div className="industry-detail-actions"><Link href={`/industries/${industry.slug}`} className="text-link">Explore {industry.label} <ArrowRight size={16} /></Link><Link href="/quote" className="button button-outline small">Discuss your business <ArrowRight size={14} /></Link></div></div></motion.div></AnimatePresence></div>;
}
