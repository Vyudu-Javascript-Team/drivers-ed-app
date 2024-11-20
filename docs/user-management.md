# User Management System Documentation

This document provides information about the user management system implementation, including setup instructions, API endpoints, and configuration details.

## Setup Instructions

1. **Environment Variables**
   Copy `.env.example` to `.env` and configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/driversed"

   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # AWS S3 (for avatar uploads)
   S3_ACCESS_KEY_ID="your_aws_access_key"
   S3_SECRET_ACCESS_KEY="your_aws_secret_key"
   S3_BUCKET="your-bucket-name"
   S3_REGION="us-east-1"
   ```

2. **Database Setup**
   ```bash
   # Run migrations
   npx prisma migrate dev
   # Generate Prisma Client
   npx prisma generate
   ```

## API Endpoints

### User Management

#### GET /api/users
List users with pagination and filtering
- Query Parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name or email
  - `role`: Filter by role (STUDENT, INSTRUCTOR, ADMIN)
  - `status`: Filter by status (ACTIVE, INACTIVE, SUSPENDED)
  - `sortBy`: Sort field
  - `sortOrder`: Sort direction (asc, desc)

#### POST /api/users
Create a new user
- Required fields: name, email
- Optional fields: role, status, phone, bio, notifications, twoFactorAuth

#### GET /api/users/[userId]
Get user details including progress and test results

#### PATCH /api/users/[userId]
Update user information
- Admins can update all fields
- Regular users can only update their own non-sensitive information

#### DELETE /api/users/[userId]
Soft delete a user (admin only)

### Avatar Management

#### POST /api/users/[userId]/avatar
Upload user avatar
- Accepts multipart/form-data
- File field name: 'avatar'
- Supports image files only

### Batch Operations

#### POST /api/users/batch
Perform batch operations on multiple users (admin only)
- Actions:
  - delete: Soft delete multiple users
  - updateStatus: Update status of multiple users
  - updateRole: Update role of multiple users

#### PUT /api/users/batch
Import users from CSV file
- Required CSV headers: name, email
- Optional headers: role, status, phone, bio

## Authentication & Authorization

The system uses NextAuth.js for authentication with the following roles:
- STUDENT: Basic access to own profile
- INSTRUCTOR: Additional access to student information
- ADMIN: Full access to all user management features

Role-based access control is implemented at the API level:
- Users can only view and edit their own profiles
- Admins have full access to all user operations
- Certain operations (delete, batch operations) are admin-only

## File Upload

Avatar uploads are handled through AWS S3:
- Files are stored in the configured S3 bucket
- Files are organized by user ID
- Signed URLs are used for secure access
- Supported formats: JPEG, PNG, GIF
- Maximum file size: 5MB

## Error Handling

All API endpoints follow a consistent error response format:
```json
{
  "error": "Error message",
  "errors": [] // Validation errors if applicable
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (validation error)
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Development Notes

1. **Database Indexes**
   The following indexes are created for optimal performance:
   - email (unique)
   - role
   - status
   - xp
   - level

2. **Soft Delete**
   Users are never physically deleted from the database. Instead, they are marked with `deleted: true`.

3. **Security Considerations**
   - All routes are protected with authentication
   - Role-based access control is enforced
   - File uploads are validated and sanitized
   - Sensitive operations require admin privileges

4. **Performance Optimizations**
   - Pagination is implemented for list endpoints
   - Indexes are created for frequently queried fields
   - Avatar URLs are cached
   - Batch operations are available for bulk updates

## Future Improvements

Consider implementing:
1. Two-factor authentication
2. Password reset functionality
3. Email verification
4. Activity logging
5. User impersonation (for admin support)
6. Bulk export functionality
7. Advanced search filters
8. Real-time notifications
