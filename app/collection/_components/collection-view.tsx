'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Empty } from '@/components/ui/empty';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEFAULT_FILTERS,
  type CollectionCard as Card,
  type CollectionFilters,
} from '@/lib/collection/types';
import {
  formatMoney,
  selectCards,
  summarizeCollection,
} from '@/lib/collection/query';
import { CollectionCard } from './collection-card';

const PAGE_SIZE = 48;
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="collection-filter-field">
      <span>{label}</span>
      <Select
        value={value}
        onValueChange={(value) => {
          if (value !== null) onChange(value);
        }}
        items={options}
      >
        <SelectTrigger className="collection-control" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="collection-select-popup">
          {options.map((option) => (
            <SelectItem
              className="collection-select-option"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CollectionView({
  cards,
  snapshotDate,
  isShowcase = false,
}: {
  cards: Card[];
  snapshotDate: string;
  isShowcase?: boolean;
}) {
  const [filters, setFilters] = useState<CollectionFilters>({
    ...DEFAULT_FILTERS,
    sort: 'value-desc',
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const summary = summarizeCollection(cards);
  const filtered = selectCards(cards, filters);
  const filteredSummary = summarizeCollection(filtered);
  const currency = cards[0]?.currency ?? 'USD';
  const setOptions = [...new Set(cards.map((card) => card.set))].sort();
  const activeFilters =
    filters.query !== '' || filters.kind !== 'all' || filters.set !== 'all';
  const unpriced = summary.quantity - summary.pricedQuantity;
  const sealed = cards.filter((card) => card.productType === 'sealed');
  const sealedQuantity = sealed.reduce((sum, card) => sum + card.quantity, 0);
  const raw = cards.filter((card) => card.productType === 'raw');
  const rawQuantity = raw.reduce((sum, card) => sum + card.quantity, 0);
  const unspecified = cards.filter(
    (card) => card.productType === 'unspecified',
  ).length;

  function updateFilters(change: Partial<CollectionFilters>) {
    setFilters((current) => ({ ...current, ...change }));
    setVisibleCount(PAGE_SIZE);
  }
  function resetFilters() {
    setFilters({ ...DEFAULT_FILTERS, sort: 'value-desc' });
    setVisibleCount(PAGE_SIZE);
  }
  return (
    <>
      <section
        className="collection-summary"
        aria-label={
          isShowcase ? 'Showcase summary' : 'Entire collection summary'
        }
      >
        <div className="collection-total">
          <span>
            {isShowcase ? 'Showcase value' : 'Estimated value'} · {currency}
          </span>
          <strong>
            {summary.pricedQuantity
              ? formatMoney(summary.valueMinor, currency)
              : 'Not priced'}
          </strong>
          <p>
            {summary.pricedQuantity} of {summary.quantity} items priced
            {unpriced ? ` · ${unpriced} unpriced` : ''}
          </p>
        </div>
        <div>
          <span>{isShowcase ? 'Showcased cards' : 'Total items'}</span>
          <strong>{summary.quantity.toLocaleString('en-US')}</strong>
          <p>{cards.length} collection entries</p>
        </div>
        <div>
          <span>Graded cards</span>
          <strong>{summary.graded.toLocaleString('en-US')}</strong>
          <p>PSA graded</p>
        </div>
        <div>
          <span>{isShowcase ? 'Ungraded cards' : 'Sealed products'}</span>
          <strong>
            {(isShowcase ? rawQuantity : sealedQuantity).toLocaleString(
              'en-US',
            )}
          </strong>
          <p>{isShowcase ? raw.length : sealed.length} collection entries</p>
        </div>
      </section>

      <div className="collection-toolbar">
        <label className="collection-search collection-filter-field">
          <span>{isShowcase ? 'Search showcase' : 'Search collection'}</span>
          <span className="collection-search-input">
            <Search aria-hidden="true" />
            <Input
              className="collection-control"
              type="search"
              placeholder="Name, set, number…"
              value={filters.query}
              onChange={(event) => updateFilters({ query: event.target.value })}
            />
          </span>
        </label>
        <FilterSelect
          label="Product type"
          value={filters.kind}
          options={[
            { value: 'all', label: isShowcase ? 'All cards' : 'All products' },
            { value: 'graded', label: 'Graded' },
            { value: 'raw', label: 'Raw cards' },
            ...(!isShowcase
              ? [{ value: 'sealed', label: 'Sealed products' }]
              : []),
            ...(unspecified
              ? [{ value: 'unspecified', label: 'Details not listed' }]
              : []),
            ...(!isShowcase ? [{ value: 'unpriced', label: 'Unpriced' }] : []),
          ]}
          onChange={(kind) =>
            updateFilters({ kind: kind as CollectionFilters['kind'] })
          }
        />
        <FilterSelect
          label="Set"
          value={filters.set}
          options={[
            { value: 'all', label: 'All sets' },
            ...setOptions.map((set) => ({ value: set, label: set })),
          ]}
          onChange={(set) => updateFilters({ set })}
        />
        <FilterSelect
          label="Sort by"
          value={filters.sort}
          options={[
            { value: 'name', label: 'Name A–Z' },
            { value: 'value-desc', label: 'Holding value: high to low' },
            { value: 'value-asc', label: 'Holding value: low to high' },
            { value: 'quantity', label: 'Quantity' },
          ]}
          onChange={(sort) =>
            updateFilters({ sort: sort as CollectionFilters['sort'] })
          }
        />
      </div>
      <div className="collection-results" aria-live="polite">
        <p>
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          {activeFilters
            ? ` · ${filteredSummary.quantity} items · ${filteredSummary.pricedQuantity ? formatMoney(filteredSummary.valueMinor, currency) + ' priced subtotal' : 'No priced items'}`
            : ` · Collectr snapshot · ${snapshotDate}`}
        </p>
        {activeFilters && (
          <Button className="collection-button" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length ? (
        <div className="collection-grid">
          {filtered.slice(0, visibleCount).map((card) => (
            <CollectionCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <Empty className="collection-empty">
          <Search aria-hidden="true" />
          <h2>No matching products</h2>
          <p>Try another name or clear the filters.</p>
          <Button className="collection-button" onClick={resetFilters}>
            {isShowcase ? 'Show all showcase cards' : 'Show all products'}
          </Button>
        </Empty>
      )}
      {filtered.length > visibleCount && (
        <div className="collection-more">
          <p>
            Showing {visibleCount} of {filtered.length} entries
          </p>
          <Button
            className="collection-button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            {isShowcase ? 'Show more cards' : 'Show more products'}
          </Button>
        </div>
      )}

      <p className="collection-footnote">
        Prices and artwork from my Collectr export, dated{' '}
        <time dateTime={snapshotDate}>{snapshotDate}</time>. Values are per-item
        snapshots, not live quotes. Identical holdings are grouped by quantity;
        different conditions and grades stay separate.
      </p>
      {unspecified > 0 && (
        <p className="collection-footnote">
          {unspecified} card entries have no condition or grading details in the
          PDF. These are marked “Details not listed” and are not counted as raw
          or graded.
        </p>
      )}
    </>
  );
}
