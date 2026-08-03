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
  readonly page = signal<number>(1);
  readonly limit = signal<number>(6);

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

  readonly totalItems = computed(() => this.filteredProducts().length);
  
  readonly totalPages = computed(() => {
    const total = this.totalItems();
    const limitSize = this.limit();
    return Math.ceil(total / limitSize);
  });

  readonly pages = computed(() => {
    const count = this.totalPages();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const currentPage = this.page();
    const limitSize = this.limit();
    const start = (currentPage - 1) * limitSize;
    return filtered.slice(start, start + limitSize);
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
    this.page.set(1);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
    this.page.set(1);
  }

  setPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.page.set(pageNumber);
    }
  }

  nextPage(): void {
    const current = this.page();
    if (current < this.totalPages()) {
      this.page.set(current + 1);
    }
  }

  prevPage(): void {
    const current = this.page();
    if (current > 1) {
      this.page.set(current - 1);
    }
  }
}
