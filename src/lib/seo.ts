import "server-only";

import { siteConfig } from "@/config/site";
import type { ArticleDetail } from "@/lib/queries/articles";
import type { CountryDetail } from "@/lib/queries/countries";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function articleJsonLd(article: ArticleDetail, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.coverImage ? [article.coverImage.url] : undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function countryJsonLd(country: CountryDetail, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    identifier: country.iso3,
    description: country.seoDescription ?? undefined,
    image: country.heroImageUrl ?? undefined,
    url,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type MovieReviewLdData = {
  movieTitle: string;
  movieImage?: string;
  director?: string;
  actors?: string[];
  releaseYear?: number | string;
  ratingValue?: number | string;
  bestRating?: number | string;
  reviewHeadline: string;
  reviewBody?: string;
  authorName: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
};

export function movieReviewJsonLd(data: MovieReviewLdData) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: data.reviewHeadline,
    reviewBody: data.reviewBody,
    url: data.url,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      "@type": "Person",
      name: data.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    itemReviewed: {
      "@type": "Movie",
      name: data.movieTitle,
      image: data.movieImage,
      dateCreated: data.releaseYear ? String(data.releaseYear) : undefined,
      ...(data.director
        ? {
            director: {
              "@type": "Person",
              name: data.director,
            },
          }
        : {}),
      ...(data.actors && data.actors.length > 0
        ? {
            actor: data.actors.map((actor) => ({
              "@type": "Person",
              name: actor,
            })),
          }
        : {}),
    },
    ...(data.ratingValue
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: String(data.ratingValue),
            bestRating: String(data.bestRating ?? 10),
            worstRating: "1",
          },
        }
      : {}),
  };
}
