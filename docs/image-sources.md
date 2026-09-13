# Image Sources

This file is a registry for externally sourced imagery used by the application.

## Rules

Use only images whose license permits the intended use. Prefer Pexels or Unsplash.

For each asset, record:
- local file path
- source site
- creator
- original source URL
- license
- download date
- any special rights considerations

Example:

```json
{
  "file": "public/images/hero.jpg",
  "source": "Pexels",
  "author": "Photographer Name",
  "sourceUrl": "https://www.pexels.com/photo/...",
  "license": "Pexels License",
  "downloadedAt": "YYYY-MM-DD",
  "notes": "No visible brand logos; used as marketing background."
}
```

Do not paste random Google Images URLs into production.

Pexels states that its photos/videos can be used free for commercial purposes, while noting that depicted brands, people, or other third-party rights may still apply.

Unsplash also allows broad free use, but its own guidance notes that additional rights can matter for recognizable people, brands, artwork, property, and similar subjects.

Before shipping an asset, check the current license/terms on the source site.
