import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from "./app.routes";
import { CatalogRepository } from "./features/catalog/domain/catalog.repository";
import { HttpCatalogRepository } from "./features/catalog/data/http-catalog.repository";
import { OrderRepository } from "./features/checkout/data/order.repository";
import { HttpOrderRepository } from "./features/checkout/data/http-order.repository";
import { authInterceptor } from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: CatalogRepository, useClass: HttpCatalogRepository },
    { provide: OrderRepository, useClass: HttpOrderRepository },
  ],
};
