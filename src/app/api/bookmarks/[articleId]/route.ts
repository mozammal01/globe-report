import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { isArticleBookmarked } from "@/lib/queries/bookmarks";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ signedIn: false, bookmarked: false });
  }

  const bookmarked = await isArticleBookmarked(user.id, articleId);
  return NextResponse.json({ signedIn: true, bookmarked });
}
