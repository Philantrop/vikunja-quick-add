/**
 * Vikunja Quick Add - Chrome Extension
 * Copyright (C) 2025 Wulf C. Krueger
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { escapeHtml, showStatus, getCurrentTab } from '../utils/helpers.js';

let allProjects = [];
let allLabels = [];
let selectedLabels = [];
let showFavoritesOnly = false;
let flatpickrInstance = null;
let reminderFlatpickrInstance = null;

// Convert date format from settings to Flatpickr format
function convertDateFormat(dateFormat, timeFormat) {
    const is24h = timeFormat === '24h';
    let datePart = '';
    
    // Convert date format
    switch (dateFormat) {
        case 'MM/DD/YYYY':
            datePart = 'm/d/Y';
            break;
        case 'DD.MM.YYYY':
            datePart = 'd.m.Y';
            break;
        case 'YYYY-MM-DD':
            datePart = 'Y-m-d';
            break;
        default:
            datePart = 'd.m.Y'; // Default to European format
    }
    
    // Add time part
    const timePart = is24h ? 'H:i' : 'h:i K';
    
    return `${datePart} ${timePart}`;
}

// Will be initialized after loading settings
function initializeFlatpickr(timeFormat, dateFormat) {
    const is24h = timeFormat === '24h';
    const altFormat = convertDateFormat(dateFormat, timeFormat);
    
    // Destroy existing instances if they exist
    if (flatpickrInstance) {
        flatpickrInstance.destroy();
    }
    if (reminderFlatpickrInstance) {
        reminderFlatpickrInstance.destroy();
    }
    
    // Initialize Flatpickr for the due date input
    flatpickrInstance = flatpickr('#dueDate', {
        enableTime: true,
        time_24hr: is24h,
        dateFormat: 'Y-m-d H:i',
        locale: {
            firstDayOfWeek: 1 // Monday
        },
        altInput: true,
        altFormat: altFormat
    });

    // Initialize Flatpickr for the reminder input
    reminderFlatpickrInstance = flatpickr('#reminderDate', {
        enableTime: true,
        time_24hr: is24h,
        dateFormat: 'Y-m-d H:i',
        locale: {
            firstDayOfWeek: 1 // Monday
        },
        altInput: true,
        altFormat: altFormat
    });
}

// Load settings and check configuration
chrome.storage.sync.get([
    'apiUrl', 
    'apiToken', 
    'defaultProjectId', 
    'timeFormat', 
    'dateFormat', 
    'showLabels', 
    'listSortOrder', 
    'showReminderDate', 
    'showDueDate',
    'taskTitle',
    'taskDescription',
    'defaultReminderDate',
    'defaultReminderTime',
    'compactMode',
    'showClearButton',
    'showSettingsButton'
], async (data) => {
    if (!data.apiUrl || !data.apiToken) {
        document.getElementById('notConfigured').style.display = 'block';
        document.getElementById('taskForm').style.display = 'none';
        return;
    }
    
    // Apply compact mode if enabled
    if (data.compactMode === true) {
        document.body.classList.add('compact-mode');
    }
    
    // Initialize Flatpickr with user's format preferences
    const timeFormat = data.timeFormat || '24h';
    const dateFormat = data.dateFormat || 'DD.MM.YYYY';
    initializeFlatpickr(timeFormat, dateFormat);

    // Show or hide labels field based on settings
    const showLabels = data.showLabels !== false; // Default to true
    const labelsFormGroup = document.getElementById('labelsFormGroup');
    if (labelsFormGroup) {
        labelsFormGroup.style.display = showLabels ? 'block' : 'none';
    }

    // Show or hide reminder date field based on settings
    const showReminderDate = data.showReminderDate !== false; // Default to true
    const reminderFormGroup = document.getElementById('reminderDateFormGroup');
    if (reminderFormGroup) {
        reminderFormGroup.style.display = showReminderDate ? 'block' : 'none';
    }

    // Show or hide due date field based on settings
    const showDueDate = data.showDueDate !== false; // Default to true
    const dueDateFormGroup = document.getElementById('dueDateFormGroup');
    if (dueDateFormGroup) {
        dueDateFormGroup.style.display = showDueDate ? 'block' : 'none';
    }
    
    // Show or hide settings button based on settings
    const showSettingsButton = data.showSettingsButton !== false; // Default to true
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.style.display = showSettingsButton ? 'inline-flex' : 'none';
    }
    
    // Show or hide clear button based on settings
    const showClearButton = data.showClearButton !== false; // Default to true
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = showClearButton ? 'inline-flex' : 'none';
    }

    // Load projects and labels
    await loadProjects(data.apiUrl, data.apiToken, data.defaultProjectId, data.listSortOrder || 'smart');
    
    // Load labels (optional - may not be available in all Vikunja instances)
    if (showLabels) {
        await loadLabels(data.apiUrl, data.apiToken);
    }

    // Check for pending task from context menu
    chrome.storage.local.get(['pendingTask'], async (localData) => {
        if (localData.pendingTask) {
            const pending = localData.pendingTask;
            document.getElementById('taskTitle').value = pending.title || '';
            document.getElementById('taskDescription').value = pending.description || '';
            
            // Clear the pending task
            chrome.storage.local.remove(['pendingTask']);
        } else {
            // Auto-fill title and description based on user preferences
            const tab = await getCurrentTab();
            const taskTitlePref = data.taskTitle || 'page-title';
            const taskDescPref = data.taskDescription !== undefined ? data.taskDescription : 'url';
            
            // Set task title based on preference
            switch (taskTitlePref) {
                case 'page-url':
                    document.getElementById('taskTitle').value = tab.url;
                    break;
                case 'title-url':
                    document.getElementById('taskTitle').value = `${tab.title}\n${tab.url}`;
                    break;
                case 'page-title':
                default:
                    document.getElementById('taskTitle').value = tab.title;
                    break;
            }
            
            // Set task description based on preference
            switch (taskDescPref) {
                case 'title-url':
                    document.getElementById('taskDescription').value = `<strong>${escapeHtml(tab.title)}</strong><br><br><a href="${tab.url}">Open page</a>`;
                    break;
                case 'empty':
                    document.getElementById('taskDescription').value = '';
                    break;
                case 'url':
                default:
                    document.getElementById('taskDescription').value = `<a href="${tab.url}">${escapeHtml(tab.title)}</a>`;
                    break;
            }
        }
        
        // Set default reminder if configured
        if (data.defaultReminderDate && data.defaultReminderDate !== '') {
            const reminderTime = data.defaultReminderTime || '10:00';
            const now = new Date();
            let reminderDate = new Date();
            
            switch (data.defaultReminderDate) {
                case 'same-day':
                    // Same day at specified time
                    const [hours, minutes] = reminderTime.split(':');
                    reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    break;
                case 'day-before':
                    // Day before at specified time
                    const [hours2, minutes2] = reminderTime.split(':');
                    reminderDate.setDate(reminderDate.getDate() - 1);
                    reminderDate.setHours(parseInt(hours2), parseInt(minutes2), 0, 0);
                    break;
                case 'week-before':
                    // Week before at specified time
                    const [hours3, minutes3] = reminderTime.split(':');
                    reminderDate.setDate(reminderDate.getDate() - 7);
                    reminderDate.setHours(parseInt(hours3), parseInt(minutes3), 0, 0);
                    break;
                default:
                    reminderDate = null;
            }
            
            if (reminderDate && reminderFlatpickrInstance) {
                reminderFlatpickrInstance.setDate(reminderDate);
            }
        }
    });
});

// Open options page
document.getElementById('openOptions')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
});

// Settings button (cogwheel icon)
document.getElementById('settingsBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
});

// Clear button - empties all pre-filled fields
document.getElementById('clearBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear all input fields
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('priority').value = '0';
    
    // Clear dates
    if (flatpickrInstance) {
        flatpickrInstance.clear();
    }
    if (reminderFlatpickrInstance) {
        reminderFlatpickrInstance.clear();
    }
    
    // Clear labels
    selectedLabels = [];
    updateSelectedLabelsDisplay();
    
    // Focus on task title
    document.getElementById('taskTitle').focus();
});

// Quick-fill buttons for title
document.getElementById('fillPageTitle').addEventListener('click', async (e) => {
    e.preventDefault();
    const tab = await getCurrentTab();
    document.getElementById('taskTitle').value = tab.title;
});

document.getElementById('fillPageUrl').addEventListener('click', async (e) => {
    e.preventDefault();
    const tab = await getCurrentTab();
    document.getElementById('taskTitle').value = tab.url;
});

document.getElementById('fillBoth').addEventListener('click', async (e) => {
    e.preventDefault();
    const tab = await getCurrentTab();
    document.getElementById('taskTitle').value = `${tab.title}\n${tab.url}`;
});

// Quick-fill buttons for description
document.getElementById('fillDescriptionUrl').addEventListener('click', async (e) => {
    e.preventDefault();
    const tab = await getCurrentTab();
    document.getElementById('taskDescription').value = `<a href="${tab.url}">${escapeHtml(tab.title)}</a>`;
});

document.getElementById('fillDescriptionTitleUrl').addEventListener('click', async (e) => {
    e.preventDefault();
    const tab = await getCurrentTab();
    document.getElementById('taskDescription').value = `<strong>${escapeHtml(tab.title)}</strong><br><br><a href="${tab.url}">Open page</a>`;
});

document.getElementById('clearDescription').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('taskDescription').value = '';
});

// Toggle favorites filter
document.getElementById('toggleFavorites').addEventListener('click', (e) => {
    e.preventDefault();
    showFavoritesOnly = !showFavoritesOnly;
    chrome.storage.sync.get(['defaultProjectId', 'recentProjects', 'favoriteProjects', 'listSortOrder'], (data) => {
        renderProjects(allProjects, data.defaultProjectId, data.recentProjects || [], data.favoriteProjects || [], data.listSortOrder || 'smart');
    });
});

// Due date shortcuts
document.getElementById('dueDateToday').addEventListener('click', (e) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(23, 59, 0, 0);
    if (flatpickrInstance) {
        flatpickrInstance.setDate(today);
    }
});

document.getElementById('dueDateTomorrow').addEventListener('click', (e) => {
    e.preventDefault();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    if (flatpickrInstance) {
        flatpickrInstance.setDate(tomorrow);
    }
});

document.getElementById('dueDateNextWeek').addEventListener('click', (e) => {
    e.preventDefault();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 0, 0);
    if (flatpickrInstance) {
        flatpickrInstance.setDate(nextWeek);
    }
});

document.getElementById('dueDateClear').addEventListener('click', (e) => {
    e.preventDefault();
    if (flatpickrInstance) {
        flatpickrInstance.clear();
    }
});

// Reminder shortcuts
document.getElementById('reminderToday').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.storage.sync.get(['defaultReminderTime'], (data) => {
        const today = new Date();
        const reminderTime = data.defaultReminderTime || '10:00';
        const [hours, minutes] = reminderTime.split(':');
        today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (reminderFlatpickrInstance) {
            reminderFlatpickrInstance.setDate(today);
        }
    });
});

document.getElementById('reminderTomorrow').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.storage.sync.get(['defaultReminderTime'], (data) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const reminderTime = data.defaultReminderTime || '10:00';
        const [hours, minutes] = reminderTime.split(':');
        tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (reminderFlatpickrInstance) {
            reminderFlatpickrInstance.setDate(tomorrow);
        }
    });
});

document.getElementById('reminderNextWeek').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.storage.sync.get(['defaultReminderTime'], (data) => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const reminderTime = data.defaultReminderTime || '10:00';
        const [hours, minutes] = reminderTime.split(':');
        nextWeek.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (reminderFlatpickrInstance) {
            reminderFlatpickrInstance.setDate(nextWeek);
        }
    });
});

document.getElementById('reminderClear').addEventListener('click', (e) => {
    e.preventDefault();
    if (reminderFlatpickrInstance) {
        reminderFlatpickrInstance.clear();
    }
});

function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Load projects from API via background script
async function loadProjects(apiUrl, apiToken, defaultProjectId, listSortOrder) {
    const select = document.getElementById('projectSelect');

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'loadProjects',
            data: { apiUrl, apiToken }
        });

        if (!response.success) {
            throw new Error(response.error);
        }

        // Handle both old and new response formats
        let projects, favorites, recentProjects;
        
        if (response.data && response.data.projects) {
            // New format: { projects, favorites, recentProjects }
            ({ projects, favorites, recentProjects } = response.data);
        } else if (Array.isArray(response.data)) {
            // Old format: just an array of projects
            projects = response.data;
            favorites = [];
            recentProjects = [];
        } else {
            throw new Error('Unexpected response format from API');
        }
        
        // Filter out invalid project IDs from favorites and recents
        const validProjectIds = new Set(projects.map(p => p.id));
        favorites = (favorites || []).filter(id => validProjectIds.has(id));
        recentProjects = (recentProjects || []).filter(id => validProjectIds.has(id));
        
        // If the default project ID is invalid (deleted project), clear it
        if (defaultProjectId && !validProjectIds.has(parseInt(defaultProjectId))) {
            defaultProjectId = null;
            // Update storage to remove the invalid default
            chrome.storage.sync.set({ defaultProjectId: null });
        }
        
        allProjects = projects;
        
        renderProjects(allProjects, defaultProjectId, recentProjects || [], favorites || [], listSortOrder);

    } catch (error) {
        console.error('Error loading projects:', error);
        const select = document.getElementById('projectSelect');
        select.textContent = '';
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Error loading projects';
        select.appendChild(option);
        showStatus('Error loading projects: ' + error.message, 'error');
    }
}

function renderProjects(projects, defaultProjectId, recentProjects = [], favoriteProjects = [], listSortOrder = 'smart') {
    const select = document.getElementById('projectSelect');
    select.textContent = '';

    if (projects.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No projects found';
        select.appendChild(option);
        return;
    }

    // Filter if showing favorites only
    let displayProjects = showFavoritesOnly 
        ? projects.filter(p => favoriteProjects.includes(p.id))
        : projects;

    if (displayProjects.length === 0 && showFavoritesOnly) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No favorite projects';
        select.appendChild(option);
        document.getElementById('toggleFavorites').style.display = 'inline';
        return;
    }

    // Sort based on user preference
    switch (listSortOrder) {
        case 'alphabetical':
            // Sort alphabetically only
            displayProjects.sort((a, b) => a.title.localeCompare(b.title));
            break;
            
        case 'favorites-alphabetical':
            // Favorites first, then alphabetical
            displayProjects.sort((a, b) => {
                const aFav = favoriteProjects.includes(a.id);
                const bFav = favoriteProjects.includes(b.id);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;
                return a.title.localeCompare(b.title);
            });
            break;
            
        case 'recent-alphabetical':
            // Recent first, then alphabetical
            displayProjects.sort((a, b) => {
                const aRecent = recentProjects.indexOf(a.id);
                const bRecent = recentProjects.indexOf(b.id);
                if (aRecent !== -1 && bRecent !== -1) return aRecent - bRecent;
                if (aRecent !== -1) return -1;
                if (bRecent !== -1) return 1;
                return a.title.localeCompare(b.title);
            });
            break;
            
        case 'smart':
        default:
            // Smart sorting: favorites first, then recent, then alphabetical
            displayProjects.sort((a, b) => {
                const aFav = favoriteProjects.includes(a.id);
                const bFav = favoriteProjects.includes(b.id);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;

                const aRecent = recentProjects.indexOf(a.id);
                const bRecent = recentProjects.indexOf(b.id);
                if (aRecent !== -1 && bRecent !== -1) return aRecent - bRecent;
                if (aRecent !== -1) return -1;
                if (bRecent !== -1) return 1;

                return a.title.localeCompare(b.title);
            });
            break;
    }

    displayProjects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        const isFavorite = favoriteProjects.includes(project.id);
        const isRecent = recentProjects.includes(project.id);
        let prefix = '';
        if (isFavorite) prefix = '★ ';
        else if (isRecent) prefix = '↻ ';
        option.textContent = prefix + project.title;
        if (project.id == defaultProjectId) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    // Show/update favorites toggle
    if (favoriteProjects.length > 0) {
        const toggle = document.getElementById('toggleFavorites');
        toggle.style.display = 'inline';
        toggle.textContent = showFavoritesOnly ? '☆ Show all projects' : '★ Show favorites only';
    }
}

// Load labels from API
async function loadLabels(apiUrl, apiToken) {
    const labelInput = document.getElementById('labelInput');
    if (!labelInput) {
        return;
    }
    
    const labelGroup = labelInput.closest('.form-group');

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'loadLabels',
            data: { apiUrl, apiToken }
        });

        if (!response.success) {
            // If labels aren't supported, hide the label section
            if (labelGroup) {
                labelGroup.style.display = 'none';
            }
            return;
        }

        allLabels = response.data || [];

        // Show label section if it was hidden
        if (labelGroup) {
            labelGroup.style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading labels:', error);
        // Hide label section on error
        if (labelGroup) {
            labelGroup.style.display = 'none';
        }
    }
}

// Label input with autocomplete
document.getElementById('labelInput')?.addEventListener('input', (e) => {
    const searchText = e.target.value.trim().toLowerCase();
    const suggestionsDiv = document.getElementById('labelSuggestions');
    
    if (!searchText) {
        suggestionsDiv.textContent = '';
        suggestionsDiv.style.display = 'none';
        return;
    }

    // Filter labels that match search
    const matches = allLabels.filter(label => 
        label.title.toLowerCase().includes(searchText) &&
        !selectedLabels.find(sl => sl.id === label.id)
    );

    suggestionsDiv.textContent = '';
    
    if (matches.length > 0) {
        matches.forEach(label => {
            const item = document.createElement('div');
            item.className = 'label-suggestion-item';
            item.setAttribute('role', 'option');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', label.title);
            
            // Create color indicator pill
            const colorPill = document.createElement('span');
            colorPill.style.display = 'inline-block';
            colorPill.style.width = '12px';
            colorPill.style.height = '12px';
            colorPill.style.borderRadius = '50%';
            colorPill.style.backgroundColor = label.hex_color || '#888';
            colorPill.style.marginRight = '8px';
            colorPill.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            colorPill.style.verticalAlign = 'middle';
            colorPill.setAttribute('aria-hidden', 'true');
            
            item.appendChild(colorPill);
            item.appendChild(document.createTextNode(label.title));
            
            const selectThisLabel = () => selectLabel(label);
            item.onclick = selectThisLabel;
            item.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectThisLabel();
                }
            };
            
            suggestionsDiv.appendChild(item);
        });
        suggestionsDiv.style.display = 'block';
    } else {
        // Option to create new label
        const createItem = document.createElement('div');
        createItem.className = 'label-suggestion-item create-new';
        createItem.setAttribute('role', 'option');
        createItem.setAttribute('tabindex', '0');
        createItem.textContent = `Create new label: "${e.target.value}"`;
        
        const createNewLabel = () => createAndSelectLabel(e.target.value);
        createItem.onclick = createNewLabel;
        createItem.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                createNewLabel();
            }
        };
        
        suggestionsDiv.appendChild(createItem);
        suggestionsDiv.style.display = 'block';
    }
});

// Handle Enter key in label input
document.getElementById('labelInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const searchText = e.target.value.trim();
        if (!searchText) return;

        // Check for exact match
        const exactMatch = allLabels.find(label => 
            label.title.toLowerCase() === searchText.toLowerCase() &&
            !selectedLabels.find(sl => sl.id === label.id)
        );

        if (exactMatch) {
            selectLabel(exactMatch);
        } else {
            // Create new label
            createAndSelectLabel(searchText);
        }
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    const labelInput = document.getElementById('labelInput');
    const suggestionsDiv = document.getElementById('labelSuggestions');
    if (labelInput && suggestionsDiv && !e.target.closest('#labelContainer')) {
        suggestionsDiv.style.display = 'none';
    }
});

function selectLabel(label) {
    if (!selectedLabels.find(sl => sl.id === label.id)) {
        selectedLabels.push(label);
        updateSelectedLabelsDisplay();
    }
    document.getElementById('labelInput').value = '';
    const suggestionsDiv = document.getElementById('labelSuggestions');
    suggestionsDiv.textContent = '';
    suggestionsDiv.style.display = 'none';
}

function createAndSelectLabel(title) {
    // Create a temporary label (will be created on server when task is saved)
    const newLabel = {
        id: null, // Null means it needs to be created
        title: title.trim(),
        hex_color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
    };
    
    selectedLabels.push(newLabel);
    allLabels.push(newLabel);
    updateSelectedLabelsDisplay();
    
    document.getElementById('labelInput').value = '';
    const suggestionsDiv = document.getElementById('labelSuggestions');
    suggestionsDiv.textContent = '';
    suggestionsDiv.style.display = 'none';
}

function updateSelectedLabelsDisplay() {
    const container = document.getElementById('selectedLabels');
    container.textContent = '';
    
    selectedLabels.forEach((label, index) => {
        const badge = document.createElement('span');
        badge.className = 'label-badge';
        badge.setAttribute('role', 'listitem');
        badge.setAttribute('tabindex', '0');
        badge.setAttribute('aria-label', `${label.title}, press Enter or Space to remove`);
        
        let bgColor = label.hex_color || '#888888';
        
        // In dark mode, lighten very dark colors for visibility
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            const newColor = ensureVisibleColor(bgColor);
            bgColor = newColor;
        }
        
        badge.style.backgroundColor = bgColor;
        badge.style.color = getContrastColor(bgColor);
        badge.style.borderColor = getBorderColor(bgColor);
        badge.textContent = label.title + ' ×';
        
        const removeLabel = () => {
            selectedLabels.splice(index, 1);
            updateSelectedLabelsDisplay();
        };
        
        badge.onclick = removeLabel;
        badge.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                removeLabel();
            }
        };
        
        container.appendChild(badge);
    });
}

function ensureVisibleColor(hexColor) {
    if (!hexColor) return '#888888';
    
    // Ensure the color starts with #
    if (!hexColor.startsWith('#')) {
        hexColor = '#' + hexColor;
    }
    
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // If too dark (brightness < 100), lighten the color significantly
    if (brightness < 100) {
        // For very dark colors, create a much lighter version
        const newR = Math.min(255, r + 150);
        const newG = Math.min(255, g + 150);
        const newB = Math.min(255, b + 150);
        const result = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        return result;
    }
    
    return hexColor;
}

function getContrastColor(hexColor) {
    if (!hexColor) return '#ffffff';
    
    // Ensure the color starts with #
    if (!hexColor.startsWith('#')) {
        hexColor = '#' + hexColor;
    }
    
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Using WCAG luminance formula for better accuracy
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function getBorderColor(hexColor) {
    if (!hexColor) return 'rgba(255, 255, 255, 0.3)';
    
    // Ensure the color starts with #
    if (!hexColor.startsWith('#')) {
        hexColor = '#' + hexColor;
    }
    
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Lighter border for dark colors, darker border for light colors
    if (brightness > 128) {
        return 'rgba(0, 0, 0, 0.3)';
    } else {
        return 'rgba(255, 255, 255, 0.5)';
    }
}

// Handle form submission
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const projectId = document.getElementById('projectSelect').value;
    const priority = parseInt(document.getElementById('priority').value);
    const dueDate = document.getElementById('dueDate').value;
    const reminderDate = document.getElementById('reminderDate').value;

    if (!title) {
        showStatus('Please enter a task title', 'error');
        return;
    }

    if (!projectId) {
        showStatus('Please select a project', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    chrome.storage.sync.get(['apiUrl', 'apiToken'], async (data) => {
        try {
            const taskData = {
                title: title
            };

            if (description) {
                taskData.description = description;
            }

            if (priority > 0) {
                taskData.priority = priority;
            }

            if (dueDate) {
                taskData.due_date = new Date(dueDate).toISOString();
            }

            if (reminderDate) {
                // Vikunja expects reminder_dates as an array of ISO date strings
                taskData.reminder_dates = [new Date(reminderDate).toISOString()];
            }

            if (selectedLabels.length > 0) {
                try {
                    // Create any new labels first (those with id=null)
                    const newLabels = selectedLabels.filter(label => label.id === null);
                    
                    for (const newLabel of newLabels) {
                        try {
                            const response = await chrome.runtime.sendMessage({
                                action: 'createLabel',
                                data: {
                                    apiUrl: data.apiUrl,
                                    apiToken: data.apiToken,
                                    title: newLabel.title,
                                    hexColor: newLabel.hex_color
                                }
                            });
                            
                            if (response.success) {
                                // Update the label in allLabels and selectedLabels with the real ID and server data
                                newLabel.id = response.data.id;
                                newLabel.hex_color = response.data.hex_color;
                                // Also update in allLabels array
                                const allLabelIndex = allLabels.findIndex(l => l.title === newLabel.title && l.id === null);
                                if (allLabelIndex !== -1) {
                                    allLabels[allLabelIndex] = { ...response.data };
                                }
                            }
                        } catch (labelError) {
                        }
                    }
                } catch (labelError) {
                }
            }

            const response = await chrome.runtime.sendMessage({
                action: 'createTask',
                data: {
                    apiUrl: data.apiUrl,
                    apiToken: data.apiToken,
                    projectId: projectId,
                    taskData: taskData
                }
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            // Add labels to the created task
            if (selectedLabels.length > 0) {
                const createdTaskId = response.data.id;
                
                for (const label of selectedLabels) {
                    if (label.id !== null) {
                        try {
                            const labelResponse = await chrome.runtime.sendMessage({
                                action: 'addLabelToTask',
                                data: {
                                    apiUrl: data.apiUrl,
                                    apiToken: data.apiToken,
                                    projectId: projectId,
                                    taskId: createdTaskId,
                                    labelId: label.id
                                }
                            });
                            
                            if (labelResponse.success) {
                            } else {
                            }
                        } catch (labelError) {
                        }
                    }
                }
            }

            if (!response.success) {
                throw new Error(response.error);
            }

            // Update recent projects
            chrome.storage.sync.get(['recentProjects'], (storageData) => {
                let recentProjects = storageData.recentProjects || [];
                const projectIdNum = parseInt(projectId);
                
                // Remove if already exists
                recentProjects = recentProjects.filter(id => id !== projectIdNum);
                
                // Add to front
                recentProjects.unshift(projectIdNum);
                
                // Keep only last 5
                recentProjects = recentProjects.slice(0, 5);
                
                chrome.storage.sync.set({ recentProjects });
            });

            showStatus('✅ Task added successfully!', 'success');
            
            // Re-fill form with current page info for next task based on user preferences
            chrome.storage.sync.get(['taskTitle', 'taskDescription'], async (prefs) => {
                const tab = await getCurrentTab();
                const taskTitlePref = prefs.taskTitle || 'page-title';
                const taskDescPref = prefs.taskDescription !== undefined ? prefs.taskDescription : 'url';
                
                // Set task title based on preference
                switch (taskTitlePref) {
                    case 'page-url':
                        document.getElementById('taskTitle').value = tab.url;
                        break;
                    case 'title-url':
                        document.getElementById('taskTitle').value = `${tab.title}\n${tab.url}`;
                        break;
                    case 'page-title':
                    default:
                        document.getElementById('taskTitle').value = tab.title;
                        break;
                }
                
                // Set task description based on preference
                switch (taskDescPref) {
                    case 'title-url':
                        document.getElementById('taskDescription').value = `<strong>${escapeHtml(tab.title)}</strong><br><br><a href="${tab.url}">Open page</a>`;
                        break;
                    case 'empty':
                        document.getElementById('taskDescription').value = '';
                        break;
                    case 'url':
                    default:
                        document.getElementById('taskDescription').value = `<a href="${tab.url}">${escapeHtml(tab.title)}</a>`;
                        break;
                }
            });
            
            document.getElementById('priority').value = '0';
            if (flatpickrInstance) {
                flatpickrInstance.clear();
            }
            if (reminderFlatpickrInstance) {
                reminderFlatpickrInstance.clear();
            }
            selectedLabels = [];
            updateSelectedLabelsDisplay();
            document.getElementById('labelInput').value = '';

            // Close popup after 1.5 seconds
            setTimeout(() => window.close(), 1500);

        } catch (error) {
            console.error('Error creating task:', error);
            showStatus('Error: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Task';
        }
    });
});
