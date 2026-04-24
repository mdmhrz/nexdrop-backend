# Auth Module API Documentation

## Base URL
`/api/v1/auth`

## Authentication
Most endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

> **Cookie-based auth**: All token-bearing endpoints set `accessToken`, `refreshToken`, and `better-auth.session_token` as HTTP-only cookies in addition to returning them in the response body.

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
      "image": "string | null",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "emailVerified": false,
      "createdAt": "2026-04-24T00:00:00.000Z",
      "updatedAt": "2026-04-24T00:00:00.000Z"
    },
    "token": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Sets Cookies**: `accessToken`, `refreshToken`, `better-auth.session_token`

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
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "image": "string | null",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "emailVerified": true,
      "createdAt": "2026-04-24T00:00:00.000Z",
      "updatedAt": "2026-04-24T00:00:00.000Z"
    },
    "token": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Sets Cookies**: `accessToken`, `refreshToken`, `better-auth.session_token`

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account is blocked
- `410 Gone`: Account has been deleted

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
  "message": "User fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": true,
    "image": "string | null",
    "phone": "string | null",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T00:00:00.000Z",
    "updatedAt": "2026-04-24T00:00:00.000Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: User not found

---

### POST /auth/refresh-token
Refresh access and refresh tokens using cookies.

**Authentication**: Public (No authentication required)

> **Note**: This endpoint reads `refreshToken` and `better-auth.session_token` from **cookies**, not the request body. No request body is required.

**Required Cookies**:
- `refreshToken`: Current refresh token
- `better-auth.session_token`: Current Better Auth session token

**Success Response** (200):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "sessionToken": "string"
  }
}
```

**Sets Cookies**: `accessToken`, `refreshToken`, `better-auth.session_token`

**Error Responses**:
- `401 Unauthorized`: Missing or invalid refresh token / session token

---

### POST /auth/change-password
Change user password. Revokes all other active sessions.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Required Cookies**:
- `better-auth.session_token`: Current Better Auth session token

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
  "message": "Password changed successfully",
  "data": {
    "token": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Sets Cookies**: `accessToken`, `refreshToken`, `better-auth.session_token`

**Error Responses**:
- `400 Bad Request`: Current password is incorrect, or Google authenticated user cannot change password
- `401 Unauthorized`: Invalid or missing session token

---

### POST /auth/logout
Logout user and invalidate session. Clears all auth cookies.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Required Cookies**:
- `better-auth.session_token`: Current Better Auth session token

**Success Response** (200):
```json
{
  "success": true,
  "message": "User logged out successfully",
  "data": {
    "success": true
  }
}
```

**Clears Cookies**: `accessToken`, `refreshToken`, `better-auth.session_token`

---

### POST /auth/verify-email
Verify user email address using OTP.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "email": "string (valid email)",
  "otp": "string (6 digits)"
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
- `400 Bad Request`: Invalid or expired OTP, or Google authenticated user
- `404 Not Found`: User not found

---

### POST /auth/forget-password
Request a password reset OTP via email.

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
  "message": "Password reset OTP sent to your email successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Email not verified, Google authenticated user, or account is deleted
- `404 Not Found`: User not found

---

### POST /auth/reset-password
Reset password using OTP. Invalidates all active sessions after reset.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "email": "string (valid email)",
  "otp": "string (6 digits)",
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
- `400 Bad Request`: Invalid or expired OTP, email not verified, Google authenticated user, or account is deleted
- `404 Not Found`: User not found

---

### POST /auth/resend-otp
Resend the email verification OTP to the user's email address.

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
  "message": "OTP sent successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Email already verified, Google authenticated user, or account is deleted
- `404 Not Found`: User not found

---

### GET /auth/login/google
Initiate Google OAuth login flow.

**Authentication**: Public (No authentication required)

**Query Parameters**:
- `redirect` (optional): Path to redirect after successful login (default: `/dashboard`)

**Behavior**: Renders an HTML page that initiates the Google OAuth flow. Upon success, redirects to `/api/v1/auth/google/success?redirect=<encodedPath>`.

---

### GET /auth/google/success
Handle Google OAuth success callback — sets auth cookies and redirects to frontend.

**Authentication**: Public (No authentication required)

**Query Parameters**:
- `redirect` (optional): Frontend path to redirect to after login (default: `/dashboard`). Must start with `/` and not `//`.

**Required Cookies**:
- `better-auth.session_token`: Set by Better Auth after Google OAuth completion

**Behavior**: Validates session, generates `accessToken` and `refreshToken`, sets them as cookies, then redirects to `${FRONTEND_URL}${redirectPath}`.

**Sets Cookies**: `accessToken`, `refreshToken`

**On Failure**: Redirects to `${FRONTEND_URL}/login?error=<error_code>` where `error_code` is one of:
- `oauth_failed`: Missing session cookie
- `no_session_found`: Session not found
- `no_user_found`: User not found in session

---

### GET /auth/oauth/error
Handle OAuth error — redirects to frontend login page.

**Authentication**: Public (No authentication required)

**Query Parameters**:
- `error` (optional): Error code to forward (default: `oauth_failed`)

**Behavior**: Redirects to `${FRONTEND_URL}/login?error=<error>`.

---

## Error Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or parameters
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: Account is blocked
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `410 Gone`: Account has been deleted
