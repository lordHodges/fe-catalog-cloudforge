import { TestBed, ComponentFixture } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { NavbarComponent } from "./navbar.component";
import { CartService } from "../../core/cart.service";

describe("NavbarComponent", () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    // Mock CartService if necessary, or just use the real one
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), CartService],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove("light-theme");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle theme when toggleTheme is called", () => {
    expect(component.isLightTheme).toBe(false);
    expect(document.body.classList.contains("light-theme")).toBe(false);

    component.toggleTheme();
    expect(component.isLightTheme).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.body.classList.contains("light-theme")).toBe(true);

    component.toggleTheme();
    expect(component.isLightTheme).toBe(false);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.body.classList.contains("light-theme")).toBe(false);
  });

  it("should read initial theme from localStorage on init", () => {
    localStorage.setItem("theme", "light");
    component.ngOnInit();
    expect(component.isLightTheme).toBe(true);
    expect(document.body.classList.contains("light-theme")).toBe(true);
  });
});
