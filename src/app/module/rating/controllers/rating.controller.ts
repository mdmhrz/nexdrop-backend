import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import status from 'http-status';
import {
  submitRatingService,
  getRiderRatingsService,
  getRatingSummaryService,
  updateRatingService,
  deleteRatingService,
  getRecentReviewsService,
} from '../services';
import { submitRatingSchema, updateRatingSchema, getRatingsSchema } from '../validations';
import { validateRequest } from '../../../middleware/validateRequest';

export const submitRatingController = catchAsync(async (req: Request, res: Response) => {
  const validatedData = submitRatingSchema.parse(req.body);
  const rating = await submitRatingService(req.user!.userId, validatedData);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Rating submitted successfully',
    data: rating,
  });
});

export const getRiderRatingsController = catchAsync(async (req: Request, res: Response) => {
  const { riderId } = req.params;
  const validatedData = getRatingsSchema.parse(req.query);
  const page = parseInt(validatedData.page as string);
  const limit = parseInt(validatedData.limit as string);

  const result = await getRiderRatingsService(riderId as string, page, limit);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Rider ratings fetched successfully',
    data: result.ratings,
    meta: result.meta,
  });
});

export const getRatingSummaryController = catchAsync(async (req: Request, res: Response) => {
  const { riderId } = req.params;
  const summary = await getRatingSummaryService(riderId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Rating summary fetched successfully',
    data: summary,
  });
});

export const updateRatingController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = updateRatingSchema.parse(req.body);
  const rating = await updateRatingService(id as string, req.user!.userId, validatedData);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Rating updated successfully',
    data: rating,
  });
});

export const deleteRatingController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteRatingService(id as string, req.user!.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const getRecentReviewsController = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const reviews = await getRecentReviewsService(limit);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Recent reviews fetched successfully',
    data: reviews,
  });
});
