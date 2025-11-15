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

import { showStatus } from '../utils/helpers.js';

// Load manifest version
const manifest = chrome.runtime.getManifest();
document.getElementById('version').textContent = manifest.version;

// Populate time options
function populateTimeOptions(is24h) {
    const select = document.getElementById('defaultReminderTime');
    const currentValue = select.value || '10:00';
    
    select.textContent = '';
    
    for (let hour = 0; hour < 24; hour++) {
        const value = `${String(hour).padStart(2, '0')}:00`;
        const option = document.createElement('option');
        option.value = value;
        
        if (is24h) {
            option.textContent = value;
        } else {
            const period = hour >= 12 ? 'p.m.' : 'a.m.';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            option.textContent = `${displayHour}:00 ${period}`;
        }
        
        select.appendChild(option);
    }
    
    // Restore the previous value
    select.value = currentValue;
}

// Apply touch target size class to body
function applyTouchTargetSize(compactMode) {
    if (compactMode === true) {
        document.body.classList.add('compact-mode');
    } else {
        document.body.classList.remove('compact-mode');
    }
}

// Load saved settings
chrome.storage.sync.get([
    'apiUrl',
    'apiToken',
    'dateFormat',
    'timeFormat',
    'taskTitle',
    'taskDescription',
    'defaultReminderDate',
    'defaultReminderTime',
    'defaultProjectId',
    'showLabels',
    'listSortOrder',
    'sortListsByName', // Legacy setting for migration
    'showReminderDate',
    'showDueDate',
    'quickAddContextMenu',
    'compactMode',
    'showClearButton',
    'showSettingsButton'
], (data) => {
    if (data.apiUrl) {
        document.getElementById('apiUrl').value = data.apiUrl;
    }
    if (data.apiToken) {
        document.getElementById('apiToken').value = data.apiToken;
    }
    
    // Set format options
    document.getElementById('dateFormat').value = data.dateFormat || 'DD.MM.YYYY';
    const timeFormat = data.timeFormat || '24h';
    document.getElementById('timeFormat24h').checked = (timeFormat === '24h');
    updateTimeFormatLabels(timeFormat === '24h');
    
    // Populate time options based on format
    populateTimeOptions(timeFormat === '24h');
    
    // Set task options
    const taskTitle = data.taskTitle || 'page-title';
    const taskDescription = data.taskDescription !== undefined ? data.taskDescription : 'url';
    document.getElementById('taskTitle').value = taskTitle;
    document.getElementById('taskDescription').value = taskDescription;
    
    // Set reminder options
    document.getElementById('defaultReminderDate').value = data.defaultReminderDate || '';
    document.getElementById('defaultReminderTime').value = data.defaultReminderTime || '10:00';
    
    // Migrate old sortListsByName setting to new listSortOrder
    let listSortOrder = data.listSortOrder;
    if (!listSortOrder && data.sortListsByName !== undefined) {
        // Migrate old setting: true = alphabetical, false/undefined = smart
        listSortOrder = data.sortListsByName ? 'alphabetical' : 'smart';
        // Save the migrated value
        chrome.storage.sync.set({ listSortOrder });
        chrome.storage.sync.remove('sortListsByName');
    }
    if (!listSortOrder) {
        listSortOrder = 'smart';
    }
    
    // Set checkboxes
    document.getElementById('showLabels').checked = data.showLabels !== false;
    document.getElementById('listSortOrder').value = listSortOrder;
    document.getElementById('showReminderDate').checked = data.showReminderDate !== false;
    document.getElementById('showDueDate').checked = data.showDueDate !== false;
    document.getElementById('quickAddContextMenu').checked = data.quickAddContextMenu !== false;
    document.getElementById('largeTouchTargets').checked = data.compactMode === true; // Default to false (standard size)
    
    // Options page never uses compact mode - always standard accessibility size
    
    // Set button toggles
    const showSettingsButton = data.showSettingsButton !== false; // Default to true
    const settingsBtn = document.getElementById('settingsIconBtn');
    if (showSettingsButton) {
        settingsBtn.classList.add('active');
    } else {
        settingsBtn.classList.remove('active');
    }
    
    const showClearButton = data.showClearButton !== false; // Default to true
    const clearBtn = document.getElementById('clearIconBtn');
    if (showClearButton) {
        clearBtn.classList.add('active');
    } else {
        clearBtn.classList.remove('active');
    }

    // Load lists if we have credentials
    if (data.apiUrl && data.apiToken) {
        loadLists(data.apiUrl, data.apiToken, data.defaultProjectId);
    }
});

