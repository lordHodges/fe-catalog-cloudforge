import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogStore } from './state/catalog.store';
import { CartService } from '../../core/cart.service';
import { Product } from './domain/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  template: `
    <div class="container py-4 py-md-5">
      <!-- Hero Header Banner -->
      <div class="hero-banner mb-5 p-4 p-md-5 rounded-4 border border-purple-glow text-center position-relative overflow-hidden shadow-lg">
        <div class="hero-glow"></div>
        <h1 class="display-4 fw-bold text-neon-cyan mb-3">
          <i class="bi bi-cloud-check-fill me-2 brand-icon"></i>CloudForge Marketplace
        </h1>
        <p class="lead text-light-purple col-lg-8 mx-auto mb-0 fw-medium">
          Infraestructura cloud de alto rendimiento, microservicios empresariales y soluciones serverless lista para desplegar.
        </p>
      </div>

      <!-- Search & Filter Controls -->
      <div class="row g-3 align-items-center mb-4">
        <div class="col-md-6 col-lg-7">
          <div class="input-group">
            <span class="input-group-text bg-purple-dark text-cyan border-purple-glow px-3">
              <i class="bi bi-search fs-5"></i>
            </span>
            <input
              type="text"
              class="form-control bg-purple-dark text-light border-purple-glow search-input py-2"
              placeholder="Buscar productos cloud..."
              [value]="catalogStore.searchQuery()"
              (input)="onSearchInput($event)"
              aria-label="Buscar productos"
            />
          </div>
        </div>

        <div class="col-md-6 col-lg-5 d-flex gap-2 align-items-center">
          <label class="text-secondary fw-semibold mb-0 me-1 d-none d-sm-inline">Categoría:</label>
          <select
            class="form-select bg-purple-dark text-light border-purple-glow py-2"
            data-testid="category-filter"
            name="category"
            [value]="catalogStore.selectedCategory()"
            (change)="onCategorySelect($event)"
          >
            @for (cat of catalogStore.categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="d-flex flex-wrap gap-2 mb-4 category-pills">
        @for (cat of catalogStore.categories(); track cat) {
          <button
            type="button"
            class="btn btn-sm rounded-pill transition-all px-3 py-2 fw-semibold"
            [class.btn-neon-cyan]="catalogStore.selectedCategory() === cat"
            [class.btn-outline-purple]="catalogStore.selectedCategory() !== cat"
            (click)="catalogStore.setSelectedCategory(cat)"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Product Cards Grid -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        @for (product of catalogStore.filteredProducts(); track product.id) {
          <div class="col">
            <div class="card h-100 product-card glass-card border-purple-glow" data-testid="product-card">
              <div class="card-img-wrapper position-relative overflow-hidden rounded-top">
                <img
                  [src]="product.imageUrl"
                  [alt]="product.name"
                  class="card-img-top product-img"
                  (error)="handleImageError($event)"
                />
                <span class="position-absolute top-0 end-0 m-3 badge badge-category rounded-pill">
                  {{ product.category }}
                </span>
              </div>

              <div class="card-body d-flex flex-column p-4">
                <h5 class="card-title product-title text-light fw-bold mb-2" data-testid="product-name">
                  <span data-testid="product-title">{{ product.title }}</span>
                </h5>
                
                <p class="card-text text-secondary small flex-grow-1 line-clamp-3">
                  {{ product.description }}
                </p>

                <div class="d-flex align-items-center justify-content-between my-3">
                  <div data-testid="product-price" class="product-price fs-4 fw-bold text-cyan">
                    \${{ product.price | number:'1.0-0' }} CLP
                  </div>
                  
                  <span
                    data-testid="product-stock"
                    class="stock-badge badge rounded-pill px-3 py-2"
                    [class.bg-success-glow]="product.stock > 0"
                    [class.bg-danger-glow]="product.stock === 0"
                  >
                    {{ product.stock > 0 ? ('Stock: ' + product.stock) : 'Agotado' }}
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="add-to-cart-btn"
                  class="btn w-100 py-2 fw-semibold rounded-3 transition-all"
                  [class.btn-neon-cyan]="product.stock > 0"
                  [class.btn-secondary-disabled]="product.stock === 0"
                  [disabled]="product.stock === 0"
                  (click)="addToCart(product)"
                >
                  <i class="bi bi-cart-plus me-2"></i>
                  {{ product.stock === 0 ? 'Agotado' : 'Agregar' }}
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center py-5">
            <div class="glass-card p-5 rounded-4 border-purple-glow">
              <i class="bi bi-search fs-1 text-cyan mb-3 d-block brand-icon"></i>
              <h4 class="text-light fw-bold">No se encontraron productos</h4>
              <p class="text-secondary">Intenta ajustar tu búsqueda o filtro de categoría.</p>
              <button class="btn btn-outline-cyan mt-2 px-4 rounded-pill fw-semibold" (click)="resetFilters()">
                Restablecer filtros
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .hero-banner {
      background: linear-gradient(135deg, rgba(26, 12, 54, 0.95) 0%, rgba(13, 11, 24, 0.95) 100%);
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(157, 78, 221, 0.25);
    }
    .hero-glow {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      height: 200%;
      background: radial-gradient(circle, rgba(0, 229, 255, 0.18) 0%, rgba(157, 78, 221, 0.08) 50%, transparent 80%);
      pointer-events: none;
    }
    .brand-icon {
      filter: drop-shadow(0 0 8px #00e5ff);
    }
    .text-neon-cyan {
      color: #00e5ff;
      text-shadow: 0 0 16px rgba(0, 229, 255, 0.6);
    }
    .text-light-purple {
      color: #d1c4e9;
    }
    .bg-purple-dark {
      background-color: rgba(22, 11, 46, 0.85) !important;
    }
    .border-purple-glow {
      border: 1px solid rgba(157, 78, 221, 0.35) !important;
    }
    .search-input:focus, .form-select:focus {
      border-color: #00e5ff !important;
      box-shadow: 0 0 16px rgba(0, 229, 255, 0.4) !important;
    }
    .glass-card {
      background: rgba(22, 11, 46, 0.78);
      backdrop-filter: blur(16px);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-6px);
      border-color: #00e5ff !important;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 229, 255, 0.3);
    }
    .card-img-wrapper {
      height: 210px;
      background: linear-gradient(180deg, #130a27 0%, #0d0b18 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(157, 78, 221, 0.2);
    }
    .product-img {
      max-height: 180px;
      object-fit: contain;
      padding: 1.25rem;
      transition: transform 0.3s ease;
    }
    .product-card:hover .product-img {
      transform: scale(1.05);
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
    .btn-secondary-disabled {
      background: #2d2645;
      color: #7b7f96;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: none;
    }
    .btn-outline-purple {
      border: 1px solid rgba(157, 78, 221, 0.5);
      color: #d1c4e9;
      background: rgba(157, 78, 221, 0.12);
    }
    .btn-outline-purple:hover {
      background: rgba(157, 78, 221, 0.35);
      color: #ffffff;
      border-color: #9d4edd;
      box-shadow: 0 0 12px rgba(157, 78, 221, 0.4);
    }
    .btn-outline-cyan {
      border: 1px solid #00e5ff;
      color: #00e5ff;
      background: transparent;
      transition: all 0.25s ease;
    }
    .btn-outline-cyan:hover {
      background: #00e5ff;
      color: #0d0b18;
      box-shadow: 0 0 16px rgba(0, 229, 255, 0.6);
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
    .text-cyan {
      color: #00e5ff;
    }
    .transition-all {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CatalogComponent {
  catalogStore = inject(CatalogStore);
  cartService = inject(CartService);

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.catalogStore.setSearchQuery(value);
  }

  onCategorySelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.catalogStore.setSelectedCategory(value);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product, 1);
  }

  resetFilters(): void {
    this.catalogStore.setSearchQuery('');
    this.catalogStore.setSelectedCategory('Todas');
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231a0c36"/><path d="M60,130 L100,70 L140,130 Z" fill="%236f42c1"/><circle cx="130" cy="70" r="15" fill="%2300e5ff"/><text x="100" y="165" font-family="sans-serif" font-size="14" fill="%2300e5ff" text-anchor="middle">CloudForge Service</text></svg>';
  }
}
