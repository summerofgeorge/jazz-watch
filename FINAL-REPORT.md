# JazzWatch — delivery report

Published and verified October 5, 2026: [JazzWatch](https://jazzwatch.stringfestanalytics.com/), [support page](https://jazzwatch.stringfestanalytics.com/support.html), [public source](https://github.com/summerofgeorge/jazz-watch). GitHub Pages remains the host. classical-live was inspected read-only and was not modified.

## Design and public features

The approved Art Deco treatment remains: cream/ink/red, display typography, stepped rectangles, double rules and concentric arches. The original Stringfest seal and horizontal logo were copied unchanged from the user's public ClassicalWatch site, verified by hash and visual inspection. No logo was redrawn; no decorative chevrons or triangles were added. Provenance is in skills/stringfest-streaming-roundup/references/branding.md.

The site has seven pages: calendar, sources, watching help, about, methodology, support and a custom 404. The redesign adds fuller George/Stringfest context, training introductions, expanded methodology, and editable sharing for sets, calendar views and support introductions. Email, text, WhatsApp, X, Facebook, native share, clipboard fallback and stable set links are included. Sharing never posts automatically, and unavailable sets show an honest notice. Research/review remains outside the public navigation.

Filters cover date range, search, venue, source type, region, country, format, viewing-link type, free-registration requirement and stale status. Viewer timezone and URL-restored filters, source times, viewing evidence, source status, and per-set/filtered ICS exports are included. ICS is a snapshot; unknown durations are explicitly estimated at 90 minutes.

## Data quality and maintenance

The final snapshot has **31 sets across seven source labels / six independent providers**: Smalls 10, Mezzrow 8, BOP STOP 2, City of Asylum 5, Hancock Institute 2, CU Boulder 3, KU Lied Center 1. Smalls and Mezzrow share a provider. Four source labels refresh automatically; three rely on current manual review.

Every admitted set needs an announced live-video broadcast, affirmative free-viewing evidence, jazz subject evidence, official URLs and an unambiguous date/time. Free registration is labeled. Membership, subscriptions, trials, recordings, free venue admission or a generic player alone do not qualify. Evidence and research decisions are in data/registry.json, data/manual-reviewed.json and docs/source-research.md.

Refresh is scheduled daily at 08:17 UTC. It respects official-host allowlists, robots, serialized delays, request/byte/deadline caps and bounded retries. No YouTube scraping, media probes or protection bypasses are used. Healthy refreshes remove withdrawn events; failures preserve only eligible stale entries with their original timestamps. Verification expires after 14 days, including in the browser. Current manual reviews were performed October 4 and must be rechecked before October 18 to continue their coverage. Maintenance is modest but not zero: monitor Actions failures and review those three manual sources.

Final hosted collection started 2026-10-05T17:05:32.329Z: **21 actual HTTP attempts, 1,420,738 response bytes**, with all automated sources healthy. Manual timestamps were not renewed.

## Verified checks

- Local and hosted unit/fixture/network-policy tests: **65 passed, 0 failed**.
- Local and hosted browser QA: **28 page/viewport/path layout and axe audits**, plus **two interaction suites**, all passed. Tests cover filters, timezone/URL restoration, evidence, ICS, sharing, clipboard denial, deep links, introduction text, stale expiry, XSS safety and loading failure.
- Built dist: **17 files, 151,541 bytes**; includes events.json and two original PNG assets. Exact allowlist, every local route/anchor and root/project-prefix behavior validated. Fixtures, research, credentials, node_modules and skill files are not deployed. Pages omits the redundant .nojekyll marker, leaving 16 publicly served files.
- [Production workflow 37345789843](https://github.com/summerofgeorge/jazz-watch/actions/runs/37345789843): **build, deploy and health all successful**. Code d04b2b8f6e46d74f96b932887e33fee433fee3fb; refreshed data 5a1120c5256b0c6cc579be329509f22d6da14f52.
- Production checks: **all 16 public files returned HTTPS 200** and matched final dist (text line endings normalized; images byte-exact); missing route returned JazzWatch 404; HTTP returned **301 to HTTPS**. GitHub's DNS check passed and Enforce HTTPS is enabled.
- Production UI: 31 sets loaded; BOP STOP search returned two; sharing invitation retained the exact source timezone/date; Copy link succeeded; the shared-set link focused and highlighted the intended concert. Live support page visually inspected. Desktop/mobile screenshots and machine-readable QA evidence are included in the ZIP's docs/qa folder.
- ICS downloads passed locally and in hosted browser suites. An earlier separate in-app-browser download attempt timed out; no separate production-download success is claimed.

## Google Analytics

Created a separate **JazzWatch GA4 property** in the existing **Stringfest Analytics** account signed in as george@stringfestanalytics.com. Property 557397837, web stream 16047412802, public measurement ID **G-B6DSXWT01V**. ClassicalWatch and the main Stringfest property were not altered. Reporting timezone is America/New_York.

The exact-production-host tag is published on every page. Advertising features and Google signals are off. Page/referrer query strings and fragments are removed; search, forms, history pageviews and outbound-click collection are disabled to exclude personal search/share text. Privacy copy is updated. Local/test/preview hosts are excluded.

**Receipt confirmed:** JazzWatch's Realtime report showed the Jazz Watch page title and page_view, first_visit and session_start from the verification visit. Initial totals include that check. Configuration and report link are in docs/analytics.md.

## Reusable skill and delivery

Created, validated and installed **$stringfest-streaming-roundup** at C:/Users/georg/.codex/skills/stringfest-streaming-roundup/. All seven installed files match the source package. The skill covers official-source evidence, bounded collection, stale handling, original Stringfest assets, George/support pages, sharing, testing and GitHub Pages. It contains no copied live concert data or Analytics IDs. The portable copy is in skills/stringfest-streaming-roundup/ in the repository and ZIP.

JazzWatch-source-and-dist.zip contains source, dist, fixtures, workflows, documentation, the portable skill, and QA outputs. Its manifest records integrity and SHA-256. No .git, node_modules, credentials or local research captures are included.

## Remaining capability limits

- **Library upload unavailable; confirmed library_file_ids: []**. This executor exposes no Library skill/tool/materializer. The downloadable ZIP is local, not Library-saved. The six original Library references could not be read; their metadata or paths were never guessed. Official assets were later obtained through the public ClassicalWatch reference instead.
- No accessible personal Stringfest branding skill or .agents/skills tree was found initially. Original logos and the reference palette supplied the verified branding inputs.
- Windows reported GJMSURFACETABLE; the requested Surface2 alias was not independently confirmed.
- The initial handoff referenced an inherited full specification absent from this chat. The implementation covers the explicit handoff and subsequent user requests; unseen requirements cannot be certified.

There is no remaining repository, audience, DNS or HTTPS decision. Future refresh health and manual reviews are ongoing maintenance, not launch blockers.
