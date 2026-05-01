# Authentication Procedure - NexDrop Backend

## Overview

Your authentication system is built on **better-auth v1.6.5** with email verification, JWT tokens, and role-based access control.

## Authentication Architecture

### 1. **Framework & Libraries**

- **better-auth**: Modern authentication library for TypeScript
- **Prisma**: Database ORM for user management
- **PostgreSQL**: Primary database (via Prisma adapter)
- **JWT**: Access and Refresh tokens for stateless auth
- **nodemailer**: Email delivery for OTP verification

### 2. **Authentication Methods**

#### Email & Password Authentication
- User registration with email verification
- Email-based login
- Password reset via OTP
- Password change with current password verification

#### Social Login
- **Google OAuth**: Mapped to CUSTOMER role automatically
- Profile auto-mapping to CUSTOMER status and email verified

#### Bearer Token (Plugin)
- Support for API key/token-based access

#### Email OTP (Plugin)
- Email verification codes (6-digit OTP)
- Special handling for SUPER_ADMIN (skips verification emails)

### 3. **User Model Structure**

```
User {
  id: String (Primary Key)
  name: String
  email: String (Unique)
  emailVerified: Boolean (default: false)
  image: String (optional)
  
  // Additional Fields
  phone: String (optional)
  role: UserRole (default: CUSTOMER)
    - SUPER_ADMIN
    - ADMIN
    - RIDER
    - CUSTOMER
  status: UserStatus (default: ACTIVE)
    - ACTIVE
    - BLOCKED
    - DELETED
  
  created/updated timestamps
  
  Relations:
  - sessions: Session[]
  - accounts: Account[] (login credentials)
  - parcels: Parcel[]
  - payments: Payment[]
  - notifications: Notification[]
  - addresses: UserAddress[]
  - riderProfile: Rider?
}

Account {
  id: String (Primary Key)
  userId: String (Foreign Key -> User)
  providerId: String ("credential" | "google")
  accountId: String
  password: String? (hashed, only for credential provider)
  accessToken: String? (for OAuth)
  refreshToken: String? (for OAuth)
  scope: String?
  created/updated timestamps
}

Session {
  id: String (Primary Key)
  token: String (Unique JWT)
  userId: String (Foreign Key -> User)
  expiresAt: DateTime
  ipAddress: String?
  userAgent: String?
  created/updated timestamps
}
```

### 4. **Authentication Flow**

#### Registration Flow
```
1. User submits: name, email, password
2. System checks if email already exists
3. Email verification check (returns ghost user if exists - security feature)
4. better-auth creates user account
5. OTP sent to email for verification
6. User verifies email with OTP
7. User can now login
8. System generates ACCESS_TOKEN and REFRESH_TOKEN
```

#### Login Flow
```
1. User submits: email, password
2. System validates credentials
3. better-auth creates session
4. System generates JWT tokens:
   - Access Token (short-lived, used in requests)
   - Refresh Token (long-lived, used to get new access token)
5. Tokens returned to client
```

#### Token Claims
```
Access Token includes:
- userId
- email
- name
- role
- status
- emailVerified

Refresh Token includes:
- userId (used to validate and regenerate Access Token)
```

#### Password Reset Flow
```
1. User requests password reset with email
2. System sends OTP to email
3. User submits OTP + new password
4. System validates OTP
5. Password updated in database
6. Tokens invalidated (user must log in again)
```

### 5. **Email Verification Process**

#### For Regular Users (CUSTOMER, RIDER, ADMIN)
```
1. Registration: OTP sent to email
2. Login: OTP sent if not verified
3. Special behavior:
   - Verification OTP is 6-digit code
   - Expires after attempt limit
   - Auto-sign-in after verification (if enabled)
```

#### For SUPER_ADMIN
```
- Email verification is SKIPPED
- Emails NOT sent for verification
- Direct access without verification
```

### 6. **Middleware & Middleware Chain**

