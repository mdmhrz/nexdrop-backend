# Rider Module API Documentation

## Base URL
`/api/v1/rider`

## Authentication
Most endpoints require authentication via session token or access token. Use the `checkAuth` or `optionalAuth` middleware to protect routes.

---

## Endpoints

### POST /rider/apply
Apply for rider role (Public + Authenticated users).

**Authentication**: Optional (Both authenticated and unauthenticated users allowed)

**Case 1: Authenticated User (CUSTOMER only)**
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  Cookie: better-auth.session_token=<session_token>
  ```
- **Request Body**:
  ```json
  {
    "district": "string (1-255 chars)"
  }
  ```
- **Validation**:
  - `district`: Required, min 1 character, max 255 characters
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Rider application submitted successfully. Your profile is under review.",
    "data": {
      "rider": {
        "id": "string",
        "userId": "string",
        "district": "string",
        "accountStatus": "PENDING",
        "currentStatus": "AVAILABLE",
        "rating": 0,
        "totalDeliveries": 0,
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Only customers can apply for rider role
  - `409 Conflict`: You already have a rider profile

**Case 2: Unauthenticated User**
- **Request Body**:
  ```json
  {
    "name": "string (1-255 chars)",
    "email": "string (valid email)",
    "password": "string (min 8 chars)",
    "district": "string (1-255 chars)"
  }
  ```
- **Validation**:
  - `name`: Required, min 1 character, max 255 characters
  - `email`: Required, valid email format
  - `password`: Required, minimum 8 characters
  - `district`: Required, min 1 character, max 255 characters
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "User profile created and rider application submitted successfully. Please check your email to verify your account.",
    "data": {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "CUSTOMER",
        "status": "ACTIVE"
      },
      "rider": {
        "id": "string",
        "userId": "string",
        "district": "string",
        "accountStatus": "PENDING",
        "currentStatus": "AVAILABLE",
        "rating": 0,
        "totalDeliveries": 0,
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
  }
  ```
- **Error Responses**:
  - `409 Conflict`: User already exists with this email (handled by better-auth)

**Note**: For unauthenticated users, if rider profile creation fails after user registration, the user account is automatically deleted (rollback).

---

### GET /rider/me
Get current rider's profile information.

