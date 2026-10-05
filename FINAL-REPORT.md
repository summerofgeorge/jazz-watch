# Jazz Watch — delivery report

JazzWatch was published on GitHub Pages October 5, 2026. The public repository is [summerofgeorge/jazz-watch](https://github.com/summerofgeorge/jazz-watch). The custom domain is configured; HTTPS certificate provisioning is in progress. classical-live was not modified.

## Included

Plain HTML/CSS/JavaScript site; Node.js 24 + pinned pnpm project; source and compiled dist; evidence-based Smalls, Mezzrow, BOP STOP and City of Asylum adapters; fourteen researched source records; manual-review importer and expiry; respectful bounded HTTP collector; source health/stale fallback; local-time filters and original source times; individual/filtered ICS exports; seven HTML pages including 404; fixtures and tests; GitHub Actions checks, refresh and Pages deployment; README and source/branding audit.

Seven sources across six independent providers now contribute verified events: Smalls, Mezzrow, BOP STOP, City of Asylum, Hancock Institute, CU Boulder and the University of Kansas. Four venue records use daily adapters; three sources use expiring manual reviews. Smalls and Mezzrow share one provider. The public research section has been removed. There are no YouTube collection requests, bypasses, paid APIs, analytics tags, visitor accounts, or video embeds.

The Art Deco styling uses double-line frames, stepped corner details, concentric arches and display typography while preserving the Stringfest cream, ink and red palette. There are no decorative triangles or chevrons. The build and full browser suite were rerun after this design update.

## Verified results

- pnpm check: **60 tests passed, 0 failed**, offline fixtures and network mocks included. Final build succeeded.
- pnpm test:browser: **28 page/viewport/path audits passed** (seven pages × desktop/mobile × root/project path), with no reported WCAG A/AA axe violations. **Two interaction suites passed**: filters, time zones, URL restoration, evidence disclosures, ICS download, stale/expired data, text injection safety and data-loading errors.
- Manual visual inspection: desktop and mobile calendar and source directory, plus concert row. Screenshots of all pages are included in docs/qa. Automated accessibility checks do not replace user testing.
- dist inspection: **13 build files; 104,397 bytes** after the final coverage-copy correction. All local HTML routes/anchors and relative production paths validated; data IDs and evidence checked. No node_modules, test fixtures or research files are deployed. The Pages upload action omits the redundant .nojekyll marker because Actions publishes the built files directly.
- Seed snapshot: **31 listings across seven sources**: Smalls 10, Mezzrow 8, BOP STOP 2, City of Asylum 5, Hancock Institute 2, CU Boulder 3, Kansas 1. All automated sources are healthy; the six manually reviewed events keep their actual check timestamps.
- First hosted refresh: October 5, 2026, 16:14:37 UTC. **21 HTTP attempts and 1,420,713 response bytes**. Robots and configured host spacing were enforced. No YouTube requests were made. The daily workflow saves subsequent verified snapshots automatically.
- pnpm health: **exit 0**. All configured sources healthy or currently manually verified.
- Maintenance: automated sources refresh daily once hosted; three manually reviewed sources need rechecking before October 18. No future event is admitted from a past livestream or a public player alone.
- Hosted verification: [GitHub Actions run 37339281383](https://github.com/summerofgeorge/jazz-watch/actions/runs/37339281383) passed build, deployment and health on Ubuntu 24.04.5, Node 24.21.0 and Chromium 145.0.7632.6. Its **60 tests, 28 layout/accessibility audits and two interaction suites all passed**. The browser suites include ICS downloads.
- Production checks: the GitHub Pages calendar loaded 31 sets; a BOP STOP search returned two. All 12 public files returned HTTP 200 at the custom domain and matched the final local dist after line-ending normalization. The custom missing-page route returned HTTP 404 with the JazzWatch page. The production desktop layout was visually inspected. The in-app browser's separate download check timed out, so no additional production ICS result is claimed beyond the passing hosted suite.

## Source evidence

The [official SmallsLIVE livestream policy](https://www.smallslive.com/livestream/) explicitly makes live viewing free and separates archive membership. The [public schedule](https://www.smallslive.com/) supplies the venue cards; individual pages provide broadcast/date evidence. Examples inspected include [Alexander McCabe Quartet](https://www.smallslive.com/events/33909-alexander-mccabe-quartet/) and [Joe Farnsworth Quartet](https://www.smallslive.com/events/34021-joe-farnsworth-quartet/). See data/registry.json and docs/source-research.md for all inclusion/exclusion decisions.

## Publication status

The approved public repository and GitHub Pages site are published. Daily refresh is scheduled for 08:17 UTC, with push and manual triggers. The final source-coverage text correction passed build, deploy and health in [run 37340632362](https://github.com/summerofgeorge/jazz-watch/actions/runs/37340632362); it is visible on the production homepage. The delivered snapshot includes that run's October 5, 16:25 UTC refresh.

GitHub Pages has accepted **jazzwatch.stringfestanalytics.com**. Bluehost now has **CNAME jazzwatch → summerofgeorge.github.io**, TTL four hours, confirmed by Google's public DNS. No existing DNS records were changed. HTTP serves the site; GitHub has requested the HTTPS certificate. Enforce HTTPS and final HTTPS verification remain pending certificate issuance. The full sequence and maintenance duties are in docs/deployment.md.

## Capability limits

- **Library upload/materialization unavailable:** this executor exposed no Library tool, current Library skill, prepare_materialize, or bundled Library helper. Plugin discovery found no suitable Library integration. None of the six supplied asset IDs could be read; no metadata, bytes, pixels, URLs, filenames or cloud paths were guessed. Clean Stringfest Analytics text branding was used, with no recreated logo, decorative chevrons or triangles.
- **Confirmed Library output IDs: none.** The ZIP is a verified local downloadable deliverable, not a Library-saved artifact. A Library-enabled executor is needed to complete that specific delivery step.
- No accessible personal .agents/skills branding folder was found. Classical Watch's existing styles supplied the warm paper/dark ink/red reference.
- Windows executor hostname is GJMSURFACETABLE; its relationship to the requested “Surface2” alias could not be independently verified.
- The handoff referred to an inherited full specification that was absent from this chat. The implementation covers the explicit handoff and documented calendar scope; exact parity with an unseen original page/filter/source list cannot be certified.

## Local use

Unzip JazzWatch-source-and-dist.zip. In jazz-watch run pnpm install --frozen-lockfile --ignore-scripts, then pnpm start. Open http://127.0.0.1:4173. Source code is under src/ and scripts/; GitHub Pages publishes dist/ only. The included snapshot is not a claim that every event is currently playing.

