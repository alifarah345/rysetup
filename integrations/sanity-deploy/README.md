# Sanity publishing to Hostinger

This receiver authenticates Sanity notifications and asks GitHub Actions to commit a marker to `main`. Hostinger's existing automatic deployment builds `rysetup.com` from that commit. The CMS site itself does not need a redeploy. No Sanity content is included in the GitHub dispatch.

## Host the receiver

Create a separate Node.js app, for example `deploy.rysetup.com`. Use Node 22 or newer, `server.js` as the entry file, and the supplied application ZIP or this directory as the app root. Enable HTTPS. Set these variables in the new app:

| Name | Value |
| --- | --- |
| `HOST` | `0.0.0.0` |
| `SANITY_DEPLOY_SECRET` | A randomly generated secret of at least 32 characters, also entered in Sanity |
| `GITHUB_DEPLOY_TOKEN` | A fine-grained GitHub token restricted to `alifarah345/rysetup` with repository **Actions: Read and write** |

Use the platform-provided port. Check that the app's `/health` route returns `{"ok":true}`. This confirms startup only. Keep both credentials in their dashboard settings. The receiver sends only the SHA-256 event identifier to GitHub. The workflow itself uses its scoped job token to commit the marker.

## Register the Sanity webhook

Open **Sanity Manage → Rukn Al Yaqeen → API → Webhooks** and add a webhook named **Deploy approved website content**. Choose the `production` dataset and the HTTPS receiver URL ending in `/sanity/publish`. Select **Create**, **Update**, and **Delete**. Leave draft events and version events off. Paste the same value as `SANITY_DEPLOY_SECRET` into Sanity's **Secret** field.

Filter:

```groq
coalesce(after()._type, before()._type) in ["page", "faq", "siteSettings"]
&& (before().approved == true || after().approved == true)
```

Projection:

```groq
{
  "projectId": "ryikque3",
  "dataset": "production",
  "id": coalesce(after()._id, before()._id),
  "type": coalesce(after()._type, before()._type),
  "revision": coalesce(after()._rev, before()._rev),
  "operation": delta::operation(),
  "wasApproved": before().approved == true,
  "isApproved": after().approved == true
}
```

This also rebuilds when previously approved content is unpublished or loses approval, so the site can drop the prior copy.

## Verify and pause

1. Save a draft without publishing. Confirm no new deployment appears.
2. Publish one approved edit. Check Sanity's webhook delivery history for HTTP 202, then look for **Deploy approved Sanity content** in GitHub Actions.
3. Check Hostinger **rysetup.com → Deployments** for the bot commit **Rebuild website for approved Sanity content** and wait for **Completed / Current**. Check the edited language page.
4. To pause automatic content deploys, disable the Sanity webhook. Manual Hostinger redeploy remains available.

GitHub serializes marker jobs, and its concurrency queue keeps at most one pending run. A quick batch may still produce more than one build. A short recent history in the marker file prevents duplicate rebuild commits for delivery retries. If a workflow fails because another commit moved `main` during the push, rerun the failed job or manually redeploy the latest `main`.
