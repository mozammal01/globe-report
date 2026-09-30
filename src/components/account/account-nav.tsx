"use client";

import {
  Bookmark,
  Clock,
  LayoutDashboard,
  Newspaper,
  PenSquare,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/account/history", label: "History", icon: Clock },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 sm:w-48">
      {isAdmin && (
        <div className="mb-2 flex flex-col gap-1">
          <Button asChild size="sm" className="mb-1 w-full gap-2 shadow-xs">
            <Link href="/admin/articles/new">
              <PenSquare className="size-4" aria-hidden="true" />
              <span>Write Blog</span>
            </Link>
          </Button>
          <Link
            href="/admin"
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            <span>Admin Studio</span>
          </Link>
          <Link
            href="/admin/articles"
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <Newspaper className="size-4" aria-hidden="true" />
            <span>Articles List</span>
          </Link>
          <Separator className="my-2" />
        </div>
      )}

      {links.map((link) => {
        const isActive =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <link.icon className="size-4" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
