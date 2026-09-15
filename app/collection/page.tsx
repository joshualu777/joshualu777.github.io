import type { Metadata } from 'next';
import csv from '@/data/collection.csv?raw';
import { collectionConfig } from '@/data/collection-config';
import { importCollectionCsv } from '@/lib/collection/import';
import { selectPublishedCards } from '@/lib/collection/showcase';
import { CollectionView } from './_components/collection-view';
import './collection.css';

export const metadata: Metadata = {
  title: 'Collection — Joshua Lu',
  description: collectionConfig.showcaseOnly
    ? 'A showcase of selected Pokémon cards from my collection.'
    : 'Pokémon cards, collection details, and manually recorded values.',
};

export default function CollectionPage() {
  const result = importCollectionCsv(csv);
  if (!result.ok)
    throw new Error(`Invalid collection CSV: ${result.errors.join(' ')}`);
  return (
    <main id="main" className="page-content collection-page">
      <header className="page-intro">
        <h1>
          {collectionConfig.showcaseOnly ? 'Collection showcase' : 'Collection'}
        </h1>
        <p>
          {collectionConfig.showcaseOnly
            ? 'Outside of work and school, I enjoy collecting Pokémon cards—here are a few highlights from my collection.'
            : 'My Pokémon cards and sealed collection.'}
        </p>
      </header>
      <CollectionView
        cards={selectPublishedCards(result.cards, collectionConfig)}
        snapshotDate={collectionConfig.snapshotDate}
        isShowcase={collectionConfig.showcaseOnly}
      />
    </main>
  );
}
