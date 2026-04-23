# Address Module API Documentation

## Base URL
`/api/v1/addresses`

## Authentication
All endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

---

## Endpoints

### GET /addresses
Get all addresses for the authenticated user with pagination.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Addresses fetched successfully",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "label": "string",
      "address": "string",
      "district": "string",
      "phone": "string | null",
      "isDefault": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime"
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

**Note**: Addresses are ordered by `isDefault` (descending) then `createdAt` (descending).

---

### POST /addresses
Create a new address for the authenticated user.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Request Body**:
```json
{
  "label": "string (1-255 chars)",
  "address": "string (1-500 chars)",
  "district": "string (1-255 chars)",
  "phone": "string (optional)",
  "isDefault": boolean (optional, default: false)
}
```

**Validation**:
- `label`: Required, min 1 character, max 255 characters
- `address`: Required, min 1 character, max 500 characters
- `district`: Required, min 1 character, max 255 characters
- `phone`: Optional
- `isDefault`: Optional, default false

**Success Response** (201):
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "label": "string",
    "address": "string",
    "district": "string",
    "phone": "string | null",
    "isDefault": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Note**: If `isDefault` is true, all other addresses for the user will be automatically set to `isDefault: false`.

---

### PATCH /addresses/:id
Update an existing address.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Path Parameters**:
- `id` (required): Address ID

**Request Body**:
```json
{
  "label": "string (optional, 1-255 chars)",
  "address": "string (optional, 1-500 chars)",
  "district": "string (optional, 1-255 chars)",
  "phone": "string (optional)",
  "isDefault": boolean (optional)
}
```

**Validation**:
- At least one field must be provided
- All fields are optional but must pass validation if provided

**Success Response** (200):
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "label": "string",
    "address": "string",
    "district": "string",
    "phone": "string | null",
    "isDefault": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Error Responses**:
- `404 Not Found`: Address not found
- `403 Forbidden`: You can only update your own addresses

**Note**: If `isDefault` is set to true, all other addresses for the user will be automatically set to `isDefault: false`.

---

### DELETE /addresses/:id
Delete an address.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Path Parameters**:
- `id` (required): Address ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": {
    "message": "Address deleted successfully"
  }
}
```

**Error Responses**:
- `404 Not Found`: Address not found
- `403 Forbidden`: You can only delete your own addresses

---

### PATCH /addresses/:id/default
Set an address as the default address.

**Authentication**: Required (All roles: ADMIN, RIDER, SUPER_ADMIN, CUSTOMER)

**Path Parameters**:
- `id` (required): Address ID

**Request Body**: None

**Success Response** (200):
```json
{
  "success": true,
  "message": "Default address set successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "label": "string",
    "address": "string",
    "district": "string",
    "phone": "string | null",
    "isDefault": true,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Error Responses**:
- `404 Not Found`: Address not found
- `403 Forbidden`: You can only set your own addresses as default

**Note**: All other addresses for the user will be automatically set to `isDefault: false`.

---

## Address Fields

- `id`: Unique identifier for the address
- `userId`: ID of the user who owns the address
- `label`: Label/name for the address (e.g., "Home", "Office")
- `address`: Full address string
- `district`: District name
- `phone`: Phone number (optional)
- `isDefault`: Whether this is the default address
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Error Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or parameters
- `403 Forbidden`: User does not have permission
- `404 Not Found`: Resource not found
