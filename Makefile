.PHONY: dev build clean deploy prune

# Files that live in the repo but must never be served. gomddoc v0.1.1's
# `exclude` suppresses page rendering but still emits a meta-refresh stub at the
# markdown path, publishing the filename. No content leaks in build mode, but
# the name does. See the comment in .gomddoc/config.yml.
PRUNE = public/CLAUDE.md

## Development server with live reload
dev:
	gomddoc preview --open

## Production build (static site in public/)
# Cleans first on purpose. gomddoc skips only the output directory it is
# currently writing to, so a stale public/ left in the source tree gets walked
# as content — a build into any other directory then renders 48 files instead
# of 16, duplicating every page under public/.
build: clean
	gomddoc build . -o public -d monolithiclab.fr
	$(MAKE) prune

## Remove files that must not be published, and fail loudly if any survives
prune:
	@rm -f $(PRUNE)
	@if find public \( -name 'CLAUDE.md' -o -name 'PLAN.md' -o -name 'DESIGN_PROMPT.md' \
	                   -o -path '*/docs/*' \) -print | grep .; then \
		echo "REFUSING: private file reached the build output (above)"; exit 1; \
	fi

## Remove build output
clean:
	rm -rf public

## Deploy: push to main triggers GitHub Actions → GitHub Pages
deploy:
	git push origin main
