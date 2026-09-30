"use client";

import {
  BarChart3,
  FolderTree,
  Globe2,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Newspaper,
  PenSquare,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/countries", label: "Countries", icon: Globe2 },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/contact", label: "Contact", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 sm:w-48">
      <Button
        asChild
        className="mb-2 w-full gap-2 font-semibold shadow-xs"
        size="sm"
      >
        <Link href="/admin/articles/new">
          <PenSquare className="size-4" aria-hidden="true" />
          <span>Write Blog</span>
        </Link>
      </Button>
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
