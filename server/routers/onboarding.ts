import crypto from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createArtworkApproval, createOnboardingInvite, getOnboardingInvite, saveOnboardingSubmission, submitArtworkDecision } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedFiles: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/webp": ["webp"],
  "image/svg+xml": ["svg"],
  "application/pdf": ["pdf"],
};

const optionalString = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const tokenSchema = z.string().trim().min(32).max(255);

const onboardingSchema = z.object({
  token: tokenSchema,
  business: z.object({
    businessName: z.string().trim().min(2).max(255),
    businessType: optionalString(160),
    address: optionalString(1000),
    contactName: z.string().trim().min(2).max(255),
    jobRole: optionalString(160),
    email: z.string().trim().email().max(320),
    phone: optionalString(64),
    website: optionalString(1024),
    socialMedia: optionalString(1024),
  }),
  product: z.object({
    product: optionalString(255),
    quantity: optionalString(64),
    size: optionalString(64),
    variation: optionalString(160),
    installation: optionalString(64),
    deliveryPreference: optionalString(255),
  }),
  reviewDestination: z.object({
    googleBusinessProfile: optionalString(1024),
    googleReviewUrl: optionalString(1024),
    alternativeDestination: optionalString(1024),
  }),
  branding: z.object({
    colours: optionalString(255),
    guidelines: optionalString(2000),
    fonts: optionalString(255),
    preferredWording: optionalString(2000),
    designPreferences: optionalString(2000),
  }),
  delivery: z.object({
    address: optionalString(1000),
    siteContact: optionalString(255),
    proposedPlacement: optionalString(1000),
    accessInformation: optionalString(2000),
    preferredDate: optionalString(64),
  }),
  websiteProject: z.object({
    currentWebsite: optionalString(1024),
    businessDescription: optionalString(3000),
    services: optionalString(3000),
    pageRequirements: optionalString(3000),
    bookingRequirements: optionalString(2000),
    contactRequirements: optionalString(2000),
    contentRequirements: optionalString(3000),
    referenceSites: optionalString(2000),
    preferredStyle: optionalString(2000),
  }),
  files: z.array(z.object({
    name: z.string().min(1).max(160),
    type: z.string().min(1).max(100),
    data: z.string().min(1).max(7_000_000),
    category: z.enum(["logo", "brand", "image", "menu", "content", "artwork", "site-photo"]),
  })).max(6),
  accurate: z.literal(true, { error: "Please confirm that the information is accurate." }),
});

export type OnboardingSubmissionInput = z.infer<typeof onboardingSchema>;

export function hashOnboardingToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function validateOnboardingFile(file: { name: string; type: string; data: string }) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !allowedFiles[file.type]?.includes(extension)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Only PNG, JPG, WebP, SVG, and PDF files are accepted." });
  }

  const buffer = Buffer.from(file.data, "base64");
  if (!buffer.length || buffer.length > MAX_FILE_SIZE) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Each uploaded file must be no larger than 5 MB." });
  }
  return buffer;
}

export const onboardingRouter = router({
  createArtwork: adminProcedure.input(z.object({
    customerId: z.number().int().positive(),
    orderId: z.number().int().positive().optional(),
    version: z.string().trim().min(1).max(64),
    file: z.object({ name: z.string().min(1).max(160), type: z.string().min(1).max(100), data: z.string().min(1).max(7_000_000) }),
  })).mutation(async ({ input }) => {
    const fileBuffer = validateOnboardingFile(input.file);
    const id = await createArtworkApproval({ ...input, fileBuffer });
    return { id };
  }),
  createInvite: adminProcedure.input(z.object({
    leadId: z.number().int().positive().optional(),
    customerId: z.number().int().positive().optional(),
    quoteRequestId: z.number().int().positive().optional(),
    artworkApprovalId: z.number().int().positive().optional(),
    expiresInDays: z.number().int().min(1).max(90).default(30),
  })).mutation(async ({ input }) => {
    const rawToken = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000);
    await createOnboardingInvite({
      tokenHash: hashOnboardingToken(rawToken),
      leadId: input.leadId,
      customerId: input.customerId,
      quoteRequestId: input.quoteRequestId,
      artworkApprovalId: input.artworkApprovalId,
      expiresAt,
    });
    return { token: rawToken, expiresAt };
  }),
  get: publicProcedure.input(z.object({ token: tokenSchema })).query(async ({ input }) => {
    const invite = await getOnboardingInvite(hashOnboardingToken(input.token));
    if (!invite) {
      throw new TRPCError({ code: "NOT_FOUND", message: "This private onboarding link is unavailable or has expired." });
    }
    return invite;
  }),
  submit: publicProcedure.input(onboardingSchema).mutation(async ({ input }) => {
    const tokenHash = hashOnboardingToken(input.token);
    const invite = await getOnboardingInvite(tokenHash);
    if (!invite) {
      throw new TRPCError({ code: "NOT_FOUND", message: "This private onboarding link is unavailable or has expired." });
    }

    const files = input.files.map((file) => ({ ...file, buffer: validateOnboardingFile(file) }));
    try {
      await saveOnboardingSubmission({ ...input, tokenHash, files });
      return { success: true };
    } catch (error) {
      console.error("[Onboarding] Submission failed:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not save your onboarding details. Please try again shortly." });
    }
  }),
  decideArtwork: publicProcedure.input(z.object({
    token: tokenSchema,
    decision: z.enum(["approved", "changes_requested"]),
    comments: z.string().trim().max(3000).optional(),
  })).mutation(async ({ input }) => {
    const invite = await getOnboardingInvite(hashOnboardingToken(input.token));
    if (!invite?.artwork) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No artwork approval is available on this private link." });
    }
    if (input.decision === "changes_requested" && !input.comments?.trim()) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Please describe the changes you would like to request." });
    }
    await submitArtworkDecision(invite.artwork.id, input.decision, input.comments?.trim() || null);
    return { success: true };
  }),
});
