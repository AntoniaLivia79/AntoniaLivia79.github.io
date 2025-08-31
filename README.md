# AntoniaLivia github.io project page

## Tips

To hard refresh the browser page after new commits, use the `Ctrl + Shift + R` shortcut

## Blog posts JSON format

You can write a post with a single text string (backward compatible):

[
  {
    "date": "2025-09-01",
    "text": "This is a single paragraph post with an https://example.com link."
  }
]

Or you can provide multiple paragraphs for the same date using the paragraphs array:

[
  {
    "date": "2025-09-01",
    "paragraphs": [
      "First paragraph. You can also include <a href=\"https://example.com\">HTML links</a>.",
      "Second paragraph with another URL that will be auto-linked: https://example.org/news",
      "Third paragraph with inline <code>code</code>."
    ]
  }
]

Notes:
- If both paragraphs and text are present, paragraphs takes precedence.
- Basic inline HTML is allowed in text/paragraphs: a, em, strong, b, i, u, s, code, kbd, mark, small, sub, sup, span, br. Links open in a new tab and unsafe protocols are removed.
- You can still attach media fields like images and youtube alongside paragraphs or text. 