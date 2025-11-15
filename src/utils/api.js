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
 * API client for Vikunja API interactions
 * 
 * Compatible with Vikunja v1.0.0+ (unstable/RC versions)
 * Tested with: v1.0.0-rc2-278-682096e5
 * 
 * Note: Requires Vikunja API v1 endpoints
 */

export async function createTask({ apiUrl, apiToken, projectId, taskData }) {
    const payload = {
        ...taskData,
        project_id: parseInt(projectId)
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
    };

    const response = await fetch(`${apiUrl}/api/v1/projects/${projectId}/tasks`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    if (!response.ok) {
        let errorMessage;
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
            errorMessage = responseText || response.statusText;
        }
        throw new Error(`${response.status}: ${errorMessage}`);
    }

    return JSON.parse(responseText);
}

export async function loadProjects({ apiUrl, apiToken }) {
    const response = await fetch(`${apiUrl}/api/v1/projects`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to load projects: ${response.statusText}`);
    }

    const projects = await response.json();
    
    // Filter out Vikunja's pseudo-projects (like Favorites with id -1)
    const realProjects = projects.filter(p => p.id > 0);
    
    // Extract favorites from Vikunja data (only valid project IDs)
    const favorites = realProjects
        .filter(p => p.is_favorite)
        .map(p => p.id);
    
    // Use Vikunja's "views" array for recent projects
    // Each project has a views array with user view records
    // Get the 5 most recently viewed projects based on the latest view timestamp
    const projectsWithViews = realProjects.filter(p => p.views && p.views.length > 0);
    
    const recentProjects = projectsWithViews
        .map(p => {
            try {
                // Find the most recent view for this project
                const mostRecentView = p.views.reduce((latest, view) => {
                    const viewTime = new Date(view.created || view.updated || view.viewed_at || 0);
                    const latestTime = new Date(latest.created || latest.updated || latest.viewed_at || 0);
                    return viewTime > latestTime ? view : latest;
                });
                
                const lastViewTime = new Date(mostRecentView.created || mostRecentView.updated || mostRecentView.viewed_at);
                
                return {
                    id: p.id,
                    title: p.title,
                    lastViewTime: lastViewTime
                };
            } catch (error) {
                return null;
            }
        })
        .filter(p => p !== null && !isNaN(p.lastViewTime.getTime()))
        .sort((a, b) => b.lastViewTime - a.lastViewTime)
        .slice(0, 5)
        .map(p => {
            return p.id;
        });
    
    // Store favorites and recents in Chrome storage for the popup to use
    try {
        await chrome.storage.sync.set({ 
            favoriteProjects: favorites,
            recentProjects: recentProjects
        });
    } catch (storageError) {
    }
    
    // Return both the projects and the extracted metadata
    return {
        projects: realProjects,
        favorites,
        recentProjects
    };
}

export async function testConnection({ apiUrl, apiToken }) {
    const response = await fetch(`${apiUrl}/api/v1/user`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || response.statusText);
    }

    return response.json();
}

export async function loadLabels({ apiUrl, apiToken }) {
    try {
        const response = await fetch(`${apiUrl}/api/v1/labels`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            // If endpoint doesn't exist (404) or forbidden (403), labels might not be supported
            if (response.status === 404 || response.status === 403) {
                throw new Error(`Labels not supported or not accessible (${response.status})`);
            }
            throw new Error(`Failed to load labels: ${response.statusText}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        throw error;
    }
}

export async function createLabel({ apiUrl, apiToken, title, hexColor }) {
    try {
        const payload = {
            title: title,
            hex_color: hexColor || '#' + Math.floor(Math.random()*16777215).toString(16)
        };

        const response = await fetch(`${apiUrl}/api/v1/labels`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch {
                errorMessage = errorText || response.statusText;
            }
            throw new Error(`Failed to create label: ${errorMessage}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        throw error;
    }
}

export async function addLabelToTask({ apiUrl, apiToken, projectId, taskId, labelId }) {
    try {
        const response = await fetch(`${apiUrl}/api/v1/tasks/${taskId}/labels`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ label_id: labelId })
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch {
                errorMessage = errorText || response.statusText;
            }
            throw new Error(`Failed to add label to task: ${errorMessage}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        throw error;
    }
}
