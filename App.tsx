
import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AdGallery } from './components/AdGallery';
import { ZoomModal } from './components/ZoomModal';
import { generateAdMockup } from './services/geminiService';
import type { ProductImage, AdFormat, GeneratedAd } from './types';
import { AD_FORMATS } from './constants';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<ProductImage | null>(null);
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>(
    AD_FORMATS.map(format => ({ ...format, imageUrl: null, isLoading: false, error: null }))
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [zoomedAd, setZoomedAd] = useState<GeneratedAd | null>(null);

  const processAdGeneration = useCallback(async (image: ProductImage) => {
    setIsGenerating(true);
    setGlobalError(null);
    // Set all to loading initially to give user feedback
    setGeneratedAds(prevAds => 
      prevAds.map(ad => ({ ...ad, isLoading: true, imageUrl: null, error: null }))
    );

    // Process requests sequentially to avoid rate limiting
    for (const format of AD_FORMATS) {
      try {
        const imageUrl = await generateAdMockup(image, format.prompt);
        setGeneratedAds(prevAds => 
          prevAds.map(ad => 
            ad.id === format.id 
              ? { ...ad, imageUrl, isLoading: false, error: null }
              : ad
          )
        );
      } catch (error: any) {
        setGeneratedAds(prevAds => 
          prevAds.map(ad => 
            ad.id === format.id 
              ? { ...ad, isLoading: false, error: error.message || 'Generation failed' }
              : ad
          )
        );
      }
    }

    setIsGenerating(false);
  }, []);

  useEffect(() => {
    if (productImage) {
      processAdGeneration(productImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productImage]);

  // Effect to handle 'Escape' key press for closing the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setZoomedAd(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleImageUpload = (image: ProductImage) => {
    setProductImage(image);
  };
  
  const handleReset = () => {
    setProductImage(null);
    setGeneratedAds(AD_FORMATS.map(format => ({ ...format, imageUrl: null, isLoading: false, error: null })));
    setIsGenerating(false);
    setGlobalError(null);
  };

  const handleZoomAd = (ad: GeneratedAd) => {
    if (ad.imageUrl) {
      setZoomedAd(ad);
    }
  };

  const handleCloseZoom = () => {
    setZoomedAd(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
            Ad Mockup Generator
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Upload your product image and watch Gemini AI place it into 10 different ad scenarios instantly.
          </p>
        </header>

        <main>
          {globalError && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{globalError}</span>
            </div>
          )}

          {!productImage && (
            <ImageUploader onImageUpload={handleImageUpload} setGlobalError={setGlobalError} />
          )}

          {productImage && (
             <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    <img src={`data:${productImage.mimeType};base64,${productImage.data}`} alt="Uploaded Product" className="max-h-60 rounded-lg shadow-lg border-4 border-slate-700" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <button 
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Upload New Image
                        </button>
                    </div>
                </div>
             </div>
          )}
          
          {(isGenerating || (productImage && generatedAds.some(ad => ad.imageUrl || ad.isLoading || ad.error))) && (
            <AdGallery ads={generatedAds} onZoomAd={handleZoomAd} />
          )}

        </main>
      </div>
      {zoomedAd && <ZoomModal ad={zoomedAd} onClose={handleCloseZoom} />}
    </div>
  );
};

export default App;
