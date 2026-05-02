# book-reader

A lightweight static book reader for multi-page Canva exports. It is designed to run on GitHub Pages, embed cleanly in a Wix iframe, and stay easy to port into WordPress later.

## Files

- `index.html` sets up the reader markup.
- `style.css` contains scoped `br-` styles for layout and responsive behavior.
- `script.js` controls page navigation and image loading.
- `pages/` stores your exported book page images.

## How to add pages

1. Export each Canva page as an individual image.
2. Rename the files in sequence:
   - `page-01.webp`
   - `page-02.webp`
   - `page-03.webp`
3. Put the files inside `pages/`.
4. Update the `pages` array in `script.js` so it matches your actual files.

Example:

```js
const pages = [
  "pages/page-01.webp",
  "pages/page-02.webp",
  "pages/page-03.webp",
  "pages/page-04.webp"
];
```

That array is the only place you need to edit to add or remove pages.

## Canva export naming

If Canva exports files with longer names, rename them before uploading to this repo so the sequence stays predictable.

Recommended naming pattern:

- `page-01.webp`
- `page-02.webp`
- `page-03.webp`
- `page-04.webp`

Using zero-padded numbers keeps the files sorted correctly.

## Host on GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open repository settings.
3. Go to Pages.
4. Set the source to deploy from the main branch.
5. Choose the root folder (`/`).
6. Save the settings.
7. Your reader will be available at:
   `https://YOUR-USERNAME.github.io/book-reader/`

## Embed in Wix with an iframe

Use an HTML embed element in Wix and paste this iframe code:

```html
<iframe
  src="https://YOUR-USERNAME.github.io/book-reader/"
  style="width:100%; height:900px; border:0;"
  loading="lazy"
></iframe>
```

If needed, adjust the iframe height in Wix to better fit your book.

## Move into WordPress later

This project is intentionally simple to make migration easy.

Options:

- Copy the HTML from `index.html` into a Custom HTML block and keep the CSS and JS in your theme or a small plugin.
- Move the reader markup into a theme template part.
- Load `style.css` and `script.js` through `wp_enqueue_style()` and `wp_enqueue_script()`.
- Keep your book images in the WordPress media library and update the `pages` array with those URLs.

All classes are scoped with the `br-` prefix to reduce style conflicts.

## Missing image handling

If a page image is missing or renamed incorrectly, the reader shows this message:

> Page image not found. Check that the file exists in /pages and matches the filename in script.js.

## Notes

- No build step
- No dependencies
- No external libraries
- Works as a static site
- Ready for later upgrades such as flipbook animation
