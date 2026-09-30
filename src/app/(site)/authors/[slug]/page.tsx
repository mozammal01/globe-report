import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, ArrowLeft } from "lucide-react";

import { ArticleCard } from "@/components/home/article-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { H1 } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format";
import { getAuthorBySlug } from "@/lib/queries/authors";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: "Author Not Found" };
  }

  const title = `${author.name} — Author at ${siteConfig.name}`;
  const description =
    author.bio || `Read articles, stories, and analyses by ${author.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: author.avatarUrl ? [{ url: author.avatarUrl }] : [],
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Section spacing="default">
      <Container>
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2 gap-1.5"
          >
            <Link href="/blog">
              <ArrowLeft className="size-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Author Header Card */}
        <div className="border-border/80 from-card via-card to-muted/30 mb-12 rounded-3xl border bg-gradient-to-br p-8 shadow-sm sm:p-10">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={112}
                height={112}
                priority
                className="ring-primary/20 shrink-0 rounded-full object-cover ring-4"
              />
            ) : (
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-28 shrink-0 items-center justify-center rounded-full text-3xl font-bold ring-4">
                {getInitials(author.name)}
              </div>
            )}

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <Badge variant="secondary" className="px-2.5 py-0.5">
                  {author.role.name || "Author"}
                </Badge>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar className="size-3.5" />
                  Joined {formatDate(author.createdAt)}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <BookOpen className="size-3.5" />
                  {author._count.articles}{" "}
                  {author._count.articles === 1 ? "article" : "articles"}
                </span>
              </div>

              <H1 className="text-2xl sm:text-4xl">{author.name}</H1>

              <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
                {author.bio ||
                  `${author.name} writes insightful stories and perspectives for ${siteConfig.name}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Articles by this Author */}
        <div className="space-y-6">
          <div className="border-border flex items-center justify-between border-b pb-4">
            <h2 className="font-heading text-xl font-bold tracking-tight">
              Articles by {author.name} ({author.articles.length})
            </h2>
          </div>

          {author.articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {author.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No published articles yet"
              description={`${author.name} hasn't published any articles yet.`}
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
