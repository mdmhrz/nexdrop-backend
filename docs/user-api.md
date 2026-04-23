# User Module API Documentation

## Base URL
`/api/v1/users`

## Authentication
All endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

---

## Endpoints

### GET /users
Get all users with optional search and pagination (Admin & Super Admin only).

**Authentication**: Required (ADMIN, SUPER_ADMIN only)

**Query Parameters**:
- `search` (optional): Search by email or name (case-insensitive)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "CUSTOMER | ADMIN | RIDER | SUPER_ADMIN",
      "status": "ACTIVE | BLOCKED | DELETED",
      "emailVerified": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### GET /users/:id
Get a specific user by ID (Admin & Super Admin only).

**Authentication**: Required (ADMIN, SUPER_ADMIN only)

**Path Parameters**:
- `id` (required): User ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CUSTOMER | ADMIN | RIDER | SUPER_ADMIN",
    "status": "ACTIVE | BLOCKED | DELETED",
    "emailVerified": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Error Responses**:
- `404 Not Found`: User not found

---

### PATCH /users/:id/role
Update user role (Super Admin only).

**Authentication**: Required (SUPER_ADMIN only)

**Path Parameters**:
- `id` (required): User ID

**Request Body**:
```json
{
  "role": "CUSTOMER | ADMIN | RIDER | SUPER_ADMIN"
}
```

**Validation**:
- `role`: Required, must be a valid UserRole enum value

**Success Response** (200):
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CUSTOMER | ADMIN | RIDER | SUPER_ADMIN",
    "status": "ACTIVE | BLOCKED | DELETED",
    "emailVerified": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Error Responses**:
- `404 Not Found`: User not found

---

### PATCH /users/:id/status
Update user status (Admin & Super Admin only).

**Authentication**: Required (ADMIN, SUPER_ADMIN only)

**Path Parameters**:
- `id` (required): User ID

**Request Body**:
```json
{
  "status": "ACTIVE | BLOCKED | DELETED"
}
```

**Validation**:
- `status`: Required, must be a valid UserStatus enum value
- **Restriction**: Users cannot change their own status except to DELETE

**Success Response** (200):
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CUSTOMER | ADMIN | RIDER | SUPER_ADMIN",
    "status": "ACTIVE | BLOCKED | DELETED",
    "emailVerified": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Error Responses**:
- `403 Forbidden`: Cannot change your own status (except DELETE)
- `404 Not Found`: User not found

---

### PATCH /users/me
Update current user's own profile (All authenticated users).

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Request Body**:
```json
{
  "name": "string (optional)",
  "email": "string (optional, valid email)",
  "password": "string (optional, min 8 chars)"
}
```

**Validation**:
- At least one field must be provided
- `name`: Optional, min 1 character, max 255 characters
- `email`: Optional, valid email format
- `password`: Optional, minimum 8 characters

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CUSTOMER | ADMIN | RIDER | SUPER_ADMIN",
    "status": "ACTIVE | BLOCKED | DELETED",
    "emailVerified": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### GET /users/dashboard
Get comprehensive customer dashboard with overview stats, charts data.

**Authentication**: Required (CUSTOMER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User dashboard fetched successfully",
  "data": {
    "overview": {
      "totalParcels": 50,
      "totalSpent": 15000,
      "activeParcels": 3,
      "deliveredParcels": 47,
      "avgDeliveryTime": 2.5,
      "todayParcels": 2,
      "thisWeekParcels": 8,
      "thisMonthParcels": 25
    },
    "barChart": {
      "title": "Spending & Parcels (Last 7 Days)",
      "data": [
        {
          "date": "2024-04-17",
          "spent": 2000,
          "parcels": 5
        },
        {
          "date": "2024-04-18",
          "spent": 1500,
          "parcels": 4
        },
        {
          "date": "2024-04-19",
          "spent": 3000,
          "parcels": 8
        },
        {
          "date": "2024-04-20",
          "spent": 1000,
          "parcels": 2
        },
        {
          "date": "2024-04-21",
          "spent": 2500,
          "parcels": 6
        },
        {
          "date": "2024-04-22",
          "spent": 2000,
          "parcels": 5
        },
        {
          "date": "2024-04-23",
          "spent": 3000,
          "parcels": 7
        }
      ]
    },
    "pieChart": {
      "title": "Parcel Status Distribution",
      "data": [
        {
          "status": "DELIVERED",
          "count": 47
        },
        {
          "status": "IN_TRANSIT",
          "count": 2
        },
        {
          "status": "PICKED_UP",
          "count": 1
        }
      ]
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User does not have customer role

**Note**:
- `avgDeliveryTime` is in hours, calculated from the first status log to delivery status
- Bar chart shows spending and parcel count for the last 7 days
- Pie chart shows distribution of all parcels by status

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

## Error Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request data or parameters
- `403 Forbidden`: User does not have permission
- `404 Not Found`: Resource not found
