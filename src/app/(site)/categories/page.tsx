import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, ArrowRight, BookOpen } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { getCategoriesWithCounts } from "@/lib/queries/categories";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Categories — Topics & Subjects",
  description: `Explore all blog categories and topics on ${siteConfig.name}.`,
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <Section spacing="default">
      <Container>
        <div className="mb-10 flex flex-col gap-3">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <FolderOpen className="size-4" />
            <span>Curated Topics</span>
          </div>
          <H1 className="text-3xl sm:text-5xl">Explore by Category</H1>
          <Lead className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            Find in-depth articles, tutorials, and perspectives organized across
            our core topics of interest.
          </Lead>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group block transition-transform duration-200 hover:-translate-y-1"
            >
              <Card className="border-border/80 bg-card/60 group-hover:border-primary/50 h-full transition-colors group-hover:shadow-md">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-primary flex items-center gap-1.5 text-xs font-semibold">
                        <BookOpen className="size-3.5" />
                        {cat._count.articles}{" "}
                        {cat._count.articles === 1 ? "article" : "articles"}
                      </span>
                    </div>

                    <h3 className="font-heading text-foreground group-hover:text-primary text-xl font-bold tracking-tight transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                      {cat.description ||
                        `Browse articles and insights filed under ${cat.name}.`}
                    </p>
                  </div>

                  <div className="text-primary mt-6 flex items-center gap-1 text-xs font-medium">
                    <span>View articles</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
