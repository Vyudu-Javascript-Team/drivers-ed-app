# API Documentation

## Authentication

All authenticated endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /api/auth/signin
Sign in with credentials or OAuth provider.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```

## Stories

### GET /api/stories
Get list of stories for a specific state.

**Query Parameters:**
- `state`: string (required) - State code (e.g., 'GA', 'FL')
- `page`: number - Page number for pagination
- `limit`: number - Items per page

**Response:**
```json
{
  "stories": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "state": "string",
      "progress": number
    }
  ],
  "pagination": {
    "total": number,
    "pages": number,
    "current": number
  }
}
```

### GET /api/stories/[id]
Get story details.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": {
    "sections": [
      {
        "type": "text|rule|question",
        "content": "string"
      }
    ]
  },
  "state": "string",
  "progress": number
}
```

### POST /api/stories/[id]/progress
Update story progress.

**Request Body:**
```json
{
  "progress": number
}
```

**Response:**
```json
{
  "id": "string",
  "progress": number,
  "completed": boolean
}
```

## Practice Tests

### GET /api/tests
Get list of practice tests.

**Query Parameters:**
- `state`: string (required)
- `difficulty`: string
- `category`: string

**Response:**
```json
{
  "tests": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "difficulty": "string",
      "questionsCount": number,
      "timeLimit": number
    }
  ]
}
```

### POST /api/tests/[id]/submit
Submit test answers.

**Request Body:**
```json
{
  "answers": number[],
  "timeSpent": number
}
```

**Response:**
```json
{
  "score": number,
  "correctAnswers": number,
  "totalQuestions": number,
  "timeSpent": number,
  "feedback": {
    "categoryBreakdown": [
      {
        "category": "string",
        "score": number
      }
    ]
  }
}
```

## User Progress

### GET /api/user/progress
Get user's learning progress.

**Response:**
```json
{
  "level": number,
  "xp": number,
  "nextLevelXP": number,
  "completedStories": string[],
  "testResults": [
    {
      "id": "string",
      "score": number,
      "date": "string"
    }
  ]
}
```

## Subscriptions

### POST /api/stripe
Create Stripe checkout session.

**Request Body:**
```json
{
  "priceId": "string"
}
```

**Response:**
```json
{
  "sessionId": "string"
}
```

### POST /api/webhook
Handle Stripe webhook events.

**Headers:**
```
stripe-signature: string
```

**Response:**
```json
{
  "received": true
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```