// Handle time format switch
document.getElementById('timeFormat24h').addEventListener('change', (e) => {
    updateTimeFormatLabels(e.target.checked);
    populateTimeOptions(e.target.checked);
});

// Handle list sort order change
document.getElementById('listSortOrder').addEventListener('change', (e) => {
    chrome.storage.sync.get(['apiUrl', 'apiToken', 'defaultProjectId'], (data) => {
        if (data.apiUrl && data.apiToken) {
            loadLists(data.apiUrl, data.apiToken, data.defaultProjectId);
        }
    });
});

// Handle clear button toggle
document.getElementById('clearIconBtn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
        btn.classList.remove('active');
        chrome.storage.sync.set({ showClearButton: false });
    } else {
        btn.classList.add('active');
        chrome.storage.sync.set({ showClearButton: true });
    }
});

// Handle settings button toggle
document.getElementById('settingsIconBtn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
        btn.classList.remove('active');
        chrome.storage.sync.set({ showSettingsButton: false });
    } else {
        btn.classList.add('active');
        chrome.storage.sync.set({ showSettingsButton: true });
    }
});

function updateTimeFormatLabels(is24h) {
    const label12h = document.getElementById('timeFormatLabel12h');
    const label24h = document.getElementById('timeFormatLabel24h');
    
    if (is24h) {
        label12h.style.color = 'GrayText';
        label12h.style.fontWeight = 'normal';
        label24h.style.color = 'CanvasText';
        label24h.style.fontWeight = '500';
    } else {
        label12h.style.color = 'CanvasText';
        label12h.style.fontWeight = '500';
        label24h.style.color = 'GrayText';
        label24h.style.fontWeight = 'normal';
    }
}

// Save settings
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiUrl = document.getElementById('apiUrl').value.trim().replace(/\/$/, '');
    const apiToken = document.getElementById('apiToken').value.trim();
    const dateFormat = document.getElementById('dateFormat').value;
    const timeFormat = document.getElementById('timeFormat24h').checked ? '24h' : '12h';
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const defaultReminderDate = document.getElementById('defaultReminderDate').value;
    const defaultReminderTime = document.getElementById('defaultReminderTime').value;
    const defaultProjectId = document.getElementById('defaultList').value;
    const showLabels = document.getElementById('showLabels').checked;
    const listSortOrder = document.getElementById('listSortOrder').value;
    const showReminderDate = document.getElementById('showReminderDate').checked;
    const showDueDate = document.getElementById('showDueDate').checked;
    const quickAddContextMenu = document.getElementById('quickAddContextMenu').checked;
    const compactMode = document.getElementById('largeTouchTargets').checked;
    const showClearButton = document.getElementById('clearIconBtn').classList.contains('active');
    const showSettingsButton = document.getElementById('settingsIconBtn').classList.contains('active');

    chrome.storage.sync.set({
        apiUrl,
        apiToken,
        dateFormat,
        timeFormat,
        taskTitle,
        taskDescription,
        defaultReminderDate,
        defaultReminderTime,
        defaultProjectId,
        showLabels,
        listSortOrder,
        showReminderDate,
        showDueDate,
        quickAddContextMenu,
        compactMode,
        showClearButton,
        showSettingsButton
    }, () => {
        showStatus('✅ Settings saved successfully!', 'success');

        // Apply touch target size immediately (but not on options page)
        // Options page always uses standard size

        // Reload lists with new settings
        loadLists(apiUrl, apiToken, defaultProjectId);
    });
});

