# AGENTS.md

The source of monolithiclab.fr, a public repo: Markdown pages built by gomddoc with the custom `basalt` theme into a
static site that GitHub Pages serves. French at the root, English under `en-us/`. The human README is
[.github/README.md](.github/README.md); `make help` lists every command.

## Hard rules

- **This repo is public: assume anything committed once is permanently readable.** Strategy, pricing, planning and
  brand rationale live in the private `company` repo. `PLAN.md`, `DESIGN_PROMPT.md` and `docs/` are gitignored, and
  `make lint` fails if one is ever tracked.
- **Every push to `main` deploys the live site** (`.github/workflows/deploy.yml`). Small copy changes (wording fixes,
  aligning a sentence) are committed **and pushed** to `main` directly: "All good for small copy changes, no worries
  with the commit and push." Design or layout changes, new pages and multi-file rewrites are committed, then shown,
  and pushed only once Nicolas says so.
- **`_tokens.css` is generated, never edited.** It is rendered from `brand/tokens.json` by `make brand` in the
  company repo, then committed here. `main.css` holds no colour literal: `var(--color-*)`, or
  `rgb(var(--rgb-*) / <alpha>)` for the translucent cases.
- **Nothing is loaded from Google's font CDN** (RGPD: the visitor's IP reaches Google before consent). Fonts are
  self-hosted in `fonts/`.
- **Marketing copy:** no first person in any page copy ("je"/"I", "mon"/"my", "moi"/"me"); write impersonally, with
  "Monolithic Lab" as subject, or in the third person for the bio. Direct address ("vous"/"you") is fine. No "not X,
  it's Y" contrasts, no fragment chains, no heavy em-dashes. "Monolithic Lab" is two words, never "Monolithic"
  alone. French copy follows `brand/editorial-fr.md` in the company repo (insécables, `« »`).
- **Facts about clients and past roles** (MeilleursAgents, Prose) come from `company/references/*.md` only. Never
  invent one.

## Constraints that look like bugs

- **The root `README.md` is the French home page**, not a repository README: gomddoc renders each directory's
  `README.md` as its index. The human README lives in `.github/`, which gomddoc never publishes.
- **Every repo-tooling file at the root is both excluded and pruned.** `AGENTS.md`, `Makefile` and `common.mk` are
  listed under `exclude:` in `.gomddoc/config.yml` (`make lint` checks it), and `make prune` deletes and then refuses
  any private file that reaches `public/`. Up to gomddoc v0.1.1, `exclude` still published a stub at the file's
  path; v0.1.2 fixed it, and prune stays as defence in depth. A new tooling file at the root joins both lists.
  Patterns that match nothing in a checkout (the gitignored files) stay out of `exclude:`, because `gomddoc doctor`
  flags them.
- **`make build` cleans first, on purpose.** gomddoc skips only the output directory it is writing to, so a stale
  `public/` gets walked as content and duplicates every page.
- **`make prune` deletes `public/tags/` and its sitemap entry.** gomddoc always generates a tag index; the site uses
  no tags.
- **`gtm_id` sits under `theme.vars`** in `config.yml` although it is no CSS property: gomddoc (still at v0.1.4)
  exposes no other extensible map to templates.
- **`layouts/error.html.tmpl` must exist**: without it gomddoc falls back to the default theme for the 404.
- **The vendored themes** (`dalle`, `default`, `monolithic`, `terminal`) under `.gomddoc/assets/themes/` are
  gitignored. Only `basalt` is ours.

## Traps `make ci` won't explain

- Internal links are extensionless (`/contact`, `/en-us/approach`): gomddoc strips `.md` and serves `approche.md` at
  `approche/index.html`.
- A page is French unless its front matter says `lang: "en"`. `alternate:` points at the same page in the other
  language and drives the language switch and `hreflang`, so set it on both sides.
