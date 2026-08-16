import { useState } from "react";
import { Check, FileUp, Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useRoute } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type FileCategory = "logo" | "brand" | "image" | "menu" | "content" | "artwork" | "site-photo";
type FilePayload = { name: string; type: string; data: string; category: FileCategory };

const initialForm = {
  businessName: "", businessType: "", address: "", contactName: "", jobRole: "", email: "", phone: "", website: "", socialMedia: "",
  product: "", quantity: "", size: "", variation: "", installation: "", deliveryPreference: "", googleBusinessProfile: "", googleReviewUrl: "", alternativeDestination: "",
  colours: "", guidelines: "", fonts: "", preferredWording: "", designPreferences: "", deliveryAddress: "", siteContact: "", proposedPlacement: "", accessInformation: "", preferredDate: "",
  currentWebsite: "", businessDescription: "", services: "", pageRequirements: "", bookingRequirements: "", contactRequirements: "", contentRequirements: "", referenceSites: "", preferredStyle: "",
};

type FormKey = keyof typeof initialForm;

function Field({ label, value, onChange, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="onboard-field"><span>{label}{required && <b> *</b>}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="onboard-field full"><span>{label}</span><textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

export default function Onboarding() {
  const [, params] = useRoute("/onboarding/:token");
  const token = params?.token ?? "";
  const invite = trpc.onboarding.get.useQuery({ token }, { retry: false, enabled: Boolean(token) });
  const submit = trpc.onboarding.submit.useMutation();
  const decideArtwork = trpc.onboarding.decideArtwork.useMutation();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<FilePayload[]>([]);
  const [includeWebsiteProject, setIncludeWebsiteProject] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [comments, setComments] = useState("");
  const update = (key: FormKey, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const field = (label: string, key: FormKey, required = false, type = "text") => <Field label={label} value={form[key]} onChange={(value) => update(key, value)} required={required} type={type} />;
  const area = (label: string, key: FormKey) => <Area label={label} value={form[key]} onChange={(value) => update(key, value)} />;

  async function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []).slice(0, 6 - files.length);
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"];
    const invalid = picked.find((file) => file.size > 5 * 1024 * 1024 || !allowedTypes.includes(file.type));
    if (invalid) {
      toast.error("Use PNG, JPG, WebP, SVG, or PDF files no larger than 5 MB.");
      event.target.value = "";
      return;
    }
    try {
      const next = await Promise.all(picked.map((file) => new Promise<FilePayload>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, type: file.type, data: String(reader.result).split(",")[1] ?? "", category: file.type === "application/pdf" ? "brand" : "image" });
        reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
        reader.readAsDataURL(file);
      })));
      setFiles((previous) => [...previous, ...next]);
      event.target.value = "";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We could not read that file.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) { toast.error("Please confirm that the information is accurate."); return; }
    try {
      await submit.mutateAsync({
        token,
        business: { businessName: form.businessName, businessType: form.businessType, address: form.address, contactName: form.contactName, jobRole: form.jobRole, email: form.email, phone: form.phone, website: form.website, socialMedia: form.socialMedia },
        product: { product: form.product, quantity: form.quantity, size: form.size, variation: form.variation, installation: form.installation, deliveryPreference: form.deliveryPreference },
        reviewDestination: { googleBusinessProfile: form.googleBusinessProfile, googleReviewUrl: form.googleReviewUrl, alternativeDestination: form.alternativeDestination },
        branding: { colours: form.colours, guidelines: form.guidelines, fonts: form.fonts, preferredWording: form.preferredWording, designPreferences: form.designPreferences },
        delivery: { address: form.deliveryAddress, siteContact: form.siteContact, proposedPlacement: form.proposedPlacement, accessInformation: form.accessInformation, preferredDate: form.preferredDate },
        websiteProject: includeWebsiteProject ? { currentWebsite: form.currentWebsite, businessDescription: form.businessDescription, services: form.services, pageRequirements: form.pageRequirements, bookingRequirements: form.bookingRequirements, contactRequirements: form.contactRequirements, contentRequirements: form.contentRequirements, referenceSites: form.referenceSites, preferredStyle: form.preferredStyle } : {},
        files,
        accurate: true,
      });
      setCompleted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We could not save your details. Please try again.");
    }
  }

  if (!token || invite.isError) return <main className="private-state"><LockKeyhole size={28} /><h1>This private onboarding link is unavailable.</h1><p>It may have expired, been completed, or been revoked. Please contact Olive Beacon if you need a new link.</p></main>;
  if (invite.isLoading) return <main className="private-state"><Loader2 className="spin" size={28} /><h1>Opening your private onboarding space…</h1></main>;
  if (completed) return <main className="private-state success"><ShieldCheck size={32} /><h1>Your onboarding details are with us.</h1><p>Olive Beacon will review the information provided and contact you if anything else is needed.</p></main>;

  return <main className="onboarding-page">
    <header className="onboarding-header"><a href="/" className="wordmark"><span>OLIVE</span> BEACON</a><span><LockKeyhole size={14} /> Secure customer onboarding</span></header>
    <section className="onboarding-intro"><p className="eyebrow"><span /> PRIVATE CUSTOMER JOURNEY</p><h1>Everything we need to make your Olive Beacon experience <em>right.</em></h1><p>This secure form helps Olive Beacon prepare your product, artwork, installation, or website project. Only share information needed for the agreed work. Please do not send passwords or payment-card information here.</p></section>
    {invite.data?.artwork && <section className="artwork-approval"><div><p>ARTWORK APPROVAL</p><strong>Proof version {invite.data.artwork.version}</strong><span>Submitted {new Date(invite.data.artwork.createdAt).toLocaleDateString()}</span>{invite.data.artwork.proofUrl && <a href={invite.data.artwork.proofUrl} target="_blank" rel="noreferrer">Open proof preview</a>}</div>{invite.data.artwork.status === "sent" && <div className="artwork-actions"><button type="button" className="button button-primary small" onClick={() => decideArtwork.mutate({ token, decision: "approved" }, { onSuccess: () => toast.success("Artwork approval recorded.") })}>Approve artwork</button><input aria-label="Requested artwork changes" placeholder="Changes you would like to request" value={comments} onChange={(event) => setComments(event.target.value)} /><button type="button" className="button button-outline small" onClick={() => decideArtwork.mutate({ token, decision: "changes_requested", comments }, { onSuccess: () => toast.success("Your change request has been recorded."), onError: (error) => toast.error(error.message) })}>Request changes</button></div>}</section>}
    <form className="onboarding-form" onSubmit={handleSubmit}>
      <section><div className="onboard-heading"><span>01</span><div><h2>Business details</h2><p>Tell us who we are preparing work for.</p></div></div><div className="onboard-grid">{field("Business name", "businessName", true)}{field("Business type", "businessType")}{field("Main contact", "contactName", true)}{field("Job role", "jobRole")}{field("Email", "email", true, "email")}{field("Phone", "phone", false, "tel")}{field("Business website", "website", false, "url")}{field("Social media", "socialMedia")}{area("Business address", "address")}</div></section>
      <section><div className="onboard-heading"><span>02</span><div><h2>Product & destination</h2><p>Complete only the fields relevant to your agreed Olive Beacon setup.</p></div></div><div className="onboard-grid">{field("Product", "product")}{field("Quantity", "quantity")}{field("Size", "size")}{field("Product variation", "variation")}{field("Installation needed", "installation")}{field("Delivery preference", "deliveryPreference")}{field("Google Business Profile URL", "googleBusinessProfile", false, "url")}{field("Google review URL", "googleReviewUrl", false, "url")}{field("Alternative destination", "alternativeDestination", false, "url")}</div></section>
      <section><div className="onboard-heading"><span>03</span><div><h2>Branding & delivery</h2><p>Give us a considered view of your business and space.</p></div></div><div className="onboard-grid">{field("Brand colours", "colours")}{field("Brand fonts", "fonts")}{field("Delivery / site address", "deliveryAddress")}{field("Site contact", "siteContact")}{field("Proposed placement", "proposedPlacement")}{field("Preferred date", "preferredDate")}{area("Brand guidelines or design direction", "guidelines")}{area("Preferred wording or customer message", "preferredWording")}{area("Access information or installation notes", "accessInformation")}</div></section>
      <section className="website-onboarding-toggle"><div><strong>Does your Olive Beacon project include a website?</strong><p>Choose this to provide website content and experience requirements.</p></div><button type="button" className={includeWebsiteProject ? "active" : ""} onClick={() => setIncludeWebsiteProject((value) => !value)} aria-pressed={includeWebsiteProject}>{includeWebsiteProject ? "Website details included" : "Add website details"}</button></section>
      {includeWebsiteProject && <section><div className="onboard-heading"><span>04</span><div><h2>Website project details</h2><p>Tell us about the website experience Olive Beacon is preparing.</p></div></div><div className="onboard-grid">{field("Current website", "currentWebsite", false, "url")}{field("Reference sites you like", "referenceSites")}{area("Business description", "businessDescription")}{area("Services, pages, or content requirements", "services")}{area("Booking, contact, gallery, menu, or review requirements", "bookingRequirements")}{area("Preferred style", "preferredStyle")}</div></section>}
      <section><div className="onboard-heading"><span>05</span><div><h2>Secure asset upload</h2><p>PNG, JPG, WebP, SVG, or PDF. Maximum 5 MB per file. Files are stored for the agreed project only.</p></div></div><label className="upload-field"><FileUp size={20} /><span>Choose logo, brand guide, images, menu, or artwork</span><input type="file" accept=".png,.jpg,.jpeg,.webp,.svg,.pdf" multiple onChange={addFiles} /></label>{files.length > 0 && <div className="upload-list">{files.map((file, index) => <span key={`${file.name}-${index}`}>{file.name}<button type="button" onClick={() => setFiles((previous) => previous.filter((_, fileIndex) => fileIndex !== index))}>Remove</button></span>)}</div>}</section>
      <label className="accurate-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span><Check size={14} /> I confirm the information provided is accurate to the best of my knowledge.</span></label>
      <button className="button button-primary onboarding-submit" disabled={submit.isPending}>{submit.isPending ? <><Loader2 className="spin" size={16} /> Saving details…</> : <><Sparkles size={16} /> Submit onboarding details</>}</button>
    </form>
  </main>;
}
