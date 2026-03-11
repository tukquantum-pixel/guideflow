-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "marketplaceEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceRadius" DOUBLE PRECISION,
ADD COLUMN     "yearsExperience" INTEGER;

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gpxData" TEXT NOT NULL,
    "geojson" TEXT,
    "distance" DOUBLE PRECISION,
    "elevationGain" DOUBLE PRECISION,
    "elevationLoss" DOUBLE PRECISION,
    "durationEst" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT NOT NULL DEFAULT 'España',

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_activityId_key" ON "Track"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_guideId_key" ON "Location"("guideId");

-- CreateIndex
CREATE INDEX "Location_lat_lng_idx" ON "Location"("lat", "lng");

-- CreateIndex
CREATE INDEX "Review_guideId_rating_idx" ON "Review"("guideId", "rating");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