- `make lint` greps the theme CSS for any hex, including inside a comment.
- **Local and deployed gomddoc can differ.** `make ci` uses whatever `gomddoc` is on the `PATH`; the deploy installs
  the `GOMDDOC_VERSION` pinned in `.github/workflows/deploy.yml`. A green local gate on a newer gomddoc proves nothing
  about the pinned one. A version bump changes that pin, then re-checks the comments in `.gomddoc/config.yml` and the
  `Makefile` that name v0.1.1/v0.1.2 behaviour (`exclude`, `theme.vars`), in the same commit.
- **A gomddoc bump can change the site, not only fix it.** Since v0.1.2, `.gomddoc/config.yml` is decoded strictly
  (`KnownFields(true)`): a misplaced key is a build error instead of a silent no-op, and a key that never applied
  starts applying (`color_chips: false` first took effect at the v0.1.2 bump). Check config.yml against the new
  version's schema and run `make ci` with that version before changing the pin.

## Where things go

- A content page is a flat `<slug>.md` (FR at the root, EN under `en-us/`), never `<slug>/README.md`; only the
  section indexes are `README.md` (root, `en-us/`, both `articles/`). Articles go in `articles/` and
  `en-us/articles/`; app pages (privacy, support) in `apps/<app>/`.
- Navigation and footer links are hard-coded, per language, in `partials/header.html.tmpl` and
  `partials/footer.html.tmpl` of `.gomddoc/assets/themes/basalt/`.
- Front matter the theme reads: `title`, `description`, `lang`, `alternate`, `hero` (`label`, `headline`,
  `subheadline`, `cta_text`, `cta_url`, `compact`), `cta_band` (`text`, `button_text`, `button_url`), `robots`.
- Structured blocks inside a page are custom elements defined in `main.js`: `<service-list>`/`<service-item>`,
  `<trust-grid>`/`<trust-card>`, `<step-timeline>`/`<step-item>`, `<contact-form>` (Formspree).
- CSS: `main.css` only, BEM-like (`.block__element--modifier`), selectors at most two levels deep, custom properties
  for colour, spacing and type, mobile-first media queries. `_tokens.css` and `main.css` are inlined into every page
  through `inlineCSSAsset`; JS (`main.js`, vanilla, progressive enhancement only) through `inlineJSAsset`.
- Open Graph images (`images/og-image{,-en}.png`) are rendered by `make og` in the company repo.

## Brand and voice

The design rules live in `brand/` in the private company repo, shared with the print documents. Summary ("Basalt"),
so a change can be sanity-checked without it: dark basalt ground, stone and bone text, one ochre accent. Big Shoulders
Display 800 uppercase for display, Hanken Grotesk for everything else. The one motif is the monolith: an ochre strata
slab beside hero headlines, repeated as staircase bars in step sequences. Rules, not boxes. No border-radius, no
shadows, no transparency, no soft gradients (the strata's hard-stop stripes are the exception), no photographs.
Hover is an instant fill swap; the slab rising on load is the only animation.

- **Positioning:** fractional CTO (_CTO à temps partagé_) and interim CTO (_CTO de transition_) for small and
  mid-sized companies, both carrying the company's AI transformation (engineering and every other team).
  Fixed-price projects (_missions au forfait_: assessment, AI exploration, POC, MVP) are a separate offer: a defined
  deliverable, never a substitute for the CTO roles.
- **AI approach:** modelled on the forward deployed engineer (on site, real data, judged on usage); the adoption
  plan is co-built with the client's teams, never a ready-made method.
- **Leadership stance:** a CTO who builds as well as manages: knows the craft hands-on and drives AI agents for
  execution.
- **EN terminology:** "interim CTO" is the primary term (US search usage); "transitional CTO" appears as a synonym.

## Documentation

| Document | Owns |
| --- | --- |
| `.github/README.md` | What the repo is, how to build and preview it |
| `.gomddoc/config.yml` | Site config, the `exclude:` list and why `exclude` is not a confidentiality boundary |
| `Makefile` | The lint invariants and the prune step, each with its reason |
| company `brand/` | Palette, type, logo, voice, French typography |
| company `PLAN.md` | Open website items (the 2026-09-24 audit) |

## Workflow

1. Minimal change, plus the owning doc in the same change
2. `make ci` green
3. Commit with the session's trailers; push only small copy fixes without asking (see Hard rules)
