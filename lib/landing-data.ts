export type RegionId = "issyk-kul" | "chon-kemin" | "karakol" | "naryn" | "ala-archa" | "osh";
export type CabinCategory = "lake" | "mountains" | "couple";
export type CabinId =
  | "mountain-a-frame"
  | "lake-house"
  | "forest-hideaway"
  | "karakol-hideaway"
  | "valley-retreat"
  | "lake-escape";
export type AmenityId = "wifi" | "kitchen" | "parking" | "heating" | "terrace";

export type Cabin = {
  id: CabinId;
  slug: string;
  region: RegionId;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  rating: number;
  ratingVerified?: boolean;
  image: string;
  categories: CabinCategory[];
  amenities: AmenityId[];
};

export const destinations: { id: RegionId; image: string }[] = [
  { id: "issyk-kul", image: "/images/kyrgyzstan-issyk-kul.webp" },
  { id: "chon-kemin", image: "/images/kyrgyzstan-chon-kemin.webp" },
  { id: "karakol", image: "/images/kyrgyzstan-karakol.webp" },
  { id: "naryn", image: "/images/kyrgyzstan-naryn.webp" },
  { id: "ala-archa", image: "/images/kyrgyzstan-ala-archa.webp" },
  { id: "osh", image: "/images/kyrgyzstan-osh.webp" },
];

// Frontend examples from the brief; availability is never inferred from them.
export const cabins: Cabin[] = [
  {
    id: "mountain-a-frame",
    slug: "mountain-a-frame",
    region: "issyk-kul",
    pricePerNight: 5000,
    maxGuests: 4,
    bedrooms: 2,
    rating: 4.9,
    image: "/images/cabin-forest.webp",
    categories: ["mountains"],
    amenities: ["wifi", "kitchen", "parking", "heating", "terrace"],
  },
  {
    id: "lake-house",
    slug: "lake-house",
    region: "issyk-kul",
    pricePerNight: 6500,
    maxGuests: 4,
    bedrooms: 2,
    rating: 4.8,
    image: "/images/cabin-lake.webp",
    categories: ["lake"],
    amenities: ["wifi", "kitchen", "parking", "heating", "terrace"],
  },
  {
    id: "forest-hideaway",
    slug: "forest-hideaway",
    region: "chon-kemin",
    pricePerNight: 4500,
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.9,
    image: "/images/cabin-mountain.webp",
    categories: ["mountains", "couple"],
    amenities: ["wifi", "kitchen", "parking", "heating"],
  },
  {
    id: "karakol-hideaway",
    slug: "karakol-hideaway",
    region: "karakol",
    pricePerNight: 7000,
    maxGuests: 6,
    bedrooms: 3,
    rating: 4.8,
    image: "/images/cabin-hideaway.webp",
    categories: ["mountains"],
    amenities: ["wifi", "kitchen", "parking", "heating", "terrace"],
  },
  {
    id: "valley-retreat",
    slug: "valley-retreat",
    region: "naryn",
    pricePerNight: 4000,
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.7,
    image: "/images/cabin-valley.webp",
    categories: ["mountains", "couple"],
    amenities: ["kitchen", "parking", "heating", "terrace"],
  },
  {
    id: "lake-escape",
    slug: "lake-escape",
    region: "issyk-kul",
    pricePerNight: 5500,
    maxGuests: 3,
    bedrooms: 1,
    rating: 4.8,
    image: "/images/cabin-escape.webp",
    categories: ["lake", "couple"],
    amenities: ["wifi", "kitchen", "parking", "heating"],
  },
];
