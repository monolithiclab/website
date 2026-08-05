# Monolithic Lab — Website Project Conventions

## Brand & Design

All design rules (colors, typography, visual language, layout patterns) live in **`brand/` in the
private `monolithiclab/company` repository** — that is the single source of truth for visual decisions,
shared with the print documents so the site and the PDFs cannot drift apart. This repository is public
and holds the implementation only; this file covers technical conventions.

Summary, so a change can be sanity-checked without the private repo to hand: warm paper and burgundy
palette, Instrument Serif headings, DM Sans body. No border-radius, no box-shadows, no gradients, no
photographs. Sharp corners, flat colours, grid layouts, mobile-first.

## Stack

- **Static site generator:** gomddoc (no JavaScript framework)
- **CSS:** Hand-written, no framework — vanilla CSS with custom properties
- **JS:** Vanilla JavaScript, minimal and progressive-enhancement only
- **Fonts:** Google Fonts (Instrument Serif, DM Sans) via `<link>` in template
- **Assets:** CSS and JS inlined into HTML via gomddoc's `inlineCSSAsset` / `inlineJSAsset`

## Build & Serve

| Command      | Description                                          |
| ------------ | ---------------------------------------------------- |
| `make dev`   | Start development server with live reload            |
| `make build` | Production build (static output in `public/`)        |
| `make clean` | Remove build output                                  |
| `make deploy`| Push to `main`, triggering GitHub Actions → GitHub Pages |

## CSS Conventions

- **BEM-like naming:** `.block__element--modifier`
- **No nesting deeper than 2 levels** in selectors
- **Custom properties** for all colors, spacing, and type sizes
- **Mobile-first** media queries
- Single CSS file (`.gomddoc/assets/themes/le-bureau/main.css`), inlined via `inlineCSSAsset`

## Marketing Voice

- **No first person** — never use "je"/"I", "mon"/"my", "moi"/"me" in any page copy
- Use impersonal constructions, "Monolithic Lab" as subject, or third person for the bio
- Direct address ("vous"/"you") is fine

## Directory Structure

The site is the repository root — there is no `Website/` wrapper directory.

```
.
  .gomddoc/
    config.yml                          # Site config (title, domain, theme, language)
    assets/themes/le-bureau/
      layouts/default.html.tmpl         # Single page template (handles all layouts)
      partials/                         # Header, footer, head partials
      main.css                          # Stylesheet (inlined via inlineCSSAsset)
      main.js                           # JS — menu + scroll reveal (inlined via inlineJSAsset)
  README.md                             # FR homepage (directory index)
  approche.md                           # FR approach page
  cto-temps-partage.md                  # FR fractional CTO pillar page
  expertises.md                         # FR expertise page (4 modes d'intervention)
  references.md                         # FR case studies (MeilleursAgents, Prose)
  faq.md                                # FR frequently asked questions
  contact.md                            # FR contact page
  mentions-legales.md                   # FR legal page
  en-us/
    README.md                           # EN homepage (directory index)
    approach.md                         # EN approach page
    fractional-cto.md                   # EN fractional CTO page
    expertise.md                        # EN expertise page
    references.md                       # EN references page
    faq.md                              # EN FAQ page
    contact.md                          # EN contact page
    legal.md                            # EN legal page
  images/                               # Static images, SVGs, favicon
```

## URLs

- gomddoc strips `.md` extensions by default (`strip_extensions: [".md"]`)
- Content pages use flat `.md` files (e.g., `approche.md`), not `folder/README.md`
- Only homepage indexes remain as `README.md` (root and `en-us/`)
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

The site uses a custom `le-bureau` theme with a single `default.html.tmpl` template.

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
