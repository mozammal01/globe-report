import type { MovieInfoCardProps } from "@/components/entertainment/movie-info-card";

export const MOVIE_DATA_BY_SLUG: Record<string, MovieInfoCardProps> = {
  "alice-in-borderland-season-2-ending-explained-joker-card": {
    title: "Alice in Borderland (Season 2)",
    originalTitle: "今際の国のアリス (Imawa no Kuni no Arisu)",
    tagline:
      "Return to reality or remain a citizen of the games. But who deals the final card?",
    releaseYear: 2022,
    duration: "8 Episodes (Season 2)",
    ageRating: "TV-MA",
    genres: ["Survival Thriller", "Psychological Mystery", "Sci-Fi", "Action"],
    director: "Shinsuke Sato",
    cast: [
      "Kento Yamazaki (Ryōhei Arisu)",
      "Tao Tsuchiya (Yuzuha Usagi)",
      "Nijiro Murakami (Shuntarō Chishiya)",
      "Aya Asahina (Hikari Kuina)",
      "Riisa Naka (Mira Kano / Queen of Hearts)",
    ],
    imdbRating: "7.7/10",
    rottenTomatoes: "89%",
    streamingOn: [
      {
        platform: "netflix",
        url: "https://www.netflix.com/title/80200575",
      },
    ],
    verdict:
      "A masterclass in psychological survival television. The Season 2 finale delivers a heartbreaking explanation for the Borderlands while leaving viewers questioning reality itself with the chilling final shot of the Joker card.",
  },
};

export function getMovieMetadataBySlug(
  slug: string,
): MovieInfoCardProps | null {
  return MOVIE_DATA_BY_SLUG[slug] ?? null;
}
