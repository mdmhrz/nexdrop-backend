import { Router } from 'express';
import {
  submitRatingController,
  getRiderRatingsController,
  getRatingSummaryController,
  updateRatingController,
  deleteRatingController,
  getRecentReviewsController,
  getMyRatingsController,
} from '../controllers';
import { checkAuth } from '../../../middleware/checkAuth';
import { validateRequest } from '../../../middleware/validateRequest';
import { submitRatingSchema, updateRatingSchema } from '../validations';
import { UserRole } from '../../../../generated/prisma/enums';

const router = Router();

// POST /api/v1/ratings - Submit rating (CUSTOMER only)
router.post(
  '/',
  checkAuth(UserRole.CUSTOMER),
  validateRequest(submitRatingSchema),
  submitRatingController
);

// GET /api/v1/ratings/rider/:riderId - Get rider's ratings (PUBLIC)
router.get('/rider/:riderId', getRiderRatingsController);

// GET /api/v1/ratings/rider/:riderId/summary - Get rating summary (PUBLIC)
router.get('/rider/:riderId/summary', getRatingSummaryController);

// GET /api/v1/ratings/my - Get my submitted ratings (CUSTOMER only)
router.get('/my', checkAuth(UserRole.CUSTOMER), getMyRatingsController);

// PATCH /api/v1/ratings/:id - Edit rating (CUSTOMER only, within 24h)
router.patch(
  '/:id',
  checkAuth(UserRole.CUSTOMER),
  validateRequest(updateRatingSchema),
  updateRatingController
);

// DELETE /api/v1/ratings/:id - Delete rating (CUSTOMER only, within 24h)
router.delete('/:id', checkAuth(UserRole.CUSTOMER), deleteRatingController);

// GET /api/v1/reviews/recent - Recent reviews for landing page (PUBLIC)
router.get('/reviews/recent', getRecentReviewsController);

export const RatingRoutes = router;
