# Changelog

## Version 2.1.0 - November 15, 2025

### ✨ New Features

#### 1. **Configurable Button Visibility**
- Added button visibility toggles in Settings page
- Show/hide Settings button in popup
- Show/hide Clear button in popup
- Visual toggle buttons with active/inactive states (blue when active, grey when inactive)
- Matches popup button styling for consistency
- Per-button descriptions for better accessibility

#### 2. **Clear All Fields Button**
- New "Clear" button in popup to empty all pre-filled fields
- Clears task title, description, dates, priority, and labels
- Provides quick reset without closing/reopening popup
- Can be toggled on/off in Settings

### 🗑️ Removed Features
- Removed logout button from Settings page
- Logout functionality removed (settings can still be manually cleared if needed)

### 🎨 UI Improvements
- Settings button in options page now uses same cogwheel icon as popup
- Both button toggles are now clickable and interactive
- Added descriptive labels next to each button toggle
- Improved accessibility with proper ARIA labels
- Better help text explaining button configuration

### 🔧 Technical Changes
- Added `showSettingsButton` storage setting (default: true)
- Added `showClearButton` storage setting (default: true)
- Updated options.js to handle button toggle states
- Updated popup.js to respect button visibility settings
- Enhanced CSS for button toggle states in options page
- Removed logout event handler and related code

---

## Version 2.0 - November 15, 2025

### ⚠️ **Vikunja Version Requirement**
- **Requires Vikunja v1.0.0 or newer**
- Tested with: v1.0.0-rc2-278-682096e5
- Uses Vikunja v1 API endpoints
- See [COMPATIBILITY.md](COMPATIBILITY.md) for details

### 🎉 Major Feature Update

#### 1. **Label/Tag Support**
- Search for existing labels with autocomplete
- Create new labels on-the-fly without leaving the extension
- Visual label badges with color coding
- Click to remove selected labels
- Press Enter to quickly add or create labels
- Labels are fetched from your Vikunja instance
- Labels sent with task creation

#### 2. **Context Menu Integration**
- Right-click selected text → "Add to Vikunja" creates task with that text
- Right-click any link → "Add link to Vikunja" creates task with the link
- Context menu tasks automatically include source page reference
- Seamless integration with browser workflow

#### 3. **Project Favorites & Recent**
- Star favorite projects in Settings page
- Recently used projects automatically tracked (last 5)
- Projects sorted by: Favorites → Recent → Alphabetical
- Visual indicators: ★ for favorites, ↻ for recent
- Toggle to show only favorite projects
- Improves productivity for users with many projects

#### 5. **Due Date Shortcuts**
- Quick buttons: Today, Tomorrow, Next Week, Clear
- Sets times to end of day (11:59 PM)
- Works alongside manual date picker

### 🛠️ Technical Changes

### 🔧 Technical Improvements
- Updated to version 2.0
- Added `contextMenus` permission
- New API methods: `loadLabels()`, `loadProjectTasks()`
- Enhanced project rendering with favorites/recent logic
- Improved form state management
- Better storage utilization (sync for favorites/recent)
- Context menu background handler

### 🎨 UI Improvements
- Label search input with autocomplete dropdown
- Date shortcut buttons for faster input
- Favorite star selector in options page
- Project list visual indicators (★ ↻)
- Better form organization and spacing
- Improved accessibility with proper labels

### 🎨 Style Updates
- Label badge styling with color-coded backgrounds
- Label autocomplete dropdown styling
- Favorite star animations and hover effects
- Date shortcuts button group styling
- Enhanced form group spacing
- Dark mode support for all new elements
## Version 1.3 (Previous)
- Initial stable release
- Basic task creation
- Project selection
- Priority and due date support
- Quick-fill buttons for title and description

---

## Documentation

For more information about this release:
- **[COMPATIBILITY.md](COMPATIBILITY.md)** - Vikunja version compatibility
- **[FEATURES.md](FEATURES.md)** - Feature usage guide  
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues
- **[API_REFERENCE.md](API_REFERENCE.md)** - Vikunja API details

