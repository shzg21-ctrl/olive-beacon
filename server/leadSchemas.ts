import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalUrl = z
  .string()
  .trim()
  .url("Please enter a valid URL.")
  .optional()
  .or(z.literal(""));

export const serviceInterestOptions = [
  "Olive Beacon Review Stand",
  "Olive Beacon Review Sticker",
  "Multiple products",
  "Website",
  "Website redesign",
  "Website maintenance",
  "Digital solution",
  "Not sure / need advice",
] as const;

export const leadSubmissionSchema = z
  .object({
    submissionType: z.enum(["quote", "contact"]),
    businessName: optionalText(255),
    businessType: optionalText(160),
    contactName: z.string().trim().min(2, "Please enter your name.").max(255),
    email: z.string().trim().email("Please enter a valid email address.").max(320),
    phone: optionalText(64),
    town: optionalText(160),
    postcode: optionalText(32),
    websiteUrl: optionalUrl,
    services: z.array(z.string().trim().min(1).max(80)).max(8),
    productQuantity: optionalText(64),
    locationCount: optionalText(32),
    installationRequired: optionalText(32),
    currentReviewPlatform: optionalText(160),
    preferredReviewDestination: optionalUrl,
    contactPreference: z.enum(["Phone", "Email", "WhatsApp"]).optional(),
    subject: optionalText(180),
    message: z.string().trim().min(10, "Please provide a little more detail.").max(5000),
    websiteDetails: z
      .object({
        hasWebsite: optionalText(32),
        existingWebsite: optionalUrl,
        websiteType: optionalText(160),
        features: z.array(z.string().trim().min(1).max(80)).max(12),
        pageCount: optionalText(32),
        maintenance: optionalText(32),
        additionalRequirements: optionalText(3000),
      })
      .optional(),
    sourcePage: z.string().trim().min(1).max(160).default("/"),
    honeypot: z.string().max(256).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.submissionType === "quote" && data.services.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["services"],
        message: "Select at least one service so we can tailor your quote.",
      });
    }
    if (data.submissionType === "quote" && !data.businessName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["businessName"],
        message: "Please enter your business name so we can tailor your quote.",
      });
    }
    if (data.submissionType === "contact" && !data.subject?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subject"],
        message: "Please add a subject.",
      });
    }
  });

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

export function hasNfcProductInterest(services: string[]): boolean {
  return services.some((service) =>
    ["Olive Beacon Review Stand", "Olive Beacon Review Sticker", "Multiple products"].includes(service)
  );
}

export function hasWebsiteInterest(services: string[]): boolean {
  return services.some((service) =>
    ["Website", "Website redesign", "Website maintenance"].includes(service)
  );
}
