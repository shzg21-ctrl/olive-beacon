import { describe, expect, it } from "vitest";
import { getBoardSrc, portfolioCategories } from "./portfolioData";

describe("Website Examples portfolio data", () => {
  it("covers the requested business categories with public-facing concept directions", () => {
    expect(portfolioCategories.map((category) => category.id)).toEqual([
      "barbers", "restaurants", "cafes", "pubs-bars", "beauty", "hotels", "garages",
      "detailing", "landscaping", "trades", "cleaning", "waste-clearance", "other-services",
    ]);
    expect(portfolioCategories.every((category) => category.concepts.length > 0)).toBe(true);
  });

  it("keeps every displayed concept tied to a managed image source and at least three coherent preview pages", () => {
    for (const category of portfolioCategories) {
      for (const concept of category.concepts) {
        expect(getBoardSrc(concept.board)).toMatch(/^\/manus-storage\/concept-board-/);
        expect(concept.pages).toHaveLength(3);
        expect(concept.pages.map((page) => page.label)).toEqual(expect.arrayContaining(["Home"]));
        expect(concept.source.familyId).toContain(category.id);
        expect(new Set(concept.pages.map((page) => page.focus)).size).toBe(3);
        expect(concept.pages.every((page) => page.focus.endsWith(`${concept.source.row}%`))).toBe(true);
      }
    }
  });

  it("keeps lower-volume categories transparent about their curated source coverage", () => {
    const lowerVolume = portfolioCategories.filter((category) => category.available < 6).map((category) => category.id);
    expect(lowerVolume).toEqual(["hotels", "detailing", "landscaping", "trades", "cleaning", "waste-clearance"]);
  });
});
