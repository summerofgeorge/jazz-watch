# JazzWatch Analytics

Created October 5, 2026 using the signed-in george@stringfestanalytics.com account.

- Account: Stringfest Analytics (`309578108`).
- Separate GA4 property: JazzWatch (`557397837`). ClassicalWatch and the main Stringfest property were not changed.
- Web stream: JazzWatch web (`16047412802`), https://jazzwatch.stringfestanalytics.com.
- Public measurement ID: `G-B6DSXWT01V` (not a secret).
- Reporting timezone: America/New_York; currency USD.
- [Open stream administration](https://analytics.google.com/analytics/web/#/a309578108p557397837/admin/streams/table/16047412802).

`src/analytics.js` runs only on the exact production hostname. It strips page/referrer query strings and fragments, disables advertising storage, user data and personalization, and turns Google signals off. Local development and repository previews send no analytics. The privacy section explains analytics cookies and links Google's policy.

Enhanced measurement: page loads, scrolls and file downloads. Browser-history page views, site search, form interactions, outbound clicks and embedded-video measurement are off. Outbound-click measurement is intentionally off because social/email share URLs may contain a visitor's personal note. No share text is sent as a custom event. The site's generated blob ICS downloads are not claimed to be measured by enhanced file-download tracking.

The tag uses analytics storage. There is no advertising integration, cross-domain linking, User-ID or Measurement Protocol secret. Review consent behavior if audience requirements change. Do not copy this measurement ID or CNAME into another roundup; create a separate property/stream only when requested.

Unit tests exercise production hostname matching, query removal, advertising settings and duplicate-tag protection. Production tag delivery and report receipt are separate checks; a new stream may take time to show data.
