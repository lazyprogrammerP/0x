-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_agentId_fkey";

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
