# API Documentation

This document provides comprehensive documentation for the Smart To-Do List Application REST API.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-backend-url.appspot.com/api`

## Authentication

All API endpoints except authentication routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Overview

The API follows RESTful principles and returns JSON responses. All timestamps are in ISO 8601 format.

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Google OAuth Login
```http
POST /api/auth/google
```

**Request Body:**
```json
{
  "token": "google_oauth_token",
  "email": "user@gmail.com",
  "name": "John Doe",
  "avatar_url": "https://lh3.googleusercontent.com/..."
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <refresh_token>
```

### Logout
```http
POST /api/auth/logout
```

## Task Endpoints

### Get Tasks
```http
GET /api/tasks
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (`pending`, `in_progress`, `completed`, `cancelled`)
- `category_id` (optional): Filter by category ID
- `priority` (optional): Filter by priority (1-5)
- `search` (optional): Search in title and description
- `sort` (optional): Sort field (`created_at`, `updated_at`, `due_date`, `priority`)
- `order` (optional): Sort order (`asc`, `desc`)

**Example:**
```http
GET /api/tasks?status=pending&priority=5&sort=due_date&order=asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "status": "pending",
        "priority": 5,
        "due_date": "2024-01-15T23:59:59Z",
        "category_id": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "category": {
          "id": 1,
          "name": "Work",
          "color": "#3B82F6"
        },
        "attachments": [
          {
            "id": 1,
            "filename": "requirements.pdf",
            "file_url": "https://storage.googleapis.com/bucket/file.pdf",
            "file_size": 1024000,
            "mime_type": "application/pdf"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Task description (optional)",
  "priority": 3,
  "due_date": "2024-01-15T23:59:59Z",
  "category_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 2,
      "title": "New task title",
      "description": "Task description",
      "status": "pending",
      "priority": 3,
      "due_date": "2024-01-15T23:59:59Z",
      "category_id": 1,
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  },
  "message": "Task created successfully"
}
```

### Get Task by ID
```http
GET /api/tasks/{id}
```

### Update Task
```http
PUT /api/tasks/{id}
```

**Request Body:** (All fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": 4,
  "due_date": "2024-01-20T23:59:59Z",
  "category_id": 2
}
```

### Delete Task
```http
DELETE /api/tasks/{id}
```

### Upload Task Attachment
```http
POST /api/tasks/{id}/attachments
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File to upload

**Response:**
```json
{
  "success": true,
  "data": {
    "attachment": {
      "id": 2,
      "task_id": 1,
      "filename": "document.pdf",
      "file_url": "https://storage.googleapis.com/bucket/document.pdf",
      "file_size": 2048000,
      "mime_type": "application/pdf",
      "created_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

### Delete Task Attachment
```http
DELETE /api/tasks/{task_id}/attachments/{attachment_id}
```

## Category Endpoints

### Get Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Work",
        "color": "#3B82F6",
        "created_at": "2024-01-01T00:00:00Z",
        "task_count": 15
      },
      {
        "id": 2,
        "name": "Personal",
        "color": "#10B981",
        "created_at": "2024-01-01T00:00:00Z",
        "task_count": 8
      }
    ]
  }
}
```

### Create Category
```http
POST /api/categories
```

**Request Body:**
```json
{
  "name": "New Category",
  "color": "#F59E0B"
}
```

### Update Category
```http
PUT /api/categories/{id}
```

**Request Body:**
```json
{
  "name": "Updated Category",
  "color": "#EF4444"
}
```

### Delete Category
```http
DELETE /api/categories/{id}
```

**Query Parameters:**
- `reassign_to` (optional): Category ID to reassign tasks to

## User Endpoints

### Get User Profile
```http
GET /api/users/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "avatar_url": "https://storage.googleapis.com/bucket/avatar.jpg",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "stats": {
        "total_tasks": 25,
        "completed_tasks": 18,
        "pending_tasks": 5,
        "overdue_tasks": 2
      }
    }
  }
}
```

### Update User Profile
```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Upload Avatar
```http
POST /api/users/avatar
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `avatar`: Image file

### Delete User Account
```http
DELETE /api/users/account
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `TOKEN_INVALID` | 401 | JWT token is invalid |
| `ACCESS_DENIED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds size limit |
| `UNSUPPORTED_FILE_TYPE` | 415 | File type not supported |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `STORAGE_ERROR` | 500 | File storage operation failed |

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authentication endpoints**: 10 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **File upload endpoints**: 20 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## File Upload Specifications

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP (max 5MB)
- **Documents**: PDF, DOC, DOCX, TXT (max 10MB)
- **Spreadsheets**: XLS, XLSX, CSV (max 10MB)
- **Other**: ZIP, RAR (max 25MB)

### File Naming
- Files are automatically renamed to prevent conflicts
- Original filename is preserved in the database
- URLs are signed for security

## WebSocket API (Future)

Real-time updates will be available via WebSocket connection:

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://your-backend-url.appspot.com/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'your_jwt_token'
}));

// Listen for task updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'task_updated') {
    // Handle task update
  }
};
```

## SDK and Client Libraries

### JavaScript/TypeScript
```bash
npm install @smart-todolist/api-client
```

```javascript
import { TodoListAPI } from '@smart-todolist/api-client';

const api = new TodoListAPI({
  baseURL: 'https://your-backend-url.appspot.com/api',
  token: 'your_jwt_token'
});

// Get tasks
const tasks = await api.tasks.list({ status: 'pending' });

// Create task
const newTask = await api.tasks.create({
  title: 'New task',
  priority: 3
});
```

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get tasks
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer your_jwt_token"

# Create task
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","priority":3}'
```

### Using Postman

Import the Postman collection: [API Collection](./postman-collection.json)

### API Documentation Tools

- **Swagger UI**: Available at `/api/docs` (development only)
- **OpenAPI Spec**: Available at `/api/openapi.json`

---

For more detailed examples and advanced usage, see the [API Examples](./examples.md) document.