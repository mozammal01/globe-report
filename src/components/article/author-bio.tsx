import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

type AuthorBioProps = {
  author: {
    id: string;
    name: string;
    slug?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
  };
};

export function AuthorBio({ author }: AuthorBioProps) {
  const authorProfileUrl = `/authors/${author.slug || author.id}`;
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-border/80 bg-card/60 rounded-2xl border p-6 shadow-sm sm:p-7">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={72}
            height={72}
            className="ring-primary/20 shrink-0 rounded-full object-cover ring-2"
          />
        ) : (
          <div className="bg-primary/10 text-primary ring-primary/20 flex size-18 shrink-0 items-center justify-center rounded-full text-xl font-bold ring-2">
            {getInitials(author.name)}
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                Written by
              </span>
              <h4 className="font-heading text-foreground text-lg font-bold">
                <Link
                  href={authorProfileUrl}
                  className="hover:text-primary transition-colors"
                >
                  {author.name}
                </Link>
              </h4>
            </div>

            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
              <Link href={authorProfileUrl}>
                <BookOpen className="size-3.5" />
                View all articles
              </Link>
            </Button>
          </div>

          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {author.bio ||
              `${author.name} is a contributing writer sharing stories, analyses, and valuable insights.`}
          </p>
        </div>
      </div>
    </div>
  );
}
