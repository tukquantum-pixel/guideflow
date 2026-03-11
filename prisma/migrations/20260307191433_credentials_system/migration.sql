-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('NONE', 'PENDING', 'VERIFIED');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('TITULO', 'SEGURO', 'LICENCIA', 'EXPERIENCIA', 'IDENTIDAD');

-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "verificationLevel" "VerificationLevel" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT,
    "documentUrl" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "coverageAmount" INTEGER,
    "status" "CredentialStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Credential_guideId_status_idx" ON "Credential"("guideId", "status");

-- CreateIndex
CREATE INDEX "Credential_expiryDate_idx" ON "Credential"("expiryDate");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
