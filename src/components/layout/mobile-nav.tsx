"use client";

import {
  LayoutDashboard,
  LogIn,
  Menu,
  Newspaper,
  PenSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useSession } from "@/lib/auth/client";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-3/4 flex-col gap-0 p-0 sm:max-w-xs"
      >
        <SheetHeader className="border-border border-b p-4">
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
          {session ? (
            <div className="border-primary/20 bg-primary/5 flex flex-col gap-2 rounded-lg border p-3">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Creator & Admin
              </span>
              <Button asChild size="sm" className="w-full gap-2 shadow-xs">
                <Link href="/admin/articles/new" onClick={() => setOpen(false)}>
                  <PenSquare className="size-4" aria-hidden="true" />
                  <span>Write New Blog</span>
                </Link>
              </Button>
              <div className="flex flex-col gap-1 pt-1 text-sm">
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 font-medium"
                >
                  <LayoutDashboard className="text-muted-foreground size-4" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  href="/admin/articles"
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 font-medium"
                >
                  <Newspaper className="text-muted-foreground size-4" />
                  <span>Manage Articles</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 font-medium"
                >
                  <User className="text-muted-foreground size-4" />
                  <span>My Account</span>
                </Link>
              </div>
            </div>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <Link href="/login" onClick={() => setOpen(false)}>
                <LogIn className="size-4" />
                <span>Sign in</span>
              </Link>
            </Button>
          )}

          <Separator />

          <div>
            <span className="text-muted-foreground mb-2 block px-1 text-xs font-semibold tracking-wider uppercase">
              Explore
            </span>
            <nav className="flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground hover:bg-muted rounded-md px-3 py-2 text-sm font-medium"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
