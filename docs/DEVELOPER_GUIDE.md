# Nex-Drop Backend Developer Guide

This guide contains all the conventions, best practices, and rules to follow when working on the Nex-Drop Backend project.

---

## Documentation Rules

**CRITICAL**: Always create/update API documentation in `/docs` folder after implementing or modifying any API endpoint.

- Each module should have its own API documentation file (e.g., `auth-api.md`, `user-api.md`, `rider-api.md`)
- Documentation must include:
  - Endpoint URL and HTTP method
  - Authentication requirements
  - Request payload with validation rules
  - Success response structure
  - Error responses
- Update documentation immediately when API changes are made

---

## Code Conventions

### Validation
- **ALWAYS use Zod validation** for all request payloads - never trust frontend input
- Use the existing `validateRequest` middleware for validation
- Validation schemas should have descriptive error messages
- Define validation schemas in `validations/` folder

### Pagination
- **ALWAYS use pagination** from the shared pagination utility (`src/app/shared/pagination.ts`) for list endpoints
- Pagination response must include `meta` object with: `page`, `limit`, `total`, `totalPages`
- Query parameters: `page` (default: 1), `limit` (default: 10)

### Error Handling
- Use `catchAsync` wrapper for all async route handlers
- Use `sendResponse` utility for consistent API responses
- Use `AppError` class for custom errors
- Return proper HTTP status codes (400, 401, 403, 404, 409, etc.)
- Provide clear, specific error messages
- Handle edge cases (e.g., user trying to change own status, duplicate emails)

### Authentication
- Use `checkAuth` middleware for protected routes
- Use `optionalAuth` middleware for routes that work with both authenticated and unauthenticated users
- better-auth library handles authentication
- Session token: `better-auth.session_token` cookie
- Access token: `accessToken` cookie
- `req.user` populated by auth middleware with: `userId`, `email`, `role`

---

## Module Structure

Each module follows this pattern:
```
src/app/module/{module-name}/
├── interfaces/
│   └── {module}.interface.ts
├── validations/
│   └── {module}.validation.ts
│   └── index.ts
├── services/
│   ├── {action}.service.ts
│   └── index.ts
├── controllers/
│   ├── {action}.controller.ts
│   └── index.ts
└── {module}.route.ts
```

**Rules**:
- Create `index.ts` files in each subdirectory for clean imports
- Service layer handles business logic and database operations
- Controller layer handles request/response and calls services
- Validation schemas use Zod with descriptive error messages

---

## Type Safety

**CRITICAL**: Never use `any` type - always use proper TypeScript types

- Define interfaces for all payloads in `interfaces/` folder
- Use Prisma-generated enums for enum values (e.g., `UserRole`, `UserStatus`, `RiderAccountStatus`)
- Use type assertions (`as string`) only when necessary and safe
- All functions should have proper return types

---

## Database Operations

- Use Prisma ORM for all database operations
- Use transactions for operations that must be atomic (e.g., create user + rider profile)
- Implement manual rollback for transaction failures if needed
- Check for duplicate emails using Prisma before better-auth operations to avoid ghost user issues
- Better-auth handles duplicate email errors, but pre-check can provide better error messages

---

## Response Format

All responses follow consistent format:

**Success Response**:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Paginated Response**:
```json
{
  "success": true,
  "message": "Success message",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
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

Use proper HTTP status codes:
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or validation error
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: User does not have permission
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists

---

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

---

## Common Patterns

### Creating a New Module

1. Create module directory structure
2. Define interfaces in `interfaces/`
3. Create Zod validation schemas in `validations/`
4. Implement services in `services/`
5. Create controllers in `controllers/`
6. Define routes in `{module}.route.ts`
7. Create `index.ts` files for exports
8. Add route to main router in `src/app/routes/index.ts`
9. Create/update API documentation in `/docs`

### Adding a New Endpoint to Existing Module

1. Define interface in `interfaces/`
2. Create validation schema in `validations/`
3. Implement service in `services/`
4. Create controller in `controllers/`
5. Add route in `{module}.route.ts`
6. Update `index.ts` files
7. Update API documentation in `/docs`

---

## Important Notes

- Better-auth library is used for authentication
- Prisma ORM is used for database operations
- Express.js middleware pattern with async error handling
- All endpoints use consistent response structure
- Always handle edge cases and provide clear error messages
- Never trust frontend input - always validate server-side
