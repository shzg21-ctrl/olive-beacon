import { useState } from "react";
import { ArrowUpRight, Expand, MoveRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { conceptData } from "@/lib/siteData";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function ConceptPreview({ concept, expanded = false }: { concept: typeof conceptData[number]; expanded?: boolean }) {
  return <div className={`concept-preview ${concept.theme} ${expanded ? "expanded" : ""}`} style={{ "--concept-accent": concept.accent } as React.CSSProperties}><div className="concept-browser"><div className="concept-browser-bar"><i /><i /><i /><span>DEMONSTRATION DESIGN</span></div><div className="concept-mini-nav"><b>{concept.category.toUpperCase()}</b><span>Menu</span><span>Services</span><span>Visit</span></div><div className="concept-hero"><span>OLIVE BEACON CONCEPT</span><h4>{concept.headline}</h4><button type="button">{concept.modules[0]} <MoveRight size={12} /></button></div><div className="concept-modules">{concept.modules.slice(1).map((module) => <div key={module}><i />{module}</div>)}</div></div></div>;
}

export function ConceptLab({ limit }: { limit?: number }) {
  const [active, setActive] = useState<string | null>(null);
  const concepts = limit ? conceptData.slice(0, limit) : conceptData;
  const activeConcept = conceptData.find((item) => item.slug === active);
  return <><div className="concept-grid">{concepts.map((concept) => <motion.article key={concept.slug} className="concept-card" whileHover={{ y: -5 }} transition={{ duration: .22 }}><ConceptPreview concept={concept} /><div className="concept-card-bottom"><div><p>OLIVE BEACON CONCEPT</p><h3>{concept.label}</h3></div><button type="button" onClick={() => setActive(concept.slug)} aria-label={`Open ${concept.label} demonstration preview`}><Expand size={17} /></button></div></motion.article>)}</div><Dialog open={Boolean(activeConcept)} onOpenChange={(open) => !open && setActive(null)}>{activeConcept && <DialogContent className="concept-dialog" showCloseButton={false}><DialogHeader><DialogTitle>{activeConcept.label}</DialogTitle><DialogDescription>This is an Olive Beacon concept / demonstration design. It is not a customer website or case study.</DialogDescription></DialogHeader><ConceptPreview concept={activeConcept} expanded /><div className="dialog-actions"><a href="/quote" className="button button-primary small">Discuss a website <ArrowUpRight size={14} /></a><DialogClose className="button button-outline small"><X size={14} /> Close preview</DialogClose></div></DialogContent>}</Dialog></>;
}
