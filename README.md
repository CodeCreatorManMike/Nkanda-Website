# Nkanda — marketing / demo website

**Live: [codecreatormanmike.github.io/Nkanda](https://codecreatormanmike.github.io/Nkanda/)**

A fully static, no-build, no-dependency demo of the Nkanda visa-application flow on the web — landing page → destination browse → apply → travelers → documents → checkout → confirmation. It exists to show the process to someone before they install the app, and to hand off to it ("Continue in the Nkanda app").

This is **completely separate from `NkandaApp/`** (the iOS app) — different codebase, different language, no shared build step. They share only a visual language and the same underlying visa-category data, re-expressed independently in `js/data.js`.

## Run it

No install step. Any static file server works:

```bash
cd website
python3 -m http.server 8000
```

Open `http://localhost:8000/index.html`.

(Opening `index.html` directly via `file://` mostly works too, but the browser's Geolocation API and some fetches are blocked on `file://` in most browsers — use a local server.)

## What's real vs. simulated

- **Real:** destination ranking, visa-category matching, acceptance-percentage math, document/traveler/checkout state — all computed client-side in `js/data.js` and `js/apply.js`, no fake numbers hardcoded per page.
- **Real:** geolocation-based citizenship detection (`js/geo.js`) — browser Geolocation API first, IP-based lookup (`ipapi.co`) as a fallback if permission is denied.
- **Simulated, clearly labeled:** the checkout form. No card network is contacted, nothing is charged, no payment data is transmitted anywhere — it's a local form-validation demo only. This is stated on the checkout screen itself.
- **Simulated:** document "upload" — clicking Upload just marks that document done locally; no file is actually read or stored anywhere (same honesty as the iOS app's demo upload).

## Structure

```
website/
  index.html            Landing page: hero, destination grid, how-it-works, trust strip
  destination.html      "Apply for your <Country> visa online" — passport/destination pickers, requirements
  apply.html            The multi-step flow: loading → match → travelers → details → docs → checkout → success
  css/style.css         Everything, one file, no build step
  js/
    data.js             Destinations, the 5-category visa model, matchRoute() — mirrors the iOS app's logic
    geo.js               Geolocation + IP-based country detection
    main.js              Landing page interactivity
    destination.js        Destination page interactivity
    apply.js              The apply-flow state machine
  assets/
    flags/               All ~250 country flag SVGs
    images/countries/     Portrait photos — 47 countries have a real photo; others fall back to a flag-forward card
    images/site/          Logo + the landing-page hero graphic (from site_assets/)
    countries.json         Full country code/name list
```

## Extending country photo coverage

`assets/images/countries/<code>.jpg` — add a file named by ISO country code and it's automatically picked up (see `PHOTO_CODES` at the top of `js/data.js`, which lists which codes currently have one). Add the destination's other metadata (validity, guaranteed days) to `FEATURED` or `EXTRA` in the same file.

## Redeploying to GitHub Pages

The live site is a static snapshot of this folder, published at the root of the `gh-pages` branch (GitHub Pages can only serve a repo's root or `/docs` — not an arbitrary nested folder like `Documents/nkanda/website/`). Whenever the website changes, redeploy with a disposable worktree so the main working tree is never touched:

```bash
git worktree add /tmp/nkanda-ghpages-wt gh-pages
rm -rf /tmp/nkanda-ghpages-wt/*
cp -R website/* /tmp/nkanda-ghpages-wt/
cd /tmp/nkanda-ghpages-wt
git add -A
git commit -m "Redeploy website"
git push origin gh-pages
cd - && git worktree remove /tmp/nkanda-ghpages-wt
```

GitHub Pages rebuilds automatically within a minute or two of the push. Never run `git checkout --orphan` or `git rm -rf .` directly in the main working tree — that deletes real project files on disk since branches share one working directory unless you explicitly use a worktree, as above.
