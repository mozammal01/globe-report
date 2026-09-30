import * as React from "react";
import {
  Calendar,
  Clock,
  Clapperboard,
  Star,
  Users,
  Film,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StreamingBadge } from "@/components/entertainment/streaming-badge";
import { cn } from "@/lib/utils";

export type MoviePlatformItem = {
  platform: string;
  url?: string;
};

export type MovieInfoCardProps = {
  title: string;
  originalTitle?: string;
  tagline?: string;
  posterUrl?: string;
  posterAlt?: string;
  releaseYear?: number | string;
  duration?: string;
  ageRating?: string;
  genres?: string[];
  director?: string | string[];
  cast?: string[];
  imdbRating?: string | number;
  rottenTomatoes?: string | number;
  streamingOn?: (string | MoviePlatformItem)[];
  verdict?: string;
  className?: string;
};

export function MovieInfoCard({
  title,
  originalTitle,
  tagline,
  posterUrl,
  posterAlt,
  releaseYear,
  duration,
  ageRating,
  genres = [],
  director,
  cast = [],
  imdbRating,
  rottenTomatoes,
  streamingOn = [],
  verdict,
  className,
}: MovieInfoCardProps) {
  const directorsList = Array.isArray(director)
    ? director.join(", ")
    : director;

  return (
    <Card
      className={cn(
        "border-border/80 bg-card/60 relative overflow-hidden rounded-xl border shadow-sm backdrop-blur-xs",
        className,
      )}
    >
      {/* Subtle top accent gradient */}
      <div className="from-primary/20 via-primary/5 absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-transparent" />

      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Movie Poster */}
          {posterUrl && (
            <div className="border-border/60 bg-muted relative aspect-2/3 w-36 shrink-0 self-center overflow-hidden rounded-lg border shadow-xs md:w-44 md:self-start">
              <Image
                src={posterUrl}
                alt={posterAlt ?? `${title} Movie Poster`}
                fill
                sizes="(max-width: 768px) 144px, 176px"
                className="object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  Movie Profile
                </span>
                {ageRating && (
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {ageRating}
                  </Badge>
                )}
              </div>

              <h2 className="text-foreground mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h2>

              {originalTitle && originalTitle !== title && (
                <p className="text-muted-foreground text-sm italic">
                  Original: {originalTitle}
                </p>
              )}

              {tagline && (
                <p className="text-muted-foreground mt-1 text-sm font-medium">
                  &ldquo;{tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Quick Meta Row: Year, Runtime, Ratings */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              {releaseYear && (
                <span className="text-muted-foreground inline-flex items-center gap-1 font-medium">
                  <Calendar className="size-3.5" aria-hidden="true" />
                  {releaseYear}
                </span>
              )}
              {duration && (
                <span className="text-muted-foreground inline-flex items-center gap-1 font-medium">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {duration}
                </span>
              )}

              {/* IMDb Rating */}
              {imdbRating && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-500 dark:bg-amber-500/20">
                  <Star
                    className="size-3.5 fill-amber-500"
                    aria-hidden="true"
                  />
                  IMDb {imdbRating}
                </span>
              )}

              {/* Rotten Tomatoes */}
              {rottenTomatoes && (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 font-semibold text-rose-500 dark:bg-rose-500/20">
                  🍅 {rottenTomatoes}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Director & Cast Metadata */}
            <div className="border-border/60 text-muted-foreground grid grid-cols-1 gap-2 border-t pt-3 text-xs sm:grid-cols-2">
              {directorsList && (
                <div className="flex items-start gap-1.5">
                  <Clapperboard
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="text-foreground font-medium">
                      Director:{" "}
                    </span>
                    <span>{directorsList}</span>
                  </div>
                </div>
              )}

              {cast.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <Users
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="text-foreground font-medium">
                      Starring:{" "}
                    </span>
                    <span>{cast.slice(0, 4).join(", ")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Streaming Platforms */}
            {streamingOn.length > 0 && (
              <div className="border-border/60 flex flex-col gap-2 border-t pt-3">
                <span className="text-foreground flex items-center gap-1 text-xs font-semibold">
                  <Film className="text-primary size-3.5" aria-hidden="true" />
                  Where to Stream Legally:
                </span>
                <div className="flex flex-wrap gap-2">
                  {streamingOn.map((item, idx) => {
                    const isObj = typeof item === "object";
                    const platform = isObj ? item.platform : item;
                    const url = isObj ? item.url : undefined;
                    return (
                      <StreamingBadge
                        key={`${platform}-${idx}`}
                        platform={platform}
                        url={url}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Verdict / Review summary */}
        {verdict && (
          <div className="border-border/60 bg-muted/40 mt-5 rounded-lg border p-3.5 text-sm sm:p-4">
            <div className="text-foreground mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="text-primary size-3.5" aria-hidden="true" />
              The Verdict / Takeaway
            </div>
            <p className="text-muted-foreground leading-relaxed">{verdict}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
