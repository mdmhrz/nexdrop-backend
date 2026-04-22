# Analytics Module API Documentation

## Base URL
`/api/v1/analytics`

## Authentication
All endpoints require authentication via session token or access token. Use the `checkAuth` middleware to protect routes.

---

## Endpoints

### GET /analytics/dashboard
Get comprehensive dashboard metrics for admin overview.

**Authentication**: Required (ADMIN and SUPER_ADMIN only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Dashboard metrics fetched successfully",
  "data": {
    "overview": {
      "totalParcels": 1000,
      "totalPendingParcels": 150,
      "totalCompletedParcels": 850,
      "totalUsers": 500,
      "totalRiders": 50,
      "totalCustomers": 450
    },
    "revenue": {
      "totalRevenue": 500000,
      "dailyRevenue": 15000,
      "weeklyRevenue": 80000,
      "monthlyRevenue": 300000,
      "platformRevenue": 150000,
      "avgOrderValue": 500
    },
    "riders": {
      "totalRiders": 50,
      "activeRiders": 40,
      "onlineRiders": 25
    },
    "performance": {
      "avgDeliveryTime": 2.5,
      "deliverySuccessRate": 95.5
    },
    "financial": {
      "riderPayouts": 350000,
      "pendingPayouts": 50000
    },
    "growth": {
      "newUsersToday": 10,
      "newUsersThisWeek": 50,
      "newUsersThisMonth": 200
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User does not have admin privileges

**Note**:
- All metrics are cached for performance
- Metrics are updated on-demand when relevant actions occur (parcel creation, payment success, etc.)
- Time-based metrics (daily, weekly, monthly) need to be reset periodically via scheduled job

---

### GET /analytics/revenue
Get revenue analytics with breakdown by payment method, district, and time.

**Authentication**: Required (ADMIN and SUPER_ADMIN only)

**Headers**:
```
Authorization: Bearer <access_token>
Cookie: better-auth.session_token=<session_token>
```

**Query Parameters**:
- `startDate`: Filter by start date (ISO date string, default: 30 days ago)
- `endDate`: Filter by end date (ISO date string, default: today)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Revenue analytics fetched successfully",
  "data": {
    "summary": {
      "totalRevenue": 50000,
      "totalPayments": 50,
      "averageOrderValue": 1000,
      "currency": "BDT"
    },
    "byPaymentMethod": [
      {
        "paymentMethod": "STRIPE",
        "totalRevenue": 30000,
        "paymentCount": 30,
        "percentage": 60
      },
      {
        "paymentMethod": "SSLCOMMERZ",
        "totalRevenue": 20000,
        "paymentCount": 20,
        "percentage": 40
      }
    ],
    "byDistrict": [
      {
        "district": "Dhaka",
        "totalRevenue": 25000,
        "parcelCount": 25,
        "averageOrderValue": 1000
      },
      {
        "district": "Chittagong",
        "totalRevenue": 15000,
        "parcelCount": 15,
        "averageOrderValue": 1000
      }
    ],
    "overTime": [
      {
        "date": "2024-04-01",
        "revenue": 5000,
        "paymentCount": 5
      },
      {
        "date": "2024-04-02",
        "revenue": 7000,
        "paymentCount": 7
      }
    ]
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User does not have admin privileges

**Note**:
- Only successful payments (status = SUCCESS) are included in analytics
- Date range defaults to last 30 days if not specified
- Revenue over time includes all dates in the range (even with zero revenue)
- District breakdown is based on parcel pickup location (districtFrom)
