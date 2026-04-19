import { Router } from 'express';
import { checkAuth } from '../../../middleware/checkAuth';

import { validateRequest } from '../../../middleware/validateRequest';
import { paymentInitiateSchema } from '../validations';
import { initiatePaymentController, sslcommerzIPNController, sslcommerzSuccessController } from '../controllers';
import { UserRole } from '../../../../generated/prisma/enums';

const router = Router();

// Initiate payment (CUSTOMER only)
router.post(
    '/initiate',
    checkAuth(UserRole.CUSTOMER),
    validateRequest(paymentInitiateSchema),
    initiatePaymentController
);

// SSL Commerz IPN (no auth required)
router.post('/sslcommerz/ipn', sslcommerzIPNController);

// SSL Commerz success callback (no auth required)
router.post('/sslcommerz/success', sslcommerzSuccessController);

export const PaymentRoutes = router;