#### Authentication Middleware (`checkAuth.ts`)
```
Purpose: Verify JWT token and attach user to request
Process:
1. Extract token from Authorization header
2. Verify token signature with secret
3. Decode token to get user claims
4. Attach user to req.user
5. Pass to next middleware
```

#### Optional Auth Middleware (`optionalAuth.ts`)
```
Purpose: Attach user if token exists, don't fail if missing
Process:
1. Check if Authorization header exists
2. If exists: verify and attach user
3. If missing: continue with req.user = null
```

#### Validation Middleware (`validateRequest.ts`)
```
Purpose: Validate request body/params using Zod schemas
Process:
1. Parse incoming request
2. Validate against Zod schema
3. Return validation errors if invalid
```

### 7. **Session Management**

#### Session Creation
```
- When user logs in, better-auth creates a session
- Session record stored in database with:
  - Token (encrypted JWT)
  - User ID
  - Expiration time
  - IP Address
  - User Agent
```

#### Session Validation
```
- Middleware checks: token exists, valid signature, not expired
- Session linked to specific IP/User-Agent (optional security)
- Multiple concurrent sessions allowed per user
```

#### Session Invalidation
```
- On logout: mark session as expired
- On password change: invalidate all sessions
- On account deletion: remove all sessions
```

### 8. **Environment Variables Required**

```env
# Core
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/nexdrop

# Authentication Secrets
BETTER_AUTH_SECRET=your_secret_key_min_32_chars
BETTER_AUTH_URL=http://localhost:5000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=30d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=24h

# Email Configuration
EMAIL_SENDER_SMTP_USER=your_email@gmail.com
EMAIL_SENDER_SMTP_PASS=your_app_password
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=587
EMAIL_SENDER_SMTP_FROM=noreply@nexdrop.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Super Admin Credentials
SUPER_ADMIN_EMAIL=admin@nexdrop.com
SUPER_ADMIN_PASSWORD=your_admin_password
```

### 9. **Key Security Features**

✓ **Email Enumeration Protection**: Ghost users returned for duplicate emails
✓ **Email Verification**: Required for regular users
✓ **Token Expiration**: Short-lived access tokens, long-lived refresh tokens
✓ **Password Hashing**: Automatic via better-auth
✓ **Session Management**: Database-backed sessions
✓ **CSRF Protection**: Via token-based authentication
✓ **Role-Based Access Control**: User roles for authorization
✓ **Status-Based Access**: Users can be blocked/deleted
✓ **OTP Verification**: Email-based verification codes

### 10. **Request/Response Pattern**

#### Authenticated Request Header
```
Authorization: Bearer <access_token>
```

