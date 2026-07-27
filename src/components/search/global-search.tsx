"use client";

import { FolderOpen, Globe2, Newspaper, Search, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SearchResults } from "@/lib/queries/search";

const EMPTY_RESULTS: SearchResults = {
  articles: [],
  countries: [],
  categories: [],
  tags: [],
};

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 2) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json() as Promise<SearchResults>)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults(EMPTY_RESULTS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults(EMPTY_RESULTS);
    }
  }, [open]);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  const trimmedQuery = query.trim();
  const hasResults =
    results.articles.length > 0 ||
    results.countries.length > 0 ||
    results.categories.length > 0 ||
    results.tags.length > 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search aria-hidden="true" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        aria-label="Search"
        className="hidden items-center gap-2 md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" aria-hidden="true" />
        <span>Search</span>
        <kbd
          aria-hidden="true"
          className="border-border bg-muted text-muted-foreground ml-1 rounded border px-1.5 py-0.5 text-[10px] font-medium"
        >
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search articles, countries, categories, tags..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Spinner size="sm" />
            </div>
          )}

          {!loading && trimmedQuery.length < 2 && (
            <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
          )}

          {!loading && trimmedQuery.length >= 2 && !hasResults && (
            <CommandEmpty>
              No results found for &ldquo;{trimmedQuery}&rdquo;.
            </CommandEmpty>
          )}

          {!loading && results.articles.length > 0 && (
            <CommandGroup heading="Articles">
              {results.articles.map((article) => (
                <CommandItem
                  key={`article-${article.id}`}
                  value={`article-${article.id}`}
                  onSelect={() => go(`/articles/${article.slug}`)}
                >
                  <Newspaper aria-hidden="true" />
                  <div className="flex flex-col">
                    <span>{article.title}</span>
                    <span className="text-muted-foreground text-xs">
                      {article.category.name}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && results.countries.length > 0 && (
            <CommandGroup heading="Countries">
              {results.countries.map((country) => (
                <CommandItem
                  key={`country-${country.id}`}
                  value={`country-${country.id}`}
                  onSelect={() => go(`/countries/${country.slug}`)}
                >
                  <Globe2 aria-hidden="true" />
                  <span aria-hidden="true">{country.flagEmoji}</span>
                  <span>{country.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && results.categories.length > 0 && (
            <CommandGroup heading="Categories">
              {results.categories.map((category) => (
                <CommandItem
                  key={`category-${category.id}`}
                  value={`category-${category.id}`}
                  onSelect={() => go(`/news?category=${category.slug}`)}
                >
                  <FolderOpen aria-hidden="true" />
                  <span>{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && results.tags.length > 0 && (
            <CommandGroup heading="Tags">
              {results.tags.map((tag) => (
                <CommandItem
                  key={`tag-${tag.id}`}
                  value={`tag-${tag.id}`}
                  onSelect={() => go(`/news?tag=${tag.slug}`)}
                >
                  <Tag aria-hidden="true" />
                  <span>{tag.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
