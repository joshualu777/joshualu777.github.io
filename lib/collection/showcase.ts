import type { CollectionCard } from './types.ts';

type ShowcaseConfig = {
  showcaseOnly: boolean;
  showcaseMinPriceUsd: number;
  showcaseMaxPriceUsd?: number;
};

// Apply on the server before serializing any collection data to the browser.
export function selectPublishedCards(
  cards: CollectionCard[],
  config: ShowcaseConfig,
): CollectionCard[] {
  if (!config.showcaseOnly) return [...cards];
  if (
    !Number.isFinite(config.showcaseMinPriceUsd) ||
    config.showcaseMinPriceUsd < 0
  )
    throw new Error('Showcase minimum must be a nonnegative USD amount.');
  const minimumMinor = Math.round(config.showcaseMinPriceUsd * 100);
  if (
    config.showcaseMaxPriceUsd !== undefined &&
    (!Number.isFinite(config.showcaseMaxPriceUsd) ||
      config.showcaseMaxPriceUsd < config.showcaseMinPriceUsd)
  )
    throw new Error(
      'Showcase maximum must be a finite USD amount at least equal to the minimum.',
    );
  const maximumMinor =
    config.showcaseMaxPriceUsd === undefined
      ? Infinity
      : Math.round(config.showcaseMaxPriceUsd * 100);
  return cards.filter(
    (card) =>
      (card.productType === 'raw' || card.productType === 'graded') &&
      card.currency === 'USD' &&
      card.unitPriceMinor !== null &&
      card.unitPriceMinor >= minimumMinor &&
      card.unitPriceMinor <= maximumMinor,
  );
}
