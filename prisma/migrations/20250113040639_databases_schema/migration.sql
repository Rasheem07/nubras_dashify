-- AlterTable
ALTER TABLE "databases" ADD COLUMN     "headers" TEXT[],
ADD COLUMN     "types" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;
