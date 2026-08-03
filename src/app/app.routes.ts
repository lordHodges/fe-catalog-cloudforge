import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

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
    path: "product/:id",
    loadComponent: () =>
      import("./features/catalog/ui/product-detail/product-detail.component").then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: "checkout",
    loadComponent: () =>
      import("./features/checkout/checkout.component").then(
        (m) => m.CheckoutComponent,
      ),
  },
  {
    path: "orders",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/checkout/ui/order-history/order-history.component").then(
        (m) => m.OrderHistoryComponent,
      ),
  },
  { path: "**", redirectTo: "catalog" },
];
