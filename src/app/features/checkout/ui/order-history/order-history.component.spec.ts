import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderHistoryComponent } from "./order-history.component";
import { OrderRepository } from "../../data/order.repository";
import { of, throwError } from "rxjs";
import { PastOrder } from "../../domain/order.model";
import { CommonModule } from "@angular/common";

describe("OrderHistoryComponent", () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;
  let orderRepoMock: any;

  const mockOrders: PastOrder[] = [
    {
      id: "ORD-123",
      status: "delivered",
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    orderRepoMock = {
      getOrders: () => of(mockOrders),
    };

    await TestBed.configureTestingModule({
      imports: [OrderHistoryComponent, CommonModule],
      providers: [
        { provide: OrderRepository, useValue: orderRepoMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load orders on init", () => {
    expect(component.orders()).toEqual(mockOrders);
    expect(component.loading()).toBe(false);
  });

  it("should handle error when loading orders", () => {
    orderRepoMock.getOrders = () => throwError(() => new Error("Network error"));
    
    // Re-create component to trigger ngOnInit with error
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.orders()).toEqual([]);
    expect(component.loading()).toBe(false);
  });
});

