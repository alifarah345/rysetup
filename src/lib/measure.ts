export const funnelEvents = ['whatsapp_click','quiz_complete','generate_lead','inquiry_accepted'] as const
export type FunnelEvent = typeof funnelEvents[number]

// Keep the event payload free of visitor and inquiry details.
export function measure(name: FunnelEvent) {
  window.dispatchEvent(new CustomEvent('ry:measurement', {detail:{name, locale:document.documentElement.lang}}))
}
