import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { importCollectionCsv } from '../lib/collection/import.ts';
import { formatMoney, summarizeCollection } from '../lib/collection/query.ts';
import { collectionConfig } from '../data/collection-config.ts';
import { selectPublishedCards } from '../lib/collection/showcase.ts';

// Functional HTTP smoke check. Point at the running development or production server.
const origin = process.argv[2] ?? 'http://localhost:3000';
const data = importCollectionCsv(
  readFileSync(new URL('../data/collection.csv', import.meta.url), 'utf8'),
);
assert.ok(data.ok);
if (!data.ok) process.exit(1);
const publishedCards = selectPublishedCards(data.cards, collectionConfig);
const totals = summarizeCollection(publishedCards);
for (const path of [
  '/',
  '/projects',
  '/experience',
  '/research-teaching',
  '/collection',
]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} should render`);
  const html = await response.text();
  assert.match(
    html,
    /href="\/collection"/,
    'Every route links to the collection',
  );
  if (path === '/collection') {
    assert.ok(
      html.includes('Collection — Joshua Lu'),
      'Collection metadata renders',
    );
    assert.ok(
      html.includes(
        totals.pricedQuantity
          ? formatMoney(totals.valueMinor, data.cards[0].currency)
          : 'Not priced',
      ),
      'Server-rendered total matches the published subset',
    );
    assert.ok(
      !html.includes('Preview CSV'),
      'CSV preview controls have been removed',
    );
    assert.ok(!html.includes('CSV tools'), 'CSV tools have been removed');
    if (collectionConfig.showcaseOnly) {
      assert.ok(
        html.includes('Collection showcase'),
        'Showcase heading renders',
      );
      assert.ok(
        html.includes('Showcase value'),
        'Totals are explicitly scoped to the showcase',
      );
      assert.ok(
        !html.includes('Bombirdier'),
        'Hidden cards are absent from HTML and serialized client data',
      );
      assert.deepEqual(
        publishedCards,
        data.cards,
        'The source itself contains only showcase cards',
      );
      const attempt = await fetch(
        new URL('/collection?showcaseOnly=false&minPrice=0', origin),
      );
      assert.equal(attempt.status, 200);
      assert.ok(
        !(await attempt.text()).includes('Bombirdier'),
        'URL parameters cannot disable the internal showcase setting',
      );
    } else {
      assert.ok(
        html.includes('Sealed products'),
        'Sealed products are labeled separately',
      );
    }
    assert.ok(html.includes('Graded cards'), 'Graded summary renders');
    assert.ok(html.includes('PSA'), 'Real grading details render');
    if (totals.pricedQuantity < totals.quantity) {
      assert.ok(
        html.includes('Unpriced'),
        'Unpriced card is not rendered as zero',
      );
    }
    const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.ok(scripts.length > 0, 'Hydration scripts are present');
    for (const script of scripts) {
      const asset = await fetch(
        new URL(script.replaceAll('&amp;', '&'), origin),
      );
      assert.equal(asset.status, 200, `Client script is served: ${script}`);
    }
    const imagePaths: string[] = [
      ...new Set(publishedCards.map((card) => card.imageUrl)),
    ];
    let nextImage = 0;
    await Promise.all(
      Array.from({ length: 8 }, async () => {
        while (nextImage < imagePaths.length) {
          const imagePath = imagePaths[nextImage++];
          const image: Response = await fetch(new URL(imagePath, origin));
          assert.equal(
            image.status,
            200,
            `Collection image is served: ${imagePath}`,
          );
          // Sites may serve static WebP files as application/octet-stream.
          // Verify the actual image bytes instead of relying on its MIME label.
          const bytes = Buffer.from(await image.arrayBuffer());
          assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', imagePath);
          assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', imagePath);
          assert.ok(
            bytes.equals(
              readFileSync(new URL('../public' + imagePath, import.meta.url)),
            ),
            `Published image matches source: ${imagePath}`,
          );
        }
      }),
    );
    console.info(`PASS all ${imagePaths.length} collection images`);
  }
  console.info(`PASS ${path}`);
}
