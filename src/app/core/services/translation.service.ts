import { Injectable, signal } from "@angular/core";

export type SupportedLanguage = "es" | "en";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  es: {
    "CATALOG.HERO_TITLE": "CloudForge Marketplace",
    "CATALOG.HERO_DESC":
      "Infraestructura cloud de alto rendimiento, microservicios empresariales y soluciones serverless lista para desplegar.",
    "CATALOG.SEARCH_PLACEHOLDER": "Buscar productos cloud...",
    "CATALOG.SEARCH_LABEL": "Buscar productos",
    "CATALOG.CATEGORY_LABEL": "Categoría:",
    "CATALOG.STOCK_AVAILABLE": "Stock: ",
    "CATALOG.STOCK_OUT": "Agotado",
    "CATALOG.BTN_ADD": "Agregar",
    "CATALOG.NO_PRODUCTS_TITLE": "No se encontraron productos",
    "CATALOG.NO_PRODUCTS_DESC":
      "Intenta ajustar tu búsqueda o filtro de categoría.",
    "CATALOG.RESET_FILTERS": "Restablecer filtros",
    "CATALOG.CURRENCY_CLP": "CLP",
    "PAGINATION.PREV": "Anterior",
    "PAGINATION.NEXT": "Siguiente",
    "PAGINATION.ARIA_LABEL": "Paginación de catálogo",
    "PAGINATION.GOTO_PAGE": "Ir a la página ",

    // Navbar
    "NAV.BRAND": "CloudForge",
    "NAV.CATALOG": "Catálogo",
    "NAV.CART": "Carrito",
    "NAV.CHECKOUT": "Checkout",

    // Cart Drawer
    "CART.TITLE": "Tu Carrito Cloud",
    "CART.EMPTY": "Tu carrito está vacío.",
    "CART.EMPTY_DESC":
      "¡Explora el catálogo y añade soluciones cloud de alto rendimiento!",
    "CART.GO_CATALOG": "Ir al Catálogo",
    "CART.SUBTOTAL": "Subtotal:",
    "CART.TOTAL": "Total:",
    "CART.PROCEED": "Proceder al Pago",
    "CART.BTN_REMOVE": "Eliminar",
  },
  en: {
    "CATALOG.HERO_TITLE": "CloudForge Marketplace",
    "CATALOG.HERO_DESC":
      "High-performance cloud infrastructure, enterprise microservices, and serverless solutions ready to deploy.",
    "CATALOG.SEARCH_PLACEHOLDER": "Search cloud products...",
    "CATALOG.SEARCH_LABEL": "Search products",
    "CATALOG.CATEGORY_LABEL": "Category:",
    "CATALOG.STOCK_AVAILABLE": "Stock: ",
    "CATALOG.STOCK_OUT": "Out of stock",
    "CATALOG.BTN_ADD": "Add",
    "CATALOG.NO_PRODUCTS_TITLE": "No products found",
    "CATALOG.NO_PRODUCTS_DESC": "Try adjusting your search or category filter.",
    "CATALOG.RESET_FILTERS": "Reset filters",
    "CATALOG.CURRENCY_CLP": "CLP",
    "PAGINATION.PREV": "Previous",
    "PAGINATION.NEXT": "Next",
    "PAGINATION.ARIA_LABEL": "Catalog pagination",
    "PAGINATION.GOTO_PAGE": "Go to page ",

    // Navbar
    "NAV.BRAND": "CloudForge",
    "NAV.CATALOG": "Catalog",
    "NAV.CART": "Cart",
    "NAV.CHECKOUT": "Checkout",

    // Cart Drawer
    "CART.TITLE": "Your Cloud Cart",
    "CART.EMPTY": "Your cart is empty.",
    "CART.EMPTY_DESC":
      "Explore the catalog and add high-performance cloud solutions!",
    "CART.GO_CATALOG": "Go to Catalog",
    "CART.SUBTOTAL": "Subtotal:",
    "CART.TOTAL": "Total:",
    "CART.PROCEED": "Proceed to Checkout",
    "CART.BTN_REMOVE": "Remove",
  },
};

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  private currentLang = signal<SupportedLanguage>("es");

  setLanguage(lang: SupportedLanguage) {
    this.currentLang.set(lang);
  }

  getLanguage(): SupportedLanguage {
    return this.currentLang();
  }

  getLanguageSignal() {
    return this.currentLang;
  }

  translate(key: string): string {
    const lang = this.currentLang();
    return translations[lang][key] || key;
  }
}
