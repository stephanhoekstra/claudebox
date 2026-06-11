# Todoist Default Inbox

A small Chrome extension for app.todoist.com. Whenever you land on the
"Today" view (`https://app.todoist.com/app/today`), it immediately redirects
you to the Inbox view instead.

## Installing (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.

## Notes

The redirect runs at `document_start` and only triggers on the exact
`/app/today` path, so it won't interfere with other Todoist URLs.
