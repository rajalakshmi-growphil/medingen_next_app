export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...properties });
  }
}

export function trackPageView(url: string): void {
  trackEvent('page_view', { page_path: url });
}
