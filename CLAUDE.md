# Monolithic Lab — Website Project Conventions

## Brand & Design

All design rules (colors, typography, visual language, layout patterns) live in **`brand/` in the
private `monolithiclab/company` repository** — that is the single source of truth for visual decisions,
shared with the print documents so the site and the PDFs cannot drift apart. This repository is public
and holds the implementation only; this file covers technical conventions.

Summary, so a change can be sanity-checked without the private repo to hand ("Basalt"): dark basalt
ground, stone and bone text, one ochre accent. Big Shoulders Display 800 uppercase for display,
Hanken Grotesk for everything else. The one motif is the monolith: an ochre strata slab beside hero
headlines, repeated as staircase bars in step sequences. Rules, not boxes. No border-radius, no
shadows, no transparency, no soft gradients (the strata's hard-stop stripes are the exception), no
photographs. Hover is an instant fill swap; the slab rising on load is the only animation.

## Stack

- **Static site generator:** gomddoc (no JavaScript framework)
- **CSS:** Hand-written, no framework — vanilla CSS with custom properties
- **JS:** Vanilla JavaScript, minimal and progressive-enhancement only
- **Fonts:** Big Shoulders Display + Hanken Grotesk, self-hosted in `fonts/` (variable woff2)
- **Assets:** CSS and JS inlined into HTML via gomddoc's `inlineCSSAsset` / `inlineJSAsset`

## Build & Serve

| Command       | Description                                              |
| ------------- | -------------------------------------------------------- |
| `make dev`    | Start development server with live reload                |
| `make build`  | Production build (static output in `public/`)            |
| `make clean`  | Remove build output                                      |
| `make deploy` | Push to `main`, triggering GitHub Actions → GitHub Pages |

## CSS Conventions

- **BEM-like naming:** `.block__element--modifier`
- **No nesting deeper than 2 levels** in selectors
- **Custom properties** for all colors, spacing, and type sizes
- **Mobile-first** media queries
- Two CSS files, both inlined via `inlineCSSAsset` and both under
  `.gomddoc/assets/themes/basalt/`:
  - `_tokens.css` — **generated, do not edit.** The palette, rendered from `brand/tokens.json` in
    the private company repo by `make brand` there. Inlined first so `main.css` can use it.
  - `main.css` — everything else. Write no colour literal here: use `var(--color-*)`, or
    `rgb(var(--rgb-*) / <alpha>)` for the translucent cases. Adding a hex reintroduces the drift
    the tokens exist to prevent.
- **Fonts are self-hosted** in `fonts/` — nothing may be loaded from Google's CDN (RGPD)

## Marketing Voice

- **Positioning:** fractional CTO (_CTO à temps partagé_) and interim CTO (_CTO de transition_) for
  small and mid-sized companies, both carrying the company's AI transformation (engineering and
  every other team). Fixed-price projects (_missions au forfait_: assessment, AI exploration, POC,
  MVP) are a separate offer: a defined deliverable, never a substitute for the CTO roles
- **AI approach:** modeled on the forward deployed engineer (on site, real data, judged on usage);
  the adoption plan is co-built with the client's teams, never a ready-made method
- **Leadership stance:** a CTO who builds, not just manages: knows the craft hands-on and drives AI
  agents for execution
- **EN terminology:** "interim CTO" is the primary term (US search usage); "transitional CTO" appears
  as a synonym
- **No first person** — never use "je"/"I", "mon"/"my", "moi"/"me" in any page copy
- Use impersonal constructions, "Monolithic Lab" as subject, or third person for the bio
- Direct address ("vous"/"you") is fine

## Directory Structure

The site is the repository root — there is no `Website/` wrapper directory.

```
.
  .gomddoc/
    config.yml                          # Site config (title, domain, theme, language)
    assets/themes/basalt/
      layouts/default.html.tmpl         # Page template (handles all layouts)
      layouts/error.html.tmpl           # 404 — without it gomddoc falls back to the default theme
      partials/                         # Header, footer, head partials
      _tokens.css                       # GENERATED palette — see company/brand/tokens.json
      main.css                          # Stylesheet (inlined via inlineCSSAsset)
      main.js                           # JS — menu, nav state, content components, form, cookies
  fonts/                                # Self-hosted woff2 + OFL notices (never load from Google)
  README.md                             # FR homepage (directory index)
  approche.md                           # FR approach page
  cto-temps-partage.md                  # FR fractional CTO pillar page
  cto-de-transition.md                  # FR interim (transitional) CTO pillar page
  transformation-ia.md                  # FR AI transformation page (FDE approach, adoption plan)
  expertises.md                         # FR offers page (CTO roles + missions au forfait)
  references.md                         # FR case studies (MeilleursAgents, Prose)
  faq.md                                # FR frequently asked questions
  contact.md                            # FR contact page
  mentions-legales.md                   # FR legal page
  articles/
    README.md                           # FR articles index
    *.md                                # FR articles (definitions, SMB case, FDE, AI-era CTO, experience)
  en-us/
    README.md                           # EN homepage (directory index)
    approach.md                         # EN approach page
    fractional-cto.md                   # EN fractional CTO page
    interim-cto.md                      # EN interim CTO page
    ai-transformation.md                # EN AI transformation page
    expertise.md                        # EN services page (CTO roles + fixed-price projects)
    references.md                       # EN references page
    faq.md                              # EN FAQ page
    contact.md                          # EN contact page
    legal.md                            # EN legal page
    articles/                           # EN articles index (README.md) + articles
  images/                               # favicon.svg, og-image{,-en}.png (rendered by `make og` in company)
```

## URLs

- gomddoc strips `.md` extensions by default (`strip_extensions: [".md"]`)
- Content pages use flat `.md` files (e.g., `approche.md`), not `folder/README.md`
- Only section indexes remain as `README.md` (root, `en-us/`, and the two `articles/` directories)
- All internal links use extensionless paths (e.g., `/contact`, `/en-us/approach`)
- Requests to `/contact.md` are 301-redirected to `/contact` by gomddoc
- In build mode, `approche.md` outputs to `approche/index.html` for static host compatibility

## i18n

- Default language: `fr` (content at root)
- English: `en-us/` subdirectory
- Language detection via `lang: "en"` frontmatter field (absent = French)
- Navigation and footer are language-aware in the template
- Cross-language links via `alternate` frontmatter field

## gomddoc Theme

The site uses a custom `basalt` theme with a single `default.html.tmpl` template.

**Template functions:**

- `inlineCSSAsset "main.css"` — inlines CSS inside `<style>` (returns `template.CSS`)
- `inlineJSAsset "main.js"` — inlines JS inside `<script>` (returns `template.JS`)
- `canonicalURL .Page.Path` — returns the canonical URL for a page

**Page layout** is controlled by frontmatter fields:

- `layout`: "home" or "page" — determines which sections render
- `hero`: object with headline, subheadline, label, cta_text, cta_url, compact
- `services`: array of service cards (home page only, currently 3 items)
- `trust_signals`: array (home page only, currently 3 items)
- `methodology`: array of timeline steps (currently 5 items)
- `contact_form`: boolean — renders the Formspree contact form
- `cta_band`: object with text, button_text, button_url
- `alternate`: URL of the corresponding page in the other language
