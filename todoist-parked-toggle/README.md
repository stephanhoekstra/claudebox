# Todoist Parked Column Toggle

A small Chrome extension for app.todoist.com. On the Inbox page in **Board**
view, it adds a blue "Hide Parked" / "Show Parked" button in the bottom-right
corner. Clicking it visually collapses (hides) or restores the "Parked"
column. The tasks in that column are not modified or moved — they remain
exactly where they are, only the column's visibility is toggled.

## Installing (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Go to your Todoist Inbox, switch to Board view, and make sure you have a
   column named "Parked".

## Notes

The "Parked" column is located via a fixed positional CSS selector
(`PARKED_COLUMN_SELECTOR` in `content.js`), since this column must be the
4th column in the board view. If Todoist changes its board layout, or the
"Parked" column moves to a different position, this selector will need to be
updated.
