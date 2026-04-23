# API Documentation

This directory contains comprehensive API documentation for all modules in the Nex-Drop Backend project.

## Documentation Files

- **[Auth Module API](./auth-api.md)** - Authentication and user management endpoints
- **[User Module API](./user-api.md)** - User management and profile endpoints
- **[Address Module API](./address-api.md)** - Address management endpoints
- **[Rider Module API](./rider-api.md)** - Rider application and management endpoints
- **[Parcel Module API](./parcel-api.md)** - Parcel management endpoints (Under Development)

## Base URL

All API endpoints are prefixed with `/api/v1`

## Authentication

Most endpoints require authentication using either:
- Session token (cookie: `better-auth.session_token`)
- Access token (Authorization header: `Bearer <token>`)

Some endpoints are public and don't require authentication (e.g., registration, login, rider application).

## Response Format

All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or validation error
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: User does not have permission
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)

## User Roles

- `CUSTOMER`: Regular customer user
- `ADMIN`: Administrative user
- `RIDER`: Delivery rider
- `SUPER_ADMIN`: Super administrative user

## User Status

- `ACTIVE`: User is active and can use the system
- `BLOCKED`: User is blocked from the system
- `DELETED`: User account is deleted

## Rider Account Status

- `PENDING`: Rider application is under review
- `ACTIVE`: Rider account is active and can accept deliveries
- `SUSPENDED`: Rider account is temporarily suspended
- `REJECTED`: Rider application was rejected

## Rider Current Status

- `AVAILABLE`: Rider is available for new deliveries
- `BUSY`: Rider is busy and not available
- `OFFLINE`: Rider is offline
- `ON_DELIVERY`: Rider is currently on a delivery

## Pagination

Some endpoints support pagination. Use these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Paginated responses include a `meta` object:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Validation

All endpoints use Zod validation for request payloads. Validation errors are returned with detailed error messages indicating which fields failed validation.

## Development Notes

- The Parcel module is currently under development
- Better-auth library is used for authentication
- Prisma ORM is used for database operations
- All endpoints use Express.js middleware for authentication and validation
