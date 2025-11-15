# Testing Checklist for v2.0

## Pre-Testing Setup
- [ ] Extension loaded in Chrome (chrome://extensions/)
- [ ] Settings configured with valid API URL and token
- [ ] At least one project available in Vikunja
- [ ] At least one label created in Vikunja

## Feature 1: Label/Tag Support
- [ ] Label input field is visible
- [ ] Typing shows autocomplete suggestions
- [ ] Can select existing labels from dropdown
- [ ] Can create new labels by typing and pressing Enter
- [ ] Selected labels show as colored badges
- [ ] Can remove labels by clicking ×
- [ ] Labels are sent with task creation
- [ ] Created task in Vikunja shows the labels
- [ ] New labels appear in Vikunja's label list

## Feature 2: Context Menu Integration
- [ ] Right-click on selected text shows "Add to Vikunja" option
- [ ] Clicking context menu opens popup with text as title
- [ ] Right-click on link shows "Add link to Vikunja" option
- [ ] Clicking link context menu opens popup with link
- [ ] Tasks created from context menu include source page reference

## Feature 3: Project Favorites & Recent
- [ ] Can star/unstar projects in Settings page
- [ ] Stars persist after saving
- [ ] Favorited projects show ★ in popup dropdown
- [ ] Recently used projects show ↻ in popup dropdown
- [ ] Projects sorted correctly: favorites → recent → alphabetical
- [ ] "Show favorites only" toggle works
- [ ] Recent projects update after creating tasks

## Feature 4: Due Date Shortcuts
- [ ] "Today" button sets correct date/time
- [ ] "Tomorrow" button sets correct date/time
- [ ] "Next Week" button sets correct date/time
- [ ] "Clear" button removes due date
- [ ] Manual date entry still works
- [ ] Due dates are correctly saved in Vikunja

## General Testing
- [ ] All existing features still work
- [ ] Dark mode renders correctly
- [ ] Form submission successful
- [ ] Success message displays
- [ ] Form resets after successful submission
- [ ] No console errors
- [ ] Extension doesn't crash
- [ ] Works across different websites

## Edge Cases
- [ ] Works with no labels available
- [ ] Works with no tasks in selected project
- [ ] Works with no favorite projects
- [ ] Handles API errors gracefully
- [ ] Long label/project names display correctly
- [ ] Many labels don't break UI
- [ ] Special characters in task titles work

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Edge (Chromium)
- [ ] Works in Brave
- [ ] Context menus work in all browsers

## Notes
Document any issues found:

