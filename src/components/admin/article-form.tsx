"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  PenSquare,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";

import { FormField } from "@/components/admin/form-field";
import {
  MediaUploader,
  type MediaValue,
} from "@/components/admin/media-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { H3, Muted } from "@/components/ui/typography";
import { createArticle, updateArticle } from "@/lib/actions/admin/articles";
import { IDLE_STATE } from "@/lib/actions/admin/types";
import { ARTICLE_STATUSES } from "@/lib/constants/article";
import type { AdminArticle } from "@/lib/queries/admin/articles";
import type { CategoryOption } from "@/lib/queries/categories";
import type { CountryOption } from "@/lib/queries/countries";
import type { TagOption } from "@/lib/queries/tags";
import { toSlug } from "@/lib/slug";

const CONTENT_TYPE_OPTIONS = [
  { value: "ARTICLE", label: "Article" },
  { value: "GUIDE", label: "Guide (Includes Table of Contents)" },
] as const;

const PRO_BLUEPRINTS = [
  {
    id: "ending-explained",
    name: "🎬 Ending Explained & Theories",
    badge: "Most Popular",
    description: "Climax breakdown, hidden clues, and future sequel theories",
    html: `<h2>The Climax Breakdown: What Really Happened?</h2>
<p>Detailed explanation of the final sequence, character motivations, and how the central conflict reached its boiling point.</p>
<blockquote><strong>Key Insight:</strong> Highlight the defining twist or thematic core that reshapes how fans understand the entire narrative.</blockquote>
<h2>Hidden Details, Symbolism & Easter Eggs</h2>
<p>Examine the subtle visual clues, recurring motifs, and foreshadowing that sharp-eyed viewers might have missed.</p>
<ul>
  <li><strong>Symbolism:</strong> What the key props, cards, or visual motifs represent.</li>
  <li><strong>Foreshadowing:</strong> Early dialogue cues and clues that pointed directly to the finale.</li>
  <li><strong>Character Arc:</strong> The psychological transformation of the protagonist.</li>
</ul>
<h2>Unanswered Questions & Top Fan Theories</h2>
<p>Explore the most prominent questions left lingering after the final credits, alongside plausible fan explanations.</p>
<h2>Future Setup: What It Means For The Next Chapter</h2>
<p>How this ending sets the stage for an upcoming season, sequel, or cinematic universe expansion.</p>
<h2>Final Verdict</h2>
<p>A concluding assessment on whether this ending delivered a satisfying payoff for audiences.</p>`,
  },
  {
    id: "spoiler-free-review",
    name: "🍿 Spoiler-Free Review & OTT Guide",
    badge: "Viral Guide",
    description: "Honest critique, standout elements, and where to stream",
    html: `<h2>Overview & Story Premise</h2>
<p>A spoiler-free introduction to the premise, tone, and what audiences can expect from the viewing experience.</p>
<h2>The Highlights: What Works Exceptionally Well</h2>
<p>Analyze standout performances, directorial vision, high-octane action sequences, and musical score.</p>
<h2>The Drawbacks: Where It Falls Short</h2>
<p>Objective critique of pacing lulls, CGI consistency, or underdeveloped character arcs.</p>
<h2>Streaming Details & OTT Release</h2>
<p>Where to watch legally on major OTT platforms (Netflix, Amazon Prime Video, Disney+) in 4K HDR.</p>
<h2>Final Verdict & Star Rating</h2>
<p><strong>Rating: 4.5 / 5 Stars</strong> — A compelling watch for cinema lovers.</p>`,
  },
  {
    id: "post-credits",
    name: "⚡ Post-Credit Breakdown & Lore",
    badge: "Trending",
    description:
      "Post-credit scenes, mystery cameos, and franchise implications",
    html: `<h2>The Post-Credit Scene: Who Appeared and Why?</h2>
<p>A beat-by-beat breakdown of the scene, identifying mystery cameos and shocking reveals.</p>
<h2>Comic Lore vs On-Screen Adaptation</h2>
<p>How this live-action reveal connects to the comic book source material or established franchise lore.</p>
<h2>Impact on the Greater Cinematic Universe</h2>
<p>The monumental shifts this scene triggers for future storylines and upcoming phase announcements.</p>`,
  },
  {
    id: "standard-feature",
    name: "📰 Standard In-Depth Feature",
    badge: "Editorial",
    description:
      "Comprehensive analytical structure for news and general articles",
    html: `<h2>Introduction</h2>
<p>Introduce the story, context, and why it matters to global audiences.</p>
<h2>Key Developments & Detailed Breakdown</h2>
<p>A thorough examination of the events, facts, or central arguments.</p>
<h2>Industry Reaction & Public Response</h2>
<p>How fans, critics, and key stakeholders have responded to the latest announcement.</p>
<h2>Looking Ahead</h2>
<p>Summary of key takeaways and what to watch for in the coming weeks.</p>`,
  },
];

