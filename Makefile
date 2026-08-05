.PHONY: dev build clean deploy prune

# Files that live in the repo but must never be served. gomddoc's `exclude`
# does not cover markdown sources — it only suppresses page rendering, and the
# raw file is copied anyway. See the comment in .gomddoc/config.yml.
PRUNE = public/CLAUDE.md

## Development server with live reload
dev:
	gomddoc preview --open

## Production build (static site in public/)
build:
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
