import type { CollectionCard, CollectionFilters } from './types.ts';
import { currencyDigits } from './import.ts';

export function summarizeCollection(cards: CollectionCard[]) {
  return cards.reduce(
    (summary, card) => {
      summary.quantity += card.quantity;
      if (card.gradingCompany) summary.graded += card.quantity;
      if (card.unitPriceMinor !== null) {
        summary.pricedQuantity += card.quantity;
        summary.valueMinor += card.unitPriceMinor * card.quantity;
      }
      return summary;
    },
    { quantity: 0, graded: 0, pricedQuantity: 0, valueMinor: 0 },
  );
}

export function formatMoney(minor: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: currencyDigits(currency),
    maximumFractionDigits: currencyDigits(currency),
  }).format(minor / 10 ** currencyDigits(currency));
}

export function selectCards(
  cards: CollectionCard[],
  filters: CollectionFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase('en-US');
  return cards
    .filter((card) => {
      const haystack = [
        card.name,
        card.set,
        card.number,
        card.language,
        card.variant,
        card.condition,
        card.gradingCompany,
        card.grade,
      ]
        .join(' ')
        .toLocaleLowerCase('en-US');
      return (
        (!query || haystack.includes(query)) &&
        (filters.set === 'all' || card.set === filters.set) &&
        (filters.kind === 'all' ||
          filters.kind === card.productType ||
          (filters.kind === 'unpriced' && card.unitPriceMinor === null))
      );
    })
    .sort((a, b) => {
      if (filters.sort === 'quantity')
        return b.quantity - a.quantity || a.name.localeCompare(b.name, 'en');
      if (filters.sort === 'value-asc' || filters.sort === 'value-desc') {
        // Unknown prices always sort last, never as zero-dollar cards.
        if (a.unitPriceMinor === null && b.unitPriceMinor !== null) return 1;
        if (b.unitPriceMinor === null && a.unitPriceMinor !== null) return -1;
        const difference =
          (a.unitPriceMinor ?? 0) * a.quantity -
          (b.unitPriceMinor ?? 0) * b.quantity;
        if (difference)
          return filters.sort === 'value-desc' ? -difference : difference;
      }
      return (
        a.name.localeCompare(b.name, 'en') || a.set.localeCompare(b.set, 'en')
      );
    });
}
