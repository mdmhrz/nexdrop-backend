import { Router } from 'express';
import { checkAuth } from '../../../middleware/checkAuth';

import { validateRequest } from '../../../middleware/validateRequest';
import { paymentInitiateSchema } from '../validations';
import { initiatePaymentController } from '../controllers';
import { UserRole } from '../../../../generated/prisma/enums';

const router = Router();

// Initiate payment (CUSTOMER only)
router.post(
    '/initiate',
    checkAuth(UserRole.CUSTOMER),
    validateRequest(paymentInitiateSchema),
    initiatePaymentController
);

export const PaymentRoutes = router;
