export type CollectionCard = {
  id: string;
  productType: 'raw' | 'graded' | 'sealed' | 'unspecified';
  name: string;
  set: string;
  number: string;
  language: string;
  variant: string;
  quantity: number;
  condition: string;
  gradingCompany: string;
  grade: string;
  unitPriceMinor: number | null;
  currency: string;
  pricedAt: string;
  imageUrl: string;
};

export type ImportResult =
  | { ok: true; cards: CollectionCard[]; warnings: string[] }
  | { ok: false; errors: string[] };

export type CollectionFilters = {
  query: string;
  kind: 'all' | 'graded' | 'raw' | 'sealed' | 'unspecified' | 'unpriced';
  set: string;
  sort: 'name' | 'value-desc' | 'value-asc' | 'quantity';
};

export const DEFAULT_FILTERS: CollectionFilters = {
  query: '',
  kind: 'all',
  set: 'all',
  sort: 'name',
};
