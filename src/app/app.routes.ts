import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "catalog", pathMatch: "full" },
  {
    path: "catalog",
    loadComponent: () =>
      import("./features/catalog/catalog.component").then(
        (m) => m.CatalogComponent,
      ),
  },
  {
    path: "checkout",
    loadComponent: () =>
      import("./features/checkout/checkout.component").then(
        (m) => m.CheckoutComponent,
      ),
  },
  { path: "**", redirectTo: "catalog" },
];
