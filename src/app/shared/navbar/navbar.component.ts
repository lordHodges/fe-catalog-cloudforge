import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header data-testid="header" class="sticky-top">
      <nav class="navbar navbar-expand-lg navbar-dark bg-purple-dark py-3">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-light fs-4" routerLink="/">
            <i class="bi bi-cloud-lightning-fill text-cyan fs-3 brand-icon"></i>
            <span class="brand-text">CloudForge Marketplace</span>
          </a>

          <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-menu navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
              <li class="nav-item">
                <a
                  class="nav-link px-3 py-2 rounded-3 text-light"
                  routerLink="/catalog"
                  routerLinkActive="active"
                >
                  Catálogo
                </a>
              </li>
            </ul>

            <div class="d-flex align-items-center gap-3">
              <button
                type="button"
                data-testid="cart-toggle-btn"
                (click)="cartService.toggleCart()"
                class="btn btn-outline-cyan position-relative d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold"
              >
                <i class="bi bi-cart3 fs-5"></i>
                <span>Carrito</span>
                @if (cartService.totalItemsCount() > 0) {
                  <span data-testid="cart-count-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-neon">
                    {{ cartService.totalItemsCount() }}
                  </span>
                }
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    nav {
      background: rgba(13, 11, 24, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(157, 78, 221, 0.35) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .brand-icon {
      filter: drop-shadow(0 0 8px #00e5ff);
    }
    .brand-text {
      background: linear-gradient(135deg, #ffffff 0%, #00e5ff 60%, #9d4edd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }
    .text-cyan {
      color: #00e5ff;
    }
    .btn-outline-cyan {
      border: 1px solid #00e5ff;
      color: #00e5ff;
      background: rgba(0, 229, 255, 0.04);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-outline-cyan:hover {
      background: #00e5ff;
      color: #0d0b18;
      box-shadow: 0 0 18px rgba(0, 229, 255, 0.6);
      transform: translateY(-1px);
    }
    .badge-neon {
      background: #ff007f;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(255, 0, 127, 0.7);
    }
    .nav-link {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-link.active {
      color: #00e5ff !important;
      font-weight: 600;
      background: rgba(0, 229, 255, 0.12);
      border: 1px solid rgba(0, 229, 255, 0.25);
    }
  `]
})
export class NavbarComponent {
  cartService = inject(CartService);
}
