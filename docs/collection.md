# Collection

The public collection is driven by `data/collection.csv`. The page is read-only:
the CSV upload, preview and download tools have been removed at Joshua's request.
No pricing subscription, API key, database or automated price updates are used.

## Public showcase setting

In `data/collection-config.ts`, `showcaseOnly: true` publishes only raw or graded
cards priced from `showcaseMinPriceUsd: 500` to `showcaseMaxPriceUsd: 2000` USD
**per copy**, including exactly $500 and $2,000. Sealed items and unpriced cards
are excluded. This setting is an additional safeguard, not a private inventory store.
The CSV itself contains only showcase cards. Disabling the filter or changing its
limits cannot restore removed records. Rebuild and publish after changes.

Filtering happens before passing records to the browser, so search, filters,
pagination and totals operate only on the showcase.

## Current showcase snapshot

Prices are from the September 6, 2026 Collectr PDF snapshot supplied by Joshua.
The source contains 19 holdings / 19 cards: 13 raw and 6 graded, totaling
**$16,262.11 USD**. Five graded cards are PSA 10; Xerneas EX (146 Full Art) is PSA 9.
There are 17 unique product artworks under `public/collection/`; raw and graded
copies may share artwork but remain separate holdings. Images depict product
artwork, not photos or authentication of the actual slabs.

Only records already shown in the $500–$2,000-per-copy showcase are retained.
Non-showcased records and unused collection artwork were removed from the current
source tree. A private recovery copy is kept outside this project.

**Publication caution:** older Git commits and previous deployments may retain
earlier data. Before creating a public repository, use a reviewed clean snapshot
with fresh history; do not push this repository's existing history or outside
backup folders. This cleanup does not retract previously published information.

Provenance columns `source_page`, `source_entries` and `source_url` refer to the
original source. Prices, quantities, condition, grading and card identifiers are
preserved unchanged. Only exact identical holdings may be grouped; raw and graded
copies, different conditions, grades, finishes or recorded prices stay separate.

## Updating the collection

1. Update `data/collection.csv` with only cards intended for public display; use UTF-8 CSV.
2. Set `snapshotDate` in `data/collection-config.ts`.
3. Update the source snapshot notes and expectations in `tests/collection-real.test.ts`.
4. Run `pnpm test:collection`, `pnpm validate:collection`, and `pnpm build`.
5. Deploy to the selected hosting provider. CSV edits do not go live until deployed.

## CSV columns and validation

Required headers: `card_name, set, card_number, quantity, unit_price, currency`.
Optional: `language, variant, condition, grading_company, grade, priced_at,
image_url, product_type, rarity, source_page, source_url, source_entries`.

- Preserve card numbers as text, including leading zeros and printed denominators.
  Sealed products may have a blank card number.
- `product_type`: raw, graded, sealed or unspecified. Omitted values infer graded
  from grading details, raw from condition, and unspecified otherwise.
- Quantity is an integer from 1 to 1,000. Only exact matches are grouped; quantities are summed.
- Price is the per-copy value for its specified grade/condition. Blank means unknown,
  not zero. No condition/grade adjustments are computed.
- Use one currency per file: USD, CAD, EUR, GBP, AUD, JPY, CHF, HKD, SGD or CNY.
  JPY uses whole yen; others allow up to two decimal places. No FX conversion.
- Graded entries require company and grade (1–10 in half-point increments).
  Sealed/raw entries must not contain grading details.
- Dates use YYYY-MM-DD. Missing dates and missing prices remain explicitly labeled.
- Images use HTTPS addresses or published local paths. Nothing proxies remote URLs.
- Text is rendered as text, never HTML. Limits: 2 MB / 5,000 entries.
  Invalid rows block publication instead of silently dropping holdings.

Totals use integer minor currency units. The main summary always covers the entire
showcase; filters show a separate priced subtotal. Unpriced items sort last.
The gallery displays 48 entries initially and loads additional batches on request.

## Code organization and verification

- `lib/collection/csv.ts`: tokenizer and resource limits.
- `lib/collection/import.ts`: validation and normalization.
- `lib/collection/types.ts`: shared model and filter types.
- `lib/collection/query.ts`: pure filtering, sorting, formatting and aggregation.
- `app/collection/page.tsx`: server source loading and metadata.
- `app/collection/_components/`: read-only gallery and product display.
- `app/collection/collection.css`: scoped styling using the site's existing theme.
- `scripts/validate-collection.ts`: runs before every production build.
- `scripts/check-collection-http.ts`: route, total, image and client-script checks.
- `tests/collection.test.ts`: parser, arithmetic and filtering tests.
- `tests/fixtures/collection-demo.csv`: original fixed dummy test fixture, not public data.
- `tests/collection-real.test.ts`: real snapshot reconciliation, grades, stock, images.

The original dummy fixture remains only for regression tests; it is not shown publicly.
