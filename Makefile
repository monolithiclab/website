include common.mk

THEME := .gomddoc/assets/themes/basalt

# Files that live in the repo but must never be served. Up to gomddoc v0.1.1,
# `exclude` still emitted a meta-refresh stub at the markdown path, publishing
# the filename; v0.1.2 (pinned in CI) fixed it, and prune stays as defence in
# depth. See the comment in .gomddoc/config.yml.
PRUNE = public/CLAUDE.md

.PHONY: run
run: ## Local preview with live reload; opens the browser
	@gomddoc preview --open

# Cleans first on purpose. gomddoc skips only the output directory it is
# currently writing to, so a stale public/ left in the source tree gets walked
# as content — a build into any other directory then renders 48 files instead
# of 16, duplicating every page under public/.
.PHONY: build
build: clean ## Production build (static site in public/)
	gomddoc build . -o public -d monolithiclab.fr
	@$(MAKE) prune

.PHONY: lint
lint: lint-tokens lint-fonts lint-private ## Check the CLAUDE.md invariants: no colour literals, no Google Fonts, no private files

.PHONY: ci
ci: lint build ## The gate: lint, then the production build (what the deploy workflow runs)

# A hex in the theme CSS reintroduces the drift the generated _tokens.css
# exists to prevent: colours come from company/brand/tokens.json only.
.PHONY: lint-tokens
lint-tokens:
	@if grep -nE '#[0-9a-fA-F]{3,8}\b' $(filter-out %/_tokens.css,$(wildcard $(THEME)/*.css)); then \
		echo "lint: colour literal in the theme CSS (above) — use var(--color-*) from _tokens.css"; exit 1; \
	fi

# Fonts are self-hosted: a request to Google's font CDN sends the visitor's IP
# to Google before consent (RGPD).
.PHONY: lint-fonts
lint-fonts:
	@if git grep -nE '//fonts\.(googleapis|gstatic)\.com' -- . ':!Makefile'; then \
		echo "lint: Google Fonts reference (above) — fonts are self-hosted in fonts/"; exit 1; \
	fi

# This repo is public, so private material must never be committed, and the
# repo's own tooling files must stay excluded from the published site.
.PHONY: lint-private
lint-private:
	@if git ls-files PLAN.md DESIGN_PROMPT.md docs | grep .; then \
		echo "lint: private file tracked in this public repo (above)"; exit 1; \
	fi
	@for f in CLAUDE.md Makefile common.mk; do \
		grep -qE "^  - \"$$f\"$$" .gomddoc/config.yml || { \
			echo "lint: $$f is not under exclude: in .gomddoc/config.yml"; exit 1; }; \
	done

# gomddoc always generates a tag index; the site uses no tags, so it is an
# empty page with an untranslated heading. prune drops it and its sitemap
# entry, then fails loudly if any private file survived into public/.
.PHONY: prune
prune: ## Remove files that must not be published, and fail loudly if any survives
	@rm -f $(PRUNE)
	@rm -rf public/tags
	@perl -0pi -e 's{\s*<url>\s*<loc>[^<]*/tags/</loc>.*?</url>}{}s' public/sitemap.xml
	@if find public \( -name 'CLAUDE.md' -o -name 'PLAN.md' -o -name 'DESIGN_PROMPT.md' \
	                   -o -name 'Makefile' -o -name 'common.mk' -o -path '*/docs/*' \) -print | grep .; then \
		echo "REFUSING: private file reached the build output (above)"; exit 1; \
	fi

.PHONY: clean
clean: ## Remove build output
	@rm -rf public

.PHONY: deploy
deploy: ## Publish the live site: push main, which GitHub Actions builds and deploys to monolithiclab.fr
	git push origin main
