# Implementation and release guide

The reference is a static Node.js/pnpm project: source pages and browser JS in `src/`; collector/model/network/build scripts in `scripts/`; registries and reviewed/snapshot JSON in `data/`; reproducible parser fixtures and browser tests in `test/`; only `dist/` deployed. Pin runtime/package manager/dependencies. Do not require a server database for a public static calendar.

Inspect these reference areas before reuse:

- `scripts/http.mjs`, model/time handling and adapters: request accounting, evidence admission, DST parsing, stale merge and original timestamps.
- `scripts/review.mjs` and manual-review example: attributable import with fixed expiry.
- `src/core.js`: local-day filters and ICS escaping, UTC dates, stable UID, CRLF and 75-octet UTF-8 folding.
- `src/app.js` and `src/share.js`: safe DOM text insertion, URL state, evidence disclosures, distinct watch-link labels, shareable set IDs and unavailable-set messaging.
- `scripts/build.mjs`, `check-dist.mjs`, `test/browser.mjs`: exact deployment allowlist, every local route, root and project-prefix tests, accessibility and deterministic fixtures.
- `.github/workflows/refresh-and-deploy.yml`: bounded daily refresh, tests, build, browser QA, data snapshot preservation, dist-only Pages deployment, then source-health reporting.

Adapt all genre-specific fields, labels, registry statuses, dates, hostnames, CNAME and workflow names deliberately. Keep a direct official event link and original source time on every card. Offer tonight/week/weekend/all dates, text, venue/source, region/country, format, watch-link, free-access and freshness filters when useful. Support arbitrary valid viewer timezones, URL-restored filters, accessible disclosures, understandable empty/loading/failure states.

Sharing should provide editable invitation text, source timezone/date/set, free-registration caveat, stable set deep link, calendar-view link, email/text/social share dialogs, clipboard fallback, native sharing where available and restored focus. Encode text and URLs; never post automatically. Shared expired or removed events need an honest message. Do not promise dynamic social previews on a purely static site.

ICS downloads are snapshots, not subscriptions. Disclose estimated durations and duplicate-import limitations. Test escaping, newline injection, Unicode folding, multi-set identity, overnight dates and expired-data exclusion.

Meaningful checks include parser positive/negative fixtures; cancellation and missing-free/stream evidence; network allowlists, robots, retry/byte/request caps; healthy deletion versus stale fallback; manual review expiry; timezone/DST; XSS safety; root/project paths; browser filtering/ICS/sharing/clipboard-denial; mobile/desktop overflow; axe checks and actual screenshots. Test analytics hostname isolation with mocks, not real traffic from test fixtures.

Publication is a separate verification step: actual Actions test/build/deploy/health outcomes, public asset bytes, 404 behavior, all page routes, HTTPS certificate and redirect, and production UI smoke check. Make one narrow fix per observed failure and rerun the affected checks. Do not fabricate passing results or repeatedly collect official sites for unrelated UI changes.
