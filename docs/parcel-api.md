# Parcel Module API Documentation

## Base URL
`/api/v1/parcels`

## Authentication
All endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

---

## Parcel Workflow Sequence

### Phase 1: Customer Creates Parcel

#### POST /parcels
Create a new parcel delivery request.

**Authentication**: Required (CUSTOMER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Request Body**:
```json
{
  "pickupAddress": "string (1-500 chars)",
  "deliveryAddress": "string (1-500 chars)",
  "districtFrom": "string (valid Bangladesh district)",
  "districtTo": "string (valid Bangladesh district)",
  "weight": "number (positive, max 50 kg)",
  "parcelType": "DOCUMENT | SMALL | MEDIUM | LARGE | FRAGILE | ELECTRONICS",
  "serviceType": "STANDARD | EXPRESS (optional, default: STANDARD)",
  "note": "string (optional)"
}
```

**Validation**:
- `pickupAddress`: Required, min 1 character, max 500 characters
- `deliveryAddress`: Required, min 1 character, max 500 characters
- `districtFrom`: Required, must be a valid Bangladesh district name
- `districtTo`: Required, must be a valid Bangladesh district name
- `weight`: Required, positive number, max 50 kg
- `parcelType`: Required, one of `DOCUMENT`, `SMALL`, `MEDIUM`, `LARGE`, `FRAGILE`, `ELECTRONICS`
- `serviceType`: Optional, `STANDARD` or `EXPRESS` (default: `STANDARD`)
- `note`: Optional

**Pricing Rules** (server-calculated — price is never accepted from client):

| Service Type | Same District | Inter-District |
|---|---|---|
| STANDARD | ৳60 | ৳120 |
| EXPRESS | ৳110 | ৳200 |

| Parcel Type | Surcharge |
|---|---|
| DOCUMENT | +৳0 |
| SMALL | +৳0 |
| MEDIUM | +৳20 |
| LARGE | +৳50 |
| FRAGILE | +৳50 |
| ELECTRONICS | +৳70 |

Weight above 1 kg: **+৳15 per kg** (rounded up)

**Formula**: `price = base + typeSurcharge + ceil(max(0, weight - 1)) × 15`

**Success Response** (201):
```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": null,
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "weight": 1.5,
    "parcelType": "ELECTRONICS",
    "serviceType": "EXPRESS",
    "status": "REQUESTED",
    "price": 247,
    "priceBreakdown": {
      "base": 110,
      "typeSurcharge": 70,
      "weightSurcharge": 15
    },
    "isPaid": false,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Validates district names against the full 64-district Bangladesh list
- Calculates price server-side using weight, parcelType, serviceType, and district comparison
- Generates unique tracking ID
- Creates parcel with status = REQUESTED
- Creates status log
- No rider assigned (riderId = null)

---

### Phase 2: Rider Discovery

#### GET /parcels/available
Get all parcels available for pickup (status = REQUESTED, riderId = null).

**Authentication**: Required (RIDER, ADMIN, SUPER_ADMIN)
- Riders must have ACTIVE account status
- Admins and Super Admins can access without rider account status check

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

**Purpose**: Discovery endpoint - riders browse available parcels, admins view parcels for assignment

---

### Phase 3: Rider Assignment (Two Ways)

#### Option A: Admin Manual Assignment

##### PATCH /parcels/:id/assign-rider
Assign a rider to a parcel (only parcels in REQUESTED status can be assigned).

**Authentication**: Required (ADMIN, SUPER_ADMIN only)

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
  "riderId": "string (required)",
  "note": "string (optional)"
}
```

**Validation**:
- `riderId`: Required string
- `note`: Optional string

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rider assigned successfully",
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
    "isPaid": false,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Validates parcel is in REQUESTED status
- Validates rider exists with ACTIVE account status and AVAILABLE current status
- Assigns rider to parcel
- Updates parcel status to ASSIGNED
- Creates status log

**Error Responses**:
- `400 Bad Request`: Parcel not in REQUESTED status, already assigned, rider not active, or rider not available
- `404 Not Found`: Parcel or rider not found

---

#### Option B: Rider Self-Assignment

##### PATCH /parcels/:id/accept
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

---

### Phase 3.5: Customer Initiates Payment

#### POST /parcels/:id/payment
Initiate payment for a parcel using Stripe (only parcels in REQUESTED status can be paid for).

**Authentication**: Required (CUSTOMER only)

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
  "paymentMethod": "STRIPE | MANUAL | BKASH | SSLCOMMERZ"
}
```

**Validation**:
- `paymentMethod`: Required, must be a valid PaymentMethod enum value (STRIPE, MANUAL, BKASH, or SSLCOMMERZ)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentUrl": "string (Payment gateway URL)",
    "sessionId": "string (Payment gateway session ID)",
    "paymentId": "string (Payment record ID)",
    "amount": number
  }
}
```

