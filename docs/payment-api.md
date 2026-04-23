# Payment API Documentation

## Overview
The payment module provides a generic payment processing system using Stripe integration. It's designed to be reusable across different modules (parcels, subscriptions, fees, etc.) through a callback-based webhook system.

## Architecture

### Generic Payment Module
- Handles payment initiation with Stripe/SSLCommerz
- Processes webhooks and dispatches to registered callbacks
- No business logic about what's being paid for

### Module-Specific Logic
- Each module (e.g., parcel) implements its own payment service
- Handles business validations (ownership, status, etc.)
- Registers webhook callback for payment success handling

---

## POST /api/v1/payments/initiate

Initiate payment for a parcel using Stripe or SSLCommerz.

### Authentication
- **Required**: Yes
- **Roles**: CUSTOMER only

### Request Headers
```
Content-Type: application/json
Cookie: better-auth.session_token=<session_token>
```

### Request Body
```json
{
  "parcelId": "string (UUID)",
  "paymentMethod": "STRIPE" | "SSLCOMMERZ"
}
```

### Validation Rules
- `parcelId`: Must be a valid UUID format
- `paymentMethod`: Must be either "STRIPE" or "SSLCOMMERZ"

### Business Logic Validations (Parcel Module)
1. User must be authenticated as CUSTOMER
2. Parcel must exist
3. Parcel must belong to the authenticated customer
4. Parcel must not already be paid (`isPaid` must be `false`)
5. Parcel status must be `REQUESTED`
6. Parcel price must be greater than 0

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentUrl": "string",
    "sessionId": "string",
    "amount": "number",
    "metadata": {
      "type": "parcel",
      "parcelId": "string",
      "description": "string"
    },
    "paymentId": "string"
  }
}
```

### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid parcel ID format"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Payment method must be STRIPE or SSLCOMMERZ"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Parcel not found"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "You can only pay for your own parcels"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Parcel is already paid"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Payment can only be initiated for parcels in REQUESTED status"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid parcel price"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "SSLCommerz not implemented yet"
}
```

---

## POST /api/v1/payments/webhook

Stripe webhook endpoint for handling payment events. No authentication required.

### Authentication
- **Required**: No

### Request Headers
```
Content-Type: application/json
stripe-signature: <stripe_signature>
```

### Request Body
Raw Stripe event payload (JSON string)

### Business Logic
1. Verifies Stripe webhook signature
2. Extracts metadata from event
3. Determines payment type from metadata (`type` field)
4. Calls registered callback for that payment type
5. Parcel callback handles:
   - Updates payment status to `SUCCESS`
   - Updates parcel `isPaid` to `true`
   - Generates rider earning (70% of parcel price) if rider is assigned

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": null
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Webhook signature verification failed"
}
```

---

## Payment Flow

### Pay Now Flow
1. Customer creates parcel (POST /parcels)
2. Customer initiates payment (POST /payments/initiate)
3. Parcel service validates parcel and calls generic payment service
4. Generic payment service creates Stripe Checkout Session with metadata
5. Customer redirected to Stripe payment page
6. Customer completes payment
7. Stripe sends webhook to backend
8. Generic payment service verifies signature and extracts metadata
9. Calls parcel webhook callback based on `type: "parcel"`
10. Parcel callback updates parcel status and generates earning
11. Parcel can now be assigned to rider

### Pay Later Flow
1. Customer creates parcel (POST /parcels)
2. Parcel remains unpaid (`isPaid: false`)
3. Customer views unpaid parcels
4. Customer initiates payment later (POST /payments/initiate)
5. Same as Pay Now flow from step 3

---

## Extending to Other Modules

To use the generic payment module for other features:

1. **Create module-specific payment service**:
```typescript
// Example: subscription payment service
export const subscriptionPaymentService = {
  async initiateSubscriptionPayment(subscriptionId: string, userId: string) {
    // Validate subscription
    // Call generic payment service with metadata: { type: 'subscription', subscriptionId }
  },
  
  async handleSubscriptionPaymentWebhook(metadata: Record<string, string>, amount: number) {
    // Update subscription status, extend access, etc.
  }
};
```

2. **Register webhook callback**:
```typescript
// In module initialization file
import paymentService from '../../payment/services/payment.service';
import subscriptionPaymentService from './subscriptionPayment.service';

paymentService.registerWebhookCallback('subscription', subscriptionPaymentService.handleSubscriptionPaymentWebhook);
```

3. **Create controller**:
```typescript
export const initiateSubscriptionPaymentController = catchAsync(async (req, res) => {
  const result = await subscriptionPaymentService.initiateSubscriptionPayment(req.body.subscriptionId, req.user.userId);
  sendResponse(res, { success: true, data: result });
});
```

---

## Environment Variables

Required environment variables for payment module:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
FRONTEND_URL=http://localhost:3000
```

---

## Notes

- **Currency**: Set to BDT (Bangladeshi Taka) in Stripe integration
- **Amount**: Amount is in BDT, converted to poisha (cents) for Stripe (amount * 100)
- **Earning Percentage**: 70% of parcel price goes to rider (parcel-specific)
- **SSLCommerz**: Not yet implemented (placeholder for future)
- **Webhook Security**: Always verifies Stripe signature before processing
- **Callback System**: Uses in-memory Map for callback registration (can be enhanced with event emitter)
- **Transaction Safety**: Payment updates use database transactions for atomicity
- **Rider Assignment**: Parcels must be paid before rider can be assigned or accept
- **Reusability**: Payment module is generic and can be used for any payment scenario
- **Environment Variables**: All env variables are loaded through `envVars` from `src/app/config/env.ts`
