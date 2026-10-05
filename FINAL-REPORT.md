# Jazz Watch — delivery report

Local implementation completed October 4, 2026. The public summerofgeorge/jazz-watch repository was created October 5; publication verification is in progress. classical-live was not modified.

## Included

Plain HTML/CSS/JavaScript site; Node.js 24 + pinned pnpm project; source and compiled dist; evidence-based Smalls, Mezzrow, BOP STOP and City of Asylum adapters; fourteen researched source records; manual-review importer and expiry; respectful bounded HTTP collector; source health/stale fallback; local-time filters and original source times; individual/filtered ICS exports; seven HTML pages including 404; fixtures and tests; GitHub Actions checks, refresh and Pages deployment; README and source/branding audit.

Seven sources across six independent providers now contribute verified events: Smalls, Mezzrow, BOP STOP, City of Asylum, Hancock Institute, CU Boulder and the University of Kansas. Four venue records use daily adapters; three sources use expiring manual reviews. Smalls and Mezzrow share one provider. The public research section has been removed. There are no YouTube collection requests, bypasses, paid APIs, analytics tags, visitor accounts, or video embeds.

The Art Deco styling uses double-line frames, stepped corner details, concentric arches and display typography while preserving the Stringfest cream, ink and red palette. There are no decorative triangles or chevrons. The build and full browser suite were rerun after this design update.

## Verified results

- pnpm check: **60 tests passed, 0 failed**, offline fixtures and network mocks included. Final build succeeded.
- pnpm test:browser: **28 page/viewport/path audits passed** (seven pages × desktop/mobile × root/project path), with no reported WCAG A/AA axe violations. **Two interaction suites passed**: filters, time zones, URL restoration, evidence disclosures, ICS download, stale/expired data, text injection safety and data-loading errors.
- Manual visual inspection: desktop and mobile calendar and source directory, plus concert row. Screenshots of all pages are included in docs/qa. Automated accessibility checks do not replace user testing.
- dist inspection: **13 deploy files; 104,772 bytes**. All local HTML routes/anchors and relative production paths validated; data IDs and evidence checked. No node_modules, test fixtures or research files are deployed.
- Seed snapshot: **31 listings across seven sources**: Smalls 10, Mezzrow 8, BOP STOP 2, City of Asylum 5, Hancock Institute 2, CU Boulder 3, Kansas 1. All automated sources are healthy; the six manually reviewed events keep their actual check timestamps.
- Last refresh: October 4, 2026, 5:32:17 p.m. America/New_York. **23 HTTP attempts, 1,496,800 response bytes, 176.623 seconds**. Robots and configured host spacing were enforced. No YouTube requests were made.
- pnpm health: **exit 0**. All configured sources healthy or currently manually verified.
- Maintenance: automated sources refresh daily once hosted; three manually reviewed sources need rechecking before October 18. No future event is admitted from a past livestream or a public player alone.
- Browser executable used for local QA: Microsoft Edge via Playwright. Hosted Linux Chromium and the GitHub workflow are pending verification.

## Source evidence

The [official SmallsLIVE livestream policy](https://www.smallslive.com/livestream/) explicitly makes live viewing free and separates archive membership. The [public schedule](https://www.smallslive.com/) supplies the venue cards; individual pages provide broadcast/date evidence. Examples inspected include [Alexander McCabe Quartet](https://www.smallslive.com/events/33909-alexander-mccabe-quartet/) and [Joe Farnsworth Quartet](https://www.smallslive.com/events/34021-joe-farnsworth-quartet/). See data/registry.json and docs/source-research.md for all inclusion/exclusion decisions.

## Publication status

The user approved the public [summerofgeorge/jazz-watch repository](https://github.com/summerofgeorge/jazz-watch) and **jazzwatch.stringfestanalytics.com**. The repository was created October 5 after GitHub sign-in succeeded. Pages deployment and production verification are in progress.

DNS inspection confirms Bluehost nameservers. After the domain is set in GitHub Pages, the required DNS record is **CNAME jazzwatch → summerofgeorge.github.io**. No DNS record has been changed. Complete sequence and maintenance duties are in docs/deployment.md. No production URL is claimed as verified.

## Capability limits

- **Library upload/materialization unavailable:** this executor exposed no Library tool, current Library skill, prepare_materialize, or bundled Library helper. Plugin discovery found no suitable Library integration. None of the six supplied asset IDs could be read; no metadata, bytes, pixels, URLs, filenames or cloud paths were guessed. Clean Stringfest Analytics text branding was used, with no recreated logo, decorative chevrons or triangles.
- **Confirmed Library output IDs: none.** The ZIP is a verified local downloadable deliverable, not a Library-saved artifact. A Library-enabled executor is needed to complete that specific delivery step.
- No accessible personal .agents/skills branding folder was found. Classical Watch's existing styles supplied the warm paper/dark ink/red reference.
- Windows executor hostname is GJMSURFACETABLE; its relationship to the requested “Surface2” alias could not be independently verified.
- The handoff referred to an inherited full specification that was absent from this chat. The implementation covers the explicit handoff and documented calendar scope; exact parity with an unseen original page/filter/source list cannot be certified.

## Local use

Unzip JazzWatch-source-and-dist.zip. In jazz-watch run pnpm install --frozen-lockfile --ignore-scripts, then pnpm start. Open http://127.0.0.1:4173. Source code is under src/ and scripts/; GitHub Pages publishes dist/ only. The included snapshot is not a claim that every event is currently playing.

