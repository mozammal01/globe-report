-- CreateEnum
CREATE TYPE "content_type" AS ENUM ('ARTICLE', 'GUIDE');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "contentType" "content_type" NOT NULL DEFAULT 'ARTICLE';