#### Response with Tokens
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "emailVerified": true
  },
  "token": {
    "token": "session_token...",
    "expiresAt": "2026-05-08T12:00:00Z"
  },
  "accessToken": "jwt_access_token...",
  "refreshToken": "jwt_refresh_token..."
}
```

### 11. **Error Handling**

#### Authentication Errors
```
- 401 Unauthorized: Invalid/missing token
- 403 Forbidden: Insufficient permissions
- 409 Conflict: User already exists
- 400 Bad Request: Invalid email format, weak password
```

#### Token Errors
```
- TokenExpiredError: Token has expired
- JsonWebTokenError: Invalid token signature
- NotBeforeError: Token not yet valid
```

### 12. **Testing Authentication**

#### Registration
```bash
POST /api/v1/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "StrongPassword123"
}
```

#### Login
```bash
POST /api/v1/auth/login
Body: {
  "email": "test@example.com",
  "password": "StrongPassword123"
}
```

#### Verify Email (after registration)
```bash
POST /api/v1/auth/verify-email
Body: {
  "code": "123456"  // OTP sent to email
}
```

#### Access Protected Route
```bash
GET /api/v1/auth/me
Header: Authorization: Bearer <access_token>
```

#### Refresh Token
```bash
POST /api/v1/auth/refresh-token
Body: {
  "refreshToken": "<refresh_token>"
}
```

---

## Configuration Checklist

- [ ] All environment variables set in `.env`
- [ ] Database created and migrations run
- [ ] Email service configured (SMTP)
- [ ] JWT secrets generated (min 32 characters)
- [ ] Better-auth URL matches backend URL
- [ ] Google OAuth credentials configured (if using)
- [ ] Super admin credentials seeded via `pnpm seed:admin`

---

## Admin Seeding with Better-Auth API

### What is `pnpm seed:admin`?

The seed admin script creates or verifies a SUPER_ADMIN user account with proper authentication via the better-auth API. It's a production-ready utility that:

1. ✅ Uses better-auth's `signUpEmail()` API for secure registration
2. ✅ Handles password hashing automatically
3. ✅ Creates proper Account records with credential provider
4. ✅ Sets email as verified (bypasses OTP for admin)
5. ✅ Assigns SUPER_ADMIN role
6. ✅ Detects existing admins and updates them if needed
7. ✅ Shows step-by-step logs with color-coded output

### Setup

#### 1. Configure Environment Variables

Create or update `.env` file:

```env
# Required for seed:admin
SUPER_ADMIN_EMAIL=superadmin@nexdrop.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
DATABASE_URL=postgresql://user:password@localhost:5432/nexdrop
BETTER_AUTH_SECRET=your_secret_key_at_least_32_chars
BETTER_AUTH_URL=http://localhost:5000
```

#### 2. Run Migrations First

```bash
pnpm migrate
```

This creates all required tables (user, account, session, etc.)

#### 3. Execute Seed Script

```bash
pnpm seed:admin
```

### Seed Script Execution Flow

#### Step-by-Step Process

```
[Step 1] Validating environment variables...
          ↓ Checks SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD exist
          
[Step 2] Connecting to database...
          ↓ Establishes PostgreSQL connection via Prisma
          
[Step 3] Checking if admin already exists...
          ├─ If EXISTS:
          │  [Step 3.1] Updating admin privileges...
          │             ↓ Ensures role is SUPER_ADMIN
          │             ↓ Ensures email is verified
          │             ↓ Skips creation, returns existing admin
          │
          └─ If NOT EXISTS:
             [Step 4] Registering admin via better-auth API...
                      ↓ Calls auth.api.signUpEmail({
                          name: "Super Admin",
                          email: superadmin@nexdrop.com,
                          password: ••••••••
                        })
                      ↓ better-auth hashes password using brypt
                      ↓ Creates User record with default CUSTOMER role
                      ↓ Creates Account record with credential provider
                      ↓ Returns user object
             
             [Step 5] Updating admin role to SUPER_ADMIN...
                      ↓ prisma.user.update({ role: SUPER_ADMIN })
                      ↓ Sets status to ACTIVE
             
             [Step 6] Setting email as verified...
                      ↓ prisma.user.update({ emailVerified: true })
                      ↓ Skips OTP verification for admin
             
             [Step 7] Fetching complete admin record...
                      ↓ Verifies all updates were applied
                      ↓ Fetches user with accounts relation
             
             ✓ SUPER_ADMIN created successfully!
```

### Example Output

**First Run (Creating Fresh Admin)**

```bash
$ pnpm seed:admin

[Step 1] Validating environment variables...
✓ Email configured: superadmin@nexdrop.com
ℹ Password configured: Sec******* (masked)
[Step 2] Connecting to database...
✓ Database connection established
[Step 3] Checking if admin already exists...
[Step 4] Registering admin via better-auth API...
✓ User registered via better-auth
ℹ User ID: WsXJGK6fH6MI0Qf95JWFzkSYK4VKBrUe
ℹ Email: superadmin@nexdrop.com
ℹ Default role: CUSTOMER
[Step 5] Updating admin role to SUPER_ADMIN...
✓ Role updated to: SUPER_ADMIN
✓ Status: ACTIVE
[Step 6] Setting email as verified...
✓ Email verified: true
[Step 7] Fetching complete admin record...
✓ Admin record verified in database
[Step ✓] SUPER_ADMIN created successfully!

════════════════════════════════════════
✓ SUPER ADMIN SEEDED SUCCESSFULLY
════════════════════════════════════════

