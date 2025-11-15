# Vikunja Quick Add

A Chrome extension for quickly adding tasks to Vikunja from your browser.

## Requirements

- **Vikunja v1.0.0 or newer** (tested with v1.0.0-rc2-278-682096e5)
- Chrome/Chromium-based browser (Chrome, Edge, Brave, etc.)
- Valid Vikunja API token with appropriate permissions

### Vikunja API Permissions

Your API token must have the following permissions:
- `tasks:write` - Required for creating tasks
- `projects:read` - Required for loading projects
- `labels:read` - Optional, for label support

## Features

- 📝 Quick task creation from any webpage
- 🔗 Auto-fill task details with current page title and URL
- 📂 Project selection with favorites and recent projects
- 🏷️ Label/tag support with search and quick creation
- ⚡ Priority levels and due date support with quick shortcuts
- 🖱️ Context menu integration (right-click to add tasks)
- ⭐ Favorite projects for quick access
- 🕐 Smart due date shortcuts (Today, Tomorrow, Next Week)
- 🎨 Dark mode support
- 🔒 Secure API token storage

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/philantrop/vikunja-quick-add.git
   cd vikunja-quick-add
   ```

2. Load the unpacked extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `vikunja-quick-add` directory

## Configuration

### Prerequisites
- Vikunja instance running v1.0.0 or newer
- Admin access to create API tokens

### Setup Steps

1. Click the extension icon in your browser toolbar
2. Click "configure your settings" or right-click the extension icon and select "Options"
3. Enter your Vikunja instance URL (e.g., `https://vikunja.example.com`)
4. Create an API token in your Vikunja instance:
   - Go to Settings → API Tokens
   - Create a new token with at least `tasks:write` and `projects:read` permissions
   - For label support, also add `labels:read` permission
5. Paste the token into the extension settings
6. (Optional) Select a default project
7. (Optional) Mark favorite projects with stars
8. Click "Test Connection" to verify your settings
9. Click "Save Settings"

## Usage

### Basic Task Creation

1. Navigate to any webpage you want to create a task from
2. Click the extension icon
3. The task description will be auto-filled with a link to the current page
4. Enter a task title (or use quick-fill buttons)
5. Select a project
6. (Optional) Add labels, set priority, and due date
7. Click "Add Task"

### Context Menu (Right-Click)

- **Selected Text**: Highlight any text, right-click, and select "Add to Vikunja"
- **Links**: Right-click any link and select "Add link to Vikunja"

### Quick Features

- **Due Date Shortcuts**: Use "Today", "Tomorrow", or "Next Week" buttons
- **Favorite Projects**: Star projects in Settings to see them first
- **Recent Projects**: Your 5 most recently used projects appear at the top
- **Labels**: Type to search existing labels or create new ones on the fly

## Project Structure

```
vikunja-quick-add/
├── manifest.json              # Extension manifest (Manifest V3)
├── package.json              # NPM package configuration
├── LICENSE                   # AGPL-3.0 license
├── README.md                 # This file
├── .gitignore               # Git ignore rules
├── src/                     # Source code
│   ├── background/          # Background service worker
│   │   └── service-worker.js
│   ├── popup/              # Popup UI logic
│   │   └── popup.js
│   ├── options/            # Options page logic
│   │   └── options.js
│   └── utils/              # Shared utilities
│       ├── api.js          # API client functions
│       └── helpers.js      # Helper functions
├── public/                 # HTML pages
│   ├── popup.html         # Popup UI
│   └── options.html       # Options page
└── assets/                # Static assets
    ├── icons/            # Extension icons
    │   ├── icon16.png
    │   ├── icon48.png
    │   └── icon128.png
    └── styles/           # CSS stylesheets
        ├── popup.css
        └── options.css
```

## Development

### Prerequisites

- Node.js and npm (optional, for build scripts)
- Chrome or Chromium-based browser

### Development Mode

1. Make changes to the source files
2. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the reload icon on the extension card

### Building for Distribution

```bash
# Install dependencies (if any added later)
npm install

# Create a production build
npm run build

# Package the extension as a ZIP file
npm run package
```

The packaged extension will be created as `vikunja-quick-add.zip` in the root directory.

### Code Organization

- **Modular Architecture**: Code is organized by feature/responsibility
- **ES6 Modules**: Using modern JavaScript modules for better maintainability
- **Separation of Concerns**: HTML, CSS, and JavaScript are kept in separate files
- **Reusable Utilities**: Common functions are extracted to utility modules

## Architecture

### Background Service Worker
- Handles API communications with Vikunja
- Processes messages from popup and options pages
- Maintains extension lifecycle

### Popup UI
- Quick task creation interface
- Project selection
- Priority and due date settings
- Auto-fill helpers for current page context

### Options Page
- API configuration
- Connection testing
- Default project selection

### Utilities
- **api.js**: Vikunja API client (tasks, projects, authentication)
- **helpers.js**: Shared helper functions (HTML escaping, status messages)

## Technologies

- Manifest V3 (modern Chrome extension format)
- ES6 Modules
- Chrome Storage API
- Chrome Tabs API
- Modern CSS with system color scheme support

## License

Copyright (C) 2025 Wulf C. Krueger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

## Documentation

- **[FEATURES.md](FEATURES.md)** - Detailed feature usage guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines


