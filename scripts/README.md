# Scripts Directory

This directory contains utility scripts for database seeding and other operational tasks.

## Available Scripts

### seed:admin - Seed SUPER_ADMIN User

Creates or verifies a SUPER_ADMIN user account with proper role and authentication.

#### Prerequisites

Ensure your `.env` file contains:
```env
SUPER_ADMIN_EMAIL=superadmin@nexdrop.com
SUPER_ADMIN_PASSWORD=your_secure_password
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000
```

#### Usage

```bash
# Seed admin via pnpm command
pnpm seed:admin

# Or directly with tsx
pnpm exec tsx scripts/seedAdmin.ts
```

#### Authentication Flow

The seed script uses **better-auth API** for secure admin creation:

1. **Step 1**: Validate environment variables (email, password)
2. **Step 2**: Connect to database
3. **Step 3**: Check if admin exists
   - If exists: Update role to SUPER_ADMIN & set email verified
   - If not exists: Proceed to registration
4. **Step 4**: Call `auth.api.signUpEmail()` via better-auth
   - Registers user with encrypted password
   - Creates account record with credential provider
   - Returns user with default CUSTOMER role
5. **Step 5**: Update user role to SUPER_ADMIN
6. **Step 6**: Set `emailVerified` to true (skip OTP for admin)
7. **Step 7**: Fetch & verify complete admin record

#### Execution Example

```bash
$ pnpm seed:admin

[Step 1] Validating environment variables...
✓ Email configured: superadmin@nexdrop.com
ℹ Password configured: 123*****
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
  Password: 123*****
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

### deleteAdmin - Delete Admin User

Removes the SUPER_ADMIN user for fresh seeding.

```bash
pnpm exec tsx scripts/deleteAdmin.ts
```

Deletes:
- User account
- Associated auth accounts

---

## Key Files

- `seedAdmin.ts` - SUPER_ADMIN creation script using better-auth API
- `deleteAdmin.ts` - Admin deletion utility
- `README.md` - This documentation
4. ✓ Creates SUPER_ADMIN user with:
   - Role: `SUPER_ADMIN`
   - Status: `ACTIVE`
   - Email Verified: `true`
   - Name: "Super Admin"
5. ✓ Creates account record with password
6. ✓ Displays success summary

#### Output Example

```
[Step 1] Validating environment variables...
✓ Email configured: admin@nexdrop.com
ℹ Password configured: sec***
[Step 2] Connecting to database...
✓ Database connection established
[Step 3] Checking if admin already exists...
[Step 4] Creating super admin user in database...
✓ User created with ID: clx...
✓ Email: admin@nexdrop.com
✓ Role: SUPER_ADMIN
✓ Status: ACTIVE
[Step 5] Creating account record with password...
✓ Account record created
[Step 6] Verification and Summary
✓ Admin user successfully seeded!

════════════════════════════════════════
✓ SUPER ADMIN SEEDED SUCCESSFULLY
════════════════════════════════════════

Admin Credentials:
  Email: admin@nexdrop.com
  Password: sec***
  Role: SUPER_ADMIN
  Status: ACTIVE
  Verified: true
  User ID: clx...
  
Next Steps:
  1. Start your development server: pnpm dev
  2. Login with the admin credentials
  3. Access admin dashboard and manage the application
```

#### Troubleshooting

**Error: Missing required environment variable**
- Ensure all required env variables are set in `.env`
- Check that the database connection is valid

**Error: User already exists**
- The script will update the role to SUPER_ADMIN if the user exists
- This is normal behavior for idempotent seeding

**Error: Database connection failed**
- Verify DATABASE_URL is correct
- Ensure database server is running
- Check network connectivity

---

## Authentication Configuration

### System Overview

The authentication system uses **better-auth** with the following setup:

- **Email/Password**: Enabled with email verification
- **Social Login**: Google OAuth integration
- **Additional Fields**: 
  - `phone` (optional)
  - `role` (required, defaults to CUSTOMER)
  - `status` (required, defaults to ACTIVE)

### User Roles

- `SUPER_ADMIN` - Full system access
- `ADMIN` - Admin privileges
- `RIDER` - Delivery personnel
- `CUSTOMER` - End users

### User Statuses

- `ACTIVE` - User is active
- `BLOCKED` - User is blocked
- `DELETED` - User is deleted

### Password Security

Passwords are automatically hashed by better-auth using industry-standard algorithms. Never store plain-text passwords in the database.

---

## Scripts Development

To add a new script:

1. Create a new `.ts` file in this directory
2. Add a corresponding npm script in `package.json`:
   ```json
   "script-name": "tsx scripts/scriptName.ts"
   ```
3. Run with: `pnpm script-name`
