import { useMemo, useState } from "react";
import { Check, ChevronDown, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const services = [
  "Olive Beacon Review Stand",
  "Olive Beacon Review Sticker",
  "Multiple products",
  "Website",
  "Website redesign",
  "Website maintenance",
  "Digital solution",
  "Not sure / need advice",
];

const productServices = ["Olive Beacon Review Stand", "Olive Beacon Review Sticker", "Multiple products"];
const websiteServices = ["Website", "Website redesign", "Website maintenance"];
const webFeatures = ["Contact form", "Quote form", "Booking", "Gallery", "Menu", "Map", "Reviews", "Social media", "Payments", "Customer portal", "Other"];

type FormMode = "quote" | "contact";

const initialForm = {
  businessName: "",
  businessType: "",
  contactName: "",
  email: "",
  phone: "",
  town: "",
  postcode: "",
  websiteUrl: "",
  productQuantity: "",
  locationCount: "",
  installationRequired: "",
  currentReviewPlatform: "",
  preferredReviewDestination: "",
  contactPreference: "Email" as "Phone" | "Email" | "WhatsApp",
  subject: "",
  message: "",
  hasWebsite: "",
  existingWebsite: "",
  websiteType: "",
  pageCount: "",
  maintenance: "",
  additionalRequirements: "",
  honey: "",
};

function SelectField({ label, value, onChange, options, required = false }: { label: string; value: string; onChange: (value: string) => void; options: string[]; required?: boolean }) {
  return (
    <label className="form-field">
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      <div className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)} required={required}>
          <option value="">Select an option</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown aria-hidden="true" size={16} />
      </div>
    </label>
  );
}

