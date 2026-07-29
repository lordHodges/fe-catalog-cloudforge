import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { MockCatalogRepository } from "./mock-catalog.repository";

describe("MockCatalogRepository", () => {
  let repository: MockCatalogRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockCatalogRepository],
    });
    repository = TestBed.inject(MockCatalogRepository);
  });

  it("should be created", () => {
    expect(repository).toBeTruthy();
  });

  it("should return mock products including prod-test-01", async () => {
    const products = await firstValueFrom(repository.getProducts());
    expect(products.length).toBeGreaterThanOrEqual(5);
    const testProduct = products.find((p) => p.id === "prod-test-01");
    expect(testProduct).toBeDefined();
    expect(testProduct?.title).toBe("Producto de Prueba Cloudforge");
    expect(testProduct?.price).toBe(15000);
    expect(testProduct?.stock).toBe(50);
    expect(testProduct?.category).toBe("Infrastructure");
  });

  it("should fetch product by id", async () => {
    const product = await firstValueFrom(
      repository.getProductById("prod-test-01"),
    );
    expect(product).toBeDefined();
    expect(product?.id).toBe("prod-test-01");
  });

  it("should return undefined for non-existent product id", async () => {
    const product = await firstValueFrom(
      repository.getProductById("non-existent-id"),
    );
    expect(product).toBeUndefined();
  });

  it('should return unique categories starting with "Todas"', async () => {
    const categories = await firstValueFrom(repository.getCategories());
    expect(categories[0]).toBe("Todas");
    expect(categories).toContain("Infrastructure");
    expect(categories).toContain("Databases");
  });
});
