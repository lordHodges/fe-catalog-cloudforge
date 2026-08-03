import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  constructor() {}

  trackEvent(eventName: string, payload?: any): void {
    // Implementación mock - en producción usaría Google Analytics, Segment, etc.
    console.log(`[Analytics] Event: ${eventName}`, payload || '');
  }

  trackPageView(url: string): void {
    console.log(`[Analytics] PageView: ${url}`);
  }
}
