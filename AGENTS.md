# Rukn Al Yaqeen project instructions

## Scope and approvals

- Use PROJECT_BRIEF.md for business requirements and ROADMAP.md for sequencing and acceptance criteria.
- Obtain owner approval before starting Phase 1 website development. Obtain separate explicit approval before any production deployment, live tracking activation, or external integration that sends customer data.
- Treat every proposed service and package as provisional until the owner confirms its scope and availability. Label provisional items in drafts and previews. Publish service offers only after approval.
- Use the existing checkout and Git for version control. Keep changes scoped and reviewable.

## Brand and content

- Use Rukn Al Yaqeen Business Setup, ركن اليقين, and rysetup.com. The audience is in the United Arab Emirates.
- Use deep navy #10243E, premium gold #C5A46D, ivory #F5F3EE, and white #FFFFFF. Test contrast for text, controls, and focus states. Treat gold as an accent where contrast is insufficient.
- Preserve original logo references in brand-assets. Store working exports separately. Use the owner-approved RY master and approved variants.
- Provide equivalent English and Arabic journeys. Set the correct HTML language and direction per locale, use CSS logical properties, and test Arabic with mixed-direction content such as emails and phone numbers. Have a fluent reviewer approve Arabic copy.
- Use restrained motion and respect reduced-motion preferences. Build responsive, keyboard-operable pages with semantic markup and visible focus.
- Use editable generic bilingual starter copy in drafts. Keep unknown business-specific content unset. Keep CMS drafts and provisional offers out of public builds.
- Use owner-approved facts. Never invent pricing, statistics, testimonials, contact details, credentials, or government affiliations. Verify regulatory claims against current official sources and record review dates. Obtain approval for legal copy.

## Engineering and data

- Prefer static Astro pages with TypeScript, Tailwind CSS, reusable components, and client-side JavaScript only where interaction warrants it. Confirm the Hostinger plan before choosing the lead endpoint.
- Keep credentials in server-side configuration, outside the public web root where applicable. Exclude local secrets from Git and client bundles.
- Collect minimal contact and inquiry details in Phase 1. Do not collect passports, Emirates IDs, payment information, or sensitive documents. Keep personal data out of analytics, URLs, and diagnostic logs.
- Validate and rate-limit lead submissions on the server. Verify successful delivery before confirming receipt. Provide accessible error and retry states.
- Keep tracking configurable and apply owner-approved consent rules. Count successful lead submissions separately from contact clicks. Keep CRM and advertising integrations inactive until approved and configured.
- Before release, verify both locales, navigation, accessibility, SEO, mobile performance, form delivery and failure handling, and tracking behavior.

## Owner's preferred instructions

- For setup, troubleshooting, and handoffs, give detailed numbered steps in the order the owner should follow. Name the screen, menu, button, and field when known. State what to enter, what success looks like, and what information to share back. Clearly mark any step that requires an account decision or approval.
- Prefer browser or dashboard steps for owner-managed setup when available. Explain any necessary technical terms in plain language and put commands in separate copyable blocks when needed.
