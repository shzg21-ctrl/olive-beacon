import { and, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, artworkApprovals, customerAssets, customerOnboardings, leads, onboardingInvites, quoteRequests, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import type { LeadSubmissionInput } from "./leadSchemas";
import { storageGet, storagePut } from "./storage";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

const normaliseOptional = (value?: string) => value?.trim() || null;

/** Saves a public enquiry and creates a quote-request record for future commercial workflows. */
export async function createLeadSubmission(input: LeadSubmissionInput): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  const result = await db.insert(leads).values({
    submissionType: input.submissionType,
    businessName: normaliseOptional(input.businessName),
    businessType: normaliseOptional(input.businessType),
    contactName: input.contactName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normaliseOptional(input.phone),
    town: normaliseOptional(input.town),
    postcode: normaliseOptional(input.postcode),
    websiteUrl: normaliseOptional(input.websiteUrl),
    serviceInterests: input.services,
    productQuantity: normaliseOptional(input.productQuantity),
    locationCount: normaliseOptional(input.locationCount),
    installationRequired: normaliseOptional(input.installationRequired),
    currentReviewPlatform: normaliseOptional(input.currentReviewPlatform),
    preferredReviewDestination: normaliseOptional(input.preferredReviewDestination),
    contactPreference: input.contactPreference ?? null,
    subject: normaliseOptional(input.subject),
    message: input.message.trim(),
    websiteDetails: input.websiteDetails ?? null,
    sourcePage: input.sourcePage,
  });

  const leadId = Number(result[0]?.insertId);
  if (!Number.isInteger(leadId) || leadId < 1) {
    throw new Error("Lead ID was not returned after insertion");
  }

  if (input.submissionType === "quote") {
    await db.insert(quoteRequests).values({
      leadId,
      serviceInterests: input.services,
      productQuantity: normaliseOptional(input.productQuantity),
      requirements: input.message.trim(),
      websiteDetails: input.websiteDetails ?? null,
    });
  }

  return { id: leadId };
}

export async function getOnboardingInvite(tokenHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [invite] = await db.select().from(onboardingInvites).where(and(
    eq(onboardingInvites.tokenHash, tokenHash),
    eq(onboardingInvites.status, "active"),
  )).limit(1);
  if (!invite || (invite.expiresAt && invite.expiresAt.getTime() < Date.now())) return undefined;

  const artwork = invite.artworkApprovalId
    ? (await db.select().from(artworkApprovals).where(eq(artworkApprovals.id, invite.artworkApprovalId)).limit(1))[0]
    : undefined;
  return { ...invite, artwork: artwork ? { id: artwork.id, version: artwork.version, status: artwork.status, createdAt: artwork.createdAt, proofUrl: artwork.fileKey ? (await storageGet(artwork.fileKey)).url : null } : null };
}

export async function createArtworkApproval(input: { customerId: number; orderId?: number; version: string; file: { name: string; type: string }; fileBuffer: Buffer }): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const stored = await storagePut(`artwork/${input.customerId}/${crypto.randomUUID()}-${safeName}`, input.fileBuffer, input.file.type);
  const result = await db.insert(artworkApprovals).values({
    customerId: input.customerId,
    orderId: input.orderId ?? null,
    version: input.version,
    fileKey: stored.key,
    status: "sent",
  });
  const id = Number(result[0]?.insertId);
  if (!id) throw new Error("Artwork approval was not created");
  return id;
}

export async function createOnboardingInvite(input: {
  tokenHash: string;
  leadId?: number;
  customerId?: number;
  quoteRequestId?: number;
  artworkApprovalId?: number;
  expiresAt: Date;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(onboardingInvites).values({
    tokenHash: input.tokenHash,
    leadId: input.leadId ?? null,
    customerId: input.customerId ?? null,
    quoteRequestId: input.quoteRequestId ?? null,
    artworkApprovalId: input.artworkApprovalId ?? null,
    expiresAt: input.expiresAt,
  });
}

type OnboardingSubmission = {
  tokenHash: string;
  business: Record<string, unknown>;
  product: Record<string, unknown>;
  reviewDestination: Record<string, unknown>;
  branding: Record<string, unknown>;
  delivery: Record<string, unknown>;
  websiteProject: Record<string, unknown>;
  accurate: true;
  files: Array<{ name: string; type: string; category: string; buffer: Buffer }>;
};

export async function saveOnboardingSubmission(input: OnboardingSubmission): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [invite] = await db.select().from(onboardingInvites).where(and(
    eq(onboardingInvites.tokenHash, input.tokenHash),
    eq(onboardingInvites.status, "active"),
  )).limit(1);
  if (!invite || (invite.expiresAt && invite.expiresAt.getTime() < Date.now())) {
    throw new Error("Onboarding invite is not available");
  }

  await db.insert(customerOnboardings).values({
    inviteId: invite.id,
    customerId: invite.customerId,
    businessDetails: input.business,
    productDetails: input.product,
    reviewDestination: input.reviewDestination,
    brandingDetails: input.branding,
    deliveryDetails: input.delivery,
    websiteProjectDetails: input.websiteProject,
    accurateConfirmed: true,
    completedAt: new Date(),
  }).onDuplicateKeyUpdate({
    set: {
      businessDetails: input.business,
      productDetails: input.product,
      reviewDestination: input.reviewDestination,
      brandingDetails: input.branding,
      deliveryDetails: input.delivery,
      websiteProjectDetails: input.websiteProject,
      accurateConfirmed: true,
      completedAt: new Date(),
    },
  });
  const [onboarding] = await db.select().from(customerOnboardings).where(eq(customerOnboardings.inviteId, invite.id)).limit(1);
  if (!onboarding) throw new Error("Onboarding record was not created");

  for (const file of input.files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const stored = await storagePut(`onboarding/${invite.id}/${crypto.randomUUID()}-${safeName}`, file.buffer, file.type);
    await db.insert(customerAssets).values({
      onboardingId: onboarding.id,
      category: file.category,
      originalName: file.name,
      storageKey: stored.key,
      mimeType: file.type,
      byteSize: file.buffer.length,
    });
  }

  await db.update(onboardingInvites).set({ status: "completed" }).where(eq(onboardingInvites.id, invite.id));
}

export async function submitArtworkDecision(artworkId: number, status: "approved" | "changes_requested", comments: string | null): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(artworkApprovals).set({
    status,
    customerComments: comments,
    approvedAt: status === "approved" ? new Date() : null,
  }).where(eq(artworkApprovals.id, artworkId));
}
