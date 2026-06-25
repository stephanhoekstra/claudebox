# Todoist Parked Column Toggle

A small Chrome extension for app.todoist.com. On the Inbox page in **Board**
view, it adds a blue "Show Parked" / "Hide Parked" button in the bottom-right
corner. The "Parked" column is hidden by default; clicking the button
visually restores (or hides again) the column. The tasks in that column are
not modified or moved — they remain exactly where they are, only the
column's visibility is toggled.

## Installing (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Go to your Todoist Inbox, switch to Board view, and make sure you have a
   column named "Parked".

## Notes

The "Parked" column (and the divider before it) is located via fixed
positional CSS selectors (`PARKED_COLUMN_SELECTORS` in `content.js`), since
these target the `<section>` of the 3rd and 4th columns in the board view.
If Todoist changes its board layout, or the "Parked" column moves to a
different position, these selectors will need to be updated.

## Diagnosing breakage

If Todoist's board layout changes, the selectors above will stop matching.
When that happens, this extension:

- logs a `console.warn` with the offending selector, and
- shows a one-time `alert()` naming the selector that no longer matches.

Open DevTools on the Inbox board view, inspect the actual "Parked" column,
and update `PARKED_COLUMN_SELECTORS` in `content.js` to match the new DOM
structure.
