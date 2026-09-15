import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv, MAX_CARDS, MAX_CSV_BYTES } from '../lib/collection/csv.ts';
import {
  importCollectionCsv,
  isSafeImageUrl,
} from '../lib/collection/import.ts';
import {
  formatMoney,
  selectCards,
  summarizeCollection,
} from '../lib/collection/query.ts';
import { DEFAULT_FILTERS } from '../lib/collection/types.ts';

const demo = readFileSync(
  new URL('./fixtures/collection-demo.csv', import.meta.url),
  'utf8',
);
const headers =
  'card_name,set,card_number,quantity,unit_price,currency,grading_company,grade,priced_at,image_url';
const row = [
  'Pikachu',
  'Base Set',
  '58/102',
  '2',
  '0.10',
  'USD',
  '',
  '',
  '2026-09-01',
  '',
];
function csv(changes: Record<number, string> = {}) {
  const cells = row.map((value, i) => changes[i] ?? value);
  return (
    headers +
    '\n' +
    cells.map((value) => '"' + value.replaceAll('"', '""') + '"').join(',')
  );
}
function valid(text: string) {
  const result = importCollectionCsv(text);
  assert.equal(result.ok, true, JSON.stringify(result));
  if (!result.ok) throw new Error('Unexpected invalid fixture');
  return result;
}
function invalid(text: string, message: RegExp) {
  const result = importCollectionCsv(text);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.errors.join(' '), message);
}

