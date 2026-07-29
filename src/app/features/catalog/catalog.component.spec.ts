import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { CatalogRepository } from './domain/catalog.repository';
import { MockCatalogRepository } from './data/mock-catalog.repository';
import { CartService } from '../../core/cart.service';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        { provide: CatalogRepository, useClass: MockCatalogRepository },
        CartService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create catalog component', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero banner title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroTitle = compiled.querySelector('.hero-banner h1');
    expect(heroTitle).toBeTruthy();
    expect(heroTitle?.textContent).toContain('CloudForge Marketplace');
  });

  it('should render category filter with data-testid="category-filter"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const filter = compiled.querySelector('[data-testid="category-filter"]');
    expect(filter).toBeTruthy();
  });

  it('should render product cards with product-name, product-price, product-stock, add-to-cart-btn', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('[data-testid="product-card"]');
    expect(productCards.length).toBeGreaterThan(0);

    const firstCard = productCards[0];
    expect(firstCard.querySelector('[data-testid="product-name"]')).toBeTruthy();
    expect(firstCard.querySelector('[data-testid="product-price"]')).toBeTruthy();
    expect(firstCard.querySelector('[data-testid="product-stock"]')).toBeTruthy();
    expect(firstCard.querySelector('[data-testid="add-to-cart-btn"]')).toBeTruthy();
  });

  it('should add item to cart when clicking add to cart button', () => {
    const initialCartCount = cartService.totalItemsCount();
    const product = component.catalogStore.filteredProducts()[0];
    component.addToCart(product);
    expect(cartService.totalItemsCount()).toBe(initialCartCount + 1);
  });

  it('should filter product cards when category selected', () => {
    component.catalogStore.setSelectedCategory('Databases');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('[data-testid="product-card"]');
    expect(productCards.length).toBe(1);
  });
});
