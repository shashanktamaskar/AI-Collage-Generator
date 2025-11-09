import { GoogleGenAI } from "@google/genai";

/**
 * Sends a thumbnail grid to the Gemini API to select the best photos.
 */
export async function getBestPhotosFromGrid(
  genAI: GoogleGenAI,
  gridBase64: string,
  filenames: string[],
  count: number = 4
): Promise<string[]> {
  try {
    const model = 'gemini-2.5-flash';
    let prompt = `You are a social media expert for a school event. From this grid of photos, select the ${count} best images that are engaging, clear, and tell a story. Focus on photos with clear subjects, good composition, and emotional impact. The filenames for the images are: ${filenames.join(", ")}.`;
    
    prompt += ` Your response MUST be ONLY a comma-separated list of the selected filenames, with no extra text or formatting.`;
    
    const imagePart = {
      inlineData: {
        data: gridBase64,
        mimeType: 'image/jpeg',
      },
    };

    const response = await genAI.models.generateContent({
        model,
        contents: { parts: [ {text: prompt}, imagePart ] }
    });
    
    const responseText = response.text;
    const selected = responseText.split(',').map(f => f.trim()).filter(f => filenames.includes(f));

    if (selected.length === 0) {
        // Fallback or retry logic can be added here
        throw new Error("AI model did not return any valid filenames.");
    }

    return selected;

  } catch (error) {
    console.error("Gemini photo selection failed:", error);
    throw new Error(`AI photo selection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Sends a generated collage to the Gemini API for a quality and impact check.
 */
export async function checkVirality(genAI: GoogleGenAI, collageBase64: string): Promise<string> {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a professional graphic designer and social media marketing expert. Analyze this collage for its design quality and potential to go viral. Provide a single combined "Impact Score" from 1 to 10. In your 3-4 sentence justification, comment on its professional appearance, layout, composition, and its potential for social media engagement. Format your response exactly like this: "Impact Score: [score]/10. [Justification]"`;

    const imagePart = {
      inlineData: {
        data: collageBase64,
        mimeType: 'image/jpeg',
      },
    };
    
    const response = await genAI.models.generateContent({
        model,
        contents: { parts: [ {text: prompt}, imagePart ] }
    });

    return response.text;

  } catch (error) {
    console.error("Gemini virality check failed:", error);
    return "Virality check could not be completed due to an API error.";
  }
}