**Authentication**: Required (RIDER and CUSTOMER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rider profile fetched successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "district": "string",
    "accountStatus": "PENDING | ACTIVE | SUSPENDED | REJECTED",
    "currentStatus": "AVAILABLE | BUSY | OFFLINE | ON_DELIVERY",
    "rating": 0.0,
    "totalDeliveries": 0,
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "RIDER",
      "status": "ACTIVE | BLOCKED | DELETED"
    }
  }
}
```

**Error Responses**:
- `404 Not Found`: Rider profile not found

---

### GET /rider/dashboard
Get comprehensive rider dashboard with overview stats, charts data.

**Authentication**: Required (RIDER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rider dashboard fetched successfully",
  "data": {
    "overview": {
      "totalDeliveries": 150,
      "totalEarnings": 45000,
      "availableEarnings": 3000,
      "rating": 4.5,
      "totalRatings": 50,
      "avgDeliveryTime": 2.5,
      "todayDeliveries": 5,
      "thisWeekDeliveries": 35,
      "thisMonthDeliveries": 120
    },
    "barChart": {
      "title": "Earnings & Deliveries (Last 7 Days)",
      "data": [
        {
          "date": "2024-04-17",
          "earnings": 5000,
          "deliveries": 8
        },
        {
          "date": "2024-04-18",
          "earnings": 4500,
          "deliveries": 7
        },
        {
          "date": "2024-04-19",
          "earnings": 6000,
          "deliveries": 10
        },
        {
          "date": "2024-04-20",
          "earnings": 3000,
          "deliveries": 5
        },
        {
          "date": "2024-04-21",
          "earnings": 5500,
          "deliveries": 9
        },
        {
          "date": "2024-04-22",
          "earnings": 4000,
          "deliveries": 6
        },
        {
          "date": "2024-04-23",
          "earnings": 7000,
          "deliveries": 12
        }
      ]
    },
    "pieChart": {
      "title": "Delivery Status Distribution",
      "data": [
        {
          "status": "DELIVERED",
          "count": 150
        },
        {
          "status": "IN_TRANSIT",
          "count": 5
        },
        {
          "status": "PICKED_UP",
          "count": 3
        }
      ]
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Rider profile not found

**Note**:
- `avgDeliveryTime` is in hours, calculated from the first status log to delivery status
- Bar chart shows earnings and delivery count for the last 7 days
- Pie chart shows distribution of all parcels assigned to the rider by status

---

### PATCH /rider/status
Update rider's current status (Active riders only).

**Authentication**: Required (RIDER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Request Body**:
```json
{
  "currentStatus": "AVAILABLE | BUSY | OFFLINE | ON_DELIVERY"
}
```

**Validation**:
- `currentStatus`: Required, must be a valid RiderStatus enum value

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rider status updated successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "district": "string",
    "accountStatus": "ACTIVE",
    "currentStatus": "AVAILABLE | BUSY | OFFLINE | ON_DELIVERY",
    "rating": 0.0,
    "totalDeliveries": 0,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Error Responses**:
- `403 Forbidden`: Only active riders can update their status
- `404 Not Found`: Rider profile not found

---

### GET /rider/earnings/me
Get current rider's earnings summary (dashboard view).

**Authentication**: Required (RIDER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Current earnings fetched successfully",
  "data": {
    "totalAvailable": 3000,
    "recentEarnings": [
      {
        "id": "string",
        "riderId": "string",
        "parcelId": "string",
        "amount": 600,
        "percentage": 70,
        "status": "PENDING",
        "createdAt": "datetime",
        "parcel": {
          "id": "string",
          "trackingId": "string",
          "price": 600,
          "customer": {
            "id": "string",
            "name": "string",
            "email": "string"
          }
        }
      }
    ]
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Rider profile not found

---

### GET /rider/earnings/history
Get rider's earnings history with filtering and sorting.

**Authentication**: Required (RIDER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (PENDING, PAID, or ALL for all)
- `startDate`: Filter by start date (ISO date string)
- `endDate`: Filter by end date (ISO date string)
- `search`: Search by parcel tracking ID
- `sortBy`: Sort field (createdAt, amount, etc.)
- `sortOrder`: Sort order (asc, desc) - default: desc

**Success Response** (200):
```json
{
  "success": true,
  "message": "Earnings history fetched successfully",
  "data": [
    {
      "id": "string",
      "riderId": "string",
      "parcelId": "string",
      "amount": 600,
      "percentage": 70,
      "status": "PENDING | PAID",
      "createdAt": "datetime",
      "parcel": {
        "id": "string",
        "trackingId": "string",
        "price": 600,
        "customer": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2,
    "totalAmount": 12000
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Rider profile not found

---

### POST /rider/cashouts/request
Request a cashout for available earnings.

**Authentication**: Required (RIDER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Request Body**:
```json
{
  "amount": 1000
}
```

**Validation**:
- `amount`: Required, number, minimum 1, maximum 100000

**Success Response** (201):
```json
{
  "success": true,
  "message": "Cashout request submitted successfully",
  "data": {
    "id": "string",
    "riderId": "string",
    "amount": 1000,
    "status": "PENDING",
    "requestedAt": "datetime",
    "processedAt": null
  }
}
```

**Error Responses**:
- `400 Bad Request`: Insufficient balance or invalid amount
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Rider profile not found

**Note**: The cashout amount must not exceed the rider's available pending earnings.

---

### GET /rider/cashouts/me
Get rider's cashout history with filtering.

**Authentication**: Required (RIDER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (PENDING, APPROVED, REJECTED, PAID, or ALL for all)
- `startDate`: Filter by start date (ISO date string)
- `endDate`: Filter by end date (ISO date string)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Cashouts fetched successfully",
  "data": [
    {
      "id": "string",
      "riderId": "string",
      "amount": 1000,
      "status": "PENDING | APPROVED | REJECTED | PAID",
      "requestedAt": "datetime",
      "processedAt": "datetime | null"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Rider profile not found

---

## Admin Cashout Management

### GET /cashouts
Get all cashouts with filtering (Admin only).

**Authentication**: Required (ADMIN and SUPER_ADMIN only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (PENDING, APPROVED, REJECTED, PAID, or ALL for all)
- `startDate`: Filter by start date (ISO date string)
- `endDate`: Filter by end date (ISO date string)

**Success Response** (200):
```json
{
  "success": true,
  "message": "All cashouts fetched successfully",
  "data": [
    {
      "id": "string",
      "riderId": "string",
      "amount": 1000,
      "status": "PENDING | APPROVED | REJECTED | PAID",
      "requestedAt": "datetime",
      "processedAt": "datetime | null",
      "rider": {
        "id": "string",
        "userId": "string",
        "district": "string",
        "accountStatus": "ACTIVE",
        "currentStatus": "AVAILABLE",
        "user": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User does not have admin privileges

---

### PATCH /cashouts/:id
Update cashout status (Admin only).

**Authentication**: Required (ADMIN and SUPER_ADMIN only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Request Body**:
```json
{
  "status": "APPROVED | REJECTED | PAID"
}
```

**Validation**:
- `status`: Required, must be a valid CashoutStatus enum value

**Success Response** (200):
```json
{
  "success": true,
  "message": "Cashout status updated successfully",
  "data": {
    "id": "string",
    "riderId": "string",
    "amount": 1000,
    "status": "APPROVED | REJECTED | PAID",
    "requestedAt": "datetime",
    "processedAt": "datetime"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid status transition
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User does not have admin privileges
- `404 Not Found`: Cashout not found

**Valid Status Transitions**:
- `PENDING` → `APPROVED` or `REJECTED`
- `REJECTED` → `APPROVED` (can reverse rejection)
- `APPROVED` → `PAID` (mark as paid after payment processing)
- `PAID` → No further transitions allowed

**Note**:
- When status is set to APPROVED, associated earnings are automatically marked as PAID
- When status is set to REJECTED, earnings remain as PENDING
- The processedAt timestamp is set automatically when status is updated
- Invalid transitions will be rejected with a 400 error

---

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

## Rider Fields

- `id`: Unique identifier for the rider profile
- `userId`: ID of the associated user
- `district`: Rider's operating district
- `accountStatus`: Account status (PENDING, ACTIVE, SUSPENDED, REJECTED)
- `currentStatus`: Current availability status (AVAILABLE, BUSY, OFFLINE, ON_DELIVERY)
- `rating`: Rider's average rating
- `totalDeliveries`: Total number of deliveries completed
- `createdAt`: Profile creation timestamp
- `updatedAt`: Last update timestamp

## Error Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or parameters
- `403 Forbidden`: User does not have permission
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
