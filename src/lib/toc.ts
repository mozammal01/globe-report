import { toSlug } from "@/lib/slug";

type Heading = { level: 2 | 3; text: string; id: string };

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function dedupeId(id: string, seen: Map<string, number>): string {
  const count = seen.get(id) ?? 0;
  seen.set(id, count + 1);
  return count > 0 ? `${id}-${count}` : id;
}

export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  const regex = /<(h2|h3)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const text = stripTags(match[2]!);
    if (!text) continue;

    headings.push({
      level: match[1]!.toLowerCase() === "h2" ? 2 : 3,
      text,
      id: dedupeId(toSlug(text), seen),
    });
  }

  return headings;
}

export function injectHeadingIds(html: string): string {
  const seen = new Map<string, number>();
  const regex = /<(h2|h3)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/gi;

  return html.replace(
    regex,
    (full, tag: string, attrs: string, inner: string) => {
      if (/\sid=/.test(attrs)) return full;

      const text = stripTags(inner);
      if (!text) return full;

      const id = dedupeId(toSlug(text), seen);
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );
}
