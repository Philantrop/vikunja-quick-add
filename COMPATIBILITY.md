# Vikunja Compatibility Guide

## Supported Vikunja Versions

This extension is designed for **Vikunja v1.0.0 and newer**.

### Tested Versions
- ✅ **v1.0.0-rc2-278-682096e5** (unstable) - Fully tested
- ✅ **v1.0.0-rc** and newer - Expected to work
- ⚠️ **v0.20.x - v0.23.x** - May work with limitations
- ❌ **v0.19.x and older** - Not supported

## API Compatibility

### Vikunja v1.0.0+ (Current Target)

#### Supported Features
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Tasks | `PUT /api/v1/projects/{id}/tasks` | ✅ Supported |
| Load Projects | `GET /api/v1/projects` | ✅ Supported |
| Load Labels | `GET /api/v1/labels` | ✅ Supported |
| Test Connection | `GET /api/v1/user` | ✅ Supported |

#### API Changes from v0.x
- ✅ "Lists" renamed to "Projects"
- ✅ Project-based task creation
- ✅ Enhanced label support with search and creation

### Vikunja v0.20.x - v0.23.x

These versions use the older "lists" terminology but the v1 API is available.

#### Known Limitations
- Labels may require `labels:read` permission
- Some features may not work on older versions

#### Workarounds
- Extension will auto-hide unsupported features
- Core task creation still works
- Disable optional features if errors occur

### Vikunja v0.19.x and Older

**Not supported.** These versions use incompatible API endpoints.

## Feature Availability by Version

### Core Features (All v1.0+ versions)
- ✅ Task creation
- ✅ Project selection
- ✅ Priority levels
- ✅ Due dates
- ✅ Task descriptions

### Advanced Features (v1.0.0+)
- ✅ Labels/tags with search and creation
- ✅ Context menu integration
- ✅ Favorites and recent projects

### Optional Features (Requires Configuration)
- 🏷️ **Labels** - Requires `labels:read` permission
- ⭐ **Favorites** - Client-side only, works with all versions

## API Token Permissions

### Required Permissions
```
tasks:write    - Create and modify tasks
projects:read  - View available projects
```

### Recommended Permissions
```
tasks:write    - Create and modify tasks
projects:read  - View available projects
labels:read    - View and attach labels (optional)
```

### Full Permissions (All Features)
```
tasks:write
projects:read
labels:read
```

## Troubleshooting by Version

### Vikunja v1.0.0-rc and newer
Most features should work out of the box. If you encounter issues:
1. Verify API token permissions
2. Check browser console for specific errors
3. Ensure Vikunja instance is accessible

### Older Versions (v0.20.x - v0.23.x)
If using an older version:
1. Labels may not load - this is expected
2. Some features will auto-hide if not supported
3. Core task creation should still work
4. Consider upgrading Vikunja for full feature support

## Checking Your Vikunja Version

1. Log into your Vikunja instance
2. Go to Settings → About
3. Look for "Version" information
4. Compare with compatibility table above

## Reporting Compatibility Issues

If you encounter issues with a specific Vikunja version:
1. Note your exact Vikunja version
2. Check browser console for API errors
3. Test the API endpoint directly: `{your-url}/api/v1/user`
4. Report with version details and console logs

## Future Compatibility

This extension uses Vikunja's stable v1 API endpoints and should remain compatible with future v1.x releases. Breaking changes in Vikunja v2.x (if any) may require extension updates.

## Migration Guide

### Upgrading from Vikunja v0.x to v1.0+

No changes needed! The extension will:
1. Automatically detect available features
2. Hide unsupported features gracefully
3. Continue working with existing settings

Your saved settings (API URL, token, favorites) will be preserved.