// Test connection
document.getElementById('testConnection').addEventListener('click', async () => {
    const apiUrl = document.getElementById('apiUrl').value.trim().replace(/\/$/, '');
    const apiToken = document.getElementById('apiToken').value.trim();

    if (!apiUrl || !apiToken) {
        showStatus('Please enter API URL and token first', 'error');
        return;
    }

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'testConnection',
            data: { apiUrl, apiToken }
        });

        if (!response.success) {
            throw new Error(response.error);
        }

        const user = response.data;
        showStatus(`✅ Connection successful! Logged in as: ${user.username || user.name}`, 'success');

        // Load lists after successful test
        const currentSelection = document.getElementById('defaultList').value;
        loadLists(apiUrl, apiToken, currentSelection);
    } catch (error) {
        showStatus(`❌ Connection failed: ${error.message}`, 'error');
    }
});

// Load lists from API
async function loadLists(apiUrl, apiToken, selectedListId) {
    const select = document.getElementById('defaultList');

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'loadProjects',
            data: { apiUrl, apiToken }
        });

        if (!response.success) {
            throw new Error(response.error);
        }

        // Handle both old and new response formats
        let lists, favoriteProjects, recentProjects;
        
        if (response.data && response.data.projects) {
            // New format: { projects, favorites, recentProjects }
            lists = response.data.projects;
            favoriteProjects = response.data.favorites || [];
            recentProjects = response.data.recentProjects || [];
        } else if (Array.isArray(response.data)) {
            // Old format: just an array of projects
            lists = response.data;
            favoriteProjects = [];
            recentProjects = [];
        } else {
            throw new Error('Unexpected response format from API');
        }
        
        // Filter out invalid project IDs from favorites and recents
        const validProjectIds = new Set(lists.map(l => l.id));
        favoriteProjects = favoriteProjects.filter(id => validProjectIds.has(id));
        recentProjects = recentProjects.filter(id => validProjectIds.has(id));
        
        // If the selected list ID is invalid (deleted project), clear it
        if (selectedListId && !validProjectIds.has(parseInt(selectedListId))) {
            selectedListId = '';
            // Update storage to remove the invalid default
            chrome.storage.sync.set({ defaultProjectId: '' });
        }

        const listSortOrder = document.getElementById('listSortOrder').value;
        
        // Sort based on user preference
        sortLists(lists, listSortOrder, favoriteProjects, recentProjects);
        
        select.textContent = '';

        lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.id;
            
            // Add visual markers for favorites and recents
            const isFavorite = favoriteProjects.includes(list.id);
            const isRecent = recentProjects.includes(list.id);
            let prefix = '';
            if (isFavorite) prefix = '★ ';
            else if (isRecent) prefix = '↻ ';
            
            option.textContent = prefix + list.title;
            if (list.id == selectedListId) {
                option.selected = true;
            }
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading lists:', error);
    }
}

// Helper function to sort lists based on user preference
function sortLists(lists, sortOrder, favoriteProjects = [], recentProjects = []) {
    switch (sortOrder) {
        case 'alphabetical':
            lists.sort((a, b) => a.title.localeCompare(b.title));
            break;
            
        case 'favorites-alphabetical':
            // Favorites first, then alphabetical
            lists.sort((a, b) => {
                const aFav = favoriteProjects.includes(a.id);
                const bFav = favoriteProjects.includes(b.id);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;
                return a.title.localeCompare(b.title);
            });
            break;
            
        case 'recent-alphabetical':
            // Recent first, then alphabetical
            lists.sort((a, b) => {
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
            lists.sort((a, b) => {
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
}
