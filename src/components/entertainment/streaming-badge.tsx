import * as React from "react";
import { Film, PlayCircle, Tv } from "lucide-react";

import { cn } from "@/lib/utils";

export type StreamingPlatform =
  | "netflix"
  | "prime"
  | "disney"
  | "apple"
  | "max"
  | "hulu"
  | "paramount"
  | "theaters"
  | "other";

type PlatformConfig = {
  label: string;
  badgeClass: string;
  icon: React.ElementType;
};

const PLATFORMS: Record<StreamingPlatform, PlatformConfig> = {
  netflix: {
    label: "Netflix",
    badgeClass:
      "bg-red-950/40 text-red-500 border-red-500/30 hover:border-red-500/60",
    icon: Tv,
  },
  prime: {
    label: "Prime Video",
    badgeClass:
      "bg-sky-950/40 text-sky-400 border-sky-400/30 hover:border-sky-400/60",
    icon: PlayCircle,
  },
  disney: {
    label: "Disney+",
    badgeClass:
      "bg-blue-950/40 text-blue-400 border-blue-400/30 hover:border-blue-400/60",
    icon: Tv,
  },
  apple: {
    label: "Apple TV+",
    badgeClass:
      "bg-zinc-800/60 text-zinc-200 border-zinc-500/40 hover:border-zinc-400",
    icon: Tv,
  },
  max: {
    label: "Max (HBO)",
    badgeClass:
      "bg-purple-950/40 text-purple-400 border-purple-400/30 hover:border-purple-400/60",
    icon: Tv,
  },
  hulu: {
    label: "Hulu",
    badgeClass:
      "bg-emerald-950/40 text-emerald-400 border-emerald-400/30 hover:border-emerald-400/60",
    icon: Tv,
  },
  paramount: {
    label: "Paramount+",
    badgeClass:
      "bg-blue-900/40 text-blue-300 border-blue-400/30 hover:border-blue-300",
    icon: Tv,
  },
  theaters: {
    label: "In Theaters",
    badgeClass:
      "bg-amber-950/40 text-amber-400 border-amber-400/30 hover:border-amber-400/60",
    icon: Film,
  },
  other: {
    label: "Digital",
    badgeClass: "bg-muted text-muted-foreground border-border",
    icon: Film,
  },
};

export function resolvePlatformKey(name: string): StreamingPlatform {
  const lower = name.toLowerCase().trim();
  if (lower.includes("netflix")) return "netflix";
  if (lower.includes("prime") || lower.includes("amazon")) return "prime";
  if (lower.includes("disney") || lower.includes("hotstar")) return "disney";
  if (lower.includes("apple")) return "apple";
  if (lower.includes("max") || lower.includes("hbo")) return "max";
  if (lower.includes("hulu")) return "hulu";
  if (lower.includes("paramount")) return "paramount";
  if (lower.includes("theater") || lower.includes("cinema")) return "theaters";
  return "other";
}

export function StreamingBadge({
  platform,
  url,
  customLabel,
  className,
}: {
  platform: StreamingPlatform | string;
  url?: string;
  customLabel?: string;
  className?: string;
}) {
  const key: StreamingPlatform =
    platform in PLATFORMS
      ? (platform as StreamingPlatform)
      : resolvePlatformKey(platform);

  const config = PLATFORMS[key] ?? PLATFORMS.other;
  const label =
    customLabel || (platform in PLATFORMS ? config.label : platform);
  const Icon = config.icon;

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide transition-all",
        config.badgeClass,
        url && "cursor-pointer hover:shadow-xs",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label={`Watch on ${label} (opens in new tab)`}
      >
        {content}
      </a>
    );
  }

  return content;
}
