import { Component, inject } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CheckoutStore } from "../state/checkout.store";
import { CartService } from "../../../core/cart.service";
import { CustomerInfo } from "../domain/order.model";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe],
  template: `
    <div class="container py-4 py-md-5">
      <!-- Breadcrumb / Back button -->
      <div class="mb-4">
        <a
          routerLink="/catalog"
          class="text-cyan text-decoration-none d-inline-flex align-items-center gap-2 fw-medium fs-6 hover-glow"
        >
          <i class="bi bi-arrow-left"></i> Volver al Catálogo
        </a>
      </div>

      <!-- Success Confirmation View -->
      @if (
        checkoutStore.orderConfirmation() ||
        checkoutStore.orderStatus() === "success"
      ) {
        <div
          data-testid="order-confirmation"
          class="glass-card p-4 p-md-5 text-center my-4 border-cyan-glow"
        >
          <div data-testid="order-success" class="order-success-content">
            <div
              class="success-icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle"
            >
              <i class="bi bi-check-circle-fill text-neon-cyan fs-1"></i>
            </div>
            <h2 class="text-light fw-bold mb-2">¡Gracias por tu compra!</h2>
            <p class="text-cyan fs-5 mb-4">
              Tu pedido ha sido procesado con éxito.
            </p>

            <div
              class="order-details-box glass-item p-4 rounded-3 text-start mx-auto mb-4"
              style="max-width: 500px;"
            >
              <div
                class="d-flex justify-content-between border-bottom border-purple-glow pb-2 mb-2"
              >
                <span class="text-secondary">ID de Orden:</span>
                <span class="text-neon-cyan fw-bold">{{
                  checkoutStore.orderConfirmation()?.orderId
                }}</span>
              </div>
              <div
                class="d-flex justify-content-between border-bottom border-purple-glow pb-2 mb-2"
              >
                <span class="text-secondary">Estado:</span>
                <span class="badge badge-neon text-uppercase">{{
                  checkoutStore.orderConfirmation()?.status || "Confirmada"
                }}</span>
              </div>
              <div class="d-flex justify-content-between pt-1">
                <span class="text-secondary">Monto Total:</span>
                <span class="text-light fw-bold fs-5"
                  >\${{
                    checkoutStore.orderConfirmation()?.totalAmount
                      | number: "1.0-0"
                  }}</span
                >
              </div>
            </div>

            <div
              class="d-flex flex-column flex-sm-row justify-content-center gap-3"
            >
              <a
                routerLink="/catalog"
                (click)="resetCheckout()"
                class="btn btn-neon-cyan px-4 py-2 fw-bold text-uppercase rounded-3"
              >
                Seguir Comprando
              </a>
            </div>
          </div>
        </div>
      } @else {
        <div class="row g-4">
          <!-- Checkout Form Column -->
          <div class="col-lg-7">
            <div class="glass-card p-4 p-md-5">
              <h3
                class="text-cyan fw-bold mb-4 d-flex align-items-center gap-2 fs-4"
              >
                <i class="bi bi-credit-card-2-front-fill"></i> Información del
                Cliente
              </h3>

              @if (checkoutStore.errorMessage()) {
                <div
                  class="alert alert-danger border-0 bg-danger-dark text-white rounded-3 mb-4 d-flex align-items-center gap-2"
                >
                  <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                  <span>{{ checkoutStore.errorMessage() }}</span>
                </div>
              }

              <form
                data-testid="checkout-form"
                (ngSubmit)="onSubmit(form)"
                #form="ngForm"
                [ngClass]="{ 'was-validated': formSubmitted }"
                novalidate
              >
                <div class="mb-3">
                  <label
                    for="customerName"
                    class="form-label text-light fw-medium"
                    >Nombre Completo *</label
                  >
                  <input
                    type="text"
                    id="customerName"
                    name="name"
                    data-testid="customer-name"
                    class="form-control glass-input text-light"
                    [ngClass]="{
                      'is-invalid':
                        nameCtrl.invalid && (nameCtrl.touched || formSubmitted),
                    }"
                    [(ngModel)]="customer.name"
                    #nameCtrl="ngModel"
                    required
                    placeholder="Ej. Alex Developer"
                  />
                  @if (
                    nameCtrl.invalid && (nameCtrl.touched || formSubmitted)
                  ) {
                    <div
                      class="invalid-feedback d-block text-danger mt-1"
                      style="display: block !important;"
                    >
                      El nombre es requerido.
                    </div>
                  }
                </div>

                <div class="mb-3">
                  <label
                    for="customerEmail"
                    class="form-label text-light fw-medium"
                    >Correo Electrónico *</label
                  >
                  <input
                    type="email"
                    id="customerEmail"
                    name="email"
                    data-testid="customer-email"
                    class="form-control glass-input text-light"
                    [ngClass]="{
                      'is-invalid':
                        emailCtrl.invalid &&
                        (emailCtrl.touched || formSubmitted),
                    }"
                    [(ngModel)]="customer.email"
                    #emailCtrl="ngModel"
                    required
                    email
                    placeholder="alex@example.com"
                  />
                  @if (
                    emailCtrl.invalid && (emailCtrl.touched || formSubmitted)
                  ) {
                    <div
                      data-testid="email-error"
                      class="invalid-feedback d-block email-error text-danger mt-1"
                      style="display: block !important;"
                    >
                      Ingresa un correo electrónico válido.
                    </div>
                  }
                </div>

                <div class="mb-3">
                  <label
                    for="customerAddress"
                    class="form-label text-light fw-medium"
                    >Dirección de Envío *</label
                  >
                  <input
                    type="text"
                    id="customerAddress"
                    name="address"
                    data-testid="customer-address"
                    class="form-control glass-input text-light"
                    [ngClass]="{
                      'is-invalid':
                        addressCtrl.invalid &&
                        (addressCtrl.touched || formSubmitted),
                    }"
                    [(ngModel)]="customer.address"
                    #addressCtrl="ngModel"
                    required
                    placeholder="Av. Principal 123"
                  />
                  @if (
                    addressCtrl.invalid &&
                    (addressCtrl.touched || formSubmitted)
                  ) {
                    <div
                      class="invalid-feedback d-block text-danger mt-1"
                      style="display: block !important;"
                    >
                      La dirección es requerida.
                    </div>
                  }
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label
                      for="customerCity"
                      class="form-label text-light fw-medium"
                      >Ciudad *</label
                    >
                    <input
                      type="text"
                      id="customerCity"
                      name="city"
                      data-testid="customer-city"
                      class="form-control glass-input text-light"
                      [ngClass]="{
                        'is-invalid':
                          cityCtrl.invalid &&
                          (cityCtrl.touched || formSubmitted),
                      }"
                      [(ngModel)]="customer.city"
                      #cityCtrl="ngModel"
                      required
                      placeholder="Tech City"
                    />
                    @if (
                      cityCtrl.invalid && (cityCtrl.touched || formSubmitted)
                    ) {
                      <div
                        class="invalid-feedback d-block text-danger mt-1"
                        style="display: block !important;"
                      >
                        La ciudad es requerida.
                      </div>
                    }
                  </div>

                  <div class="col-md-6">
                    <label
                      for="customerZip"
                      class="form-label text-light fw-medium"
                      >Código Postal *</label
                    >
                    <input
                      type="text"
                      id="customerZip"
                      name="zipCode"
                      data-testid="customer-zip"
                      class="form-control glass-input text-light"
                      [ngClass]="{
                        'is-invalid':
                          zipCtrl.invalid && (zipCtrl.touched || formSubmitted),
                      }"
                      [(ngModel)]="customer.zipCode"
                      #zipCtrl="ngModel"
                      required
                      placeholder="90210"
                    />
                    @if (
                      zipCtrl.invalid && (zipCtrl.touched || formSubmitted)
                    ) {
                      <div
                        class="invalid-feedback d-block text-danger mt-1"
                        style="display: block !important;"
                      >
                        El código postal es requerido.
                      </div>
                    }
                  </div>
                </div>

                <button
                  type="submit"
                  data-testid="submit-order-btn"
                  [disabled]="checkoutStore.isSubmitting()"
                  class="btn btn-neon-cyan w-100 py-3 fw-bold fs-5 text-uppercase rounded-3 d-flex align-items-center justify-content-center gap-2"
                >
                  @if (checkoutStore.isSubmitting()) {
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Procesando...</span>
                  } @else {
                    <i class="bi bi-shield-lock-fill"></i>
                    <span>Realizar Pedido</span>
                  }
                </button>
              </form>
            </div>
          </div>

          <!-- Order Summary Column -->
          <div class="col-lg-5">
            <div class="glass-card p-4 p-md-5">
              <h3
                class="text-cyan fw-bold mb-4 d-flex align-items-center gap-2 fs-4"
              >
                <i class="bi bi-bag-check-fill"></i> Resumen del Pedido
              </h3>

              @if (cartService.isEmpty()) {
                <div class="text-center py-4">
                  <p class="text-secondary mb-3">
                    No tienes productos en tu carrito.
                  </p>
                  <a routerLink="/catalog" class="btn btn-outline-cyan btn-sm"
                    >Ver Catálogo</a
                  >
                </div>
              } @else {
                <div
                  class="order-items-list mb-4 overflow-y-auto pe-1"
                  style="max-height: 320px;"
                >
                  @for (
                    item of cartService.cartItems();
                    track item.product.id
                  ) {
                    <div
                      class="d-flex align-items-center gap-3 py-2 border-bottom border-purple-glow"
                    >
                      <img
                        [src]="item.product.imageUrl"
                        [alt]="item.product.name"
                        class="rounded border border-purple-glow"
                        style="width: 48px; height: 48px; object-fit: cover;"
                      />
                      <div class="flex-grow-1 min-w-0">
                        <h6
                          class="text-light mb-0 text-truncate fs-6"
                          [title]="item.product.name"
                        >
                          {{ item.product.name }}
                        </h6>
                        <small class="text-secondary"
                          >Cant: {{ item.quantity }} x \${{
                            item.product.price | number: "1.0-0"
                          }}</small
                        >
                      </div>
                      <span class="text-neon-cyan fw-bold fs-6">
                        \${{
                          item.product.price * item.quantity | number: "1.0-0"
                        }}
                      </span>
                    </div>
                  }
                </div>

                <div class="border-top border-purple-glow pt-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-secondary">Subtotal</span>
                    <span class="text-light"
                      >\${{ cartService.totalAmount() | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="d-flex justify-content-between mb-3">
                    <span class="text-secondary">Envío</span>
                    <span class="text-neon-cyan">Gratis</span>
                  </div>
                  <div
                    class="d-flex justify-content-between border-top border-purple-glow pt-3 fs-4"
                  >
                    <span class="text-light fw-bold">Total</span>
                    <span class="text-neon-cyan fw-bold"
                      >\${{ cartService.totalAmount() | number: "1.0-0" }}</span
                    >
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes successPop {
        0% {
          transform: scale(0.85);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .order-success-content {
        animation: successPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .border-cyan-glow {
        border-color: #00e5ff !important;
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
      }
      .border-purple-glow {
        border-color: rgba(157, 78, 221, 0.35) !important;
      }
      .text-neon-cyan {
        color: #00e5ff;
        text-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
      }
      .text-cyan {
        color: #00e5ff;
      }
      .hover-glow:hover {
        text-shadow: 0 0 12px rgba(0, 229, 255, 0.8);
        color: #33ebff !important;
      }
      .glass-input {
        background: rgba(15, 7, 32, 0.7);
        border: 1px solid rgba(157, 78, 221, 0.4);
        border-radius: 10px;
        transition: all 0.25s ease;
      }
      .glass-input:focus {
        background: rgba(22, 11, 46, 0.9);
        border-color: #00e5ff !important;
        box-shadow: 0 0 16px rgba(0, 229, 255, 0.4) !important;
      }
      .glass-item {
        background: rgba(28, 14, 58, 0.85);
        border: 1px solid rgba(157, 78, 221, 0.35);
        backdrop-filter: blur(12px);
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
        box-shadow: 0 0 25px rgba(0, 229, 255, 0.85);
        transform: translateY(-2px);
      }
      .btn-neon-cyan:disabled {
        background: #2d2645;
        color: #7b7f96;
        box-shadow: none;
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
      .success-icon-wrapper {
        width: 80px;
        height: 80px;
        background: rgba(0, 229, 255, 0.12);
        border: 2px solid #00e5ff;
        box-shadow: 0 0 25px rgba(0, 229, 255, 0.5);
      }
      .bg-danger-dark {
        background: rgba(220, 53, 69, 0.25);
        border: 1px solid #dc3545;
        box-shadow: 0 0 12px rgba(220, 53, 69, 0.3);
      }
    `,
  ],
})
export class CheckoutComponent {
  checkoutStore = inject(CheckoutStore);
  cartService = inject(CartService);

  customer: CustomerInfo = {
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  };

  formSubmitted = false;

  onSubmit(form?: NgForm): void {
    this.formSubmitted = true;
    if (form && form.invalid) {
      return;
    }
    const hasValidCustomerData = !!(
      this.customer.name?.trim() &&
      this.customer.email?.trim() &&
      this.customer.address?.trim() &&
      this.customer.city?.trim() &&
      this.customer.zipCode?.trim()
    );

    if (hasValidCustomerData && !this.cartService.isEmpty()) {
      this.checkoutStore.submitOrder(this.customer);
    }
  }

  resetCheckout(): void {
    this.formSubmitted = false;
    this.checkoutStore.resetCheckout();
  }
}
