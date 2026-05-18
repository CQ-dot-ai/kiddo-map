# Kiddomap Search Console Priority

## What changed

- Sitemap now includes:
  - home
  - about/contact/privacy/terms
  - 3 guide pages
  - 15 core place pages only
- Non-core place pages are still reachable through internal links, but are no longer pushed as first-class sitemap targets.
- Sitemap no longer writes a fake `lastmod` timestamp for every page on every request.

## Core place pages to keep in sitemap

These pages have the strongest combination of demand, clearer search intent, and better chance of earning indexation on a young domain.

1. `/places/klcc-park`
2. `/places/zoo-negara`
3. `/places/sunway-lagoon`
4. `/places/aquaria-klcc`
5. `/places/farm-in-the-city`
6. `/places/perdana-botanical-garden`
7. `/places/the-parenthood-sunway`
8. `/places/kidzania`
9. `/places/petrosains`
10. `/places/taman-botani-negara-shah-alam`
11. `/places/islamic-arts-museum`
12. `/places/national-museum`
13. `/places/wetland-studios-putrajaya`
14. `/places/bank-negara-museum-art-gallery`
15. `/places/national-science-centre`

## Pages to downgrade from sitemap for now

All other `/places/*` pages should stay linked from guides and related-place modules, but should not be treated as primary sitemap targets until:

- they have stronger unique copy
- they have more useful photos
- they have clearer venue facts
- the domain has stronger search authority

## Search Console issue handling

### 1. Not found (404)

Status: needs manual URL check in GSC.

Action:
- open the single URL in Search Console
- if the page should exist, restore it
- if the page should not exist, either:
  - keep the 404 and remove all internal references, or
  - add a 301 redirect to the closest active replacement

Current blocker:
- exact URL is UNKNOWN until exported from Search Console

### 2. Discovered - currently not indexed

Interpretation:
- Google knows the URLs but is not spending crawl budget on them yet

Action:
- rely on guide pages as the main entry points
- keep sitemap focused on the strongest pages only
- strengthen internal links from guide pages to core place pages

### 3. Crawled - currently not indexed

Interpretation:
- Google fetched the page and decided it was not strong enough to index

Likely causes on Kiddomap:
- place pages are still too template-driven
- some pages do not yet have enough unique value
- image and source quality is still uneven

Action:
- improve only the core 10-15 place pages first
- add stronger unique descriptions, venue notes, and photo quality
- avoid expanding sitemap again until those pages improve

## Next SEO work order

1. Export the exact 38 unindexed URLs from Search Console
2. Classify each URL into:
   - keep
   - downgrade
   - redirect/fix
3. Improve the 15 core place pages before pushing more place URLs into sitemap
4. Re-submit sitemap and request validation after Google recrawls
