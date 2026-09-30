import * as React from "react";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

export type VideoEmbedProps = {
  src: string; // YouTube URL or YouTube Video ID
  title?: string;
  caption?: string;
  className?: string;
};

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/,
  );

  return match ? match[1] : null;
}

export function VideoEmbed({
  src,
  title = "Movie Trailer or Scene Breakdown",
  caption,
  className,
}: VideoEmbedProps) {
  const videoId = extractYouTubeId(src);

  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <figure className={cn("my-6 flex flex-col gap-2", className)}>
      <div className="border-border/60 bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-xs">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {caption && (
        <figcaption className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-xs">
          <Play className="text-primary size-3" aria-hidden="true" />
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
