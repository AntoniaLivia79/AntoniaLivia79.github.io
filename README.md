# AntoniaLivia79.github.io — Project Guide

This repository contains the source for my personal site hosted on GitHub Pages. It is a static site: HTML, CSS, and a small amount of client‑side JavaScript to render the blog from a JSON file.

Use this guide to create and maintain content (especially blog posts and tags).

## Quick Tips
- Hard refresh after deploying changes: press Ctrl + Shift + R in your browser to bust the cache.
- Keep JSON valid. A single trailing comma or missing quote in posts.json will break blog rendering.
- Assets belong under files/ (e.g., files/images/...). Link to them with site‑relative paths like /files/images/your-image.png.

## Site Structure
Top-level files:
- index.html — Home page with overview/links.
- blog.html — Blog front page that shows up to seven most recent days of posts. Renders from posts.json via blog.js. Includes tag filter UI.
- archives.html — Older posts (more than 7 days old), grouped by month. Also supports tag filtering.
- blog.js — Client-side renderer. Loads posts.json, sanitizes text, linkifies URLs, groups by date/month, and renders images/YouTube. Handles tag chips and filtering via URL hash (#tag=...).
- posts.json — Content store for blog posts. Edit this file to add new posts.
- styles.css — Site-wide styling (typography, layout, tag chips, blog cards, etc.).
- files/ — Static assets such as images or extra HTML files. Example: files/images/avatar.png, files/enchanter_map.html.
- spacetrader/ — JavaScript game prototype.
- CNAME — Custom domain configuration for GitHub Pages (do not edit unless changing domain).

## How the Blog Works
- Data source: blog.js fetches posts.json with no-store caching to pick up fresh content after deploy.
- Rendering:
  - Blog page shows the seven most recent date groups (a date group can contain multiple posts on the same day).
  - Archives page shows posts older than 7 days, grouped by month with a simple month navigation list.
- Tagging:
  - Each post can have an optional tags array of strings. Tags are displayed as chips on each post.
  - The tag filter at the top aggregates all tags and shows counts. Clicking a tag sets the URL hash (#tag=...) and filters both Blog and Archives.
  - “All” clears the filter and shows all posts for that page.
- Safety:
  - Text and paragraph content is sanitized to allow only a small, safe subset of inline HTML tags.
  - External links open in a new tab with rel=noopener noreferrer.
- Media:
  - Images are lazy-loaded and styled; YouTube links are embedded via an iframe when a youtube field is present.

## Authoring Content (posts.json)
posts.json is a single JSON array of post objects. Each object represents a post. Posts are displayed in descending date order.

Required fields:
- date: string in YYYY-MM-DD format.

Optional fields:
- text: string (single-paragraph content). If both text and paragraphs are provided, paragraphs takes precedence.
- paragraphs: array of strings (multiple paragraphs for the same post).
- images: array of objects with { "src": "files/images/your-image.png", "alt": "Alt text" }.
- youtube: string (a YouTube URL; can be youtu.be short link or youtube.com/watch?v= style).
- tags: array of strings (e.g., ["projects", "retrogaming"]). Multiple tags are supported.

### Minimal single-paragraph post
[
  {
    "date": "2025-09-01",
    "text": "This is a single paragraph post with an https://example.com link.",
    "tags": ["note", "example"]
  }
]

### Multi-paragraph post with image and tags
[
  {
    "date": "2025-09-01",
    "tags": ["projects", "retrogaming"],
    "paragraphs": [
      "First paragraph. You can also include <a href=\"https://example.com\">HTML links</a>.",
      "Second paragraph with another URL that will be auto-linked: https://example.org/news",
      "Third paragraph with inline <code>code</code>."
    ],
    "images": [
      { "src": "files/images/example.jpg", "alt": "An example image" }
    ]
  }
]

### Notes and Rules
- Dates and order: Dates control ordering. Use YYYY-MM-DD. Multiple posts on the same date are grouped under one date heading.
- Paragraphs vs text: If both are present, paragraphs is used and text is ignored.
- Allowed inline HTML in text/paragraphs: a, em, strong, b, i, u, s, code, kbd, mark, small, sub, sup, span, br. Other tags are stripped for safety.
- Links: http(s) links are auto-linkified. Relative links to files/... are converted to site-root /files/... and open in a new tab.
- Media: images and youtube can appear alongside text or paragraphs.
- Tags: Optional. Add tags to categorize posts and enable filtering. Tags are case-sensitive in display; filtering matches exact string.
- Accessibility: Always include a descriptive alt for each image.

## Adding Images and Files
- Place images under files/images/.
- Reference them from posts.json using a site-relative path, for example: "src": "files/images/your-photo.jpg".
- Include helper pages under files/ (e.g., files/enchanter_map.html) and link to them in post content.

## Tag Filtering Behavior
- The top “Tags” section shows an All chip and one chip per tag with a count of posts containing that tag.
- Clicking a tag updates the URL to #tag=YourTag and filters displayed posts accordingly.
- The filter works on both Blog (recent) and Archives pages, with the latter still restricting to posts older than ~30 days before filtering by tag.

## Troubleshooting
- Blog shows “Error loading blog”: Check that posts.json is valid JSON (use a JSON linter) and is accessible.
- A post or image does not appear: Verify the file path exists under files/, the date is valid, and JSON is properly formatted.
- Tag filter shows 0 posts: Ensure the selected tag exists on at least one post; remember filtering applies after the recent/archival split.

## Local Preview
- Since this is a static site, you can open blog.html and archives.html directly in a browser, but some browsers restrict fetch from file:// URLs.
- Easiest approach: use GitHub Pages to view after pushing. Alternatively, run a small local web server (e.g., Python’s http.server) if needed.
- After pushing changes, use Ctrl + Shift + R to hard refresh.

## Maintenance
- Keep posts.json tidy and consistent; prefer meaningful tags and accurate alt text.
- When changing look & feel, adjust styles.css. Tag chip styles live at the bottom of styles.css.
- For structural changes to blog rendering, modify blog.js.