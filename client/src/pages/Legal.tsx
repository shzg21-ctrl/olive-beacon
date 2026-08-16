import { Link } from "wouter";

const legalContent = {
  privacy: {
    eyebrow: "PRIVACY",
    title: "Privacy, handled with care.",
    intro: "This working policy explains how Olive Beacon handles the details provided through its website. It should be reviewed and approved for the business’s final legal position before public launch.",
    sections: [
      ["What we collect", "When you submit an enquiry, we collect the information needed to respond to it. This can include your contact details, business information, service interests, and the requirements you choose to share."],
      ["Why we use it", "We use your information to assess and respond to your enquiry, prepare relevant proposals, and maintain a clear record of our business correspondence. We do not ask for passwords, payment-card details, or sensitive personal information through our public forms."],
      ["How long we keep it", "Enquiry information is retained only for as long as it is needed for the enquiry, related business administration, and any legal or accounting obligations that may apply. The exact retention schedule should be finalised before launch."],
      ["Your choices", "You can ask for access to, correction of, or deletion of information held about you, subject to applicable legal obligations. Contact details will be added here when Olive Beacon’s professional email address is established."],
    ],
  },
  cookies: {
    eyebrow: "COOKIES",
    title: "Clear choices. No dark patterns.",
    intro: "Olive Beacon currently uses essential local storage to remember the cookie notice choice. This policy should be reviewed before launch if analytics, advertising, or additional integrations are enabled.",
    sections: [
      ["Essential storage", "The website may store a preference that records your cookie choice. This helps the site remember your selection and is not used for advertising."],
      ["Analytics", "Analytics are not active in the current website build. If analytics are introduced, the provider, purpose, and any consent requirements should be documented here before launch."],
      ["Marketing", "No marketing cookies or advertising pixels are enabled in the current website build."],
      ["Manage preferences", "You can clear your browser storage to remove your saved preferences. A preference control is also available in the site footer."],
    ],
  },
  terms: {
    eyebrow: "TERMS",
    title: "Website terms of use.",
    intro: "These draft website terms explain the intended basis on which the Olive Beacon site may be used. They require final professional legal review before launch.",
    sections: [
      ["Website information", "Olive Beacon provides general information about its digital solutions and product offerings. Content is provided in good faith but is not a binding offer, technical specification, or guarantee of a particular outcome."],
      ["Enquiries and quotes", "Submitting an enquiry does not create a contract. Product specifications, availability, delivery, installation, project scopes, and pricing will be confirmed in writing before any order or project is accepted."],
      ["Intellectual property", "The Olive Beacon name, visual identity, website content, and original materials are protected. They may not be copied or used without permission."],
      ["No guarantees", "Olive Beacon products and digital services can make customer interactions easier, but customers always choose whether to leave feedback or a review. No review volumes, results, or business outcomes are guaranteed."],
    ],
  },
} as const;

export default function Legal({ page }: { page: keyof typeof legalContent }) {
  const content = legalContent[page];
  return <main className="legal-page"><header className="simple-nav"><Link href="/" className="wordmark"><span>OLIVE</span> BEACON</Link><Link href="/" className="text-link">Back to home</Link></header><section className="legal-hero"><p className="eyebrow"><span /> {content.eyebrow}</p><h1>{content.title}</h1><p>{content.intro}</p></section><section className="legal-copy">{content.sections.map(([heading, body]) => <article key={heading}><h2>{heading}</h2><p>{body}</p></article>)}</section><footer className="legal-footer"><Link href="/" className="wordmark"><span>OLIVE</span> BEACON</Link><p>© {new Date().getFullYear()} Olive Beacon</p></footer></main>;
}
