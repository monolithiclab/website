---
title: "gomddoc — Monolithic Lab"
description: "gomddoc, a documentation server and static site generator for Markdown by Monolithic Lab, with search and a built-in MCP server for AI agents."
lang: "en"
hero:
  compact: true
  label: "Developer tool"
  headline: "gomddoc"
  subheadline: "A folder of Markdown served as a documentation site for people and an MCP server for their AI agents."
---

gomddoc is a single Go binary that turns a folder of Markdown into a fast, searchable documentation site. The same
URL answers a browser with a themed HTML page and an AI agent with the raw Markdown, and a built-in MCP server lets
agents search and read the docs directly. It runs as a production HTTP server, or builds a static site for any host.
Monolithic Lab's own websites, monolithiclab.fr included, are built with it.

## What it does

- **Serves Markdown as a site.** Pages render inside a theme, with clean URLs, navigation, a table of contents and a
  search dialog. Images, styles and any other file are served with their type.
- **Answers people and agents.** A request with `Accept: text/markdown` gets the Markdown source. `gomddoc mcp`, on
  stdio or over HTTP, gives AI clients read-only tools to search, read pages and sections, and walk the navigation.
- **Builds static sites.** `gomddoc build` writes clean-URL directories, a 404 page, a sitemap, an Atom feed and
  redirect stubs, ready for GitHub Pages, a bucket or a CDN.
- **Takes care of search and SEO.** A full-text index built at startup, canonical URLs, Open Graph tags, JSON-LD,
  `hreflang` for translated pages and a `robots.txt`.
- **Reads content from git.** A site can be served straight from a `git+https://` or `git+ssh://` repository.
- **Documents itself.** `gomddoc help` serves the user guide embedded in the binary, and `gomddoc doctor` lists every
  configuration and content problem with its fix.
- **Runs in production.** Secure defaults (path jail, hidden files blocked, security headers, optional Basic Auth),
  gzip, ETags, Prometheus metrics, health endpoints and graceful shutdown.

## Get it

```bash
brew install monolithiclab/tap/gomddoc
gomddoc preview --open ./docs
```

Releases are published for Linux and macOS, on amd64 and arm64, through GitHub Releases, the Homebrew tap and a
container image on GitHub Container Registry. Each release carries a software bill of materials and Sigstore-signed
checksums. The project is released and in use, before version 1.0.

## Licence

The source code is public on [GitHub](https://github.com/monolithiclab/gomddoc). Noncommercial use is free under the
PolyForm Noncommercial License 1.0.0. Use in or for a business, internal use included, needs a commercial licence
from Monolithic Lab, priced per deployment. [Licensing](https://gomddoc.com/docs/licensing)

## Links

- [gomddoc.com](https://gomddoc.com), the product site and documentation
- [Source code](https://github.com/monolithiclab/gomddoc)
- [Themes](https://github.com/monolithiclab/gomddoc-themes)
- [Support](/apps/gomddoc/support/)
- [Privacy policy](/apps/gomddoc/privacy/)
