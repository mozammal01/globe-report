export type CategorySeed = {
  name: string;
  slug: string;
  description: string;
};

export const categories: CategorySeed[] = [
  {
    name: "World",
    slug: "world",
    description: "Global affairs and cross-border developments.",
  },
  {
    name: "Politics",
    slug: "politics",
    description: "Government, elections, and policy.",
  },
  {
    name: "Business",
    slug: "business",
    description: "Markets, trade, and the global economy.",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Innovation, software, and the digital economy.",
  },
  {
    name: "Science",
    slug: "science",
    description: "Research, discovery, and exploration.",
  },
  {
    name: "Health",
    slug: "health",
    description: "Public health, medicine, and wellbeing.",
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Competitions, leagues, and athletes.",
  },
  {
    name: "Culture",
    slug: "culture",
    description: "Arts, heritage, and society.",
  },
  {
    name: "Environment",
    slug: "environment",
    description: "Climate, conservation, and sustainability.",
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    description: "Film, television, and media.",
  },
];
