"use client";

import {
  Bookmark,
  Clock,
  LayoutDashboard,
  LogOut,
  Newspaper,
  PenSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/client";

export function UserMenu({ name }: { name: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground text-xs font-normal">
              Admin & Creator
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="text-primary focus:text-primary cursor-pointer font-medium"
        >
          <Link href="/admin/articles/new">
            <PenSquare
              className="text-primary mr-2 size-4"
              aria-hidden="true"
            />
            <span>Write New Blog</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/admin">
            <LayoutDashboard className="mr-2 size-4" aria-hidden="true" />
            <span>Admin Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/admin/articles">
            <Newspaper className="mr-2 size-4" aria-hidden="true" />
            <span>Manage Articles</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account">
            <User className="mr-2 size-4" aria-hidden="true" />
            <span>Account Overview</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account/bookmarks">
            <Bookmark className="mr-2 size-4" aria-hidden="true" />
            <span>Bookmarks</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account/history">
            <Clock className="mr-2 size-4" aria-hidden="true" />
            <span>Reading History</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={handleSignOut}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 size-4" aria-hidden="true" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
