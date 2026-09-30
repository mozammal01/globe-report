import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getCategoriesWithCounts } from "@/lib/queries/categories";

export async function FeaturedCategoriesSection() {
  const categories = await getCategoriesWithCounts();
  const topCategories = categories.slice(0, 6);

  if (topCategories.length === 0) return null;

  return (
    <Section spacing="sm" className="border-border/80 bg-muted/20 border-t">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-primary size-5" />
            <h2 className="font-heading text-xl font-bold tracking-tight">
              Explore by Topic
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <span>All topics</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group border-border/80 bg-card/70 hover:border-primary/50 hover:bg-card flex flex-col justify-between rounded-xl border p-3.5 text-center transition-all hover:shadow-xs sm:text-left"
            >
              <h3 className="font-heading text-foreground group-hover:text-primary line-clamp-1 text-sm font-semibold transition-colors">
                {cat.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-[11px]">
                {cat._count.articles}{" "}
                {cat._count.articles === 1 ? "article" : "articles"}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
