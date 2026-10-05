# JazzWatch deployment

Approved destination: public `summerofgeorge/jazz-watch`, hosted on GitHub Pages at `jazzwatch.stringfestanalytics.com`. Approval was given October 4, 2026. Do not modify classical-live.

## Current state

The public [summerofgeorge/jazz-watch repository](https://github.com/summerofgeorge/jazz-watch) and GitHub Pages site were published October 5, 2026. [The first hosted workflow](https://github.com/summerofgeorge/jazz-watch/actions/runs/37339281383) passed build, deploy and health, including 60 tests, 28 layout/accessibility audits and two interaction suites. All seven HTML pages and the required data/assets respond at the custom domain.

GitHub Pages is configured for `jazzwatch.stringfestanalytics.com`. A single CNAME was added in Bluehost: `jazzwatch` to `summerofgeorge.github.io`, TTL four hours. Google's public DNS confirms it. Existing records were not modified. GitHub has requested the TLS certificate; Enforce HTTPS and final HTTPS verification are pending issuance.

## Recreating the deployment

1. Create `summerofgeorge/jazz-watch` as a public repository. This publishes the source, fixtures and research notes as well as the compiled site; only `dist/` is served as the website.
2. Push the prepared project to `main`. Do not include `node_modules/`, ignored `work/`, local research captures or credentials.
3. Set Settings → Pages → Source to GitHub Actions. The included refresh/deploy workflow requests its built-in content-write and Pages permissions; no personal access token or paid API is needed at runtime.
4. Run the workflow and verify the successful deployment URL. Its scheduled refresh is daily at 08:17 UTC (04:17 EDT / 03:17 EST). The health job runs after deployment so a labeled stale fallback can still be served.
5. In the repository's Pages settings, set the custom domain to `jazzwatch.stringfestanalytics.com` **before** adding DNS. With a custom Actions workflow, the included `dist/CNAME` documents intent but does not configure the domain by itself.

## Configured Bluehost DNS

This record is already saved for stringfestanalytics.com:

| Type | Host/name | Value/target | TTL |
|---|---|---|---|
| CNAME | jazzwatch | summerofgeorge.github.io | 4 hours |

Do not use a repository path, URL scheme, apex-domain record or wildcard. Leave existing website and mail records unchanged. If a record for this exact name already exists, inspect its current purpose before replacing it.

After propagation, check the CNAME, GitHub's DNS check and certificate status, then enable Enforce HTTPS. Verify https://jazzwatch.stringfestanalytics.com/, all seven routes, events.json, filtering and ICS downloads at the production address. Until those checks succeed, the custom URL is a planned destination, not a verified live site.

## Maintenance

- Review failed GitHub Actions runs. The health job reports source failures and overdue manual reviews without erasing valid fallback data.
- Daily automated sources: Smalls, Mezzrow (one shared provider), BOP STOP and City of Asylum. Parser fixtures guard required evidence and structural changes. Collection is serialized, robots-aware and capped at 60 actual requests per run.
- Manually reviewed sources: Hancock Institute, CU Boulder and Kansas. The current six events were checked October 4; review them again before October 18 if continued coverage is wanted. Re-import an empty event array to withdraw a review. Never advance a verification timestamp without rereading the official pages.
- Old events disappear automatically. Failed sources retain original timestamps and stale labels for at most 14 days. A build alone never renews evidence.
- Expect occasional parser repairs when a venue redesigns its pages. This release is low-infrastructure, not maintenance-free.

References: [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
