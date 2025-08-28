
export interface ProductImage {
  data: string; // base64 encoded image data
  mimeType: string;
}

export interface AdFormat {
  id: number;
  name: string;
  prompt: string;
}

export interface GeneratedAd extends AdFormat {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}
