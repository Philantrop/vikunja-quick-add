# Vikunja API Reference - v1.0.0+

This document details the Vikunja API endpoints used by this extension.

## Base Configuration

```javascript
const apiUrl = 'https://your-vikunja-instance.com'
const headers = {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
```

## Endpoints Used

### 1. Test Connection / Get User Info
```http
GET /api/v1/user
Authorization: Bearer {token}
```

**Response:**
```json
{
    "id": 1,
    "username": "user",
    "name": "User Name",
    "email": "user@example.com"
}
```

### 2. Load Projects
```http
GET /api/v1/projects
Authorization: Bearer {token}
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "My Project",
        "description": "...",
        "owner": {...},
        "created": "...",
        "updated": "..."
    }
]
```

### 3. Create Task
```http
PUT /api/v1/projects/{projectId}/tasks
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Task title",
    "description": "<a href='...'>Link</a>",
    "project_id": 1,
    "priority": 3,
    "due_date": "2025-11-15T23:59:00Z",
    "labels": [
        {
            "id": 1,
            "title": "Label Name",
            "hex_color": "#ff0000"
        }
    ]
}
```

**Response:**
```json
{
    "id": 42,
    "title": "Task title",
    "description": "<a href='...'>Link</a>",
    "project_id": 1,
    "priority": 3,
    "due_date": "2025-11-15T23:59:00Z",
    "labels": [...],
    "created": "...",
    "updated": "..."
}
```

### 4. Load Labels
```http
GET /api/v1/labels
Authorization: Bearer {token}
```

**Response:**
```json
[
    {
        "id": 1,
        "title": "Work",
        "hex_color": "#1973ff",
        "description": "Work related tasks",
        "created": "...",
        "updated": "..."
    }
]
```

**Note:** Requires `labels:read` permission. May return 403/404 if not available.

## API Permissions Required

### Minimum (Core Functionality)
- `tasks:write` - Create and modify tasks
- `projects:read` - View available projects

### Recommended (Full Features)
- `tasks:write` - Create and modify tasks
- `projects:read` - View available projects
- `labels:read` - View and attach labels

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (endpoint or resource doesn't exist)
- `500` - Internal Server Error

### Extension Error Handling
- Labels: If 403/404, feature is hidden automatically
- Tasks: Shows error to user
- Projects: Shows error message in dropdown
- Connection test: Displays specific error

## Data Formats

### Dates
All dates use ISO 8601 format:
```javascript
new Date('2025-11-15T23:59:00').toISOString()
// "2025-11-15T23:59:00.000Z"
```

### HTML Content
Task descriptions support HTML:
```html
<a href="https://example.com">Link</a>
<strong>Bold text</strong>
<br>
<p>Paragraph</p>
```

### Priority Levels
```javascript
0 - None
1 - Low
2 - Medium
3 - High
4 - Urgent
5 - DO NOW
```

## API Version Compatibility

### Vikunja v1.0.0+
- ✅ All endpoints fully supported
- ✅ Projects API (renamed from Lists)
- ✅ Task relationships
- ✅ Labels API

### Vikunja v0.x
- ⚠️ May use different endpoints
- ⚠️ Limited compatibility
- ⚠️ Not officially supported

## Testing API Endpoints

You can test endpoints directly using curl:

```bash
# Test connection
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-vikunja.com/api/v1/user

# List projects
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-vikunja.com/api/v1/projects

# List labels
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-vikunja.com/api/v1/labels

# Create task
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Task","project_id":1}' \
     https://your-vikunja.com/api/v1/projects/1/tasks
```

## References

- [Vikunja API Documentation](https://vikunja.io/docs/api-documentation/)
- [Vikunja GitHub](https://github.com/go-vikunja/vikunja)
- Extension tested with: **v1.0.0-rc2-278-682096e5**
