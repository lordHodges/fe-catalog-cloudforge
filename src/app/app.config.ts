import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";
import { CatalogRepository } from "./features/catalog/domain/catalog.repository";
import { MockCatalogRepository } from "./features/catalog/data/mock-catalog.repository";
import { OrderRepository } from "./features/checkout/data/order.repository";
import { HttpOrderRepository } from "./features/checkout/data/http-order.repository";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: CatalogRepository, useClass: MockCatalogRepository },
    { provide: OrderRepository, useClass: HttpOrderRepository },
  ],
};
