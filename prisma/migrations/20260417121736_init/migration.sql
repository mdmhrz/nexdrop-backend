-- CreateTable
CREATE TABLE "stats_cache" (
    "id" TEXT NOT NULL,
    "totalParcels" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_cache_pkey" PRIMARY KEY ("id")
);
