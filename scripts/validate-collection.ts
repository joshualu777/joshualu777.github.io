import { readFileSync } from 'node:fs';
import { importCollectionCsv } from '../lib/collection/import.ts';
import { summarizeCollection } from '../lib/collection/query.ts';

const path = new URL('../data/collection.csv', import.meta.url);
const result = importCollectionCsv(readFileSync(path, 'utf8'));
if (!result.ok) {
  console.error(
    'Collection CSV validation failed:\n' + result.errors.join('\n'),
  );
  process.exitCode = 1;
} else {
  const totals = summarizeCollection(result.cards);
  console.info(
    `Collection validated: ${result.cards.length} entries, ${totals.quantity} items, ${totals.pricedQuantity} priced.`,
  );
  for (const warning of result.warnings) console.warn(warning);
}
