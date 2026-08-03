import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CatalogRepository } from "../../domain/catalog.repository";
import { Product } from "../../domain/product.model";
import { CartService } from "../../../../core/cart.service";
import { SeoService } from "../../../../core/services/seo.service";
import { AnalyticsService } from "../../../../core/services/analytics.service";

@Component({
  selector: "app-product-detail",
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule, FormsModule],
  template: `
    <div class="container py-4 py-md-5">
      <!-- Back Link -->
      <a
        routerLink="/catalog"
        class="btn-back text-cyan text-decoration-none d-inline-flex align-items-center mb-4 transition-all"
        data-testid="back-to-catalog"
      >
        <i class="bi bi-arrow-left fs-5 me-2"></i>
        <span class="fw-semibold">Volver al catálogo</span>
      </a>

      <!-- Loading State -->
      @if (loading()) {
        <div class="text-center py-5" data-testid="loading-state">
          <div class="spinner-border text-cyan mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-secondary lead">Cargando detalles del producto...</p>
        </div>
      }

      <!-- Not Found State -->
      @if (!loading() && !product()) {
        <div class="glass-card text-center p-5 rounded-4 border-purple-glow" data-testid="not-found-state">
          <i class="bi bi-exclamation-triangle fs-1 text-danger mb-3 d-block"></i>
          <h3 class="text-light fw-bold">Producto no encontrado</h3>
          <p class="text-secondary max-width-md mx-auto mb-4">
            Lo sentimos, el producto que estás buscando no existe o ha sido retirado.
          </p>
          <a routerLink="/catalog" class="btn btn-outline-cyan px-4 rounded-pill fw-semibold">
            Volver al catálogo
          </a>
        </div>
      }

      <!-- Product Content -->
      @if (!loading() && product(); as p) {
        <div class="row g-5" data-testid="product-detail-content">
          <!-- Product Image Column -->
          <div class="col-lg-6">
            <div class="product-gallery glass-card rounded-4 border-purple-glow p-4 d-flex align-items-center justify-content-center position-relative overflow-hidden">
              <div class="hero-glow"></div>
              <img
                [src]="p.imageUrl"
                [alt]="p.name"
                class="img-fluid product-img"
                (error)="handleImageError($event)"
                data-testid="product-image"
              />
            </div>
          </div>

          <!-- Product Details Column -->
          <div class="col-lg-6">
            <div class="product-info-panel h-100 d-flex flex-column justify-content-between">
              <div>
                <!-- Category Badge -->
                <span class="badge badge-category rounded-pill px-3 py-2 mb-3" data-testid="product-category">
                  {{ p.category }}
                </span>

                <!-- Title -->
                <h1 class="display-5 text-neon-cyan fw-bold mb-3" data-testid="product-name">
                  {{ p.title }}
                </h1>

                <!-- ID / Info -->
                <p class="text-secondary small mb-4">
                  ID: <span class="text-light-purple">{{ p.id }}</span>
                </p>

                <!-- Description -->
                <h5 class="text-light fw-semibold mb-2">Descripción del Servicio</h5>
                <p class="text-secondary lead fs-6 mb-4 lh-lg" data-testid="product-description">
                  {{ p.description }}
                </p>
              </div>

              <div class="purchase-section glass-card p-4 rounded-4 border-purple-glow mt-4">
                <!-- Price and Stock -->
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <span class="text-secondary small d-block mb-1">Precio</span>
                    <span class="fs-2 fw-bold text-cyan" data-testid="product-price">
                      \${{ p.price | number: "1.0-0" }} CLP
                    </span>
                  </div>

                  <div>
                    <span class="text-secondary small d-block mb-1 text-end">Disponibilidad</span>
                    <span
                      class="stock-badge badge rounded-pill px-3 py-2"
                      [class.bg-success-glow]="p.stock > 0"
                      [class.bg-danger-glow]="p.stock === 0"
                      data-testid="product-stock"
                    >
                      {{ p.stock > 0 ? "Stock: " + p.stock : "Agotado" }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                @if (p.stock > 0) {
                  <div class="d-flex flex-column gap-3">
                    <!-- Quantity Selector -->
                    <div class="d-flex align-items-center justify-content-between bg-purple-dark border-purple-glow rounded-3 p-2">
                      <span class="text-light fw-medium ps-2">Cantidad</span>
                      <div class="d-flex align-items-center gap-3">
                        <button
                          type="button"
                          class="btn btn-outline-cyan btn-sm rounded-circle d-flex align-items-center justify-content-center p-0"
                          style="width: 32px; height: 32px;"
                          [disabled]="quantity() <= 1"
                          (click)="decrementQuantity()"
                          data-testid="decrement-qty-btn"
                        >
                          <i class="bi bi-dash fs-5"></i>
                        </button>
                        <span class="text-light fw-bold fs-5 px-1" data-testid="quantity-value">{{ quantity() }}</span>
                        <button
                          type="button"
                          class="btn btn-outline-cyan btn-sm rounded-circle d-flex align-items-center justify-content-center p-0"
                          style="width: 32px; height: 32px;"
                          [disabled]="quantity() >= p.stock"
                          (click)="incrementQuantity(p.stock)"
                          data-testid="increment-qty-btn"
                        >
                          <i class="bi bi-plus fs-5"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Add to Cart Button -->
                    <button
                      type="button"
                      class="btn btn-neon-cyan py-3 fw-bold rounded-3 transition-all d-flex align-items-center justify-content-center gap-2"
                      (click)="addToCart(p)"
                      data-testid="add-to-cart-btn"
                    >
                      <i class="bi bi-cart-plus fs-5"></i>
                      <span>Agregar al Carrito</span>
                    </button>
                  </div>
                } @else {
                  <button
                    type="button"
                    class="btn btn-secondary-disabled w-100 py-3 fw-bold rounded-3"
                    disabled
                  >
                    <i class="bi bi-dash-circle me-2"></i>
                    Agotado Temporalmente
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .btn-back {
        background: transparent;
        border: none;
      }
      .btn-back:hover {
        color: #33ebff !important;
        transform: translateX(-4px);
      }
      .text-neon-cyan {
        color: #00e5ff;
        text-shadow: 0 0 16px rgba(0, 229, 255, 0.5);
      }
      .text-light-purple {
        color: #d1c4e9;
      }
      .text-cyan {
        color: #00e5ff;
      }
      .bg-purple-dark {
        background-color: rgba(22, 11, 46, 0.85) !important;
      }
      .border-purple-glow {
        border: 1px solid rgba(157, 78, 221, 0.35) !important;
      }
      .glass-card {
        background: rgba(22, 11, 46, 0.78);
        backdrop-filter: blur(16px);
      }
      .product-gallery {
        height: 450px;
        background: linear-gradient(180deg, #130a27 0%, #0d0b18 100%);
      }
      .hero-glow {
        position: absolute;
        width: 150%;
        height: 150%;
        background: radial-gradient(
          circle,
          rgba(0, 229, 255, 0.15) 0%,
          rgba(157, 78, 221, 0.05) 50%,
          transparent 80%
        );
        pointer-events: none;
      }
      .product-img {
        max-height: 380px;
        object-fit: contain;
        z-index: 1;
        transition: transform 0.5s ease;
      }
      .product-gallery:hover .product-img {
        transform: scale(1.03);
      }
      .badge-category {
        background: rgba(157, 78, 221, 0.85);
        color: #ffffff;
        backdrop-filter: blur(8px);
        box-shadow: 0 0 10px rgba(157, 78, 221, 0.6);
        font-weight: 600;
      }
      .btn-neon-cyan {
        background: #00e5ff;
        color: #0d0b18;
        border: none;
        box-shadow: 0 0 14px rgba(0, 229, 255, 0.5);
      }
      .btn-neon-cyan:hover {
        background: #33ebff;
        color: #0d0b18;
        box-shadow: 0 0 22px rgba(0, 229, 255, 0.85);
      }
      .btn-outline-cyan {
        border: 1px solid #00e5ff;
        color: #00e5ff;
        background: transparent;
        transition: all 0.25s ease;
      }
      .btn-outline-cyan:hover:not(:disabled) {
        background: #00e5ff;
        color: #0d0b18;
        box-shadow: 0 0 16px rgba(0, 229, 255, 0.6);
      }
      .btn-outline-cyan:disabled {
        border-color: rgba(0, 229, 255, 0.2);
        color: rgba(0, 229, 255, 0.2);
        cursor: not-allowed;
      }
      .btn-secondary-disabled {
        background: #2d2645;
        color: #7b7f96;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }
      .bg-success-glow {
        background: rgba(25, 135, 84, 0.25);
        color: #2ecc71;
        border: 1px solid rgba(46, 204, 113, 0.5);
        box-shadow: 0 0 8px rgba(46, 204, 113, 0.25);
      }
      .bg-danger-glow {
        background: rgba(220, 53, 69, 0.25);
        color: #ff6b6b;
        border: 1px solid rgba(255, 107, 107, 0.5);
        box-shadow: 0 0 8px rgba(255, 107, 107, 0.25);
      }
      .transition-all {
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .max-width-md {
        max-width: 500px;
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogRepo = inject(CatalogRepository);
  private cartService = inject(CartService);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);

  product = signal<Product | undefined>(undefined);
  loading = signal<boolean>(true);
  quantity = signal<number>(1);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.loadProduct(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.catalogRepo.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.quantity.set(1);
        this.loading.set(false);
        if (prod) {
          this.seoService.updateSeo({
            title: prod.title,
            description: prod.description,
            image: prod.imageUrl,
          });
          this.analyticsService.trackPageView(`/product/${prod.id}`);
        }
      },
      error: () => {
        this.product.set(undefined);
        this.loading.set(false);
      },
    });
  }

  incrementQuantity(maxStock: number): void {
    if (this.quantity() < maxStock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(prod: Product): void {
    this.cartService.addItem(prod, this.quantity());
    this.analyticsService.trackEvent('add_to_cart', { product_id: prod.id, product_name: prod.title, quantity: this.quantity() });
    this.cartService.openCart();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231a0c36"/><path d="M90,195 L150,105 L210,195 Z" fill="%236f42c1"/><circle cx="195" cy="105" r="22" fill="%2300e5ff"/><text x="150" y="247" font-family="sans-serif" font-size="20" fill="%2300e5ff" text-anchor="middle">CloudForge Service</text></svg>';
  }
}
