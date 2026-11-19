# Rukn Al Yaqeen Business Setup

Phase 1 is a bilingual Astro site with a static build, a local sample-only lead endpoint, and Sanity Studio configuration for editorial content.

## Run and verify

Use Node 24. From the checkout:

```sh
npm ci
npm run dev
```

Open the local site at port 4321. The sample lead endpoint accepts synthetic submissions only and discards all request data. For an alternate local or private preview origin, set `RY_PREVIEW_ORIGIN` to the exact origin (scheme, host, and port). Preview pages are marked noindex. Keep draft previews on private, access-controlled infrastructure.

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

Use `npm run preview` to view the compiled site with the same sample lead behavior. If Chromium is already installed, set `RY_CHROMIUM_PATH` to its executable. Use `ASTRO_TELEMETRY_DISABLED=1` when working in a restricted environment that cannot write Astro configuration.

## Editorial workflow

Provision an approved Sanity project and dataset, invite editors with appropriate roles, and configure the Studio origin. Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` to run `npm run studio` or `npm run studio:build`. See [.env.example](.env.example) for the Astro server settings. Never put the read token in a `SANITY_STUDIO_*` variable.

Generate an offline NDJSON file with `npm run --silent cms:seed > /tmp/rysetup-drafts.ndjson`. This command makes no writes to Sanity. Review and import it into the approved dataset using Sanity’s dataset import workflow. All seed documents are drafts. Routes use the sitemap slugs without locale prefixes, and `home` is the homepage. Add paired articles with a slug of the form `resources/article-name`. Edit service copy, package copy, FAQs, article content, metadata, and contact settings in Studio. The design and quiz rules are maintained in code.

For authenticated, local draft review, set `RY_CMS_DRAFTS=true` and a narrowly scoped server-only `SANITY_READ_TOKEN`, then run `npm run dev` with its default loopback binding. Public builds read published, explicitly approved content. The build needs both translations for required pages and owner approval on each service document. Add approved contact data to show WhatsApp and email. Test editor logins, permissions, private preview and localized publishing in the actual dataset before enabling the content workflow.

## Release prerequisites

Confirm the Hostinger plan and lead delivery route. Configure an approved HTTPS lead destination using `RY_LEAD_ENDPOINT` (a same-origin path is preferred). The endpoint must validate the URL-encoded payload, rate-limit requests, handle origin restrictions, and return JSON with `accepted: true` and `delivered: true` only after verified delivery. Verify the configured destination with sample data. The local sample endpoint is development tooling and is outside the static artifact.

The site uses a vector reconstruction of the approved RY direction. Before release, review the reconstructed artwork and obtain sign-off for services, bilingual copy, contact details, and legal text. Set `RY_PUBLIC_RELEASE=true` only for an approved production build. Upload the generated `dist/` artifact to the confirmed Hostinger document root through an approved release process. Configure a host-level root redirect to `/en/` and keep the previous artifact available for rollback.

The site emits `ry:measurement` events for `generate_lead`, `quiz_complete`, and `whatsapp_click`. Once consent behavior and account IDs are approved, map delivered leads to GA4's generate_lead event, a Google Ads lead conversion, and Meta's Lead event. Use separate engagement events for the quiz and WhatsApp clicks. Payloads contain the event name and locale only.

## Private Hostinger staging

Use a separate HTTPS site, proposed as `staging.rysetup.com`, and enable password protection in hPanel before sharing access. Confirm the actual plan and the staging document root in hPanel. The 50-site allowance describes capacity. Verify PHP and outbound delivery capabilities separately before selecting the live form transport.

Build a staging artifact with `RY_REVIEW_ONLY=true SITE_URL=https://staging.rysetup.com npm run build`. The result stays out of search indexes and locally disables inquiry submission. Set the approved lead inbox later through restricted CMS settings for the server-side integration. Keep the delivery recipient separate from any public contact email and keep mail credentials on the server.

### GitHub deployment to staging

GitHub Actions runs the build and type check for changes to `main` and pull requests targeting it. To upload a reviewed build, use **Actions → Hostinger staging → Run workflow** on `main`. The first run requires an existing GitHub repository with the code on `main` and a separate HTTPS staging site with hPanel password protection enabled.

In the staging document root, place a file named `.rysetup-staging` whose only content is `staging.rysetup.com`. Confirm the exact root and SSH/SFTP access in hPanel. Create a GitHub environment named `staging`, restrict it to `main`, and enable required reviewers if supported. Configure these environment settings directly in GitHub:

| Kind | Names |
| --- | --- |
| Variables | `HOSTINGER_SFTP_HOST`, `HOSTINGER_SFTP_PORT`, `HOSTINGER_SFTP_USER`, `HOSTINGER_STAGING_ROOT` |
| Secrets | `HOSTINGER_STAGING_SSH_KEY`, `HOSTINGER_KNOWN_HOSTS` |

Use a dedicated deployment SSH key and credentials restricted to the staging directory if the plan supports that scope. Verify the server host-key fingerprint through Hostinger before recording the corresponding OpenSSH known-hosts entry. The workflow verifies host identity and requires both an HTTPS password challenge and the staging marker before uploading. It overwrites matching files and leaves old files in place. It targets staging only. Retain a successful build artifact if rollback is needed, and remove obsolete staging files during a separate review.
