import { prisma } from "../../../lib/prisma";

import { ParcelStatus } from "../../../../generated/prisma/enums";
import type { SubmitRatingInput, UpdateRatingInput } from "../interfaces";
import AppError from "../../../errorHelper/AppError";
import status from "http-status";

export const submitRatingService = async (customerId: string, data: SubmitRatingInput) => {

  // Check if parcel exists and belongs to customer
  const parcel = await prisma.parcel.findUnique({
    where: { id: data.parcelId },
    include: { rider: true },
  });

  if (!parcel) {
    throw new AppError(status.NOT_FOUND, 'Parcel not found');
  }

  if (parcel.customerId !== customerId) {
    throw new AppError(status.FORBIDDEN, 'You can only rate your own parcels');
  }

  if (parcel.status !== ParcelStatus.DELIVERED) {
    throw new AppError(status.BAD_REQUEST, 'You can only rate delivered parcels');
  }

  if (!parcel.riderId) {
    throw new AppError(status.BAD_REQUEST, 'No rider assigned to this parcel');
  }

  // Check if already rated
  const existingRating = await prisma.riderRating.findUnique({
    where: {
      parcelId_customerId: {
        parcelId: data.parcelId,
        customerId,
      },
    },
  });

  if (existingRating) {
    throw new AppError(status.CONFLICT, 'You have already rated this parcel');
  }

  // Create rating
  const rating = await prisma.riderRating.create({
    data: {
      riderId: parcel.riderId,
      customerId,
      parcelId: data.parcelId,
      rating: data.rating,
      comment: data.comment,
    },
  });

  // Update rider's average rating
  const rider = await prisma.rider.findUnique({
    where: { id: parcel.riderId },
  });

  if (rider) {
    const oldRating = rider.rating;
    const oldCount = rider.totalRatings;
    const newAverage = ((oldRating * oldCount) + data.rating) / (oldCount + 1);

    await prisma.rider.update({
      where: { id: parcel.riderId },
      data: {
        rating: newAverage,
        totalRatings: oldCount + 1,
      },
    });
  }

  return rating;
};

export const getRiderRatingsService = async (riderId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [ratings, total] = await Promise.all([
    prisma.riderRating.findMany({
      where: { riderId },
      include: {
        customer: {
          select: { id: true, name: true },
        },
        parcel: {
          select: { id: true, trackingId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.riderRating.count({ where: { riderId } }),
  ]);

  return {
    ratings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRatingSummaryService = async (riderId: string) => {
  const rider = await prisma.rider.findUnique({
    where: { id: riderId },
  });

  if (!rider) {
    throw new AppError(status.NOT_FOUND, 'Rider not found');
  }

  const ratings = await prisma.riderRating.findMany({
    where: { riderId },
    select: { rating: true },
  });

  const ratingDistribution = {
    fiveStar: ratings.filter(r => r.rating === 5).length,
    fourStar: ratings.filter(r => r.rating === 4).length,
    threeStar: ratings.filter(r => r.rating === 3).length,
    twoStar: ratings.filter(r => r.rating === 2).length,
    oneStar: ratings.filter(r => r.rating === 1).length,
  };

  return {
    averageRating: rider.rating,
    totalRatings: rider.totalRatings,
    ratingDistribution,
  };
};

export const updateRatingService = async (ratingId: string, customerId: string, data: UpdateRatingInput) => {
  const rating = await prisma.riderRating.findUnique({
    where: { id: ratingId },
    include: { rider: true },
  });

  if (!rating) {
    throw new AppError(status.NOT_FOUND, 'Rating not found');
  }

  if (rating.customerId !== customerId) {
    throw new AppError(status.FORBIDDEN, 'You can only update your own ratings');
  }

  // Check if rating is within 24 hours
  const hoursSinceCreation = (Date.now() - rating.createdAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new AppError(status.BAD_REQUEST, 'You can only edit ratings within 24 hours');
  }

  const oldRatingValue = rating.rating;

  // Update rating
  const updatedRating = await prisma.riderRating.update({
    where: { id: ratingId },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
  });

  // Recalculate rider's average rating if rating changed
  if (data.rating && data.rating !== oldRatingValue) {
    const rider = await prisma.rider.findUnique({
      where: { id: rating.riderId },
    });

    if (rider) {
      const allRatings = await prisma.riderRating.findMany({
        where: { riderId: rating.riderId },
        select: { rating: true },
      });

      const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = total / allRatings.length;

      await prisma.rider.update({
        where: { id: rating.riderId },
        data: { rating: newAverage },
      });
    }
  }

  return updatedRating;
};

export const deleteRatingService = async (ratingId: string, customerId: string) => {
  const rating = await prisma.riderRating.findUnique({
    where: { id: ratingId },
    include: { rider: true },
  });

  if (!rating) {
    throw new AppError(status.NOT_FOUND, 'Rating not found');
  }

  if (rating.customerId !== customerId) {
    throw new AppError(status.FORBIDDEN, 'You can only delete your own ratings');
  }

  // Check if rating is within 24 hours
  const hoursSinceCreation = (Date.now() - rating.createdAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new AppError(status.BAD_REQUEST, 'You can only delete ratings within 24 hours');
  }

  await prisma.riderRating.delete({
    where: { id: ratingId },
  });

  // Recalculate rider's average rating
  const rider = await prisma.rider.findUnique({
    where: { id: rating.riderId },
  });

  if (rider) {
    const allRatings = await prisma.riderRating.findMany({
      where: { riderId: rating.riderId },
      select: { rating: true },
    });

    if (allRatings.length === 0) {
      await prisma.rider.update({
        where: { id: rating.riderId },
        data: { rating: 0, totalRatings: 0 },
      });
    } else {
      const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
      const newAverage = total / allRatings.length;

      await prisma.rider.update({
        where: { id: rating.riderId },
        data: { rating: newAverage, totalRatings: allRatings.length },
      });
    }
  }

  return { message: 'Rating deleted successfully' };
};

export const getRecentReviewsService = async (limit: number) => {
  const reviews = await prisma.riderRating.findMany({
    include: {
      customer: {
        select: { name: true },
      },
      rider: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return reviews.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    customer: { name: review.customer.name },
    rider: { name: review.rider.user.name },
  }));
};
