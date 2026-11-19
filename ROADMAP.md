# Development roadmap

## Phase 1 — Corporate website and lead generation

### Stack and Hostinger compatibility

Use Astro in static output mode with TypeScript and Tailwind CSS. Build shared layouts, locale-aware navigation, content schemas for services and resources, and reusable form components. Use a small client-side module for the quiz. Add a React island only if an interaction warrants it. Static output is a good fit for a bilingual content site with limited interactive features and avoids an always-on app server.

Build with Node.js in local development or CI using a committed lockfile and a pinned Node version. Hostinger serves the generated HTML, CSS, and JavaScript from the site's configured document root, commonly public_html on hPanel web hosting. Confirm the actual plan and document root before configuring a release. The static site requires no Node.js runtime on the host. Verify HTTPS, redirect support, caching, and a review environment on the selected plan.

Use a small same-origin PHP lead endpoint if the plan supports PHP and approved outbound mail or lead delivery. If the plan lacks the required runtime or delivery capability, use an approved hosted form receiver or serverless endpoint after reviewing data handling, origin controls, and cost. Keep the frontend lead payload stable across receivers. Store secrets server-side. Verify delivery with synthetic data in the review environment before enabling forms for real inquiries.

### Content management proposal

Use hosted Sanity Studio as the Phase 1 editorial interface. Astro fetches approved published content at build time and Hostinger serves the generated static files. Test Arabic editing, editor permissions, paired translations, and draft preview early. Verify the CMS plan supports the required access controls before committing to it. Keep any private build credentials in CI.

Use a deliberate review-to-release workflow. Editors save drafts and review a private preview. Approved content triggers a rebuild of the static site. Configure a production release gate so a CMS edit cannot bypass deployment approval. Test one edit through preview and rebuild in each locale.

### Implementation sequence

| Step | Work | Review evidence |
| --- | --- | --- |
| 1. Confirm scope | Obtain permission to begin. Review logos, choose a master with the owner, and confirm content, services, hosting capabilities, and the lead delivery route. | Approved design direction and a list of items gated on owner input |
| 2. Establish the foundation | Scaffold Astro and Git checks. Add brand tokens, reusable layout, locale routing, responsive navigation, and content schemas. | Both locale shells render and the language switch keeps visitors on equivalent pages |
| 3. Build the acquisition pages and CMS | Implement the sitemap, calls to action, content schemas and editor access. Seed editable English and Arabic starter copy. | Review links between homepage, detail pages, contact, and resources |
| 4. Build lead capture | Implement the consultation and service forms, quiz, WhatsApp links, server validation, abuse controls, delivery, and localized feedback. | Successful and failed submissions behave correctly and synthetic inquiries reach the approved destination |
| 5. Prepare discovery and measurement | Add localized metadata, sitemap, canonical and hreflang links, consent controls and event hooks. | Crawl checks and inspection of consent, conversion deduplication, and event payloads |
| 6. Verify and seek release approval | Test mobile and desktop, keyboard flows, RTL and mixed-direction fields, build and type checks, performance, lead delivery, and content sign-off. Document artifact deployment and rollback. | Review build, QA results, accepted content, and separate production approval |

The Phase 1 scope includes the recommendation quiz. The cost calculator remains a later addition after the business approves pricing rules and identifies who will maintain them. Document launch metrics for qualified leads, lead-to-consultation rate, and lead-to-customer rate using the lead handoff process. Establish baselines after launch.

## Phase 2 — CRM and business dashboard

Connect the validated lead payload to an approved CRM. Add source attribution, qualification rules, ownership, deduplication, retries, pipeline views, and consent-aware follow-up automation. Measure lead response and conversion using agreed definitions.

## Phase 3 — Business messaging

Integrate WhatsApp Business API and Instagram messaging once accounts, permissions, opt-in rules, and escalation workflows are approved. Route conversations to staff and connect them to the CRM where appropriate.

## Phase 4 — Bilingual AI customer service

Use the OpenAI API server-side with an approved, maintained business knowledge base. Support English and Arabic around the clock, qualify leads, and hand uncertain or sensitive cases to staff. Evaluate answer accuracy, language quality, and handover behavior before customer rollout.

## Phase 5 — Secure customer portal

Add authenticated customer access for service requests, status timelines, document management, and notifications. Design authorization, storage, audit logging, and retention before enabling document uploads. Verify that customers can access only their own records.
