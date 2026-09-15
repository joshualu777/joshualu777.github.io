import { parseCsv } from './csv.ts';
import type { CollectionCard, ImportResult } from './types.ts';

const REQUIRED = [
  'card_name',
  'set',
  'card_number',
  'quantity',
  'unit_price',
  'currency',
];
const OPTIONAL = [
  'product_type',
  'rarity',
  'source_page',
  'source_entries',
  'source_url',
  'language',
  'variant',
  'condition',
  'grading_company',
  'grade',
  'priced_at',
  'image_url',
];
const CURRENCIES = new Set([
  'USD',
  'CAD',
  'EUR',
  'GBP',
  'AUD',
  'JPY',
  'CHF',
  'HKD',
  'SGD',
  'CNY',
]);

export function currencyDigits(currency: string) {
  return currency === 'JPY' ? 0 : 2;
}

/** No server fetches: only safe image locations are passed to the browser. */
export function isSafeImageUrl(value: string): boolean {
  if (
    /^\/[^/\\]/.test(value) &&
    !value.includes('\\') &&
    !/[\u0000-\u0020]/.test(value)
  )
    return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/** Atomic import: invalid rows reject the file, rather than silently losing holdings. */
export function importCollectionCsv(text: string): ImportResult {
  let rows: string[][];
  try {
    rows = parseCsv(text);
  } catch (error) {
    return {
      ok: false,
      errors: [
        error instanceof Error ? error.message : 'Could not read the CSV.',
      ],
    };
  }
  if (rows.length < 2)
    return { ok: false, errors: ['Add a header row and at least one card.'] };
  const headers = rows[0].map((header) =>
    header.toLowerCase().replace(/[\s-]+/g, '_'),
  );
  const missing = REQUIRED.filter((header) => !headers.includes(header));
  if (missing.length)
    return { ok: false, errors: [`Missing columns: ${missing.join(', ')}.`] };
  if (new Set(headers).size !== headers.length)
    return { ok: false, errors: ['Column names must be unique.'] };

  const errors: string[] = [];
  const warnings: string[] = [];
  const unknown = headers.filter(
    (header) => !REQUIRED.includes(header) && !OPTIONAL.includes(header),
  );
  if (unknown.length) warnings.push(`Unused columns: ${unknown.join(', ')}.`);
  const cards: CollectionCard[] = [];

  rows.slice(1).forEach((values, index) => {
    const label = `Record ${index + 2}`;
    const fail = (message: string) => errors.push(`${label}: ${message}`);
    if (values.length !== headers.length) {
      fail(
        `expected ${headers.length} fields, found ${values.length}. Check commas and quotes.`,
      );
      return;
    }
    if (values.some((value) => value.length > 2048)) {
      fail('a field is longer than 2,048 characters.');
      return;
    }
    const record = Object.fromEntries(
      headers.map((header, i) => [header, values[i]]),
    );
    const value = (key: string) => record[key] ?? '';
    const inferredType = value('grading_company')
      ? 'graded'
      : value('condition')
        ? 'raw'
        : 'unspecified';
    const productType = (value('product_type') ||
      inferredType) as CollectionCard['productType'];
    if (!['raw', 'graded', 'sealed', 'unspecified'].includes(productType))
      fail('product_type must be raw, graded, sealed, or unspecified.');
    for (const key of ['card_name', 'set']) {
      if (!value(key)) fail(`${key} is required.`);
    }
    if (productType !== 'sealed' && !value('card_number'))
      fail('card_number is required for cards.');
    const quantity = Number(value('quantity'));
    if (!/^\d+$/.test(value('quantity')) || quantity < 1 || quantity > 1000)
      fail('quantity must be a whole number from 1 to 1,000.');
    const currency = value('currency').toUpperCase();
    if (!CURRENCIES.has(currency))
      fail(
        'currency must be USD, CAD, EUR, GBP, AUD, JPY, CHF, HKD, SGD, or CNY.',
      );
    let unitPriceMinor: number | null = null;
    const price = value('unit_price');
    if (price !== '') {
      const digits = currencyDigits(currency);
      const pattern = digits === 0 ? /^\d+$/ : /^\d+(\.\d{1,2})?$/;
      if (!pattern.test(price) || Number(price) > 1000000)
        fail(
          `unit_price must be a nonnegative number up to 1,000,000 with at most ${digits} decimal places; omit currency symbols and thousands separators.`,
        );
      else {
        const [whole, decimal = ''] = price.split('.');
        unitPriceMinor =
          Number(whole) * 10 ** digits + Number(decimal.padEnd(digits, '0'));
      }
    }
    const gradingCompany = value('grading_company').toUpperCase();
    const grade = value('grade');
    if (productType === 'graded' && !gradingCompany)
      fail('graded cards require grading_company and grade.');
    if (productType !== 'graded' && (gradingCompany || grade))
      fail('grading details require product_type graded.');
    if (Boolean(gradingCompany) !== Boolean(grade))
      fail(
        'provide both grading_company and grade, or leave both blank for a raw card.',
      );
    if (grade && !/^(?:[1-9](?:\.5)?|10)$/.test(grade))
      fail('grade must be from 1 to 10 in half-point increments.');
    const pricedAt = value('priced_at');
    if (pricedAt && !validDate(pricedAt))
      fail('priced_at must be a real date in YYYY-MM-DD format.');
    const imageUrl = value('image_url');
    if (imageUrl && !isSafeImageUrl(imageUrl))
      fail(
        'image_url must be an HTTPS URL or a local path beginning with a single /.',
      );
    cards.push({
      id: `card-${index + 1}`,
      productType,
      name: value('card_name'),
      set: value('set'),
      number: value('card_number'),
      language: value('language') || 'Not specified',
      variant: value('variant'),
      quantity,
      condition: value('condition') || 'Not specified',
      gradingCompany,
      grade,
      unitPriceMinor,
      currency,
      pricedAt,
      imageUrl,
    });
  });
  if (new Set(cards.map((card) => card.currency)).size > 1)
    errors.push(
      'Use one currency per CSV. Prices are not converted between currencies.',
    );
  if (errors.length) return { ok: false, errors };
  const noImages = cards.filter((card) => !card.imageUrl).length;
  if (noImages)
    warnings.push(
      `${noImages} ${noImages === 1 ? 'entry has' : 'entries have'} no image URL; a labeled placeholder will be shown.`,
    );
  return { ok: true, cards, warnings };
}
