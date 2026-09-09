export type ProductStatus = "live" | "in-development" | "planned";

export interface Product {
  slug: string;
  name: string;
  mark: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  url?: string;
}

const STATUS_LABEL: Record<ProductStatus, string> = {
  live: "Live",
  "in-development": "In development",
  planned: "Planned",
};

export function statusLabel(status: ProductStatus): string {
  return STATUS_LABEL[status];
}

/**
 * Edit this list to add real taglines, descriptions, status, and a url
 * for each project. New entries automatically get a card on the hub.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "gostate",
    name: "GoState",
    mark: "GS",
    tagline: "Add a one-line tagline for GoState.",
    description: "Placeholder — edit src/data/products.ts with a real description, status, and link.",
    status: "in-development",
  },
  {
    slug: "fableagent",
    name: "FableAgent",
    mark: "FA",
    tagline: "Add a one-line tagline for FableAgent.",
    description: "Placeholder — edit src/data/products.ts with a real description, status, and link.",
    status: "in-development",
  },
  {
    slug: "gaia",
    name: "GAIA",
    mark: "GA",
    tagline: "Add a one-line tagline for GAIA.",
    description: "Placeholder — edit src/data/products.ts with a real description, status, and link.",
    status: "in-development",
  },
  {
    slug: "recalldock",
    name: "RecallDock",
    mark: "RD",
    tagline: "Add a one-line tagline for RecallDock.",
    description: "Placeholder — edit src/data/products.ts with a real description, status, and link.",
    status: "in-development",
  },
];
