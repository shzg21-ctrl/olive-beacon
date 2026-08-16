import { TRPCError } from "@trpc/server";
import { createLeadSubmission } from "../db";
import { leadSubmissionSchema } from "../leadSchemas";
import { notifyOwner } from "../_core/notification";
import { publicProcedure, router } from "../_core/trpc";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const submissionAttempts = new Map<string, { count: number; expiresAt: number }>();

function assertWithinRateLimit(identifier: string) {
  const now = Date.now();
  const current = submissionAttempts.get(identifier);

  if (!current || current.expiresAt <= now) {
    submissionAttempts.set(identifier, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (current.count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a few minutes before submitting another enquiry.",
    });
  }

  current.count += 1;
}

function firstHeaderValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "unknown";
  return value?.split(",")[0]?.trim() || "unknown";
}

export function formatLeadNotification(input: {
  submissionType: "quote" | "contact";
  businessName?: string;
  contactName: string;
  email: string;
  phone?: string;
  services: string[];
  subject?: string;
  message: string;
  sourcePage: string;
  productQuantity?: string;
  locationCount?: string;
  installationRequired?: string;
  currentReviewPlatform?: string;
  preferredReviewDestination?: string;
  contactPreference?: string;
  websiteDetails?: Record<string, unknown>;
}) {
  const lines = [
    `Type: ${input.submissionType === "quote" ? "Quote request" : "Contact message"}`,
    `Contact: ${input.contactName}`,
    `Business: ${input.businessName || "Not provided"}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not provided"}`,
    `Interested in: ${input.services.join(", ") || "General enquiry"}`,
    input.subject ? `Subject: ${input.subject}` : "",
    input.contactPreference ? `Preferred contact: ${input.contactPreference}` : "",
    input.productQuantity ? `Approx. quantity: ${input.productQuantity}` : "",
    input.locationCount ? `Locations: ${input.locationCount}` : "",
    input.installationRequired ? `Installation: ${input.installationRequired}` : "",
    input.currentReviewPlatform ? `Current review platform: ${input.currentReviewPlatform}` : "",
    input.preferredReviewDestination ? `Preferred destination: ${input.preferredReviewDestination}` : "",
    input.websiteDetails ? `Website requirements: ${JSON.stringify(input.websiteDetails)}` : "",
    `Source: ${input.sourcePage}`,
    "",
    `Message: ${input.message}`,
  ];

  return lines.filter(Boolean).join("\n");
}

export const leadsRouter = router({
  submit: publicProcedure.input(leadSubmissionSchema).mutation(async ({ ctx, input }) => {
    if (input.honeypot) {
      return { success: true, id: 0, ownerNotified: false };
    }

    const clientId = firstHeaderValue(ctx.req.headers["x-forwarded-for"]);
    assertWithinRateLimit(clientId);

    try {
      const submission = await createLeadSubmission(input);
      let ownerNotified = false;

      try {
        ownerNotified = await notifyOwner({
          title: `New Olive Beacon ${input.submissionType === "quote" ? "quote request" : "contact enquiry"}`,
          content: formatLeadNotification(input),
        });
      } catch (notificationError) {
        console.warn("[Lead] Owner notification failed:", notificationError);
      }

      return { success: true, id: submission.id, ownerNotified };
    } catch (error) {
      console.error("[Lead] Submission failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "We could not save your enquiry. Please try again shortly.",
      });
    }
  }),
});
