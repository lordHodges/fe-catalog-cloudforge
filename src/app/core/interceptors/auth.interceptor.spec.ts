import {
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpHeaders,
} from "@angular/common/http";
import { authInterceptor } from "./auth.interceptor";
import { signal } from "@angular/core";
import { of } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { AuthService } from "../services/auth.service";

describe("authInterceptor", () => {
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      token: signal<string | null>(null),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });
  });

  it("should not add Authorization header if token is null", () => {
    authServiceMock.token.set(null);

    const req = new HttpRequest("GET", "/api/test-endpoint");
    const nextSpy: any = (clonedReq: HttpRequest<any>) => {
      expect(clonedReq.headers.has("Authorization")).toBe(false);
      return of(new HttpResponse());
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy);
    });
  });

  it("should add Authorization header with Bearer token if token is present", () => {
    authServiceMock.token.set("mock-jwt-token-123");

    const req = new HttpRequest("GET", "/api/test-endpoint");
    const nextSpy: any = (clonedReq: HttpRequest<any>) => {
      expect(clonedReq.headers.has("Authorization")).toBe(true);
      expect(clonedReq.headers.get("Authorization")).toBe(
        "Bearer mock-jwt-token-123",
      );
      return of(new HttpResponse());
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy);
    });
  });
});
