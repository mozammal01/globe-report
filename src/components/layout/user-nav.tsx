"use client";

import { PenSquare } from "lucide-react";
import Link from "next/link";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/client";

// Client-side session check (via Better Auth's useSession hook) rather than
// a server-side getCurrentUser() call — reading cookies/headers in a Server
// Component here would force every page under the shared (site) layout into
// fully dynamic rendering, defeating ISR on the homepage/article/country
// pages. Same pattern as BookmarkButton's client-side status fetch.
export function UserNav() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Skeleton className="size-9 rounded-md" />;
  }

  if (!session) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="default"
        size="sm"
        asChild
        className="gap-1.5 px-2.5 font-medium shadow-xs sm:px-3"
      >
        <Link href="/admin/articles/new" aria-label="Write a new blog post">
          <PenSquare className="size-3.5" aria-hidden="true" />
          <span>
            Write<span className="xs:inline hidden sm:inline"> Blog</span>
          </span>
        </Link>
      </Button>
      <UserMenu name={session.user.name} />
    </div>
  );
}
