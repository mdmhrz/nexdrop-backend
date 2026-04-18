# Parcel Module API Documentation

## Base URL
`/api/v1/parcels`

## Authentication
All endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

---

## Endpoints

### GET /parcels/available
Get all parcels available for pickup (status = REQUESTED, riderId = null).

**Authentication**: Required (RIDER only - Active riders only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Available parcels fetched successfully",
  "data": [
    {
      "id": "string",
      "trackingId": "string",
      "customerId": "string",
      "riderId": null,
      "pickupAddress": "string",
      "deliveryAddress": "string",
      "districtFrom": "string",
      "districtTo": "string",
      "status": "REQUESTED",
      "price": number,
      "isPaid": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "customer": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string"
      }
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

**Purpose**: Show jobs rider can accept

---

### GET /parcels/assigned
Get all parcels assigned to the current rider (status = ASSIGNED, PICKED, or IN_TRANSIT).

**Authentication**: Required (RIDER only - Active riders only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Assigned parcels fetched successfully",
  "data": [
    {
      "id": "string",
      "trackingId": "string",
      "customerId": "string",
      "riderId": "string",
      "pickupAddress": "string",
      "deliveryAddress": "string",
      "districtFrom": "string",
      "districtTo": "string",
      "status": "ASSIGNED | PICKED | IN_TRANSIT",
      "price": number,
      "isPaid": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "customer": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

**Purpose**: Show jobs rider already has

---

### PATCH /parcels/:id/pick
Mark that the rider has picked up the parcel from sender.

**Authentication**: Required (RIDER only - Active riders only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Path Parameters**:
- `id` (required): Parcel ID

**Request Body**:
```json
{
  "note": "string (optional)"
}
```

**Validation**:
- `note`: Optional string

**Success Response** (200):
```json
{
  "success": true,
  "message": "Parcel picked up successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": "string",
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "status": "PICKED",
    "price": number,
    "isPaid": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Parcel status: ASSIGNED → PICKED
- Status log created
- Rider status: AVAILABLE → BUSY

**Error Responses**:
- `403 Forbidden`: Rider is not active, parcel not assigned to rider, or parcel not in ASSIGNED status
- `404 Not Found`: Rider profile or parcel not found

**Purpose**: Confirm pickup from sender location

---

### PATCH /parcels/:id/deliver
Mark parcel as successfully delivered.

**Authentication**: Required (RIDER only - Active riders only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Path Parameters**:
- `id` (required): Parcel ID

**Request Body**:
```json
{
  "note": "string (optional)"
}
```

**Validation**:
- `note`: Optional string

**Success Response** (200):
```json
{
  "success": true,
  "message": "Parcel delivered successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": "string",
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "status": "DELIVERED",
    "price": number,
    "isPaid": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Parcel status: IN_TRANSIT → DELIVERED
- Status log created
- Rider earning generated (70% of parcel price)
- Earning status: PENDING
- Rider status: BUSY → AVAILABLE

**Error Responses**:
- `403 Forbidden`: Rider is not active, parcel not assigned to rider, or parcel not in IN_TRANSIT status
- `404 Not Found`: Rider profile or parcel not found

**Purpose**: Confirm delivery to receiver

---

### PATCH /parcels/:id/accept
Accept/claim a parcel (rider directly assigns parcel to themselves).

**Authentication**: Required (RIDER only - Active riders only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Path Parameters**:
- `id` (required): Parcel ID

**Request Body**:
```json
{
  "note": "string (optional)"
}
```

**Validation**:
- `note`: Optional string

**Success Response** (200):
```json
{
  "success": true,
  "message": "Parcel accepted successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": "string",
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "status": "ASSIGNED",
    "price": number,
    "isPaid": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Parcel status: REQUESTED → ASSIGNED
- Parcel assigned to rider
- Status log created

**Error Responses**:
- `403 Forbidden`: Rider is not active, rider not available, or parcel not in REQUESTED status
- `404 Not Found`: Rider profile or parcel not found
- `409 Conflict`: Parcel is already assigned to another rider

**Purpose**: Claim job directly without admin assignment

---

## Parcel Status

- `REQUESTED`: Parcel requested by customer, waiting for rider assignment
- `ASSIGNED`: Parcel assigned to a rider, waiting for pickup
- `PICKED`: Rider has picked up the parcel from sender
- `IN_TRANSIT`: Parcel is in transit to delivery location
- `DELIVERED`: Parcel has been successfully delivered

## Rider Workflow

**Full Flow**:
1. GET /parcels/available → Find job
2. PATCH /parcels/:id/accept → Accept/claim job (or admin assigns)
3. GET /parcels/assigned → See assigned job
4. PATCH /parcels/:id/pick → Pickup parcel
5. PATCH /parcels/:id/deliver → Complete delivery

## Error Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request data or parameters
- `403 Forbidden`: User does not have permission or invalid state
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists or conflict with current state
