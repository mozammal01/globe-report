import { NextResponse } from "next/server";

import { searchAll } from "@/lib/queries/search";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = await getClientIp();
  if (!rateLimit(`search:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const results = await searchAll(searchParams.get("q") ?? "");

  return NextResponse.json(results);
}
