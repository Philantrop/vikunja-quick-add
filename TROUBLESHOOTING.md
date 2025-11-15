# Troubleshooting Guide

## System Requirements

**Vikunja Version:** v1.0.0 or newer (tested with v1.0.0-rc2-278-682096e5)

### Check Your Vikunja Version
1. Log into your Vikunja instance
2. Go to Settings → About
3. Verify version is v1.0.0 or newer
4. If using older version, see [COMPATIBILITY.md](COMPATIBILITY.md)

## Labels Cannot Be Loaded

### Symptoms
- Label dropdown shows "No labels available" or "Error loading labels"
- Label section may be hidden
- Console shows label loading errors

### Possible Causes & Solutions

#### 1. **Vikunja Version Issue**
Labels API endpoint requires Vikunja v1.0.0 or newer.

**Solution:**
- Verify you're running Vikunja v1.0.0+ (tested with v1.0.0-rc2-278-682096e5)
- Update Vikunja to the latest version if needed
- Check your Vikunja version in Settings → About
- See [COMPATIBILITY.md](COMPATIBILITY.md) for version details

#### 2. **API Token Permissions**
Your API token may not have label read permissions.

**Solution:**
1. Go to your Vikunja instance → Settings → API Tokens
2. Create a new token with these permissions:
   - `tasks:write` (required)
   - `projects:read` (required)
   - `labels:read` (for label support)
3. Update the token in extension settings

#### 3. **No Labels Created**
If you haven't created any labels in Vikunja, the list will be empty.

**Solution:**
1. Go to your Vikunja instance → Settings → Labels
2. Create at least one label
3. Reload the extension popup

#### 4. **CORS or Network Issues**
Connection problems between extension and Vikunja.

**Solution:**
- Check browser console (F12) for detailed errors
- Verify your Vikunja URL is correct in settings
- Test the connection using the "Test Connection" button
- Ensure Vikunja instance is accessible

### Checking the Console

1. Open the extension popup
2. Press F12 to open browser DevTools
3. Go to the Console tab
4. Look for messages starting with "API: Loading labels"
5. Check for any red error messages

### Expected Console Output (Success)
```
API: Loading labels from: https://your-instance.com/api/v1/labels
API: Labels response status: 200
API: Labels data: [{id: 1, title: "Work", ...}]
Loaded labels: [{id: 1, title: "Work", ...}]
```

### Expected Console Output (Not Supported)
```
API: Loading labels from: https://your-instance.com/api/v1/labels
API: Labels response status: 404
Labels not available: Labels not supported or not accessible (404)
```

### Workaround
If labels are not available or not working, the extension will:
- Automatically hide the label section
- Continue to work normally for all other features
- Labels are completely optional

## Other Common Issues

### Tasks Not Creating
- Verify API token has `tasks:write` permission
- Check that selected project exists
- Ensure task title is not empty

### Projects Not Loading
- Verify API token has `projects:read` permission
- Check API URL format (no trailing slash)
- Test connection in Settings

### Context Menu Not Appearing
- Reload the extension (chrome://extensions/)
- Check that contextMenus permission is enabled
- Try on a different webpage (some sites block extensions)

### Parent Tasks Not Loading
- Must select a project first
- Project must have existing tasks
- Only works with projects that have tasks

## Getting Help

If issues persist:
1. Check extension console for errors
2. Verify Vikunja API endpoint: `{your-url}/api/v1/labels`
3. Test API endpoint directly in browser while logged into Vikunja
4. Check Vikunja server logs for API errors
5. Report issue with console logs and Vikunja version
