# API Reference Guide

## Authentication

### 1. User Authentication

#### Login
```typescript
POST /api/auth/login
Content-Type: application/json

Request:
{
  email: string;
  password: string;
}

Response:
{
  user: User;
  token: string;
  expiresIn: number;
}
```

#### Register
```typescript
POST /api/auth/register
Content-Type: application/json

Request:
{
  email: string;
  password: string;
  name: string;
  state: string;
}

Response:
{
  user: User;
  token: string;
}
```

#### OAuth
```typescript
GET /api/auth/[provider]
Providers: ['google', 'apple', 'facebook']

Response:
{
  user: User;
  token: string;
}
```

## Content API

### 1. Stories

#### Get Stories
```typescript
GET /api/stories
Query Parameters:
- state: string
- difficulty: 'beginner' | 'intermediate' | 'advanced'
- page: number
- limit: number

Response:
{
  stories: Story[];
  totalPages: number;
  currentPage: number;
}
```

#### Get Story
```typescript
GET /api/stories/[id]

Response:
{
  story: Story;
  prerequisites: Story[];
  nextStories: Story[];
}
```

#### Track Progress
```typescript
POST /api/stories/[id]/progress
Content-Type: application/json

Request:
{
  checkpoint: string;
  timeSpent: number;
  score?: number;
}

Response:
{
  progress: Progress;
  achievements: Achievement[];
  nextCheckpoint: Checkpoint;
}
```

### 2. Practice Tests

#### Get Questions
```typescript
GET /api/practice/questions
Query Parameters:
- state: string
- topic: string
- difficulty: number
- limit: number

Response:
{
  questions: Question[];
  totalQuestions: number;
}
```

#### Submit Test
```typescript
POST /api/practice/submit
Content-Type: application/json

Request:
{
  questions: {
    id: string;
    answer: string;
    timeSpent: number;
  }[];
}

Response:
{
  score: number;
  correct: string[];
  incorrect: string[];
  explanations: {
    questionId: string;
    explanation: string;
  }[];
  recommendations: Topic[];
}
```

### 3. User Progress

#### Get Progress
```typescript
GET /api/users/progress

Response:
{
  overall: {
    level: number;
    xp: number;
    completion: number;
  };
  stories: {
    completed: string[];
    inProgress: {
      storyId: string;
      progress: number;
    }[];
  };
  tests: {
    taken: number;
    averageScore: number;
    bestScore: number;
  };
  achievements: Achievement[];
}
```

#### Update Settings
```typescript
PATCH /api/users/settings
Content-Type: application/json

Request:
{
  notifications: boolean;
  emailFrequency: 'daily' | 'weekly' | 'never';
  preferredTime: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

Response:
{
  settings: UserSettings;
}
```

## Admin API

### 1. Content Management

#### Create Story
```typescript
POST /api/admin/stories
Content-Type: application/json

Request:
{
  title: string;
  state: string;
  content: StoryContent;
  metadata: StoryMetadata;
  media: MediaContent;
}

Response:
{
  story: Story;
  status: 'draft' | 'published';
}
```

#### Update Content
```typescript
PATCH /api/admin/content/[type]/[id]
Content-Type: application/json

Request:
{
  updates: {
    field: string;
    value: any;
  }[];
  publishNow?: boolean;
}

Response:
{
  content: Content;
  version: string;
}
```

### 2. Analytics

#### Get Usage Stats
```typescript
GET /api/admin/analytics
Query Parameters:
- startDate: string
- endDate: string
- metrics: string[]

Response:
{
  users: {
    total: number;
    active: number;
    new: number;
  };
  content: {
    views: number;
    completion: number;
    popular: Content[];
  };
  performance: {
    averageLoad: number;
    errors: number;
    uptime: number;
  };
}
```

## Webhooks

### 1. Stripe Webhooks

#### Payment Success
```typescript
POST /api/webhooks/stripe
Content-Type: application/json

Request:
{
  type: 'payment_intent.succeeded';
  data: {
    object: {
      id: string;
      amount: number;
      customer: string;
    };
  };
}

Response:
Status: 200
```

### 2. Storage Webhooks

#### Media Processing
```typescript
POST /api/webhooks/media
Content-Type: application/json

Request:
{
  type: 'media.processed';
  data: {
    fileId: string;
    urls: {
      original: string;
      thumbnail: string;
      optimized: string;
    };
  };
}

Response:
Status: 200
```

## Error Handling

### Error Response Format
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}
```

### Common Error Codes
```typescript
enum ErrorCodes {
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error'
}
```

## Rate Limiting

### Limits
```typescript
const rateLimits = {
  public: {
    window: '15m',
    max: 100
  },
  authenticated: {
    window: '15m',
    max: 300
  },
  admin: {
    window: '15m',
    max: 1000
  }
}
```

### Headers
```typescript
Response Headers:
X-RateLimit-Limit: number
X-RateLimit-Remaining: number
X-RateLimit-Reset: number
```

## GraphQL API

### Schema
```graphql
type User {
  id: ID!
  email: String!
  name: String
  progress: Progress
  achievements: [Achievement!]!
}

type Story {
  id: ID!
  title: String!
  content: StoryContent!
  state: State!
  requirements: Requirements
}

type Query {
  me: User
  story(id: ID!): Story
  stories(
    state: String
    difficulty: Difficulty
    page: Int
    limit: Int
  ): StoriesConnection!
}

type Mutation {
  updateProgress(
    storyId: ID!
    progress: ProgressInput!
  ): ProgressPayload!
}
```

## WebSocket API

### Real-time Updates
```typescript
// Connect
ws://api.driversed.com/ws?token=${authToken}

// Message Format
interface WebSocketMessage {
  type: 'progress' | 'achievement' | 'notification';
  data: any;
}

// Subscribe to Updates
{
  type: 'subscribe',
  channel: 'user_progress',
  userId: string
}
```

## API Versioning

### Version Headers
```typescript
Request Headers:
Accept: application/json
API-Version: 2023-11-01
```

### Deprecation
```typescript
Response Headers:
Deprecation: true
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
Link: <https://api.driversed.com/v2/resource>; rel="successor-version"
```