function toDatetimeLocalValue(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ArticleForm({
  article,
  categories,
  countries,
  tags,
}: {
  article?: AdminArticle;
  categories: CategoryOption[];
  countries: CountryOption[];
  tags: TagOption[];
}) {
  const action = article ? updateArticle.bind(null, article.id) : createArticle;
  const [state, formAction] = useActionState(action, IDLE_STATE);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [isSlugLocked, setIsSlugLocked] = useState(Boolean(article?.slug));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    article?.seoDescription ?? "",
  );
  const [coverImage, setCoverImage] = useState<MediaValue | null>(
    article?.coverMediaId && article.coverImage
      ? { id: article.coverMediaId, url: article.coverImage.url }
      : null,
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(article?.tags.map((tag) => tag.id) ?? []),
  );
  const [tagSearch, setTagSearch] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugLocked) {
      setSlug(toSlug(val));
    }
  };

  const handleSlugSync = () => {
    setSlug(toSlug(title));
  };

  const handleApplyBlueprint = (templateHtml: string) => {
    if (content.trim().length > 0) {
      const confirmReplace = window.confirm(
        "Replace your current content with this Pro Blueprint template?",
      );
      if (!confirmReplace) return;
    }
    setContent(templateHtml);
  };

  const handleAutoFillSeo = () => {
    if (!seoTitle.trim() && title.trim()) {
      setSeoTitle(title.trim());
    }
    if (!seoDescription.trim() && excerpt.trim()) {
      setSeoDescription(excerpt.trim());
    }
  };

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Live Metrics Calculation
  const wordsCount = content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordsCount / 200));

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
  );
  const selectedTagsList = tags.filter((tag) => selectedTagIds.has(tag.id));

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-8 pb-12">
      {/* Basic Post Metadata */}
      <div className="flex flex-col gap-4">
        <FormField label="Title" name="title" error={state.fieldErrors?.title}>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Alice in Borderland Season 3: Joker Card Theories & Climax Explained"
            required
            className="text-base font-medium"
          />
        </FormField>

        <FormField
          label="Slug (URL Path)"
          name="slug"
          hint="The permalink for your article (e.g. /articles/your-slug)"
          error={state.fieldErrors?.slug}
        >
          <div className="flex items-center gap-2">
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setIsSlugLocked(true);
              }}
              required
              placeholder="auto-generated-from-title"
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (isSlugLocked) {
                  handleSlugSync();
                  setIsSlugLocked(false);
                } else {
                  setIsSlugLocked(true);
                }
              }}
              className="shrink-0 gap-1.5 text-xs"
              title={
                isSlugLocked
                  ? "Click to sync slug with title"
                  : "Auto-syncing with title (click to lock)"
              }
            >
              {isSlugLocked ? (
                <>
                  <RefreshCw className="size-3.5" />
                  <span>Sync Title</span>
                </>
              ) : (
                <>
                  <Sparkles className="text-primary size-3.5" />
                  <span className="text-primary font-medium">Auto-Sync</span>
                </>
              )}
            </Button>
          </div>
        </FormField>

        <FormField
          label="Excerpt / Catchy Hook"
          name="excerpt"
          hint="Short preview displayed on home feed, search engines, and social media cards."
          error={state.fieldErrors?.excerpt}
        >
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a high-converting 1-2 sentence hook to tease the ending twist or shocking theory..."
          />
        </FormField>
      </div>

      <Separator />

      {/* Pro Writing Studio & Blueprints */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <H3 className="flex items-center gap-2">
              <PenSquare className="text-primary size-5" />
              Article Content & Pro Blueprints
            </H3>
            <Muted>
              Use 1-click movie blueprints for ending breakdowns or write
              freely.
            </Muted>
          </div>

          {/* Quick Metrics Bar */}
          <div className="border-border bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium">
            <span className="text-foreground flex items-center gap-1">
              <BookOpen className="text-muted-foreground size-3.5" />
              {wordsCount} words
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground flex items-center gap-1">
              <Clock className="text-muted-foreground size-3.5" />~{readingTime}{" "}
              min read
            </span>
            <span className="text-muted-foreground">•</span>
            {wordsCount >= 600 ? (
              <Badge
                variant="default"
                className="h-5 gap-1 bg-emerald-600 text-[10px] text-white"
              >
                <CheckCircle2 className="size-3" />
                AdSense Ready
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-5 text-[10px] text-amber-600 dark:text-amber-400"
              >
                Target 600+ words
              </Badge>
            )}
          </div>
        </div>

        {/* Pro Blueprints Selector */}
        <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-primary flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="size-3.5" />
              1-Click Pro Story Blueprints
            </span>
            <span className="text-muted-foreground text-[11px]">
              Inserts structured H2, H3 & callouts
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PRO_BLUEPRINTS.map((bp) => (
              <button
                key={bp.id}
                type="button"
                onClick={() => handleApplyBlueprint(bp.html)}
                className="group border-border bg-card hover:border-primary/40 hover:bg-muted/50 flex flex-col items-start rounded-md border p-2.5 text-left transition-all hover:shadow-xs"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="group-hover:text-primary text-xs font-semibold">
                    {bp.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px]"
                  >
                    {bp.badge}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 line-clamp-1 text-[11px]">
                  {bp.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <RichTextEditor value={content} onChange={setContent} />
        <input type="hidden" name="content" value={content} />
        {state.fieldErrors?.content && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.content[0]}
          </p>
        )}
      </div>

      <Separator />

      {/* Cover Image */}
      <div className="flex flex-col gap-4">
        <div>
          <H3>Cover Image & Thumbnail</H3>
          <Muted>
            High-contrast 16:9 cinematic visuals drive 3x more clicks on social
            feeds.
          </Muted>
        </div>
        <MediaUploader
          label="Cover image"
          value={coverImage}
          onChange={setCoverImage}
        />
        <input type="hidden" name="coverMediaId" value={coverImage?.id ?? ""} />
      </div>

      <Separator />

      {/* Publishing Configuration */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Category"
          name="categoryId"
          error={state.fieldErrors?.categoryId}
        >
          <NativeSelect
            id="categoryId"
            name="categoryId"
            defaultValue={article?.categoryId ?? ""}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Country / Region"
          name="countryId"
          error={state.fieldErrors?.countryId}
        >
          <NativeSelect
            id="countryId"
            name="countryId"
            defaultValue={article?.countryId ?? ""}
          >
            <option value="">Global / All Regions</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.flagEmoji} {country.name}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Status"
          name="status"
          error={state.fieldErrors?.status}
        >
          <NativeSelect
            id="status"
            name="status"
            defaultValue={article?.status ?? "PUBLISHED"}
          >
            {ARTICLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Content type"
          name="contentType"
          hint="Guides feature a floating Table of Contents and Guide badge."
          error={state.fieldErrors?.contentType}
        >
          <NativeSelect
            id="contentType"
            name="contentType"
            defaultValue={article?.contentType ?? "ARTICLE"}
          >
            {CONTENT_TYPE_OPTIONS.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Publish date"
          name="publishedAt"
          hint="Leave blank to publish immediately or select future date."
          error={state.fieldErrors?.publishedAt}
        >
          <Input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(article?.publishedAt)}
          />
        </FormField>

        <div className="flex flex-col justify-center pt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              name="isFeatured"
              defaultChecked={article?.isFeatured}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer font-medium">
              Pin to Featured Hero Section
            </Label>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Featured articles appear highlighted on top of the homepage.
          </p>
        </div>
      </div>

      <Separator />

      {/* Pro Tag Cloud & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <H3>Tags & Topics</H3>
          <Muted>
            Tag related movie franchises, genres, and themes for internal
            linking.
          </Muted>
        </div>

        {/* Selected Tags Chips */}
        {selectedTagsList.length > 0 && (
          <div className="border-border bg-muted/30 flex flex-wrap items-center gap-1.5 rounded-lg border p-2.5">
            <span className="text-muted-foreground mr-1 text-xs font-semibold">
              Selected ({selectedTagsList.length}):
            </span>
            {selectedTagsList.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="hover:bg-destructive/15 hover:text-destructive cursor-pointer gap-1 text-xs transition-colors"
                onClick={() => toggleTag(tag.id)}
                title="Click to remove tag"
              >
                {tag.name}
                <X className="size-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Tag Quick Filter Search */}
        <div className="relative max-w-xs">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
          <Input
            type="search"
            placeholder="Search tags (e.g. Cinema, Plot Twist)..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="h-9 pl-8 text-xs"
          />
        </div>

        <div className="border-border grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-3">
          {filteredTags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 py-0.5">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTagIds.has(tag.id)}
                onCheckedChange={() => toggleTag(tag.id)}
              />
              <Label
                htmlFor={`tag-${tag.id}`}
                className="cursor-pointer truncate text-xs"
              >
                {tag.name}
              </Label>
              {selectedTagIds.has(tag.id) && (
                <input type="hidden" name="tagIds" value={tag.id} />
              )}
            </div>
          ))}
          {filteredTags.length === 0 && (
            <p className="text-muted-foreground col-span-full py-2 text-center text-xs">
              No matching tags found.
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* SEO & Live Google Search Snippet Preview */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <H3 className="flex items-center gap-2">
              <Sparkles className="text-primary size-5" />
              Search Engine Optimization (SEO)
            </H3>
            <Muted>
              Optimize how your article ranks and appears on Google Search.
            </Muted>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoFillSeo}
            className="shrink-0 gap-1.5 text-xs"
          >
            <Wand2 className="text-primary size-3.5" />
            <span>Auto-fill from Title & Excerpt</span>
          </Button>
        </div>

        {/* Live Google Search Preview */}
        <Card className="border-border/80 bg-muted/20">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase">
              <Eye className="size-3.5" />
              Live Google Search Preview
            </span>
            <div className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
              <span>https://globereport.com</span>
              <span>›</span>
              <span>articles</span>
              <span>›</span>
              <span className="text-foreground/80 font-mono text-[11px]">
                {slug || "your-article-slug"}
              </span>
            </div>
            <p className="line-clamp-1 cursor-pointer text-base font-medium text-blue-600 hover:underline dark:text-blue-400">
              {seoTitle || title || "Your Catchy Article Title Goes Here"}
            </p>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {seoDescription ||
                excerpt ||
                "Write an engaging excerpt or SEO description to maximize clicks from search engines and social media feeds..."}
            </p>
          </CardContent>
        </Card>

        <FormField
          label="SEO Title"
          name="seoTitle"
          hint="60 characters or less recommended for search engines."
          error={state.fieldErrors?.seoTitle}
        >
          <Input
            id="seoTitle"
            name="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Catchy headline optimized for Google Search"
          />
        </FormField>

        <FormField
          label="SEO Meta Description"
          name="seoDescription"
          hint="155-160 characters recommended to entice Google searchers."
          error={state.fieldErrors?.seoDescription}
        >
          <Textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Compelling description summarizing the core mystery or analysis..."
          />
        </FormField>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border p-3 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <div className="border-border bg-background/95 sticky bottom-4 z-20 flex items-center justify-between rounded-xl border p-4 shadow-lg backdrop-blur-md">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="hidden sm:inline">Article status:</span>
          <Badge variant="outline" className="font-mono text-xs">
            {article ? "UPDATING" : "NEW POST"}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" type="button" asChild>
            <a href="/admin/articles">Cancel</a>
          </Button>
          <SubmitButton className="gap-2 font-semibold shadow-xs">
            <PenSquare className="size-4" />
            <span>{article ? "Save Changes" : "Publish Article"}</span>
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
