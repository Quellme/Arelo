# ARELO-356 + ARELO-357 upload bundle

Based on `origin/main` @ commit `6bf8476` (already contains ARELO-348 + ARELO-355 + the
consolidated ARELO-356/357 `arelo_dashboard.html` you uploaded earlier).

Upload each file to the SAME path in `Quellme/Arelo` shown below (create the `assets/icons/`
and `assets/social/` folders in GitHub's uploader if they don't exist yet — dragging this whole
folder into GitHub's "Upload files" page preserves the structure automatically).

| Path | Status | Ticket |
|---|---|---|
| `arelo_dashboard.html` | Already live on `main` — included here only for reference/completeness, no action needed | 356+357 |
| `assets/analytics.js` | NEW — required for any analytics event to fire anywhere on the site | 357 |
| `index.html` | Modified — CTA tracking + SEO/social meta | 356+357 |
| `coming-soon.html` | Modified — waitlist submit tracking + SEO/social meta | 356+357 |
| `feedback.html` | Modified — feedback opened/submitted tracking + SEO/social meta | 356+357 |
| `privacy.html` | Modified — SEO meta only | 356 |
| `terms.html` | Modified — SEO meta only | 356 |
| `arelo_login.html` | Modified — noindex meta only | 356 |
| `arelo_onboarding.html` | Modified — noindex meta only | 356 |
| `robots.txt` | NEW | 356 |
| `sitemap.xml` | NEW | 356 |
| `_redirects` | Modified — `/dashboard` now 301s to `/demo` instead of duplicating it | 356 |
| `assets/icons/favicon-16x16.png` | NEW | 356 |
| `assets/icons/favicon-32x32.png` | NEW | 356 |
| `assets/icons/apple-touch-icon.png` | NEW | 356 |
| `assets/social/arelo-social-preview.png` | NEW | 356 |

Analytics will not fire anywhere on the site until `assets/analytics.js` is uploaded (every
call site already checks `if (window.AreloAnalytics)`, so it silently no-ops without it — no
errors either way). It will still be a no-op even once uploaded until the ARELO-357 external
site-id dependency is supplied (see `assets/analytics.js`'s `ARELO_ANALYTICS_DOMAIN`).
