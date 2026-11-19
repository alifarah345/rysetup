export type FunnelEvent = 'whatsapp_click' | 'quiz_complete' | 'generate_lead'

// Only a future consent-aware adapter should forward these events to vendors.
export function measure(name: FunnelEvent) {
  window.dispatchEvent(new CustomEvent('ry:measurement', {detail:{name, locale:document.documentElement.lang}}))
}
