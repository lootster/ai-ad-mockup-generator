
import React from 'react';
import type { GeneratedAd } from '../types';
import { CloseIcon } from './icons';

interface ZoomModalProps {
  ad: GeneratedAd;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ ad, onClose }) => {
  if (!ad.imageUrl) {
    return null;
  }

  // Prevents the modal from closing when the image itself is clicked.
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="zoom-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl p-4 w-full max-w-4xl max-h-full flex flex-col relative animate-scale-in"
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
          <h2 id="zoom-modal-title" className="text-xl font-bold text-slate-200">{ad.name}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close zoomed image view"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <img 
            src={ad.imageUrl} 
            alt={`Zoomed view of ${ad.name}`}
            className="w-full h-auto object-contain max-h-[80vh] rounded" 
          />
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};
