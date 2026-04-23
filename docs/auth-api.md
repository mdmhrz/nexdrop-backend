# Auth Module API Documentation

## Base URL
`/api/v1/auth`

## Authentication
Most endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

---

## Endpoints

### POST /auth/register
Register a new user account.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "name": "string (1-255 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)"
}
```

**Validation**:
- `name`: Required, min 1 character, max 255 characters
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "emailVerified": boolean
    },
    "token": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Error Responses**:
- `409 Conflict`: User already exists with this email

---

### POST /auth/login
Login with email and password.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "email": "string (valid email)",
  "password": "string"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "emailVerified": boolean
    },
    "token": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials

---

### GET /auth/me
Get current authenticated user information.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "emailVerified": boolean
  }
}
```

---

### POST /auth/refresh-token
Refresh access token using refresh token.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

---

### POST /auth/change-password
Change user password.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 8 chars)"
}
```

**Validation**:
- `currentPassword`: Required
- `newPassword`: Required, minimum 8 characters

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Current password is incorrect

---

### POST /auth/logout
Logout user and invalidate session.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### POST /auth/verify-email
Verify user email address.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "token": "string"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid or expired token

---

### POST /auth/forget-password
Request password reset email.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "email": "string (valid email)"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### POST /auth/reset-password
Reset password with token.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "token": "string",
  "newPassword": "string (min 8 chars)"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid or expired token

---

### GET /auth/login/google
Initiate Google OAuth login.

**Authentication**: Public (No authentication required)

Redirects to Google OAuth consent screen.

---

### GET /auth/google/success
Handle Google OAuth success callback.

**Authentication**: Public (No authentication required)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "CUSTOMER",
      "status": "ACTIVE"
    },
    "token": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

---

### GET /auth/oauth/error
Handle OAuth error.

**Authentication**: Public (No authentication required)

**Error Response** (400):
```json
{
  "success": false,
  "message": "OAuth authentication failed",
  "error": "error details"
}
```

---

## Error Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or parameters
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: User does not have permission
- `409 Conflict`: Resource already exists (e.g., duplicate email)
