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

/**
 * Helper utility functions
 */

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Show status message
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
export function showStatus(message, type) {
    const status = document.getElementById('status');
    if (!status) return;
    
    status.textContent = message;
    status.className = `status ${type}`;

    if (type === 'error') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

/**
 * Get current active tab
 * @returns {Promise<chrome.tabs.Tab>} Active tab
 */
export async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}