test('dummy CSV: six entries, nine cards, two graded, eight priced; $503.75 total', () => {
  const { cards } = valid(demo);
  assert.equal(cards.length, 6);
  assert.deepEqual(summarizeCollection(cards), {
    quantity: 9,
    graded: 2,
    pricedQuantity: 8,
    valueMinor: 50375,
  });
  assert.equal(formatMoney(50375, 'USD'), '$503.75');
});
test('CSV supports BOM, CRLF, commas, escaped quotes, multiline cells, and blank lines', () => {
  assert.deepEqual(
    parseCsv('\uFEFFa,b\r\n"a,b","a ""quote""\nnext line"\r\n\r\n'),
    [
      ['a', 'b'],
      ['a,b', 'a "quote"\nnext line'],
    ],
  );
});
test('trailing empty field and final record without newline are preserved', () => {
  assert.deepEqual(parseCsv('a,b,c\n1,2,'), [
    ['a', 'b', 'c'],
    ['1', '2', ''],
  ]);
});
test('unterminated and stray quotes are rejected', () => {
  assert.throws(() => parseCsv('a\n"unfinished'), /closing quote/);
  assert.throws(() => parseCsv('a\na"b'), /Unexpected quote/);
  assert.throws(() => parseCsv('a\n"a"b'), /closing quote/);
});
test('empty CSV and header-only CSV are rejected', () => {
  invalid('', /at least one card/);
  invalid(headers, /at least one card/);
});
test('headers are case insensitive and support spaces, but duplicates and missing columns fail', () => {
  valid(csv().replace('card_name', 'Card Name'));
  invalid(csv().replace('card_name', 'name'), /Missing columns/);
  invalid(csv().replace('image_url', 'grade'), /unique/);
});
test('wrong field counts and blank names fail atomically', () => {
  invalid(csv() + '\nPikachu,Base', /expected 10 fields/);
  invalid(csv({ 0: '' }), /card_name is required/);
});
test('leading zero card numbers, Unicode and quoted names survive import', () => {
  const { cards } = valid(csv({ 0: 'ピカチュウ, "special"', 2: '001' }));
  assert.equal(cards[0].name, 'ピカチュウ, "special"');
  assert.equal(cards[0].number, '001');
});
test('money uses integer minor units, avoiding floating point errors', () => {
  const { cards } = valid(csv({ 3: '3' }));
  assert.equal(summarizeCollection(cards).valueMinor, 30);
});
test('missing prices are null; explicit zero is priced', () => {
  assert.equal(valid(csv({ 4: '' })).cards[0].unitPriceMinor, null);
  assert.equal(
    summarizeCollection(valid(csv({ 4: '' })).cards).pricedQuantity,
    0,
  );
  assert.equal(
    summarizeCollection(valid(csv({ 4: '0' })).cards).pricedQuantity,
    2,
  );
});
for (const quantity of ['0', '-1', '1.5', 'abc', '', '1001', '1e2']) {
  test(`invalid quantity ${JSON.stringify(quantity)} is rejected`, () =>
    invalid(csv({ 3: quantity }), /quantity/));
}
for (const price of [
  '-1',
  'NaN',
  'Infinity',
  '1.001',
  '$10',
  '1,000',
  '1e3',
  '1000001',
]) {
  test(`invalid price ${JSON.stringify(price)} is rejected`, () =>
    invalid(csv({ 4: price }), /unit_price/));
}
test('mixed currencies are rejected rather than added or converted', () => {
  invalid(csv() + '\n' + csv({ 5: 'EUR' }).split('\n')[1], /one currency/);
  invalid(csv({ 5: 'XYZ' }), /currency must/);
});
test('JPY uses whole yen and other supported currencies use two decimals', () => {
  const card = valid(csv({ 4: '1200', 5: 'JPY' })).cards[0];
  assert.equal(card.unitPriceMinor, 1200);
  assert.equal(formatMoney(1200, 'JPY'), '¥1,200');
  invalid(csv({ 4: '1.50', 5: 'JPY' }), /0 decimal places/);
  assert.equal(valid(csv({ 5: 'cad' })).cards[0].currency, 'CAD');
});
test('grading company and grade must be paired; valid half grades are retained', () => {
  invalid(csv({ 6: 'PSA' }), /both grading_company and grade/);
  invalid(csv({ 7: '10' }), /both grading_company and grade/);
  invalid(csv({ 6: 'PSA', 7: '11' }), /grade must/);
  invalid(csv({ 6: 'BGS', 7: '9.2' }), /grade must/);
  const card = valid(csv({ 6: 'bgs', 7: '9.5' })).cards[0];
  assert.equal(card.gradingCompany, 'BGS');
  assert.equal(card.grade, '9.5');
});
test('dates must be real ISO calendar dates', () => {
  valid(csv({ 8: '2024-02-29' }));
  for (const date of ['2025-02-29', '2026-09-31', '09/01/2026'])
    invalid(csv({ 8: date }), /real date/);
});
test('image URLs cannot execute scripts, embed data, or use insecure schemes', () => {
  for (const url of [
    'javascript:alert(1)',
    'data:image/svg+xml,test',
    'http://example.com/a.png',
    '//example.com/a.png',
    '/\\example.com/a.png',
    'https://user:pass@example.com/a.png',
  ]) {
    assert.equal(isSafeImageUrl(url), false);
    invalid(csv({ 9: url }), /image_url/);
  }
  assert.equal(
    isSafeImageUrl('https://images.pokemontcg.io/svp/52_hires.png'),
    true,
  );
  assert.equal(isSafeImageUrl('/collection/pikachu.png'), true);
});
test('missing images and unused columns produce warnings without losing records', () => {
  assert.match(valid(csv()).warnings.join(' '), /no image URL/);
  assert.match(
    valid(csv().replace('image_url', 'notes')).warnings.join(' '),
    /Unused columns: notes/,
  );
});
test('identical rows remain separate holdings with stable unique IDs', () => {
  const cards = valid(csv() + '\n' + csv().split('\n')[1]).cards;
  assert.notEqual(cards[0].id, cards[1].id);
  assert.equal(summarizeCollection(cards).quantity, 4);
});
test('search, set, raw, graded and unpriced filters compose correctly', () => {
  const { cards } = valid(demo);
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, query: 'PIKACHU' })[0].quantity,
    2,
  );
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, kind: 'graded' }).length,
    2,
  );
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, kind: 'raw' }).length,
    4,
  );
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, kind: 'unpriced' })[0].name,
    'Mewtwo',
  );
  assert.equal(
    selectCards(cards, {
      ...DEFAULT_FILTERS,
      set: 'Fusion Strike',
      kind: 'raw',
    }).length,
    0,
  );
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, query: 'nonexistent' }).length,
    0,
  );
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, query: 'BGS 9.5' })[0].name,
    'Gengar VMAX',
  );
});
test('sort uses holding value, puts unpriced last, and never mutates the original', () => {
  const { cards } = valid(demo);
  const original = cards.map((card) => card.id);
  const asc = selectCards(cards, { ...DEFAULT_FILTERS, sort: 'value-asc' });
  assert.equal(asc[0].name, 'Bulbasaur');
  assert.equal(asc.at(-1)?.name, 'Mewtwo');
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, sort: 'value-desc' })[0].name,
    'Charizard ex',
  );
  assert.equal(
    selectCards(cards, { ...DEFAULT_FILTERS, sort: 'quantity' })[0].name,
    'Eevee',
  );
  assert.deepEqual(
    cards.map((card) => card.id),
    original,
  );
});
test('empty filtered summary is safe', () => {
  assert.deepEqual(summarizeCollection([]), {
    quantity: 0,
    graded: 0,
    pricedQuantity: 0,
    valueMinor: 0,
  });
});
test('bounded file, row and field sizes prevent oversized imports', () => {
  invalid('x'.repeat(MAX_CSV_BYTES + 1), /2 MB/);
  invalid('a\n' + 'x\n'.repeat(MAX_CARDS + 1), /5,000/);
  invalid(csv({ 0: 'x'.repeat(2049) }), /2,048/);
});
