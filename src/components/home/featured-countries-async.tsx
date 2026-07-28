import { FeaturedCountriesSection } from "@/components/home/featured-countries-section";
import { getFeaturedCountries } from "@/lib/queries/articles";

export async function FeaturedCountriesAsync() {
  const featuredCountries = await getFeaturedCountries(8);

  return <FeaturedCountriesSection countries={featuredCountries} />;
}
