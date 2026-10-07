# monolithiclab.fr

Source of [monolithiclab.fr](https://monolithiclab.fr), the Monolithic Lab website (French at the root, English
under `en-us/`). Built with [gomddoc](https://github.com/monolithiclab/gomddoc) into a static site and served by
GitHub Pages.

**The root `README.md` is the French home page, not a repository README.** gomddoc renders each directory's
`README.md` as that directory's index, so the human README lives here in `.github/`, which GitHub shows first and
gomddoc never publishes.

## Working on the site

Needs `gomddoc` on the `PATH` (`go install github.com/monolithiclab/gomddoc/cmd/gomddoc@<version>`, the version
pinned in `.github/workflows/deploy.yml`).

```sh
make help    # list every target
make run     # local preview with live reload, opens the browser
make build   # production build into public/
make ci      # the gate: lint checks, then the build
make deploy  # push main: GitHub Actions builds and publishes the live site
```

Every push to `main` deploys. The palette (`_tokens.css`) is generated from the private company repo; never edit it
by hand. Conventions for contributors and agents: [CLAUDE.md](../CLAUDE.md).
