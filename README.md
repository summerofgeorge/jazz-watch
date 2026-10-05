# Jazz Watch

A small static calendar of affirmatively free jazz livestreams, presented by Stringfest Analytics. Plain HTML, CSS and JavaScript; Node.js and pnpm only at build/collection time. The browser's single data store is `dist/events.json`. No API key, database, framework, video storage, or visitor account is required.

Published on GitHub Pages October 5, 2026. Custom domain: **jazzwatch.stringfestanalytics.com**. Build, deployment and health passed on GitHub; DNS is configured. HTTPS certificate provisioning is the remaining launch step. See [deployment status](docs/deployment.md).

## Local use

Requires Node.js 24.16+ and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm check
pnpm refresh
pnpm build
pnpm start
```

Open http://127.0.0.1:4173. Do not open index.html as a file; browser JSON loading needs HTTP. `pnpm build` is offline and does **not** update verification times. `pnpm refresh` makes bounded official-source requests and preserves the previous verified snapshot if a source fails. `pnpm health` returns nonzero for failed/stale/overdue sources.

Browser checks: `pnpm exec playwright install --with-deps chromium`, then `pnpm test:browser`. Windows uses an installed Microsoft Edge; Linux CI uses Playwright Chromium. Browser screenshots and the audit JSON go to ignored `work/qa/`.

## What is implemented

- Calendar with Tonight, Next 7 days, This weekend, all upcoming, search (including artists and instruments), venue, jazz format, source type, region, country, watch-link type, free-account access, selected time zone, and hide-stale filters. Filter URLs can be shared or bookmarked.
- Original source times, separate set occurrences, announced-time status, official event links, evidence disclosures, venue/channel/direct link labels, and per-set or filtered ICS downloads.
- Sources, coverage/methodology, watching/TV help, About/privacy, Support, and 404 pages. Layouts adapt to desktop and mobile; no decorative triangles or chevrons, invented logos, remote fonts, tracking, or video embeds.
- Separate active-source and research registries; expiring manual review; automated collection and deployment-ready GitHub workflows.

Seven sources currently contribute verified events across six independent providers:

| Source | Maintenance | Scope |
|---|---|---|
| Smalls and Mezzrow | Daily automated checks | Shared provider; today/tomorrow, dated broadcast promise and no-charge policy |
| BOP STOP, Cleveland | Daily automated checks | Current upcoming cards; jazz introduction, dated event, explicit free-stream promise |
| City of Asylum, Pittsburgh | Daily automated checks | Current concert page, jazz titles, dated free livestream reservations; free registration |
| Herbie Hancock Institute, Paris | Dated manual review | October 10–11 competition and gala |
| CU Boulder College of Music | Dated manual review | Three selected jazz concerts; October 30 Grusin performances only |
| University of Kansas, Lied Center | Dated manual review | October 8 Jazz Ensembles concert |

The four automated venue records use three independent providers. Manual reviews expire 14 days after their actual check; scheduled builds do not renew them. This is a maintained calendar, not a maintenance-free service: check workflow failures and review manual sources before expiry. Automated adapters fail closed when required page structure changes. Healthy collection removes withdrawn events; failed sources are visibly stale until expiry.

Research candidates remain in the maintainer registry and source audit, but are not rendered on the public Sources page. The data model retains at most a 45-day horizon. A public player alone never qualifies a performance.

## Data contract and admission

Every event has a stable ID derived from source + official URL + start instant, an explicit-zone ISO start, a valid optional end, source IANA zone, venue/location/category, artist information if published, a safe official event URL, a safe viewing URL, watch destination kind, affirmative jazz/free booleans, known access requirements, separate stream/free evidence descriptions and source URLs, actual verification time, and stale/review method flags. Distinct sets have distinct IDs.

A source policy that explicitly promises all its shows are streamed free can establish access, but the dated performance still needs broadcast evidence. An in-person ticket price is not the streaming price. Free trials, required donations, membership-only access, radio-only events, replays, canceled/postponed shows, and unknown access are not admitted. A public embed by itself is insufficient proof of a free upcoming performance.

Smalls uses New York wall time even when its text says EST in summer. Printed weekday/month/day, the full Open Graph date, first-stream clock, and index/detail times must agree. Tomorrow announcements include a full numeric broadcast date, which is cross-checked. An event-specific Live Now label and official venue player can establish the live layout; playback itself is never tested. Missing required structures cause a failed-source state rather than a healthy empty result. A recognizably empty schedule is valid.

## Network limits and stale behavior

- HTTPS, explicit collection-host allowlist, no credentials, no arbitrary remote fetch feature.
- Robots checked before collection, wildcard/agent allow-disallow rules honored, crawl delays honored. Minimum 1 second per host; Smalls is configured at 10 seconds and its robots policy also asks for 10 seconds. BOP STOP and City of Asylum use at least 1.5 seconds.
- Serialized requests, in-run URL cache, at most 60 HTTP requests including robots, redirects and retries; four redirect-hop attempts; 15-second request deadline; eight-minute collection budget; 2 MB per response and 15 MB aggregate body limit, enforced while reading.
- One retry for a network error or 502/503/504. No retry for 401, 403, 404, 429, malformed layouts, robots disallow, or unsupported redirects. No proxy rotation, CAPTCHA workarounds, session reuse, browser collection, YouTube requests, or protection bypass.
- A healthy source replaces its prior events, including removals. A failed source may retain still-relevant events, marked stale, until 14 days from the **original verification**, never from the latest build. Per-source failure is isolated. Current manual reviews follow the same fixed expiry.
- Browser expiry runs on load and every minute. The full-data warning appears after two days. Local calendar-day filters handle time-zone differences; explicit overnight end times can preserve a show after midnight. Recently started entries may remain until the viewer's day ends. “Scheduled now” makes no playback claim.

## Manual review

`data/manual-reviewed.json` contains six events reviewed from official pages on October 4, 2026. Use `docs/manual-review-example.json` as the review envelope. A reviewer must visit every official event and access-policy page, record their identity, actual UTC check time, reviewed scope URL, and a complete replacement array for the source, including removals. Each event must satisfy `normalize()` in `scripts/model.mjs` (see positive fixtures/tests for the field contract). Use `adapter: manual` and `status: reviewed` for reviewed sources (`research` also remains supported). Manual evidence is included only through a valid review.

```sh
pnpm review import path/to/completed-review.json
pnpm refresh
pnpm check
```

The importer validates evidence, access and dates. It preserves the supplied timestamp; it never supplies “now.” Reviews expire after 14 days and produce `review_due`. Recheck the source before changing that date. Do not relabel a candidate active until its unattended adapter and real output have been tested. An empty completed review can deliberately remove a source's prior manual events.

## GitHub Pages publication

Repository: [summerofgeorge/jazz-watch](https://github.com/summerofgeorge/jazz-watch). The approved custom domain is **jazzwatch.stringfestanalytics.com**; see `docs/deployment.md` for the verified publication status. The deployment workflow runs only for a public repository. It expects a `main` branch and permission for its bot to commit only data and built files.

Deployment steps (also see `docs/deployment.md`):

1. Push this separate project to the new repository; do not overwrite classical-live.
2. In Settings → Pages choose **GitHub Actions** as the source. Allow the workflow's built-in token to write contents for the data snapshot. If branch protection prevents bot commits, adjust the repository's approved automation policy first.
3. Run **Refresh, test and publish Jazz Watch**. It installs pinned dependencies, tests, refreshes, builds, validates dist, runs browser/accessibility checks, saves the source snapshot, uploads only `dist/`, and deploys it. Health is checked after deployment so a source failure can publish a labeled fallback and still flag the run for attention.
4. Open the actual URL returned by the successful deploy job. Check event links, local times, filters, ICS downloads and all navigation there. A locally passing workflow is not proof of hosted execution.
5. Optionally attach an approved custom subdomain through GitHub Pages and the domain's DNS, then link it from the main Stringfest website. A CNAME file records the approved domain. With an Actions deployment, the custom domain must also be configured in GitHub Pages settings; the file alone does not configure it. The site works at a repository path or domain root using relative assets and links.

Daily schedule: 08:17 UTC (04:17 EDT / 03:17 EST), plus pushes to main and manual runs. GitHub can delay or disable scheduled runs after prolonged inactivity; data expiry protects the displayed calendar. Workflow runs use standard Ubuntu runners with 15-minute build, five-minute deploy and health limits; Pages artifacts have one-day retention. There is no paid API or hosted browser service. Account billing/quotas and actual visitor bandwidth are not measured by this project.

Official guidance: [Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [scheduled workflow behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

## Tests and artifacts

`pnpm check` runs offline unit/fixture/network-policy tests, builds, then verifies the exact deployed-file allowlist, every local HTML route/anchor, relative paths, event IDs/admission evidence and site size. `pnpm test:browser` checks seven pages at desktop/mobile sizes at both root and /jazz-watch/, axe accessibility rules, interactions, downloads, URL restoration, stale expiry, HTML-injection safety, and loading errors. Test-only events are intercepted in memory, never published.

ICS exports use CRLF, UTC timestamps, stable UIDs, escaped text, and 75-octet UTF-8 line folding. Unknown durations get an explicit 90-minute estimate. An ICS download is a snapshot, not a subscription; import behavior and duplicate handling vary by calendar app.

## Reference and branding audit

The requested [classical-live repository](https://github.com/summerofgeorge/classical-live) was inspected read-only before implementation: README, package.json, scripts/ingest.mjs, scripts/http.mjs, dist/index.html and dist/styles.css. GitHub tree revision observed: `49c3766a3a2db2f61fc4e8c6eee36f990077cb0a`. No changes were made to that repository. Jazz Watch is an independent project following its useful data-quality principles.

No personal .agents/skills tree or Stringfest branding skill was accessible in this local executor. The existing Classical Watch styles provided the warm paper/dark ink/red reference. The six supplied Library attachment IDs could not be materialized because no Library tools/skill were exposed here; plugin discovery found no usable Library integration. No guessed URLs or cloud paths were used, and no logo was recreated. The permitted fallback is clean **Stringfest Analytics** text branding.

Local executor reported Windows hostname `GJMSURFACETABLE`; the requested Surface2 alias was not independently confirmed. Source and dist are bundled in the local ZIP. A Library upload and confirmed library_file_id require a Library-enabled executor; none is claimed in this package.

