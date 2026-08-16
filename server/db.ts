import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, leads, quoteRequests, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import type { LeadSubmissionInput } from "./leadSchemas";

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
