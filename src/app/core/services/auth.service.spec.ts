import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthService, AuthResponse } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse: AuthResponse = {
    user: {
      id: "usr-123",
      name: "Juan Perez",
      email: "juan@example.com",
    },
    token: "mock-jwt-token-xyz",
  };

  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created with no authenticated state by default", () => {
    expect(service).toBeTruthy();
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it("should log in successfully and set state/localStorage", () => {
    service.login("juan@example.com", "password123").subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(service.currentUser()).toEqual(mockResponse.user);
      expect(service.token()).toBe(mockResponse.token);
      expect(service.isAuthenticated()).toBe(true);
    });

    const req = httpMock.expectOne("/api/auth/login");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      email: "juan@example.com",
      password: "password123",
    });
    req.flush(mockResponse);
  });

  it("should register successfully and set state/localStorage", () => {
    service
      .register("Juan Perez", "juan@example.com", "password123")
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(service.currentUser()).toEqual(mockResponse.user);
        expect(service.token()).toBe(mockResponse.token);
        expect(service.isAuthenticated()).toBe(true);
      });

    const req = httpMock.expectOne("/api/auth/register");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      name: "Juan Perez",
      email: "juan@example.com",
      password: "password123",
    });
    req.flush(mockResponse);
  });

  it("should log out and clear state/localStorage", () => {
    // Manually trigger handleAuthSuccess
    (service as any).handleAuthSuccess(mockResponse);
    expect(service.isAuthenticated()).toBe(true);

    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
