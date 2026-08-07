-- CreateEnum
CREATE TYPE "public"."EmailStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "public"."EmailJob" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "delayBetween" INTEGER NOT NULL,
    "hourlyLimit" INTEGER NOT NULL,
    "status" "public"."EmailStatus" NOT NULL DEFAULT 'PENDING',
    "bullJobId" TEXT,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailJob_pkey" PRIMARY KEY ("id")
);
