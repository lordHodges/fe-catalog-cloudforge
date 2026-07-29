import { Injectable, signal, computed, inject } from "@angular/core";
import { Product } from "../domain/product.model";
import { CatalogRepository } from "../domain/catalog.repository";

@Injectable({
  providedIn: "root",
})
export class CatalogStore {
  private repository = inject(CatalogRepository);

  readonly products = signal<Product[]>([]);
  readonly selectedCategory = signal<string>("Todas");
  readonly searchQuery = signal<string>("");

  readonly categories = computed(() => {
    const list = this.products().map((p) => p.category);
    const unique = Array.from(new Set(list));
    return ["Todas", ...unique];
  });

  readonly filteredProducts = computed(() => {
    const all = this.products();
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    return all.filter((p) => {
      const matchesCategory =
        cat === "Todas" ||
        cat === "All" ||
        cat === "" ||
        p.category.toLowerCase() === cat.toLowerCase();

      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  });

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.repository.getProducts().subscribe((items) => {
      this.products.set(items);
    });
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }
}
