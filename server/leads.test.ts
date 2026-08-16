import { describe, expect, it } from "vitest";
import { leadSubmissionSchema } from "./leadSchemas";
import { formatLeadNotification } from "./routers/leads";

const validQuote = {
  submissionType: "quote" as const,
  businessName: "Beacon Barbers",
  businessType: "Barber",
  contactName: "Alex Morgan",
  email: "alex@example.com",
  phone: "07123456789",
  town: "Canterbury",
  postcode: "CT1 1AA",
  websiteUrl: "",
  services: ["Olive Beacon Review Stand"],
  productQuantity: "1–5",
  locationCount: "1",
  installationRequired: "Unsure",
  currentReviewPlatform: "Google Business Profile",
  preferredReviewDestination: "",
  contactPreference: "Email" as const,
  subject: "",
  message: "We would like to make leaving a review easier after each appointment.",
  sourcePage: "/",
  honeypot: "",
};

describe("lead submission validation", () => {
  it("accepts a well-formed quote request", () => {
    expect(leadSubmissionSchema.safeParse(validQuote).success).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    const result = leadSubmissionSchema.safeParse({ ...validQuote, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires a service selection for quote requests", () => {
    const result = leadSubmissionSchema.safeParse({ ...validQuote, services: [] });
    expect(result.success).toBe(false);
  });

  it("includes key lead details in the owner alert", () => {
    const content = formatLeadNotification(validQuote);
    expect(content).toContain("Alex Morgan");
    expect(content).toContain("Beacon Barbers");
    expect(content).toContain("Olive Beacon Review Stand");
  });
});
