import React from 'react';
import type { GeneratedAd } from '../types';
import { SpinnerIcon, DownloadIcon } from './icons';

interface AdCardProps {
  ad: GeneratedAd;
  onZoom: (ad: GeneratedAd) => void;
}

// Helper function to generate a valid filename from the ad name and image data URL
const generateFilename = (name: string, imageUrl: string): string => {
  const extensionMatch = imageUrl.match(/data:image\/(.*?);/);
  const extension = extensionMatch ? extensionMatch[1] : 'png';
  const sanitizedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${sanitizedName}.${extension}`;
};


export const AdCard: React.FC<AdCardProps> = ({ ad, onZoom }) => {
  const canZoom = !!ad.imageUrl && !ad.isLoading;

  const handleClick = () => {
    if (canZoom) {
      onZoom(ad);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the zoom modal from opening when the download button is clicked
    if (!ad.imageUrl) return;

    const link = document.createElement('a');
    link.href = ad.imageUrl;
    link.download = generateFilename(ad.name, ad.imageUrl);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className={`bg-slate-800 rounded-lg overflow-hidden shadow-lg flex flex-col transition-transform duration-300 ${canZoom ? 'transform hover:-translate-y-1 cursor-pointer' : ''}`}
      onClick={handleClick}
      role={canZoom ? 'button' : undefined}
      tabIndex={canZoom ? 0 : -1}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      aria-label={`Zoom in on ${ad.name}`}
    >
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
      <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-200 truncate min-w-0">{ad.name}</h3>
        {canZoom && (
          <button
            onClick={handleDownload}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
            aria-label={`Download ${ad.name} ad mockup`}
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};