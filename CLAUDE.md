# claudebox

A collection of small, self-contained Chrome extensions ("plugins"), each
tweaking the behavior of a specific website for personal use.

## Repo structure

- One folder per extension, at the repo root.
- Folder name should be descriptive and kebab-case, e.g.
  `todoist-parked-toggle`, `gmail-snooze-shortcut`.
- Each folder is a complete, independently loadable Chrome extension
  (Manifest V3) — it must contain its own `manifest.json` and can be loaded
  unpacked via `chrome://extensions` by selecting that folder directly.
- Each folder has its own `README.md` with what it does and install/usage
  notes.

## Conventions for new plugins

- Use Manifest V3.
- Prefer a content script (`content.js` + `styles.css`) scoped via `matches`
  to the specific site/domain. Avoid requesting broad permissions
  (`<all_urls>`, `tabs`, etc.) unless the feature genuinely needs them.
- Many target sites (e.g. Todoist, Gmail) are SPAs with generated/hashed CSS
  class names that change between deployments. Locate elements by stable
  signals where possible: visible text content, `aria-*` attributes,
  `data-testid`, roles, etc. Avoid hardcoding hashed class names.
- Re-apply changes on DOM mutations (`MutationObserver`) and on SPA
  navigation (poll `location.href` or listen for `popstate`), since these
  sites don't do full page reloads when navigating.
- Keep injected UI minimal and clearly identifiable (fixed-position button,
  unique `id`), styled via a small `styles.css` rather than inline styles
  where practical.
- No build step / dependencies — plain HTML/CSS/JS so any plugin can be
  loaded unpacked as-is.
- Document any brittle DOM-detection heuristics in the plugin's README so
  they're easy to find and fix when the target site changes.

## Adding a new plugin

1. Create a new folder at the repo root, e.g. `mkdir my-plugin`.
2. Add `manifest.json`, `content.js`, `styles.css` (as needed), and
   `README.md` following the conventions above.
3. Test by loading the folder unpacked in Chrome.
