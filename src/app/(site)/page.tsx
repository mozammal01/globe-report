import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
        {siteConfig.tagline}
      </h1>
      <p className="text-muted-foreground max-w-2xl text-lg text-balance">
        {siteConfig.description}
      </p>
    </section>
  );
}