**What happens internally**:
- Validates parcel exists and belongs to customer
- Validates parcel is not already paid
- Validates parcel status is REQUESTED
- Validates price is valid (> 0)
- For STRIPE: Creates Stripe checkout session
- For SSLCOMMERZ: Creates SSL Commerz payment session
- Saves payment record with PENDING status (before sending to gateway)
- Returns payment URL and session ID
- `400 Bad Request`: MANUAL or BKASH payment methods not implemented yet

**Payment Flow**:
1. Customer initiates payment via this endpoint
2. Redirected to Stripe checkout URL
3. Completes payment on Stripe
4. Stripe sends webhook to `/payment/webhook`
5. Webhook updates Payment status to SUCCESS
6. Parcel `isPaid` set to true
7. If rider assigned, creates Earning record (70% of parcel price)

**Purpose**: Customer pays for parcel delivery before rider pickup

---

### Phase 4: Rider Views Assigned Parcels

#### GET /parcels/assigned
Get all parcels assigned to the current rider (status = ASSIGNED or IN_TRANSIT).

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
      "status": "ASSIGNED | IN_TRANSIT",
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

**Purpose**: Rider views all parcels assigned to them

---

### Phase 5: Rider Picks Up Parcel

#### PATCH /parcels/:id/pick
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
    "status": "IN_TRANSIT",
    "price": number,
    "isPaid": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Validates parcel is assigned to this rider
- Validates parcel status is ASSIGNED
- Validates rider is ACTIVE
- Parcel status: ASSIGNED → IN_TRANSIT
- Status log created
- Rider status: AVAILABLE → BUSY

**Error Responses**:
- `403 Forbidden`: Rider is not active, parcel not assigned to rider, or parcel not in ASSIGNED status
- `404 Not Found`: Rider profile or parcel not found

---

### Phase 6: Rider Delivers Parcel

#### PATCH /parcels/:id/deliver
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
- Validates parcel is assigned to this rider
- Validates parcel status is IN_TRANSIT
- Validates rider is ACTIVE
- Parcel status: IN_TRANSIT → DELIVERED
- Status log created
- Rider earning generated (70% of parcel price)
- Earning status: PENDING
- Rider status: BUSY → AVAILABLE

**Error Responses**:
- `403 Forbidden`: Rider is not active, parcel not assigned to rider, or parcel not in IN_TRANSIT status
- `404 Not Found`: Rider profile or parcel not found

---

### Phase 7: Customer Tracks Parcel

#### GET /parcels/:id
Get a specific parcel by ID (accessible by customer, assigned rider, or admin).

