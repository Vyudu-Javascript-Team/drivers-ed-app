# Security Guidelines

## Authentication

### JWT Configuration
```typescript
const jwtOptions = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1d',
  algorithm: 'HS256'
};
```

### Password Hashing
```typescript
import { hash, compare } from 'bcrypt';

const hashPassword = async (password: string) => {
  return hash(password, 12);
};

const verifyPassword = async (password: string, hash: string) => {
  return compare(password, hash);
};
```

### Session Management
```typescript
const sessionConfig = {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};
```

## API Security

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Input Validation
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### CORS Configuration
```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400
};
```

## Data Protection

### Encryption at Rest
```typescript
import { createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-gcm';
const key = process.env.ENCRYPTION_KEY;
```

### Secure Headers
```typescript
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## Payment Security

### Stripe Integration
```typescript
const stripeConfig = {
  apiVersion: '2023-10-16',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};
```

### PCI Compliance
- Never store raw credit card data
- Use Stripe Elements for secure card collection
- Implement proper error handling

## Error Handling

### Secure Error Responses
```typescript
const handleError = (error: Error) => {
  logger.error(error);
  return {
    error: 'An error occurred',
    code: 500
  };
};
```

### Logging
```typescript
const logger = {
  error: (error: Error) => {
    // Remove sensitive data
    const sanitizedError = sanitizeError(error);
    // Log to monitoring service
  }
};
```

## File Upload Security

### Upload Restrictions
```typescript
const uploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png'],
  storage: {
    destination: '/secure/uploads',
    filename: (req, file, cb) => {
      const uniqueName = generateUniqueName(file);
      cb(null, uniqueName);
    }
  }
};
```

### File Scanning
```typescript
const scanFile = async (file: Buffer) => {
  // Implement virus scanning
  // Check file type
  // Validate content
};
```

## Database Security

### Query Parameters
```typescript
const safeQuery = async (query: string, params: any[]) => {
  return prisma.$executeRaw`${query}${params}`;
};
```

### Connection Security
```typescript
const dbConfig = {
  ssl: true,
  maxConnections: 20,
  idleTimeoutMillis: 30000
};
```

## Monitoring

### Security Events
```typescript
const securityEvents = {
  LOGIN_ATTEMPT: 'login_attempt',
  PASSWORD_CHANGE: 'password_change',
  API_ACCESS: 'api_access'
};
```

### Alerts
```typescript
const alertConfig = {
  thresholds: {
    failedLogins: 5,
    apiErrors: 10
  },
  channels: ['email', 'slack']
};
```

## Compliance

### GDPR
```typescript
const gdprConfig = {
  retention: {
    userdata: 365 * 24 * 60 * 60, // 1 year
    logs: 30 * 24 * 60 * 60 // 30 days
  },
  deletion: {
    method: 'hard',
    cascade: true
  }
};
```

### Data Export
```typescript
const exportUserData = async (userId: string) => {
  const userData = await getUserData(userId);
  return formatForExport(userData);
};
```

## Security Checklist

1. Authentication
   - [ ] Implement MFA
   - [ ] Secure password reset
   - [ ] Session management

2. Authorization
   - [ ] Role-based access
   - [ ] Resource permissions
   - [ ] API access control

3. Data Protection
   - [ ] Encryption at rest
   - [ ] Secure transmission
   - [ ] Data backup

4. API Security
   - [ ] Rate limiting
   - [ ] Input validation
   - [ ] Output sanitization

5. Infrastructure
   - [ ] Firewall configuration
   - [ ] Network segmentation
   - [ ] Regular updates

6. Monitoring
   - [ ] Security logging
   - [ ] Alert system
   - [ ] Audit trail

7. Compliance
   - [ ] GDPR compliance
   - [ ] Data privacy
   - [ ] Regular audits