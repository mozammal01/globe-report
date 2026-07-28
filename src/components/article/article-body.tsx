import { P } from "@/components/ui/typography";
import { isHtmlContent } from "@/lib/format";
import { PROSE_CLASSNAME } from "@/lib/prose";
import { cn } from "@/lib/utils";

export function ArticleBody({
  content,
  className,
}: {
  content: string;
  className?: string;
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

  return (
    <div
      className={cn(PROSE_CLASSNAME, className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
