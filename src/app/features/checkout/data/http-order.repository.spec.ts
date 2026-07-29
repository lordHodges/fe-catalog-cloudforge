import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpOrderRepository } from './http-order.repository';
import { CreateOrderPayload, OrderConfirmation } from '../domain/order.model';

describe('HttpOrderRepository', () => {
  let repository: HttpOrderRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpOrderRepository
      ]
    });

    repository = TestBed.inject(HttpOrderRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post order payload to /api/orders and map response correctly', () => {
    const payload: CreateOrderPayload = {
      customer: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '456 Market Ave',
        city: 'San Francisco',
        zipCode: '94101'
      },
      items: [{ productId: 'p1', quantity: 1, price: 99.99 }],
      totalAmount: 99.99
    };

    const mockResponse = {
      success: true,
      orderId: 'ORD-999',
      message: 'Order created successfully'
    };

    let result: OrderConfirmation | undefined;
    repository.createOrder(payload).subscribe(res => {
      result = res;
    });

    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);

    expect(result).toBeDefined();
    expect(result?.orderId).toBe('ORD-999');
    expect(result?.status).toBe('created');
    expect(result?.totalAmount).toBe(99.99);
  });
});
