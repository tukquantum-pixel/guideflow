-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other',
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "includes" TEXT,
ADD COLUMN     "meetingPoint" TEXT,
ADD COLUMN     "meetingPointUrl" TEXT,
ADD COLUMN     "whatToBring" TEXT;

-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "languages" TEXT[];
