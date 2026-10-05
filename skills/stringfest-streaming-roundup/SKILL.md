---
name: stringfest-streaming-roundup
description: Build or maintain a Stringfest-branded calendar of verified free livestreams, with official-source research, bounded collection, static HTML/CSS/JS, ICS, sharing, and GitHub Pages. Use for another roundup like JazzWatch or ClassicalWatch; not for a generic website or a list of recordings.
---

# Stringfest streaming roundups

Build a useful public guide with a small truthful dataset and maintainable source adapters. Preserve the user's current genre, audience, design, host, and scope choices. Read [the evidence contract](references/evidence.md) before research and [the implementation guide](references/implementation.md) before editing.

## Start from evidence and an isolated project

- For an existing roundup, inspect its instructions, code, data, deployment and current production behavior before changing it. Preserve working adapters and user edits.
- For a new roundup, use a separate directory/repository. Inspect the reference read-only: https://github.com/summerofgeorge/jazz-watch and, when useful, https://github.com/summerofgeorge/classical-live. Neither reference is authorization to modify it.
- Reuse architecture and validated fixtures, not existing event data, review timestamps, domain configuration, repository identity, or Google Analytics IDs. Research current official sources for the new subject. Empty coverage is better than invented broadcasts.
- Ask only for missing decisions that materially block work. Prepare the local site and reviewable deployment before requesting an unprovided repository/audience/domain decision. Prior explicit publication authorization persists within the current conversation.

## Keep Stringfest recognizable

Use warm paper `#eeece1`, dark ink `#3d3935`, red `#bd292f` as the starting palette. The supplied official PNG assets in `assets/` are unchanged originals; see [asset provenance](references/branding.md). Never redraw a Stringfest logo. If assets cannot be read or used, clean Stringfest Analytics text is acceptable. Inspect actual pixels before use.

JazzWatch's successful Art Deco treatment uses display typography, double rules, stepped rectangular details, concentric arches, and generous whitespace. Avoid decorative triangles and chevrons. The user's latest art direction takes precedence, and another genre may need its own restrained visual treatment. The official logo's existing shapes are not permission to add decorative motifs.

Include clear Stringfest attribution, a truthful George/about section, a support page inviting relevant introductions to Stringfest training, methodology, watching help, corrections contact, privacy, and sharing controls. Match current https://classicalwatch.stringfestanalytics.com/support.html for useful content conventions after inspecting it. Verify biographical credentials and business links before reuse; do not invent donations, payment links, costs, testimonials, endorsements, or nonprofit status.

## Finish the actual deliverable

- Build and inspect `dist/`, test root and repository-prefix deployment, mobile/desktop layout, accessibility, source failures, timezone and ICS behavior, and sharing fallbacks.
- Prefer GitHub Pages for these projects unless the user chooses otherwise. Publish only with an authorized repository/audience. Configure approved custom domain before DNS, then verify DNS, certificate, HTTPS redirect, workflow success, production routes, and actual assets. Never claim a preview is production.
- Analytics is optional and only installed when requested. Use the actual separate property/stream in the specified account. Never copy a reference site's ID. Restrict the tag to the production hostname, disable ad features, exclude personal form text and search query values, and update privacy copy. Confirm collection separately from installation.
- Report the true source count, provider overlap, automatic/manual coverage, maintenance duties, tests and deployment limitations. Never equate a source registry candidate with a working source.
- Package source, fixtures, docs, and dist without credentials, `.git`, `node_modules`, local captures, or private account data. If Library is requested, use the current Library skill and confirmed uploaded IDs; otherwise provide a verified local ZIP and state the capability limit.

For repeat work, improve this skill only when a real failure demonstrates the need. Keep live data and account identifiers in the project, not this skill.
