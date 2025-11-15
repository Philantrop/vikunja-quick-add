# Contributing to Vikunja Quick Add

Thank you for your interest in contributing to Vikunja Quick Add! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites

- Chrome or Chromium-based browser
- Git
- Text editor or IDE
- Basic knowledge of JavaScript, HTML, CSS
- Familiarity with Chrome Extension APIs (helpful but not required)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/vikunja-quick-add.git
   cd vikunja-quick-add
   ```

2. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the project directory

3. **Make Changes**
   - Edit files in `src/`, `public/`, or `assets/`
   - Reload the extension in Chrome to see changes

## Project Structure

Please read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the project organization and design principles.

### Key Directories

- `src/` - JavaScript source code (ES6 modules)
- `public/` - HTML pages
- `assets/` - Static assets (CSS, icons)
- `manifest.json` - Extension configuration

## Development Guidelines

### Code Style

**JavaScript**:
- Use ES6+ syntax (modules, arrow functions, const/let)
- Use descriptive variable and function names
- Add JSDoc comments for exported functions
- Keep functions small and focused
- Avoid global variables

**HTML**:
- Use semantic HTML5 elements
- Include proper labels for form inputs
- Maintain accessibility standards

**CSS**:
- Use system color keywords for theme support
- Follow mobile-first approach when applicable
- Keep selectors simple and maintainable
- Use CSS custom properties for repeated values

### File Organization

1. **Adding a new API function**:
   - Add to `src/utils/api.js`
   - Export the function
   - Add JSDoc documentation

2. **Adding a helper function**:
   - Add to `src/utils/helpers.js`
   - Make it pure and reusable
   - Document parameters and return values

3. **Adding UI features**:
   - Update HTML in `public/`
   - Update CSS in `assets/styles/`
   - Update logic in `src/popup/` or `src/options/`

4. **New components**:
   - Create new directory under `src/`
   - Follow existing naming conventions
   - Update manifest.json if needed

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add keyboard shortcut for quick task creation
fix: Resolve issue with project loading on slow connections
docs: Update README with new configuration options
refactor: Extract duplicate code into helper function
style: Format code according to style guide
```

Prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `style:` - Code formatting
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Testing

Before submitting changes:

1. **Manual Testing**:
   - Test all affected features
   - Test in both light and dark modes
   - Test error cases
   - Verify API calls work correctly

2. **Browser Testing**:
   - Test in Chrome
   - Test in other Chromium browsers if possible

3. **Edge Cases**:
   - Test with empty/invalid inputs
   - Test with network errors
   - Test with expired API tokens

## Pull Request Process

1. **Before Submitting**:
   - Ensure code follows style guidelines
   - Test thoroughly
   - Update documentation if needed
   - Check for console errors

2. **PR Description**:
   - Describe what changes were made
   - Explain why the changes are needed
   - Reference any related issues
   - Include screenshots for UI changes

3. **Review Process**:
   - Maintainers will review your PR
   - Address any feedback
   - Make requested changes
   - Once approved, your PR will be merged

## Reporting Bugs

When reporting bugs, include:

- Extension version
- Chrome version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Console errors (if any)

## Feature Requests

When requesting features:

- Clearly describe the feature
- Explain the use case
- Consider how it fits the project scope
- Be open to discussion and alternatives

## Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Security enhancements
- Documentation improvements

### Medium Priority
- New features (aligned with project goals)
- UI/UX improvements
- Accessibility improvements
- Browser compatibility

### Nice to Have
- Unit tests
- Integration tests
- TypeScript migration
- Build system improvements
- Internationalization (i18n)

## Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All functions have appropriate documentation
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive
- [ ] UI is accessible and keyboard-friendly
- [ ] Dark mode works correctly
- [ ] No security vulnerabilities introduced
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and descriptive

## Getting Help

- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Check [README.md](README.md) for usage information
- Open an issue for questions
- Reference Chrome Extension documentation

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 license.

## Recognition

Contributors will be recognized in the project documentation.

---

Thank you for contributing to Vikunja Quick Add! 🎉
