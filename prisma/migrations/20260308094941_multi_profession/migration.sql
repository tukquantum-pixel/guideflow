-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "equipment" JSONB,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "professionCategory" TEXT,
ADD COLUMN     "professionType" TEXT,
ADD COLUMN     "rentalIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specializations" TEXT[];
