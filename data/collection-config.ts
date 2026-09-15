export const collectionConfig = {
  snapshotDate: '2026-09-06',
  // Extra safeguard for future additions; the CSV contains only showcase cards.
  // Disabling this cannot restore entries removed from the source.
  showcaseOnly: true,
  // USD per copy, inclusive. Applies to raw and graded cards, not sealed items.
  showcaseMinPriceUsd: 500,
  showcaseMaxPriceUsd: 2000,
};
