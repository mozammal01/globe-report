import { Newspaper } from "lucide-react";
import { Suspense } from "react";

import { ArticleSection } from "@/components/home/article-section";
import { ArticleSectionSkeleton } from "@/components/home/article-section-skeleton";
import { EditorsPicksSection } from "@/components/home/editors-picks-section";
import { FeaturedCountriesAsync } from "@/components/home/featured-countries-async";
import { HeroSection } from "@/components/home/hero-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { PopularSection } from "@/components/home/popular-section";
import { TrendingSection } from "@/components/home/trending-section";
import { getHeroArticle, getLatestArticles } from "@/lib/queries/articles";

export const revalidate = 60;

export default async function HomePage() {
  const hero = await getHeroArticle();
  const latest = await getLatestArticles(6, hero?.id);

  return (
    <>
      <HeroSection article={hero} />

      <ArticleSection
        title="Latest News"
        icon={Newspaper}
        articles={latest}
        cols={3}
        className="border-t-0"
      />

      <Suspense fallback={<ArticleSectionSkeleton cols={4} count={4} />}>
        <TrendingSection />
      </Suspense>

      <Suspense fallback={<ArticleSectionSkeleton cols={4} count={4} />}>
        <PopularSection />
      </Suspense>

      <Suspense fallback={<ArticleSectionSkeleton cols={4} count={4} />}>
        <FeaturedCountriesAsync />
      </Suspense>

      <Suspense fallback={<ArticleSectionSkeleton cols={3} count={3} />}>
        <EditorsPicksSection />
      </Suspense>

      <NewsletterSection />
    </>
  );
}
