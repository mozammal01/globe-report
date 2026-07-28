import { P } from "@/components/ui/typography";
import { isHtmlContent } from "@/lib/format";
import { PROSE_CLASSNAME } from "@/lib/prose";
import { injectHeadingIds } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function ArticleBody({
  content,
  className,
  withHeadingIds = false,
}: {
  content: string;
  className?: string;
  /** Adds anchor ids to h2/h3 so a table of contents can link into the body (used for Guide content). */
  withHeadingIds?: boolean;
}) {
  if (!isHtmlContent(content)) {
    const paragraphs = content
      .split("\n\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {paragraphs.map((paragraph, index) => (
          <P key={index}>{paragraph}</P>
        ))}
      </div>
    );
  }

  const html = withHeadingIds ? injectHeadingIds(content) : content;

  return (
    <div
      className={cn(PROSE_CLASSNAME, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
