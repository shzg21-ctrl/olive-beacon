import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const leadStatus = mysqlEnum("leadStatus", [
  "new",
  "contacted",
  "qualified",
  "quote_sent",
  "follow_up",
  "won",
  "lost",
]);

/** Public quote and contact submissions. These records are the source of truth for lead follow-up. */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  submissionType: mysqlEnum("submissionType", ["quote", "contact"]).notNull(),
  businessName: varchar("businessName", { length: 255 }),
  businessType: varchar("businessType", { length: 160 }),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  town: varchar("town", { length: 160 }),
  postcode: varchar("postcode", { length: 32 }),
  websiteUrl: varchar("websiteUrl", { length: 1024 }),
  serviceInterests: json("serviceInterests").$type<string[]>().notNull(),
  productQuantity: varchar("productQuantity", { length: 64 }),
  locationCount: varchar("locationCount", { length: 32 }),
  installationRequired: varchar("installationRequired", { length: 32 }),
  currentReviewPlatform: varchar("currentReviewPlatform", { length: 160 }),
  preferredReviewDestination: varchar("preferredReviewDestination", { length: 1024 }),
  contactPreference: varchar("contactPreference", { length: 32 }),
  subject: varchar("subject", { length: 180 }),
  message: text("message").notNull(),
  websiteDetails: json("websiteDetails").$type<Record<string, unknown>>(),
  sourcePage: varchar("sourcePage", { length: 160 }).notNull(),
  status: leadStatus.default("new").notNull(),
  followUpAt: timestamp("followUpAt"),
  ownerNotes: text("ownerNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Future-ready customer record, created after qualification rather than from public form submissions. */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessType: varchar("businessType", { length: 160 }),
  primaryContact: varchar("primaryContact", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  websiteUrl: varchar("websiteUrl", { length: 1024 }),
  status: mysqlEnum("status", ["prospect", "active", "inactive"]).default("prospect").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** A detailed commercial request associated with a lead when quote fulfilment begins. */
export const quoteRequests = mysqlTable("quoteRequests", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  customerId: int("customerId"),
  serviceInterests: json("serviceInterests").$type<string[]>().notNull(),
  productQuantity: varchar("productQuantity", { length: 64 }),
  requirements: text("requirements"),
  websiteDetails: json("websiteDetails").$type<Record<string, unknown>>(),
  status: mysqlEnum("status", ["new", "in_review", "quoted", "accepted", "declined"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Future operations model for approved physical-product orders. */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  quoteRequestId: int("quoteRequestId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  quotedPrice: varchar("quotedPrice", { length: 64 }),
  status: mysqlEnum("status", ["draft", "confirmed", "in_production", "quality_check", "fulfilled", "cancelled"]).default("draft").notNull(),
  deliveryDetails: json("deliveryDetails").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Future artwork-proof tracking model. Approval is recorded before production begins. */
export const artworkApprovals = mysqlTable("artworkApprovals", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  orderId: int("orderId"),
  version: varchar("version", { length: 64 }).notNull(),
  fileKey: varchar("fileKey", { length: 1024 }),
  status: mysqlEnum("status", ["draft", "sent", "approved", "changes_requested"]).default("draft").notNull(),
  customerComments: text("customerComments"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Future website project model to keep delivery separate from public marketing content. */
export const websiteProjects = mysqlTable("websiteProjects", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  quoteRequestId: int("quoteRequestId"),
  scope: text("scope"),
  status: mysqlEnum("status", ["discovery", "design", "build", "review", "launched", "maintenance"]).default("discovery").notNull(),
  assetManifest: json("assetManifest").$type<Record<string, unknown>>(),
  targetDeadline: timestamp("targetDeadline"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
