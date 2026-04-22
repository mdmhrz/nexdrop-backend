import { z } from 'zod';

export const submitRatingSchema = z.object({
  parcelId: z.string().uuid('Invalid parcel ID'),
  rating: z.number().int('Rating must be an integer').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
});

export const updateRatingSchema = z.object({
  rating: z.number().int('Rating must be an integer').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
}).refine(data => data.rating !== undefined || data.comment !== undefined, {
  message: 'At least one field (rating or comment) must be provided',
});

export const getRatingsSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});
