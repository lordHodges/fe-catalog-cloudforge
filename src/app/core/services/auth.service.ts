import {
  Injectable,
  inject,
  signal,
  computed,
  WritableSignal,
  Signal,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { AnalyticsService } from "./analytics.service";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = "cloudforge_auth_token";
const USER_KEY = "cloudforge_auth_user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private analyticsService = inject(AnalyticsService);

  readonly currentUser: WritableSignal<User | null> = signal<User | null>(
    this.loadUser(),
  );
  readonly token: WritableSignal<string | null> = signal<string | null>(
    this.loadToken(),
  );
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.token());

  private loadToken(): string | null {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        return localStorage.getItem(TOKEN_KEY);
      } catch {
        return null;
      }
    }
    return null;
  }

  private loadUser(): User | null {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>("/api/auth/login", { email, password })
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  register(
    name: string,
    email: string,
    password: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>("/api/auth/register", { name, email, password })
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch {}
    }
    this.analyticsService.trackEvent("logout");
  }

  private handleAuthSuccess(res: AuthResponse): void {
    if (res && res.token && res.user) {
      this.token.set(res.token);
      this.currentUser.set(res.user);
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        } catch {}
      }
      this.analyticsService.trackEvent("login", { user_id: res.user.id });
    }
  }
}
