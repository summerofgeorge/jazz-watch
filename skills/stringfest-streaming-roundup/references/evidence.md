# Admission and collection contract

A dated listing requires an official event identity, unambiguous start and IANA source timezone, affirmative live-video broadcast evidence, affirmative free-viewing evidence, and evidence that it belongs to the requested subject. Store evidence URLs and concise quoted/paraphrased support with an actual verification timestamp. A venue's player, channel, free in-person admission, previous concert recording, or general reputation is insufficient.

Free registration is allowed when explicitly free and clearly labeled. Exclude subscriptions, member-only viewing, free trials and unclear prices. Distinguish a direct event URL from a channel or venue player. Do not imply that a channel opens a particular set. Do not claim playback is live merely because a scheduled time has arrived.

Research registries should distinguish automated sources, current manual reviews, candidates needing evidence, blocked sources and exclusions with reasons. Keep maintainer research separate from the public source directory. Multiple venue labels sharing one provider must not inflate independent coverage.

Collectors use only approved official HTML/API/feeds. Do not scrape YouTube, probe media manifests, bypass protections, use cookies to work around blocks, or treat browser success as authorization for an undocumented private API. Never broaden a network allowlist to bypass rejection.

JazzWatch's reference bounds: one serialized worker; max 60 actual requests (robots, retries and redirects count); 2 MB per response, 15 MB aggregate; 15-second per-request deadline, eight-minute run limit; host delays at least 1.5 seconds, Smalls 10 seconds; robots rules and crawl delays respected; one retry only for network errors/502/503/504, none for 401/403/404/429. Adapt only with evidence and an explicit maintained budget, not to maximize scraped volume.

Treat missing structure as failure, not an empty schedule. An affirmative healthy empty result removes prior records. A failed source may retain eligible prior entries with a stale label and original verification time; never renew evidence during fallback or build. Reference expiry is exactly 14 days, with a site-wide refresh warning after two days. Enforce expiry in the browser too. Manual review records need reviewer, actual checked-at time, scope URL, and a complete replacement list; never auto-renew them.

Use stable IDs that distinguish multiple sets. Reject impossible dates, ambiguous DST folds/gaps, mismatched weekday/date/time labels, conflicting duplicates, cancellations and missing required evidence. Research first, then fixture the actual observed structure with provenance. Keep synthetic events in tests only.
