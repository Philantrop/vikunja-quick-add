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

import * as api from '../utils/api.js';

// Create context menu items based on user settings
async function updateContextMenus() {
    // Remove all existing context menu items first
    await chrome.contextMenus.removeAll();
    
    // Check if context menu is enabled in settings
    const data = await chrome.storage.sync.get(['quickAddContextMenu']);
    const isEnabled = data.quickAddContextMenu !== false; // Default to true
    
    if (isEnabled) {
        chrome.contextMenus.create({
            id: 'addSelectedText',
            title: 'Add "%s" to Vikunja',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'addLink',
            title: 'Add link to Vikunja',
            contexts: ['link']
        });
    }
}

// Create context menu items on install
chrome.runtime.onInstalled.addListener(() => {
    updateContextMenus();
});

// Listen for storage changes to update context menu
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.quickAddContextMenu) {
        updateContextMenus();
    }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'addSelectedText') {
        // Store selected text to be used when popup opens
        chrome.storage.local.set({
            pendingTask: {
                title: info.selectionText,
                description: `<p>From: <a href="${tab.url}">${tab.title}</a></p>`,
                source: 'context-menu-selection'
            }
        });
        chrome.action.openPopup();
    } else if (info.menuItemId === 'addLink') {
        // Store link info to be used when popup opens
        chrome.storage.local.set({
            pendingTask: {
                title: info.linkText || info.linkUrl,
                description: `<a href="${info.linkUrl}">${info.linkText || info.linkUrl}</a>`,
                source: 'context-menu-link'
            }
        });
        chrome.action.openPopup();
    }
});

// Handle messages from popup and options pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'createTask') {
        api.createTask(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'loadProjects') {
        api.loadProjects(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'testConnection') {
        api.testConnection(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'loadLabels') {
        api.loadLabels(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'createLabel') {
        api.createLabel(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'addLabelToTask') {
        api.addLabelToTask(request.data)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});
