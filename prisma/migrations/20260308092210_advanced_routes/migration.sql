-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "maxElevation" DOUBLE PRECISION,
ADD COLUMN     "minElevation" DOUBLE PRECISION,
ADD COLUMN     "routeType" TEXT,
ADD COLUMN     "seasonRecommended" TEXT[];

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "startPoint" JSONB NOT NULL,
    "endPoint" JSONB NOT NULL,
    "distance" DOUBLE PRECISION,
    "duration" INTEGER,
    "elevationGain" DOUBLE PRECISION,
    "elevationLoss" DOUBLE PRECISION,
    "difficulty" TEXT,
    "terrain" TEXT,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "timeFromStart" INTEGER,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StagePhoto" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StagePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckpointPhoto" (
    "id" TEXT NOT NULL,
    "checkpointId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CheckpointPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoutePhoto" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoutePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stage_trackId_order_idx" ON "Stage"("trackId", "order");

-- CreateIndex
CREATE INDEX "Checkpoint_stageId_order_idx" ON "Checkpoint"("stageId", "order");

-- CreateIndex
CREATE INDEX "StagePhoto_stageId_idx" ON "StagePhoto"("stageId");

-- CreateIndex
CREATE INDEX "CheckpointPhoto_checkpointId_idx" ON "CheckpointPhoto"("checkpointId");

-- CreateIndex
CREATE INDEX "UserRoutePhoto_trackId_approved_idx" ON "UserRoutePhoto"("trackId", "approved");

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagePhoto" ADD CONSTRAINT "StagePhoto_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointPhoto" ADD CONSTRAINT "CheckpointPhoto_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoutePhoto" ADD CONSTRAINT "UserRoutePhoto_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoutePhoto" ADD CONSTRAINT "UserRoutePhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
