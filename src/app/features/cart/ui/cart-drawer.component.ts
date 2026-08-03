import { Component, inject } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { Router } from "@angular/router";
import { CartService } from "../../../core/cart.service";
import { TranslatePipe } from "../../../shared/pipes/translate.pipe";
import { AnalyticsService } from "../../../core/services/analytics.service";

@Component({
  selector: "app-cart-drawer",
  standalone: true,
  imports: [CommonModule, DecimalPipe, TranslatePipe],
  template: `
    @if (cartService.isOpen()) {
      <div class="cart-backdrop" (click)="cartService.closeCart()" role="presentation"></div>
      <div
        data-testid="cart-drawer"
        class="cart-drawer shadow-lg d-flex flex-column"
        tabIndex="-1"
        role="dialog"
        [attr.aria-label]="'CART.TITLE' | translate"
        aria-modal="true"
      >
        <!-- Header -->
        <div
          class="cart-header p-3 border-bottom border-purple-glow d-flex align-items-center justify-content-between"
        >
          <h5 class="m-0 text-light fw-bold d-flex align-items-center gap-2">
            <i class="bi bi-cart3 text-neon-cyan brand-icon" aria-hidden="true"></i>
            <span>{{ 'CART.TITLE' | translate }}</span>
          </h5>
          <button
            type="button"
            data-testid="cart-close-btn"
            class="btn-close btn-close-white"
            (click)="cartService.closeCart()"
            aria-label="Cerrar"
          ></button>
        </div>

        <!-- Body -->
        <div class="cart-body p-3 flex-grow-1 overflow-y-auto">
          @if (cartService.isEmpty()) {
            <div
              data-testid="empty-cart-message"
              class="empty-cart text-center py-5"
            >
              <i
                class="bi bi-cart-x text-cyan fs-1 mb-3 d-block brand-icon"
                aria-hidden="true"
              ></i>
              <p class="text-light-purple fs-5 mb-0 fw-medium">
                {{ 'CART.EMPTY' | translate }}
              </p>
            </div>
          } @else {
            <div class="cart-items-list d-flex flex-column gap-3">
              @for (item of cartService.cartItems(); track item.product.id) {
                <div
                  data-testid="cart-item"
                  class="cart-item glass-item p-3 rounded-3 border border-purple-glow d-flex align-items-center gap-3"
                >
                  <img
                    [src]="item.product.imageUrl"
                    [alt]="item.product.name"
                    class="cart-item-img rounded"
                    (error)="handleImageError($event)"
                  />

                  <div class="flex-grow-1 min-w-0">
                    <h6
                      data-testid="cart-item-title"
                      class="cart-item-title text-light fw-semibold mb-1 text-truncate"
                      [title]="item.product.title || item.product.name"
                    >
                      {{ item.product.title || item.product.name }}
                    </h6>
                    <div
                      data-testid="cart-item-price"
                      class="cart-item-price text-neon-cyan fw-bold"
                    >
                      \${{ item.product.price | number: "1.0-0" }}
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      data-testid="qty-decrement"
                      (click)="decrementQuantity(item.product.id)"
                      class="btn btn-sm btn-outline-cyan px-2 py-0 fw-bold rounded-2"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span
                      data-testid="item-quantity"
                      class="item-quantity px-2 text-light fw-bold fs-6"
                    >
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      data-testid="qty-increment"
                      [disabled]="item.quantity >= item.product.stock"
                      (click)="incrementQuantity(item.product.id)"
                      class="btn btn-sm btn-outline-cyan px-2 py-0 fw-bold rounded-2"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    data-testid="remove-item-btn"
                    (click)="removeItem(item.product.id)"
                    class="btn btn-sm btn-outline-danger p-1 border-0 rounded-2"
                    [attr.aria-label]="('CART.BTN_REMOVE' | translate) + ' ' + item.product.title"
                    [title]="'CART.BTN_REMOVE' | translate"
                  >
                    <i class="bi bi-trash fs-5" aria-hidden="true"></i>
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer -->
        <div
          class="cart-footer p-3 border-top border-purple-glow bg-dark-purple"
        >
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-light fw-semibold fs-5">{{ 'CART.TOTAL' | translate }}</span>
            <span
              data-testid="cart-total"
              class="cart-total fs-3 fw-bold text-neon-cyan"
            >
              \${{ cartService.totalAmount() | number: "1.0-0" }}
            </span>
          </div>

          <button
            type="button"
            data-testid="proceed-to-checkout-btn"
            [disabled]="cartService.isEmpty()"
            (click)="goToCheckout()"
            class="btn btn-neon-cyan w-100 fw-bold py-2 fs-5 text-uppercase rounded-3"
            role="button"
          >
            {{ 'CART.PROCEED' | translate }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes backdropFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes drawerSlideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .cart-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(10, 5, 24, 0.75);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 1040;
        animation: backdropFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      .cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 420px;
        max-width: 90vw;
        height: 100vh;
        background: rgba(22, 11, 46, 0.96);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-left: 1px solid rgba(157, 78, 221, 0.4);
        z-index: 1050;
        box-shadow:
          -10px 0 35px rgba(0, 0, 0, 0.6),
          0 0 25px rgba(0, 229, 255, 0.2);
        animation: drawerSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .bg-dark-purple {
        background: rgba(15, 7, 32, 0.95);
      }
      .border-purple-glow {
        border-color: rgba(157, 78, 221, 0.35) !important;
      }
      .brand-icon {
        filter: drop-shadow(0 0 6px #00e5ff);
      }
      .text-neon-cyan {
        color: #00e5ff;
        text-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
      }
      .text-light-purple {
        color: #d1c4e9;
      }
      .glass-item {
        background: rgba(28, 14, 58, 0.85);
        backdrop-filter: blur(10px);
        transition:
          border-color 0.25s ease,
          box-shadow 0.25s ease;
      }
      .glass-item:hover {
        border-color: rgba(0, 229, 255, 0.4) !important;
        box-shadow:
          0 4px 15px rgba(0, 0, 0, 0.4),
          0 0 12px rgba(0, 229, 255, 0.15);
      }
      .cart-item-img {
        width: 52px;
        height: 52px;
        object-fit: cover;
        background: #120724;
        border: 1px solid rgba(157, 78, 221, 0.3);
      }
      .btn-outline-cyan {
        border: 1px solid #00e5ff;
        color: #00e5ff;
        background: rgba(0, 229, 255, 0.06);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-outline-cyan:hover:not(:disabled) {
        background: #00e5ff;
        color: #0d0b18;
        box-shadow: 0 0 12px rgba(0, 229, 255, 0.7);
      }
      .btn-neon-cyan {
        background: #00e5ff;
        color: #0d0b18;
        border: none;
        box-shadow: 0 0 16px rgba(0, 229, 255, 0.5);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-neon-cyan:hover:not(:disabled) {
        background: #33ebff;
        color: #0d0b18;
        box-shadow: 0 0 24px rgba(0, 229, 255, 0.85);
        transform: translateY(-1px);
      }
      .btn-neon-cyan:disabled {
        background: #2d2645;
        color: #7b7f96;
        box-shadow: none;
      }
      .text-cyan {
        color: #00e5ff;
      }
    `,
  ],
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  incrementQuantity(productId: string | number): void {
    const item = this.cartService
      .cartItems()
      .find((i) => String(i.product.id) === String(productId));
    if (item && item.quantity < item.product.stock) {
      this.cartService.incrementQuantity(productId);
    }
  }

  decrementQuantity(productId: string | number): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: string | number): void {
    this.cartService.removeItem(productId);
  }

  goToCheckout(): void {
    this.analyticsService.trackEvent('begin_checkout', { value: this.cartService.totalAmount() });
    this.cartService.closeCart();
    this.router.navigate(["/checkout"]);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%231a0c36"/><text x="25" y="30" font-family="sans-serif" font-size="20" fill="%2300e5ff" text-anchor="middle">⚡</text></svg>';
  }
}
