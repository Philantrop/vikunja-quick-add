# Chrome Web Store Compliance Fixes

## Completed Fixes (November 15, 2025)

### ✅ Critical Issues Fixed

1. **Privacy Policy Added**
   - Added `privacy_policy` field to manifest.json
   - URL: https://turing.mailstation.de/privacy-policy/

2. **Host Permissions Declared**
   - Added `host_permissions` for API calls to external Vikunja instances
   - Permissions: `http://*/` and `https://*/`
   - Required for fetch() calls to user-configured Vikunja servers

3. **Unsafe innerHTML Usage Eliminated**
   - Replaced all `innerHTML` assignments with safe alternatives
   - Used `textContent` and `createElement()` to prevent XSS vulnerabilities
   - Files fixed:
     - `src/popup/popup.js` (6 instances)
     - `src/options/options.js` (2 instances)

4. **Content Security Policy Added**
   - Added explicit CSP to manifest.json
   - Policy: `script-src 'self'; object-src 'self'`
   - Prevents inline scripts and restricts code execution

5. **Repository URLs Updated**
   - Changed from placeholder `yourusername` to actual repository
   - URL: https://github.com/philastrophist/vikunja-quick-add

6. **Version Numbers Synchronized**
   - Updated package.json version to match manifest.json (2.4.1)

## Remaining Requirements for Store Submission

### Store Assets Needed

1. **Screenshots** (required)
   - Take 1-5 screenshots showing key features
   - Recommended size: 1280x800 or 640x400
   - Show: main popup, settings page, task creation flow

2. **Promotional Images** (optional but recommended)
   - Small tile: 440x280
   - Large tile: 920x680
   - Marquee: 1400x560

3. **Detailed Description**
   - Write comprehensive store listing description
   - Highlight features and Vikunja version requirement
   - Explain setup process

### Testing Checklist

- [ ] Load unpacked extension and verify all functions work
- [ ] Test task creation with various field combinations
- [ ] Verify context menu integration works
- [ ] Test settings page and option persistence
- [ ] Check that labels/tags work correctly
- [ ] Verify privacy policy link is accessible
- [ ] Test on different Vikunja instances

### Pre-Submission Checklist

- [x] Manifest V3 compliant
- [x] Privacy policy URL included
- [x] Host permissions declared
- [x] No unsafe innerHTML usage
- [x] Content Security Policy defined
- [x] All code is local (no remote code execution)
- [x] Icons in required sizes (16, 48, 128)
- [x] Minimal permissions requested
- [x] Repository URL updated
- [ ] Screenshots prepared
- [ ] Store description written
- [ ] Extension thoroughly tested

## Security Improvements Made

1. **XSS Prevention**: All dynamic content now uses safe DOM methods
2. **CSP Enforcement**: Extension pages cannot execute inline scripts
3. **Minimal Permissions**: Only requests necessary permissions
4. **API Token Security**: Stored in chrome.storage.sync (encrypted by Chrome)

## Notes

- External library used: Flatpickr (date/time picker)
  - Bundled locally in `assets/lib/`
  - MIT licensed
  - Version: minified (should document version in submission)

- The extension makes network requests to user-specified Vikunja instances
  - This is the core functionality and properly declared via host_permissions
  - Privacy policy should explain this clearly

## Developer Console Submission Steps

1. Create a ZIP file of the extension:
   ```bash
   npm run package
   ```

2. Log into Chrome Web Store Developer Dashboard

3. Create new item and upload the ZIP

4. Fill in store listing details:
   - Name: Vikunja Quick Add
   - Summary: Quickly add tasks to Vikunja from your browser
   - Category: Productivity
   - Language: English

5. Upload screenshots and promotional images

6. Set privacy practices:
   - Does NOT collect user data
   - Link to privacy policy
   - Explain API token storage

7. Submit for review

## Expected Review Items

Google may ask about:
- Use of host_permissions (explain: user-configured Vikunja API calls)
- External library Flatpickr (explain: date picker, MIT licensed)
- API token storage (explain: chrome.storage.sync, user-controlled)
