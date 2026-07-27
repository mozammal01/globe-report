import { Flame, Newspaper, Star, TrendingUp } from "lucide-react";

import { ArticleSection } from "@/components/home/article-section";
import { FeaturedCountriesSection } from "@/components/home/featured-countries-section";
import { HeroSection } from "@/components/home/hero-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import {
  getEditorsPicks,
  getFeaturedCountries,
  getHeroArticle,
  getLatestArticles,
  getPopularArticles,
  getTrendingArticles,
} from "@/lib/queries/articles";

export const revalidate = 60;

export default async function HomePage() {
  const hero = await getHeroArticle();

  const [latest, trending, popular, editorsPicks, featuredCountries] =
    await Promise.all([
      getLatestArticles(6, hero?.id),
      getTrendingArticles(4),
      getPopularArticles(4),
      getEditorsPicks(3),
      getFeaturedCountries(8),
    ]);

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

      <ArticleSection
        title="Trending"
        description="What readers are following right now"
        icon={TrendingUp}
        articles={trending}
        cols={4}
        emptyMessage="No trending stories in the last two weeks."
      />

      <ArticleSection
        title="Popular"
        description="All-time reader favorites"
        icon={Flame}
        articles={popular}
        cols={4}
      />

      <FeaturedCountriesSection countries={featuredCountries} />

      <ArticleSection
        title="Editor's Picks"
        description="Hand-picked stories worth your time"
        icon={Star}
        articles={editorsPicks}
        cols={3}
      />

      <NewsletterSection />
    </>
  );
}
