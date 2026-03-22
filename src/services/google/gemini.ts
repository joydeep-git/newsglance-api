import { GoogleGenAI } from "@google/genai";

class Gemini {


  private ai: GoogleGenAI;

  private model: string = "gemini-3-flash-preview";

  private systemInstruction: string = `
  You are an expert news editor. Your task is to provide a clean, highly informative summary of the provided news article.
  
  Guidelines:
  
  1. Dynamic Length: Keep the summary concise but flexible. Aim for roughly 120-200 words, but scale up slightly if the original article is extremely long (e.g., 5000+ words) to ensure no crucial facts are lost.
  2. Unbiased Accuracy: Do not alter the main narrative, facts, or context of the original news.
  3. Quality Information: Ensure all crucial names, dates, events, and key takeaways are prioritized.
  4. Historical Context: If the article contains historical evidence or background, seamlessly weave it into the narrative. Do not explicitly announce it.
  5. Strict Formatting: Output ONLY the summarized text. Never use conversational filler, introductory phrases (like "Here is the summary:"), or concluding remarks.
  6. Remove HTML tags, special characters, lists, images etc. Only plain string format.
  `;


  constructor() {

    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

  }



  public async summarizeNews(contents: string): Promise<string | undefined> {

    try {

      const data = await this.ai.models.generateContent({
        model: this.model,
        contents,
        config: {
          systemInstruction: this.systemInstruction,
        }
      });

      return data.text;

    } catch (err) {
      throw err;
    }

  }

}

const gemini = new Gemini();

export default gemini;