**Authentication**: Required (CUSTOMER, RIDER, ADMIN, SUPER_ADMIN)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Path Parameters**:
- `id` (required): Parcel ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Parcel fetched successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": "string | null",
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "status": "REQUESTED | ASSIGNED | PICKED | IN_TRANSIT | DELIVERED | CANCELLED",
    "price": number,
    "isPaid": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "customer": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string"
    },
    "rider": {
      "id": "string",
      "userId": "string",
      "district": "string",
      "accountStatus": "PENDING | ACTIVE | SUSPENDED",
      "currentStatus": "AVAILABLE | BUSY | OFFLINE",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string"
      }
    },
    "statusLogs": [
      {
        "id": "string",
        "parcelId": "string",
        "status": "REQUESTED | ASSIGNED | PICKED | IN_TRANSIT | DELIVERED | CANCELLED",
        "changedBy": "string",
        "note": "string | null",
        "timestamp": "datetime",
        "user": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
}
```

**Error Responses**:
- `403 Forbidden`: You don't have permission to view this parcel
- `404 Not Found`: Parcel not found

**Purpose**: Customer tracks parcel progress with full status history

---

### Phase 8: Customer Views Their Parcels

#### GET /parcels/my
Get all parcels belonging to the authenticated customer.

**Authentication**: Required (CUSTOMER only)

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
  "message": "My parcels fetched successfully",
  "data": [
    {
      "id": "string",
      "trackingId": "string",
      "customerId": "string",
      "riderId": "string | null",
      "pickupAddress": "string",
      "deliveryAddress": "string",
      "districtFrom": "string",
      "districtTo": "string",
      "status": "REQUESTED | ASSIGNED | PICKED | IN_TRANSIT | DELIVERED | CANCELLED",
      "price": number,
      "isPaid": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "rider": {
        "id": "string",
        "userId": "string",
        "district": "string",
        "accountStatus": "PENDING | ACTIVE | SUSPENDED",
        "currentStatus": "AVAILABLE | BUSY | OFFLINE",
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "phone": "string"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Purpose**: Customer views all their parcels with rider information

---

### Phase 9: Customer Cancels Parcel

#### PATCH /parcels/:id/cancel
Cancel a parcel (only parcels in REQUESTED status can be cancelled).

**Authentication**: Required (CUSTOMER only)

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
  "message": "Parcel cancelled successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": null,
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "status": "CANCELLED",
    "price": number,
    "isPaid": false,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Validates parcel belongs to customer
- Validates status is REQUESTED
- Parcel status → CANCELLED
- Status log created

**Error Responses**:
- `403 Forbidden`: You can only cancel your own parcels
- `404 Not Found`: Parcel not found
- `400 Bad Request`: Only parcels in REQUESTED status can be cancelled

**Purpose**: Customer cancels parcel before rider assignment

---

## Admin Monitoring & Management

### GET /parcels
Get all parcels with optional filters (status, district, date).

**Authentication**: Required (ADMIN, SUPER_ADMIN only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `status` (optional): Filter by parcel status (REQUESTED, ASSIGNED, PICKED, IN_TRANSIT, DELIVERED, CANCELLED)
- `district` (optional): Filter by district (matches districtFrom or districtTo)
- `date` (optional): Filter by creation date (YYYY-MM-DD format)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Parcels fetched successfully",
  "data": [
    {
      "id": "string",
      "trackingId": "string",
      "customerId": "string",
      "riderId": "string | null",
      "pickupAddress": "string",
      "deliveryAddress": "string",
      "districtFrom": "string",
      "districtTo": "string",
      "status": "REQUESTED | ASSIGNED | PICKED | IN_TRANSIT | DELIVERED | CANCELLED",
      "price": number,
      "isPaid": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "customer": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "rider": {
        "id": "string",
        "userId": "string",
        "district": "string",
        "accountStatus": "PENDING | ACTIVE | SUSPENDED",
        "currentStatus": "AVAILABLE | BUSY | OFFLINE",
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "phone": "string"
        }
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

**Purpose**: Admin view of all parcels with filtering capabilities for monitoring and management

---

### PATCH /parcels/:id/status
Update parcel status manually (admin override).

**Authentication**: Required (ADMIN, SUPER_ADMIN only)

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
  "status": "REQUESTED | ASSIGNED | PICKED | IN_TRANSIT | DELIVERED | CANCELLED",
  "note": "string (optional)"
}
```

**Validation**:
- `status`: Required, must be a valid ParcelStatus enum value
- `note`: Optional string

**Success Response** (200):
```json
{
  "success": true,
  "message": "Parcel status updated successfully",
  "data": {
    "id": "string",
    "trackingId": "string",
    "customerId": "string",
    "riderId": "string | null",
    "pickupAddress": "string",
    "deliveryAddress": "string",
    "districtFrom": "string",
    "districtTo": "string",
    "status": "REQUESTED | ASSIGNED | PICKED | IN_TRANSIT | DELIVERED | CANCELLED",
    "price": number,
    "isPaid": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**What happens internally**:
- Validates parcel exists
- Updates parcel status
- Creates status log

**Error Responses**:
- `400 Bad Request`: Parcel is already in the requested status
- `404 Not Found`: Parcel not found

**Purpose**: Admin override for parcel status changes

---

## Parcel Status Flow

```
REQUESTED → ASSIGNED → IN_TRANSIT → DELIVERED
                    ↓
                 CANCELLED
```

**Status Meanings**:
- `REQUESTED`: Customer created parcel, waiting for rider assignment
- `ASSIGNED`: Rider assigned, waiting for pickup
- `IN_TRANSIT`: Rider picked up and is en route to delivery
- `DELIVERED`: Successfully delivered, earning generated
- `CANCELLED`: Cancelled by customer (only in REQUESTED status)

---

## Rider Status Flow

```
AVAILABLE → BUSY → AVAILABLE
```

**Status Meanings**:
- `AVAILABLE`: Rider can accept new parcels
- `BUSY`: Rider is on a delivery (after picking up parcel)
- `OFFLINE`: Rider not accepting deliveries

---

## Complete Example Flow

**Customer**:
1. POST `/parcels` → Creates parcel (status: REQUESTED)

**Admin (or Rider)**:
2. PATCH `/parcels/:id/assign-rider` → Assigns rider (status: ASSIGNED)
   OR
   PATCH `/parcels/:id/accept` → Rider accepts (status: ASSIGNED)

**Customer**:
3. POST `/parcels/:id/payment` → Initiates payment (creates Payment record, returns Stripe URL)
4. Completes payment on Stripe → Webhook updates Payment to SUCCESS, sets Parcel.isPaid = true

**Rider**:
5. GET `/parcels/assigned` → Views assigned job
6. PATCH `/parcels/:id/pick` → Picks up parcel (status: IN_TRANSIT, rider: BUSY)
7. PATCH `/parcels/:id/deliver` → Delivers parcel (status: DELIVERED, rider: AVAILABLE, earning generated)

**Customer**:
8. GET `/parcels/:id` → Tracks parcel progress
9. GET `/parcels/my` → Views all parcels

---

## Error Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request data or parameters
- `403 Forbidden`: User does not have permission or invalid state
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists or conflict with current state
