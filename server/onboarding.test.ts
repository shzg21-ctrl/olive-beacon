import { describe, expect, it } from "vitest";
import { hashOnboardingToken, validateOnboardingFile } from "./routers/onboarding";

describe("secure onboarding helpers", () => {
  it("hashes secure tokens deterministically without returning the raw token", () => {
    const token = "a".repeat(43);
    const hash = hashOnboardingToken(token);

    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashOnboardingToken(token));
    expect(hash).not.toContain(token);
  });

  it("accepts an allowed file type with matching extension", () => {
    const file = validateOnboardingFile({
      name: "brand-guide.pdf",
      type: "application/pdf",
      data: Buffer.from("example pdf contents").toString("base64"),
    });

    expect(file.toString()).toBe("example pdf contents");
  });

  it("rejects disallowed or mismatched uploaded files", () => {
    expect(() => validateOnboardingFile({
      name: "unexpected.exe",
      type: "application/pdf",
      data: Buffer.from("not a document").toString("base64"),
    })).toThrow("Only PNG, JPG, WebP, SVG, and PDF files are accepted.");
  });
});
