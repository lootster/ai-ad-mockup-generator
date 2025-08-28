
import React from 'react';
import type { GeneratedAd } from '../types';
import { SpinnerIcon } from './icons';

interface AdCardProps {
  ad: GeneratedAd;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="aspect-video bg-slate-700 flex items-center justify-center relative">
        {ad.isLoading && (
          <div className="flex flex-col items-center text-slate-400">
            <SpinnerIcon className="w-8 h-8 animate-spin" />
            <span className="mt-2 text-sm">Generating...</span>
          </div>
        )}
        {ad.error && !ad.isLoading && (
          <div className="p-4 text-center text-red-400">
            <p className="text-sm font-semibold">Generation Failed</p>
             <p className="text-xs mt-1">{ad.error}</p>
          </div>
        )}
        {ad.imageUrl && !ad.isLoading && (
          <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <h3 className="font-semibold text-slate-200 truncate">{ad.name}</h3>
      </div>
    </div>
  );
};
