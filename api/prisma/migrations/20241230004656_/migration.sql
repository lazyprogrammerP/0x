-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "callSID" TEXT,
ADD COLUMN     "contacted" BOOLEAN NOT NULL DEFAULT false;
