-- AlterTable
ALTER TABLE "rider" ADD COLUMN     "totalRatings" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "rider_rating" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rider_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rider_rating_riderId_idx" ON "rider_rating"("riderId");

-- CreateIndex
CREATE INDEX "rider_rating_parcelId_idx" ON "rider_rating"("parcelId");

-- CreateIndex
CREATE UNIQUE INDEX "rider_rating_parcelId_customerId_key" ON "rider_rating"("parcelId", "customerId");

-- AddForeignKey
ALTER TABLE "rider_rating" ADD CONSTRAINT "rider_rating_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_rating" ADD CONSTRAINT "rider_rating_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider_rating" ADD CONSTRAINT "rider_rating_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "parcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
