# Rating Module API Documentation

## Base URL
`/api/v1/ratings`

---

## Endpoints

### POST /ratings
Submit a rating for a rider after parcel delivery.

**Authentication**: Required (CUSTOMER only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Request Body**:
```json
{
  "parcelId": "019da6e0-2d4d-76a9-9361-4767d6b4b38d",
  "rating": 5,
  "comment": "Great service!"
}
```

**Validation Rules**:
- `parcelId`: Must be a valid UUID
- `rating`: Must be an integer between 1 and 5
- `comment`: Optional, maximum 500 characters

**Success Response** (201):
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": {
    "id": "string",
    "riderId": "string",
    "customerId": "string",
    "parcelId": "string",
    "rating": 5,
    "comment": "Great service!",
    "createdAt": "2026-04-23T00:00:00Z",
    "updatedAt": "2026-04-23T00:00:00Z"
  }
}
```

**Error Responses**:
- `404`: Parcel not found
- `403`: You can only rate your own parcels
- `400`: You can only rate delivered parcels / No rider assigned
- `409`: You have already rated this parcel

---

### GET /rider/:riderId
Get paginated list of ratings for a specific rider.

**Authentication**: Not required (PUBLIC)

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rider ratings fetched successfully",
  "data": [
    {
      "id": "string",
      "rating": 5,
      "comment": "Great service!",
      "createdAt": "2026-04-23T00:00:00Z",
      "updatedAt": "2026-04-23T00:00:00Z",
      "customer": {
        "id": "string",
        "name": "John Doe"
      },
      "parcel": {
        "id": "string",
        "trackingId": "TRK123456"
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

---

### GET /rider/:riderId/summary
Get rating summary for a specific rider.

**Authentication**: Not required (PUBLIC)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rating summary fetched successfully",
  "data": {
    "averageRating": 4.5,
    "totalRatings": 50,
    "ratingDistribution": {
      "fiveStar": 30,
      "fourStar": 15,
      "threeStar": 3,
      "twoStar": 1,
      "oneStar": 1
    }
  }
}
```

**Error Responses**:
- `404`: Rider not found

---

### PATCH /ratings/:id
Update an existing rating.

**Authentication**: Required (CUSTOMER only, within 24 hours of creation)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Request Body**:
```json
{
  "rating": "number (1-5, optional)",
  "comment": "string (optional, max 500 characters)"
}
```

**Validation Rules**:
- At least one field (rating or comment) must be provided
- `rating`: Must be an integer between 1 and 5
- `comment`: Maximum 500 characters

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rating updated successfully",
  "data": {
    "id": "string",
    "rating": 5,
    "comment": "Updated comment",
    "createdAt": "2026-04-23T00:00:00Z",
    "updatedAt": "2026-04-23T01:00:00Z"
  }
}
```

**Error Responses**:
- `404`: Rating not found
- `403`: You can only update your own ratings
- `400`: You can only edit ratings within 24 hours

---

### DELETE /ratings/:id
Delete a rating.

**Authentication**: Required (CUSTOMER only, within 24 hours of creation)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Rating deleted successfully",
  "data": null
}
```

**Error Responses**:
- `404`: Rating not found
- `403`: You can only delete your own ratings
- `400`: You can only delete ratings within 24 hours

---

### GET /reviews/recent
Get recent reviews for landing page.

**Authentication**: Not required (PUBLIC)

**Query Parameters**:
- `limit`: Number of reviews to return (default: 10)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Recent reviews fetched successfully",
  "data": [
    {
      "id": "string",
      "rating": 5,
      "comment": "Excellent service!",
      "createdAt": "2026-04-23T00:00:00Z",
      "customer": {
        "name": "John Doe"
      },
      "rider": {
        "name": "Ahmed Khan"
      }
    }
  ]
}
```

---

## Business Rules

1. **Rating Eligibility**:
   - Only customers can rate riders
   - Only delivered parcels can be rated
   - One rating per parcel per customer
   - Ratings can only be edited/deleted within 24 hours of creation

2. **Rating Calculation**:
   - Rider's average rating is recalculated after each rating submission/update/deletion
   - Formula: `(sum of all ratings) / (total number of ratings)`

3. **Rating Values**:
   - 1 star: Poor
   - 2 stars: Below average
   - 3 stars: Average
   - 4 stars: Good
   - 5 stars: Excellent

---

## Database Schema

### RiderRating Model
- `id`: UUID (primary key)
- `riderId`: UUID (foreign key to Rider)
- `customerId`: UUID (foreign key to User)
- `parcelId`: UUID (foreign key to Parcel)
- `rating`: Integer (1-5)
- `comment`: String (optional, max 500)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Unique Constraint
- `parcelId` + `customerId` combination must be unique (one rating per parcel per customer)
