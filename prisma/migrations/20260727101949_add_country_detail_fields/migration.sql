-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "capital" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "economy" TEXT,
ADD COLUMN     "gdpSummary" TEXT,
ADD COLUMN     "heroImageAlt" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "history" TEXT,
ADD COLUMN     "interestingFacts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "population" INTEGER,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "travel" TEXT;
