
import React, { useCallback } from 'react';
import type { ProductImage } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (image: ProductImage) => void;
  setGlobalError: (error: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, setGlobalError }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    setGlobalError(null);
    if (!file.type.startsWith('image/')) {
        setGlobalError('Invalid file type. Please upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string).split(',')[1];
      if (base64String) {
        onImageUpload({ data: base64String, mimeType: file.type });
      } else {
        setGlobalError('Could not read the image file. Please try again.');
      }
    };
    reader.onerror = () => {
        setGlobalError('Error reading file. Please try a different file.');
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="file-upload" className="relative block w-full p-8 text-center border-2 border-dashed rounded-lg cursor-pointer border-slate-700 hover:border-indigo-500 hover:bg-slate-800 transition-colors">
        <div className="flex flex-col items-center justify-center">
            <UploadIcon className="w-12 h-12 mb-4 text-slate-500" />
            <span className="text-xl font-semibold text-slate-300">Click to upload or drag and drop</span>
            <p className="mt-2 text-sm text-slate-500">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input 
            id="file-upload" 
            name="file-upload" 
            type="file" 
            className="sr-only" 
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
