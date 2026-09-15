import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { importCollectionCsv } from '../lib/collection/import.ts';
import { selectCards, summarizeCollection } from '../lib/collection/query.ts';
import { DEFAULT_FILTERS } from '../lib/collection/types.ts';
import { parseCsv } from '../lib/collection/csv.ts';
import { selectPublishedCards } from '../lib/collection/showcase.ts';
import { collectionConfig } from '../data/collection-config.ts';

const source = readFileSync(
  new URL('../data/collection.csv', import.meta.url),
  'utf8',
);
const result = importCollectionCsv(source);
if (!result.ok) throw new Error(result.errors.join('\n'));
const cards = result.cards;

test('public showcase uses the inclusive $500–$2000 per-copy range', () => {
  assert.equal(collectionConfig.showcaseOnly, true);
  assert.equal(collectionConfig.showcaseMinPriceUsd, 500);
  assert.equal(collectionConfig.showcaseMaxPriceUsd, 2000);
  const base = { ...cards[0], quantity: 1, productType: 'raw' as const };
  const fixtures = [
    { ...base, id: 'below', unitPriceMinor: 49999, quantity: 10 },
    { ...base, id: 'exact', unitPriceMinor: 50000 },
    { ...base, id: 'above', unitPriceMinor: 50001 },
    { ...base, id: 'maximum', unitPriceMinor: 200000, quantity: 2 },
    { ...base, id: 'over-maximum', unitPriceMinor: 200001 },
    {
      ...base,
      id: 'graded-over-maximum',
      productType: 'graded' as const,
      unitPriceMinor: 200001,
    },
    {
      ...base,
      id: 'graded',
      productType: 'graded' as const,
      unitPriceMinor: 50000,
    },
  ];
  assert.deepEqual(
    selectPublishedCards(fixtures, collectionConfig).map((card) => card.id),
    ['exact', 'above', 'maximum', 'graded'],
  );
  const published = selectPublishedCards(cards, collectionConfig);
  assert.ok(published.length > 0);
  assert.ok(
    published.every(
      (card) =>
        card.unitPriceMinor !== null &&
        card.unitPriceMinor >= 50000 &&
        card.unitPriceMinor <= 200000,
    ),
  );
});

test('showcase maximum rejects invalid or reversed ranges', () => {
  for (const amount of [-1, 499, NaN, Infinity]) {
    assert.throws(
      () =>
        selectPublishedCards(cards, {
          showcaseOnly: true,
          showcaseMinPriceUsd: 500,
          showcaseMaxPriceUsd: amount,
        }),
      /Showcase maximum/,
    );
  }
});

test('showcase cutoff is inclusive, per copy, and limited to priced USD cards', () => {
  const base = { ...cards[0], quantity: 1, productType: 'raw' as const };
  const fixtures = [
    { ...base, id: 'below', unitPriceMinor: 9999, quantity: 10 },
    { ...base, id: 'exact', unitPriceMinor: 10000 },
    { ...base, id: 'above', unitPriceMinor: 10001 },
    {
      ...base,
      id: 'graded',
      productType: 'graded' as const,
      unitPriceMinor: 10000,
    },
    {
      ...base,
      id: 'sealed',
      productType: 'sealed' as const,
      unitPriceMinor: 100000,
    },
    { ...base, id: 'unknown', unitPriceMinor: null },
    { ...base, id: 'other-currency', currency: 'JPY', unitPriceMinor: 10000 },
  ];
  const before = structuredClone(fixtures);
  assert.deepEqual(
    selectPublishedCards(fixtures, {
      showcaseOnly: true,
      showcaseMinPriceUsd: 100,
    }).map((card) => card.id),
    ['exact', 'above', 'graded'],
  );
  assert.deepEqual(fixtures, before);
});
test('the source contains only showcased cards, even with filtering disabled', () => {
  assert.deepEqual(selectPublishedCards(cards, collectionConfig), cards);
  assert.deepEqual(selectPublishedCards(cards, { ...collectionConfig, showcaseOnly: false }), cards);
});
test('showcase minimum is configurable and rejects invalid thresholds', () => {
  assert.equal(
    selectPublishedCards(cards, {
      showcaseOnly: true,
      showcaseMinPriceUsd: 1000000,
    }).length,
    0,
  );
  for (const amount of [-1, NaN, Infinity]) {
    assert.throws(
      () =>
        selectPublishedCards(cards, {
          showcaseOnly: true,
          showcaseMinPriceUsd: amount,
        }),
      /nonnegative USD/,
    );
  }
});

// Public-only snapshot: no non-showcased inventory belongs in this checkout.
test('showcase imports without warnings and preserves its 19 cards and total', () => {
  assert.equal(cards.length, 19);
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(summarizeCollection(cards), {
    quantity: 19, graded: 6, pricedQuantity: 19, valueMinor: 1626211,
  });
});
test('showcase keeps 13 raw cards and six PSA-graded cards, with no sealed stock', () => {
  assert.equal(selectCards(cards, { ...DEFAULT_FILTERS, kind: 'raw' }).length, 13);
  const graded = selectCards(cards, { ...DEFAULT_FILTERS, kind: 'graded' });
  assert.equal(graded.length, 6);
  assert.ok(graded.every(card => card.gradingCompany === 'PSA'));
  assert.deepEqual(graded.filter(card => card.grade !== '10').map(card => [card.name, card.grade]),
    [['Xerneas EX (146 Full Art)', '9']]);
  assert.ok(cards.every(card => ['raw', 'graded'].includes(card.productType)));
});
test('only the 17 referenced WebP artworks remain in the public collection directory', () => {
  const images = new Set(cards.map(card => card.imageUrl));
  assert.equal(images.size, 17);
  assert.deepEqual(
    readdirSync(new URL('../public/collection', import.meta.url)).sort(),
    [...images].map(path => path.split('/').at(-1)).sort(),
  );
  for (const path of images) {
    assert.match(path, /^\/collection\/collectr-(all-)?\d+\.webp$/);
    const bytes = readFileSync(new URL('../public' + path, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
  }
});
test('raw and graded copies are not merged', () => {
  for (const name of ['Lugia V (Alternate Full Art)', 'Mew ex (JP)']) {
    const copies = cards.filter(card => card.name === name);
    assert.equal(copies.length, 2);
    assert.deepEqual(copies.map(card => card.productType).sort(), ['graded', 'raw']);
    assert.ok(copies.every(card => card.quantity === 1));
  }
});
test('retained prices and provenance use the original snapshot', () => {
  assert.ok(cards.every(card => card.pricedAt === '2026-09-06' && card.currency === 'USD'));
  const [headers, ...rows] = parseCsv(source);
  assert.ok(rows.every(row => row[headers.indexOf('source_entries')] === '1'));
});
