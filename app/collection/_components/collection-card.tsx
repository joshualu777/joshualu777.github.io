'use client';

import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { CollectionCard as Card } from '@/lib/collection/types';
import { formatMoney } from '@/lib/collection/query';

export function CollectionCard({ card }: { card: Card }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="collection-card">
      <div className="collection-card-art">
        {card.imageUrl && !imageFailed ? (
          <img
            src={card.imageUrl}
            alt={`${card.name}, ${card.set}, ${card.number}`}
            width={734}
            height={1024}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="collection-image-fallback">
            <ImageOff aria-hidden="true" />
            <span>Image unavailable</span>
            <span>{card.name}</span>
          </div>
        )}
      </div>
      <div className="collection-card-info">
        <div className="collection-card-badges">
          <span
            className={card.gradingCompany ? 'card-grade' : 'card-condition'}
          >
            {card.gradingCompany
              ? `${card.gradingCompany} ${card.grade}`
              : card.productType === 'sealed'
                ? 'Sealed product'
                : card.productType === 'unspecified'
                  ? 'Details not listed'
                  : `Raw · ${card.condition}`}
          </span>
          <span className="card-quantity">×{card.quantity}</span>
        </div>
        <h2>{card.name}</h2>
        <p className="collection-card-set">
          {card.set}
          {card.number ? ` · ${card.number}` : ''}
        </p>
        <p className="collection-card-variant">
          {[card.language, card.variant].filter(Boolean).join(' · ')}
        </p>
        <dl className="collection-card-prices">
          <div>
            <dt>{card.productType === 'sealed' ? 'Per item' : 'Per card'}</dt>
            <dd>
              {card.unitPriceMinor === null
                ? 'Unpriced'
                : formatMoney(card.unitPriceMinor, card.currency)}
            </dd>
          </div>
          <div>
            <dt>Holding value</dt>
            <dd>
              {card.unitPriceMinor === null
                ? '—'
                : formatMoney(
                    card.unitPriceMinor * card.quantity,
                    card.currency,
                  )}
            </dd>
          </div>
        </dl>
        <p className="collection-card-date">
          {card.unitPriceMinor === null ? (
            'Excluded from estimated value'
          ) : card.pricedAt ? (
            <>
              As of <time dateTime={card.pricedAt}>{card.pricedAt}</time>
            </>
          ) : (
            'Price date not provided'
          )}
        </p>
      </div>
    </article>
  );
}
