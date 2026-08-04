import { TestBed } from "@angular/core/testing";
import { CatalogStore } from "./catalog.store";
import { CatalogRepository } from "../domain/catalog.repository";
import { MockCatalogRepository } from "../data/mock-catalog.repository";

describe("CatalogStore", () => {
  let store: CatalogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatalogStore,
        { provide: CatalogRepository, useClass: MockCatalogRepository },
      ],
    });
    store = TestBed.inject(CatalogStore);
  });

  it("should be created and load products", () => {
    expect(store).toBeTruthy();
    expect(store.products().length).toBeGreaterThan(0);
    expect(store.selectedCategory()).toBe("Todas");
    expect(store.searchQuery()).toBe("");
  });

  it("should compute categories correctly", () => {
    const categories = store.categories();
    expect(categories[0]).toBe("Todas");
    expect(categories).toContain("Infrastructure");
  });

  it("should filter products by category", () => {
    store.setSelectedCategory("Databases");
    const filtered = store.filteredProducts();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => p.category === "Databases")).toBe(true);
  });

  it("should filter products by search query", () => {
    store.setSearchQuery("Prueba");
    const filtered = store.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("prod-test-01");
  });

  it("should filter products by category and search query combined", () => {
    store.setSelectedCategory("Infrastructure");
    store.setSearchQuery("Kubernetes");
    const filtered = store.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toContain("Kubernetes");
  });

  describe("Tier 5 Adversarial Edge Cases", () => {
    it("TC-ADV-CAT-01: should execute search safely with regex special characters and symbols", () => {
      store.setSearchQuery(".*+?^${}()|[\\]\\\\ <script>");
      const filtered = store.filteredProducts();
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });

    it("TC-ADV-CAT-02: should trim search query and match products correctly", () => {
      store.setSearchQuery("   Kubernetes   ");
      const filtered = store.filteredProducts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toContain("Kubernetes");
    });

    it("TC-ADV-CAT-03: should handle non-matching category selection cleanly", () => {
      store.setSelectedCategory("NonExistentCategory99");
      const filtered = store.filteredProducts();
      expect(filtered.length).toBe(0);
    });
  });

  describe("Pagination Functionality", () => {
    it("should initialize with default pagination state", () => {
      expect(store.page()).toBe(1);
      expect(store.limit()).toBe(6);
      expect(store.totalPages()).toBeGreaterThan(0);
      expect(store.pages().length).toBe(store.totalPages());
    });

    it("should calculate paginatedProducts correctly based on limit", () => {
      store.limit.set(3);
      expect(store.paginatedProducts().length).toBe(3);
      expect(store.totalPages()).toBe(2); // 6 products / 3 limit = 2 pages
    });

    it("should navigate pages correctly using nextPage and prevPage", () => {
      store.limit.set(3);
      expect(store.page()).toBe(1);

      store.nextPage();
      expect(store.page()).toBe(2);

      // Attempt to go beyond total pages (clamped)
      store.nextPage();
      expect(store.page()).toBe(2);

      store.prevPage();
      expect(store.page()).toBe(1);

      // Attempt to go below 1 (clamped)
      store.prevPage();
      expect(store.page()).toBe(1);
    });

    it("should reset page to 1 when category filter changes", () => {
      store.limit.set(2);
      store.setPage(2);
      expect(store.page()).toBe(2);

      store.setSelectedCategory("Infrastructure");
      expect(store.page()).toBe(1);
    });

    it("should reset page to 1 when search query changes", () => {
      store.limit.set(2);
      store.setPage(2);
      expect(store.page()).toBe(2);

      store.setSearchQuery("Postgres");
      expect(store.page()).toBe(1);
    });
  });
});
