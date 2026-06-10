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

Todoist's web app uses generated CSS class names that change between
deployments, so this extension locates the "Parked" column by its visible
text label rather than a fixed selector. If Todoist significantly changes its
board layout, the column-detection logic in `content.js`
(`findParkedColumn`) may need adjusting.