export function QuoteForm() {
  const [mode, setMode] = useState<FormMode>("quote");
  const [form, setForm] = useState(initialForm);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const submitLead = trpc.leads.submit.useMutation();

  const needsProductDetails = useMemo(() => selectedServices.some((service) => productServices.includes(service)), [selectedServices]);
  const needsWebsiteDetails = useMemo(() => selectedServices.some((service) => websiteServices.includes(service)), [selectedServices]);

  const update = (key: keyof typeof initialForm, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const toggle = (value: string, values: string[], setValues: (values: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const changeMode = (nextMode: FormMode) => {
    setMode(nextMode);
    setSelectedServices([]);
    setSelectedFeatures([]);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = mode === "contact" ? ["General enquiry"] : selectedServices;
    if (mode === "quote" && selected.length === 0) {
      toast.error("Select at least one service so we can tailor your quote.");
      return;
    }

    try {
      await submitLead.mutateAsync({
        submissionType: mode,
        businessName: form.businessName,
        businessType: form.businessType,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        town: form.town,
        postcode: form.postcode,
        websiteUrl: form.websiteUrl,
        services: selected,
        productQuantity: form.productQuantity,
        locationCount: form.locationCount,
        installationRequired: form.installationRequired,
        currentReviewPlatform: form.currentReviewPlatform,
        preferredReviewDestination: form.preferredReviewDestination,
        contactPreference: form.contactPreference,
        subject: form.subject,
        message: form.message,
        websiteDetails: needsWebsiteDetails ? {
          hasWebsite: form.hasWebsite,
          existingWebsite: form.existingWebsite,
          websiteType: form.websiteType,
          features: selectedFeatures,
          pageCount: form.pageCount,
          maintenance: form.maintenance,
          additionalRequirements: form.additionalRequirements,
        } : undefined,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
        honeypot: form.honey,
      });
      toast.success(mode === "quote" ? "Thanks — we’ve received your enquiry. Olive Beacon will be in touch shortly." : "Thanks — your message has been received. Olive Beacon will be in touch shortly.");
      setForm(initialForm);
      setSelectedServices([]);
      setSelectedFeatures([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn’t send your enquiry. Please try again shortly.");
    }
  }

  return (
    <section id="quote" className="section quote-section" aria-labelledby="quote-title">
      <div className="quote-shell">
        <div className="quote-intro">
          <p className="eyebrow"><span /> START A CONVERSATION</p>
          <h2 id="quote-title">Built around what <em>matters.</em></h2>
          <p>Tell us where you want to create a stronger customer connection. We’ll review your requirements and come back with the right next step.</p>
          <div className="quote-points">
            <div><Check size={16} /> No generic packages or fixed pricing</div>
            <div><Check size={16} /> Clear, considered recommendations</div>
            <div><Check size={16} /> Your details stay within Olive Beacon</div>
          </div>
        </div>
        <div className="quote-card">
          <div className="form-tabs" role="tablist" aria-label="Enquiry type">
            <button type="button" role="tab" aria-selected={mode === "quote"} className={mode === "quote" ? "active" : ""} onClick={() => changeMode("quote")}>Request a quote</button>
            <button type="button" role="tab" aria-selected={mode === "contact"} className={mode === "contact" ? "active" : ""} onClick={() => changeMode("contact")}>General enquiry</button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <input className="honeypot" tabIndex={-1} autoComplete="off" name="companySite" value={form.honey} onChange={(event) => update("honey", event.target.value)} aria-hidden="true" />
            <div className="form-grid">
              <label className="form-field"><span>Contact name <b aria-hidden="true">*</b></span><input value={form.contactName} onChange={(event) => update("contactName", event.target.value)} required autoComplete="name" /></label>
              <label className="form-field"><span>Email <b aria-hidden="true">*</b></span><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required autoComplete="email" /></label>
              <label className="form-field"><span>Business name{mode === "quote" && <b aria-hidden="true"> *</b>}</span><input value={form.businessName} onChange={(event) => update("businessName", event.target.value)} required={mode === "quote"} autoComplete="organization" /></label>
              <label className="form-field"><span>Phone</span><input type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" /></label>
              {mode === "contact" && <label className="form-field form-span"><span>Subject <b aria-hidden="true">*</b></span><input value={form.subject} onChange={(event) => update("subject", event.target.value)} required /></label>}
            </div>

            {mode === "quote" && <>
              <div className="fieldset-label">What are you interested in? <b aria-hidden="true">*</b></div>
              <div className="choice-grid service-choices">
                {services.map((service) => <label key={service} className={selectedServices.includes(service) ? "choice checked" : "choice"}><input type="checkbox" checked={selectedServices.includes(service)} onChange={() => toggle(service, selectedServices, setSelectedServices)} /><span>{service}</span><Check size={14} /></label>)}
              </div>
              <div className="form-grid detail-grid">
                <label className="form-field"><span>Business type</span><input value={form.businessType} onChange={(event) => update("businessType", event.target.value)} placeholder="e.g. Hospitality, salon, trade" /></label>
                <label className="form-field"><span>Town / city</span><input value={form.town} onChange={(event) => update("town", event.target.value)} autoComplete="address-level2" /></label>
                <label className="form-field"><span>Postcode</span><input value={form.postcode} onChange={(event) => update("postcode", event.target.value)} autoComplete="postal-code" /></label>
                <label className="form-field"><span>Website URL</span><input type="url" value={form.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://" /></label>
              </div>
            </>}

            {needsProductDetails && <div className="conditional-panel"><div className="panel-heading"><span>01</span><div><strong>Product details</strong><small>A few details help us make a useful recommendation.</small></div></div><div className="form-grid"><SelectField label="Approximate quantity" value={form.productQuantity} onChange={(value) => update("productQuantity", value)} options={["1–5", "6–20", "21–50", "50+"]} /><SelectField label="Number of locations" value={form.locationCount} onChange={(value) => update("locationCount", value)} options={["1", "2–5", "6–10", "10+"]} /><SelectField label="Installation required?" value={form.installationRequired} onChange={(value) => update("installationRequired", value)} options={["Yes", "No", "Unsure"]} /><label className="form-field"><span>Current review platform</span><input value={form.currentReviewPlatform} onChange={(event) => update("currentReviewPlatform", event.target.value)} placeholder="e.g. Google Business Profile" /></label><label className="form-field form-span"><span>Preferred review destination</span><input type="url" value={form.preferredReviewDestination} onChange={(event) => update("preferredReviewDestination", event.target.value)} placeholder="https://" /></label></div></div>}

            {needsWebsiteDetails && <div className="conditional-panel"><div className="panel-heading"><span>02</span><div><strong>Website requirements</strong><small>Help us understand the experience you are looking to create.</small></div></div><div className="form-grid"><SelectField label="Do you currently have a website?" value={form.hasWebsite} onChange={(value) => update("hasWebsite", value)} options={["Yes", "No"]} /><label className="form-field"><span>Existing website</span><input type="url" value={form.existingWebsite} onChange={(event) => update("existingWebsite", event.target.value)} placeholder="https://" /></label><SelectField label="What are you looking for?" value={form.websiteType} onChange={(value) => update("websiteType", value)} options={["New website", "Redesign", "Landing page", "Booking website", "Service business website", "Restaurant / hospitality", "Portfolio", "Other"]} /><SelectField label="Number of pages" value={form.pageCount} onChange={(value) => update("pageCount", value)} options={["1–3", "4–6", "7–10", "Unsure"]} /><SelectField label="Do you require maintenance?" value={form.maintenance} onChange={(value) => update("maintenance", value)} options={["Yes", "No", "Unsure"]} /></div><div className="field-set"><div className="field-set-title">Features required</div><div className="choice-grid feature-choices">{webFeatures.map((feature) => <label key={feature} className={selectedFeatures.includes(feature) ? "choice checked" : "choice"}><input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggle(feature, selectedFeatures, setSelectedFeatures)} /><span>{feature}</span><Check size={14} /></label>)}</div></div><label className="form-field"><span>Additional website requirements</span><textarea value={form.additionalRequirements} onChange={(event) => update("additionalRequirements", event.target.value)} rows={3} /></label></div>}

            <div className="form-grid top-gap"><SelectField label="Preferred contact method" value={form.contactPreference} onChange={(value) => update("contactPreference", value as "Phone" | "Email" | "WhatsApp")} options={["Phone", "Email", "WhatsApp"]} /><div /></div>
            <label className="form-field"><span>{mode === "quote" ? "Tell us a little about your requirements" : "Message"} <b aria-hidden="true">*</b></span><textarea value={form.message} onChange={(event) => update("message", event.target.value)} minLength={10} required rows={5} placeholder={mode === "quote" ? "What would a stronger customer connection look like for your business?" : "How can Olive Beacon help?"} /></label>
            <div className="form-action"><button className="button button-primary" type="submit" disabled={submitLead.isPending}>{submitLead.isPending ? <><Loader2 size={16} className="spin" /> Sending…</> : <>{mode === "quote" ? "Request my quote" : "Send message"} <Send size={15} /></>}</button><p>By submitting, you agree that Olive Beacon may contact you about your enquiry. <a href="/privacy">Privacy details</a>.</p></div>
          </form>
        </div>
      </div>
    </section>
  );
}
