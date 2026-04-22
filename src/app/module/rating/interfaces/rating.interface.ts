export interface SubmitRatingInput {
  parcelId: string;
  rating: number;
  comment?: string;
}

export interface UpdateRatingInput {
  rating?: number;
  comment?: string;
}

export interface RatingResponse {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  rider: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
  };
  parcel: {
    id: string;
    trackingId: string;
  };
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

export interface RecentReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  customer: {
    name: string;
  };
  rider: {
    name: string;
  };
}