Admin Credentials:
  Email: superadmin@nexdrop.com
  Password: Sec**** (hidden for security)
  Role: SUPER_ADMIN
  Status: ACTIVE
  Email Verified: true
  User ID: WsXJGK6fH6MI0Qf95JWFzkSYK4VKBrUe
  Auth Method: email/password (via better-auth)

Next Steps:
  1. Start your development server: pnpm dev
  2. Login with the admin credentials
  3. Access admin dashboard and manage the application

════════════════════════════════════════
```

**Second Run (Admin Already Exists)**

```bash
$ pnpm seed:admin

[Step 1] Validating environment variables...
✓ Email configured: superadmin@nexdrop.com
ℹ Password configured: Sec*****
[Step 2] Connecting to database...
✓ Database connection established
[Step 3] Checking if admin already exists...
⚠ Admin user already exists with email: superadmin@nexdrop.com
ℹ Current role: SUPER_ADMIN
ℹ Current status: ACTIVE
ℹ Email verified: true
[Step 3.1] Updating admin privileges...
✓ Admin already has correct configuration
[Step ✓] Admin is ready to use: superadmin@nexdrop.com
ℹ Database connection closed
```

### Database Records Created

After running `pnpm seed:admin`, the following records are created:

#### User Table
```sql
id:              WsXJGK6fH6MI0Qf95JWFzkSYK4VKBrUe
name:            Super Admin
email:           superadmin@nexdrop.com
emailVerified:   true
role:            SUPER_ADMIN
status:          ACTIVE
createdAt:       2026-05-01 12:00:00
updatedAt:       2026-05-01 12:00:00
```

#### Account Table
```sql
id:              (auto-generated UUID)
userId:          WsXJGK6fH6MI0Qf95JWFzkSYK4VKBrUe
providerId:      credential
accountId:       (internal better-auth id)
password:        (bcrypt hashed: $2b$10$...)
```

### Using the Admin Account

After seeding, login with:

```bash
POST /api/v1/auth/login
{
  "email": "superadmin@nexdrop.com",
  "password": "YourSecurePassword123!"
}
```

Response:
```json
{
  "user": {
    "id": "WsXJGK6fH6MI0Qf95JWFzkSYK4VKBrUe",
    "email": "superadmin@nexdrop.com",
    "name": "Super Admin",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "emailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Troubleshooting

#### Issue: "SUPER_ADMIN_EMAIL environment variable is not set"
**Solution**: Add `SUPER_ADMIN_EMAIL` to `.env` file

#### Issue: "Database connection failed"
**Solution**: 
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL server is running
- Check network connectivity

#### Issue: "User already exists"
**Solution**: 
- Script detects this and updates the existing admin
- To start fresh: `pnpm exec tsx scripts/deleteAdmin.ts` then `pnpm seed:admin`

#### Issue: "Failed to register admin"
**Solution**:
- Verify `BETTER_AUTH_SECRET` is set
- Check email format is valid
- Review database logs

### Deleting Admin (Fresh Start)

To reset and reseed the admin user:

```bash
# Delete existing admin
pnpm exec tsx scripts/deleteAdmin.ts

# Create fresh admin
pnpm seed:admin
```

### Security Notes

🔒 **Better-Auth Password Hashing**
- Uses bcrypt with secure salt
- Password never stored in plain text
- Automatic via better-auth API

🔒 **Environment Variables**
- Keep SUPER_ADMIN_PASSWORD in `.env`
- Don't commit `.env` to version control
- Use strong passwords in production

🔒 **Email Verification**
- SUPER_ADMIN skips OTP verification
- Regular users still require email verification
- Reduces friction for initial setup

🔒 **Session Security**
- Sessions stored in database
- Token-based authentication
- Automatic expiration

---

## Next Steps

1. Run migrations: `pnpm migrate`
2. Seed admin user: `pnpm seed:admin`
3. Start development server: `pnpm dev`
4. Test authentication endpoints
5. Monitor logs for issues
