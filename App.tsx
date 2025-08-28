
import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AdGallery } from './components/AdGallery';
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

  const processAdGeneration = useCallback(async (image: ProductImage) => {
    setIsGenerating(true);
    setGlobalError(null);
    setGeneratedAds(prevAds => 
      prevAds.map(ad => ({ ...ad, isLoading: true, imageUrl: null, error: null }))
    );

    const promises = AD_FORMATS.map(format => 
      generateAdMockup(image, format.prompt)
        .then(imageUrl => ({ status: 'fulfilled', value: imageUrl, id: format.id }))
        .catch(error => ({ status: 'rejected', reason: error.message || 'Unknown error', id: format.id }))
    );

    const results = await Promise.allSettled(promises);

    setGeneratedAds(prevAds => {
      const newAds = [...prevAds];
      results.forEach(result => {
        // Fix for line 36: The .catch() on each promise ensures all promises passed to Promise.allSettled resolve.
        // We must inspect the 'status' property of the custom object inside `result.value` to differentiate between success and failure.
        if (result.status === 'fulfilled') {
          const settlement = result.value;
          if (settlement.status === 'fulfilled') {
            const { id, value } = settlement;
            const adIndex = newAds.findIndex(ad => ad.id === id);
            if (adIndex !== -1) {
              newAds[adIndex] = { ...newAds[adIndex], imageUrl: value, isLoading: false, error: null };
            }
          } else if (settlement.status === 'rejected') {
            const { id, reason } = settlement;
            const adIndex = newAds.findIndex(ad => ad.id === id);
            if(adIndex !== -1) {
              newAds[adIndex] = { ...newAds[adIndex], isLoading: false, error: reason };
            }
          }
        }
        // The original `else if (result.status === 'rejected')` block was unreachable and its logic was incorrect.
      });
      return newAds;
    });

    setIsGenerating(false);
  }, []);

  useEffect(() => {
    if (productImage) {
      processAdGeneration(productImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productImage]);

  const handleImageUpload = (image: ProductImage) => {
    setProductImage(image);
  };
  
  const handleReset = () => {
    setProductImage(null);
    setGeneratedAds(AD_FORMATS.map(format => ({ ...format, imageUrl: null, isLoading: false, error: null })));
    setIsGenerating(false);
    setGlobalError(null);
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
                    <img src={productImage.data} alt="Uploaded Product" className="max-h-60 rounded-lg shadow-lg border-4 border-slate-700" />
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
            <AdGallery ads={generatedAds} />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
