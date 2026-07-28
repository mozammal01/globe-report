import { List } from "lucide-react";

import { extractHeadings } from "@/lib/toc";

export function GuideToc({ content }: { content: string }) {
  const headings = extractHeadings(content);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="border-border bg-card rounded-lg border p-4"
    >
      <div className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
        <List className="size-4" aria-hidden="true" />
        In this guide
      </div>
      <ol className="flex flex-col gap-1.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "ml-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
