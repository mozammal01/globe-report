import { NextResponse } from "next/server";

import { searchAll } from "@/lib/queries/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const results = await searchAll(searchParams.get("q") ?? "");

  return NextResponse.json(results);
}
