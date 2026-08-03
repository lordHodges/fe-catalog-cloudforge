import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderRepository } from "../../data/order.repository";
import { PastOrder } from "../../domain/order.model";

@Component({
  selector: "app-order-history",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-history-container">
      <h1 class="neon-title">Historial de Órdenes</h1>
      
      <div *ngIf="loading()" class="loading">
        Cargando órdenes...
      </div>

      <div *ngIf="!loading() && orders().length === 0" class="empty-state">
        No tienes órdenes pasadas.
      </div>

      <div *ngIf="!loading() && orders().length > 0" class="orders-list">
        <div class="order-card" *ngFor="let order of orders()">
          <div class="order-header">
            <h3>Pedido: <span class="neon-text">{{ order.id }}</span></h3>
            <span class="status-badge" [ngClass]="order.status">{{ order.status | uppercase }}</span>
          </div>
          <div class="order-body">
            <p><strong>Fecha:</strong> {{ order.createdAt | date:'short' }}</p>
            <p><strong>Total:</strong> {{ order.totalAmount | currency }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-history-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: var(--surface-card, #1e1e1e);
      border-radius: 8px;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
    }

    .neon-title {
      color: #fff;
      text-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff;
      margin-bottom: 2rem;
      text-align: center;
    }

    .neon-text {
      color: #00f3ff;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #aaa;
      font-size: 1.2rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      background-color: #2a2a2a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
      border-color: #00f3ff;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid #444;
      padding-bottom: 0.5rem;
    }

    .order-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .status-badge.delivered {
      background-color: rgba(0, 255, 128, 0.2);
      color: #00ff80;
      border: 1px solid #00ff80;
    }

    .status-badge.pending {
      background-color: rgba(255, 165, 0, 0.2);
      color: #ffa500;
      border: 1px solid #ffa500;
    }
    
    .status-badge.created {
      background-color: rgba(0, 243, 255, 0.2);
      color: #00f3ff;
      border: 1px solid #00f3ff;
    }

    .order-body p {
      margin: 0.5rem 0;
      color: #ccc;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private orderRepo = inject(OrderRepository);

  orders = signal<PastOrder[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.orderRepo.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading orders", err);
        this.loading.set(false);
      }
    });
  }
}
