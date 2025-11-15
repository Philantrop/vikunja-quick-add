# Build and Release Guide

This document explains how to build and release the Vikunja Quick Add extension.

## Local Building

### Using the Build Script

The easiest way to build the extension locally:

```bash
./build.sh
```

This will:
- Clean the previous build
- Copy all necessary files to `dist/`
- Create a versioned ZIP file (e.g., `vikunja-quick-add-v2.4.1.zip`)
- Show the build size and contents

### Using npm

Alternatively, you can use npm:

```bash
npm run build
```

## Automated Releases

The project uses GitHub Actions to automatically build and release the extension when you push a version tag.

### Creating a Release

1. **Update the version** in both `manifest.json` and `package.json`:
   ```json
   "version": "2.5.0"
   ```

2. **Commit your changes**:
   ```bash
   git add manifest.json package.json
   git commit -m "Bump version to 2.5.0"
   ```

3. **Create and push a tag**:
   ```bash
   git tag v2.5.0
   git push origin main
   git push origin v2.5.0
   ```

4. **GitHub Actions will automatically**:
   - Verify the tag version matches the manifest version
   - Build the extension
   - Create a GitHub release
   - Upload the ZIP file as a release asset

### Tag Format

Tags must follow the format `v*` (e.g., `v2.5.0`, `v1.0.0-beta.1`). The version number after the `v` must match the version in `manifest.json`.

### Release Notes

The GitHub Action automatically generates release notes with installation instructions. You can edit the release on GitHub to add:
- Changelog/what's new
- Breaking changes
- Bug fixes
- New features

## Manual Release

If you need to create a release manually:

1. Build the extension:
   ```bash
   ./build.sh
   ```

2. Go to [GitHub Releases](https://github.com/philantrop/vikunja-quick-add/releases)

3. Click "Draft a new release"

4. Create a new tag (e.g., `v2.5.0`)

5. Upload the generated ZIP file

6. Add release notes and publish

## Development

For development, you don't need to build. Simply:

1. Load the extension directory as an unpacked extension in Chrome
2. Make your changes
3. Reload the extension in `chrome://extensions/`

## Build Output

The build creates:
- `dist/` - Directory with all extension files
- `vikunja-quick-add-v{VERSION}.zip` - Distributable ZIP file

The ZIP contains:
- `src/` - Source code
- `public/` - HTML pages
- `assets/` - Icons and stylesheets
- `manifest.json` - Extension manifest
- `LICENSE` - License file

## Troubleshooting

### Version Mismatch Error

If GitHub Actions fails with a version mismatch error:
- Ensure `manifest.json` and `package.json` have the same version
- Ensure the git tag matches the version (e.g., tag `v2.5.0` for version `2.5.0`)

### Build Script Not Executable

If you get a permission error:
```bash
chmod +x build.sh
```

### ZIP File Too Large

The extension should be under 5MB. If it's larger, check for:
- Unnecessary files in `dist/`
- Large assets that could be optimized
- Development files that shouldn't be included
