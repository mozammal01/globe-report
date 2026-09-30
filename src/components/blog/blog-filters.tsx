"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { CategoryOption } from "@/lib/queries/categories";

type BlogFiltersProps = {
  categories: CategoryOption[];
  selectedCategory?: string;
  searchQuery?: string;
};

export function BlogFilters({
  categories,
  selectedCategory,
  searchQuery = "",
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery);
  const [, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }
    params.delete("page"); // reset to page 1

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function getCategoryHref(slug?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search articles, topics, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-border/80 focus-visible:ring-primary/20 h-11 rounded-xl pr-4 pl-10 text-sm"
        />
      </form>

      {/* Category Pills Slider / Bar */}
      <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
        <Link href={getCategoryHref(undefined)}>
          <Badge
            variant={!selectedCategory ? "default" : "outline"}
            className="hover:border-primary/50 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
          >
            All Topics
          </Badge>
        </Link>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <Link key={cat.id} href={getCategoryHref(cat.slug)}>
              <Badge
                variant={isActive ? "default" : "outline"}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {cat.name}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
