
import React from 'react';
import type { GeneratedAd } from '../types';
import { AdCard } from './AdCard';

interface AdGalleryProps {
  ads: GeneratedAd[];
}

export const AdGallery: React.FC<AdGalleryProps> = ({ ads }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};
