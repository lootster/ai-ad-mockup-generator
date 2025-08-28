
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { ProductImage } from '../types';

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdMockup = async (productImage: ProductImage, prompt: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const imagePart = {
      inlineData: {
        data: productImage.data,
        mimeType: productImage.mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error generating ad mockup:", error);
    // Re-throw a more user-friendly error
    throw new Error("Failed to generate ad. The model may be unable to process the request.");
  }
};
