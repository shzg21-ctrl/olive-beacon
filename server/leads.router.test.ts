import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  createLeadSubmission: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", () => ({ createLeadSubmission: mocks.createLeadSubmission }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));

import { leadsRouter } from "./routers/leads";

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

describe("leads.submit", () => {
  beforeEach(() => {
    mocks.createLeadSubmission.mockReset().mockResolvedValue({ id: 101 });
    mocks.notifyOwner.mockReset().mockResolvedValue(true);
  });

  it("persists a valid lead and sends an owner alert", async () => {
    const caller = leadsRouter.createCaller({
      req: { headers: { "x-forwarded-for": "router-unit-test" } },
    } as unknown as TrpcContext);

    const result = await caller.submit(validQuote);

    expect(mocks.createLeadSubmission).toHaveBeenCalledWith(expect.objectContaining({
      businessName: "Beacon Barbers",
      services: ["Olive Beacon Review Stand"],
    }));
    expect(mocks.notifyOwner).toHaveBeenCalledWith(expect.objectContaining({
      title: "New Olive Beacon quote request",
      content: expect.stringContaining("Alex Morgan"),
    }));
    expect(result).toEqual({ success: true, id: 101, ownerNotified: true });
  });

  it("silently accepts honeypot spam without saving a lead or sending an alert", async () => {
    const caller = leadsRouter.createCaller({
      req: { headers: { "x-forwarded-for": "honeypot-unit-test" } },
    } as unknown as TrpcContext);

    const result = await caller.submit({ ...validQuote, honeypot: "suspicious content" });

    expect(mocks.createLeadSubmission).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, id: 0, ownerNotified: false });
  });

  it("keeps a saved lead successful when owner notification is temporarily unavailable", async () => {
    mocks.notifyOwner.mockResolvedValue(false);
    const caller = leadsRouter.createCaller({
      req: { headers: { "x-forwarded-for": "notification-unit-test" } },
    } as unknown as TrpcContext);

    const result = await caller.submit(validQuote);

    expect(result).toEqual({ success: true, id: 101, ownerNotified: false });
  });

  it("returns a safe error when the lead cannot be persisted", async () => {
    mocks.createLeadSubmission.mockRejectedValue(new Error("database unavailable"));
    const caller = leadsRouter.createCaller({
      req: { headers: { "x-forwarded-for": "persistence-unit-test" } },
    } as unknown as TrpcContext);

    await expect(caller.submit(validQuote)).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "We could not save your enquiry. Please try again shortly.",
    });
  });

  it("rate limits repeated submissions from one source", async () => {
    const caller = leadsRouter.createCaller({
      req: { headers: { "x-forwarded-for": "rate-limit-unit-test" } },
    } as unknown as TrpcContext);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(caller.submit(validQuote)).resolves.toMatchObject({ success: true });
    }
    await expect(caller.submit(validQuote)).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });
});
