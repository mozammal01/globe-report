import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <Section spacing="lg">
      <Container
        size="narrow"
        className="flex flex-col items-center gap-6 text-center"
      >
        <H1 className="md:text-6xl">{siteConfig.tagline}</H1>
        <Lead className="max-w-2xl">{siteConfig.description}</Lead>
      </Container>
    </Section>
  );
}
