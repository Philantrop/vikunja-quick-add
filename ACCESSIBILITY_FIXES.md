# Accessibility Fixes

This document summarizes the accessibility improvements made to the Vikunja Quick Add extension.

## Summary

All HTML, CSS, and JavaScript files have been updated to meet WCAG 2.1 Level AA accessibility standards.

## Changes Made

### 1. HTML Structure (popup.html & options.html)
- ✅ Added `lang="en"` attribute to `<html>` elements for language declaration
- ✅ Added `<title>` element to popup.html
- ✅ Added proper `href="#"` attributes to all interactive `<a>` elements
- ✅ Added `role="button"` to link-styled interactive elements
- ✅ Added ARIA attributes:
  - `aria-required="true"` on required form fields
  - `aria-describedby` for fields with help text
  - `aria-label` for controls that need additional context
  - `role="group"` for related button groups
  - `role="list"` and `role="listitem"` for semantic lists
  - `role="listbox"` and `role="option"` for suggestion dropdowns
  - `role="status"` and `aria-live="polite"` for status messages

### 2. Keyboard Accessibility (popup.js & options.js)
- ✅ Added `preventDefault()` to all link click handlers to prevent navigation
- ✅ Made label badges keyboard accessible:
  - Added `tabindex="0"` for keyboard focus
  - Added `onkeydown` handlers for Enter and Space keys
  - Added descriptive `aria-label` attributes
- ✅ Made label suggestions keyboard accessible:
  - Added `tabindex="0"` and `role="option"`
  - Added keyboard event handlers (Enter/Space)
  - Added `aria-label` for screen readers
- ✅ Made favorite stars keyboard accessible:
  - Added `tabindex="0"` and `role="button"`
  - Added keyboard navigation support
  - Dynamic `aria-label` updates on toggle

### 3. Focus Indicators (popup.css & options.css)
- ✅ Enhanced focus styles using `:focus-visible` for:
  - All form inputs, textareas, and selects
  - Buttons and links
  - Label badges
  - Label suggestion items
  - Favorite stars
- ✅ Added visible focus outlines with proper offset for clarity
- ✅ Used system `Highlight` color for consistency with user preferences

### 4. Visual Design
- ✅ Added hover and active states for interactive links
- ✅ Enhanced visual feedback with background colors on hover/active
- ✅ Ensured proper padding and border-radius for click targets
- ✅ Decorative elements (color pills) marked with `aria-hidden="true"`

## Testing Recommendations

### Keyboard Navigation
1. Test tab navigation through all interactive elements
2. Verify Enter/Space keys work on all custom buttons
3. Ensure focus indicators are clearly visible

### Screen Readers
1. Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS)
2. Verify all interactive elements are announced correctly
3. Check that form validation messages are announced
4. Verify status messages are announced via live regions

### Color Contrast
- All text meets WCAG AA contrast requirements (4.5:1 for normal, 3:1 for large)
- System colors (Canvas, CanvasText, etc.) ensure proper contrast in both light and dark modes

## Browser Compatibility

The accessibility features use standard HTML5, ARIA 1.2, and CSS3 features supported by:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
