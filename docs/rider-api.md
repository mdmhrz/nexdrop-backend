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
