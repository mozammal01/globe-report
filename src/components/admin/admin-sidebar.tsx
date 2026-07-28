"use client";

import {
  FolderTree,
  Globe2,
  LayoutDashboard,
  Newspaper,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/countries", label: "Countries", icon: Globe2 },
  { href: "/admin/tags", label: "Tags", icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 sm:w-48">
      {links.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
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
