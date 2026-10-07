# monolithiclab.fr

Source of [monolithiclab.fr](https://monolithiclab.fr), the Monolithic Lab website (French at the root, English
under `en-us/`). Built with [gomddoc](https://github.com/monolithiclab/gomddoc) into a static site and served by
GitHub Pages.

**The root `README.md` is the French home page, not a repository README.** gomddoc renders each directory's
`README.md` as that directory's index, so the human README lives here in `.github/`, which GitHub shows first and
gomddoc never publishes.

## Status

Live at [monolithiclab.fr](https://monolithiclab.fr): ten pages and six articles in each language, plus placeholder
pages for the Hazereel and Mojiroll apps under `apps/`. Open items are tracked privately with the rest of the
company's plan.

## Working on the site

Needs `gomddoc` on the `PATH` (`go install github.com/monolithiclab/gomddoc/cmd/gomddoc@<version>`, the version
pinned in `.github/workflows/deploy.yml`).

```sh
make help    # every target, with what it does
make run     # local preview with live reload, opens the browser
make ci      # the gate: lint checks, then the production build into public/
```

Every push to `main` deploys. The palette (`_tokens.css`) is generated from the private company repo; never edit it
by hand.

## Documentation

- [CLAUDE.md](../CLAUDE.md): conventions for contributors and agents (hard rules, placements, the theme's front
  matter and components).
- `.gomddoc/config.yml` and `Makefile`: the site config and the lint and prune invariants, each with its reason.

## Licence

No licence file yet. Until one is chosen, the content and the `basalt` theme are © Monolithic Lab, all rights
reserved; the fonts in `fonts/` carry their own OFL notices.
