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
    tagline: "Context preservation for developer workspaces",
    description: "A backend for capturing and restoring developer workspace state — a FastAPI gateway, Supabase/Postgres snapshot storage, and a local CLI that hashes workspace files, env vars, and the active process into a deterministic restore plan.",
    status: "in-development",
    url: "https://github.com/AMallur/GoState",
  },
  {
    slug: "fableagent",
    name: "FableAgent",
    mark: "FA",
    tagline: "Denial recovery platform for healthcare billing",
    description: "A multi-tenant RCM platform that ingests X12 835/837 files, detects underpayments and denials, and automates appeals — claim matching, an NCCI-aware detection engine, appeal-letter generation, a biller/collector ops UI, and a public API.",
    status: "in-development",
    url: "https://github.com/AMallur/fableagent_v1",
  },
  {
    slug: "gaia",
    name: "GAIA",
    mark: "GA",
    tagline: "Local-first R&D system for materials experiments",
    description: "GAIA Ω compiles, executes, and evidences bounded cementitious-material experiments end to end — a fail-closed safety-permit gate, simulated device execution, a formulation optimizer, and an operator console. Simulation-only; physical operation stays locked out pending independent safety review.",
    status: "in-development",
    url: "https://github.com/AMallur/GAIA",
  },
  {
    slug: "recalldock",
    name: "RecallDock",
    mark: "RD",
    tagline: "Add a one-line tagline for RecallDock.",
    description: "No public repo found for RecallDock yet — edit src/data/products.ts with a real description, status, and link once it exists.",
    status: "planned",
  },
];
