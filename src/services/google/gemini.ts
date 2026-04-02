import { GoogleGenAI } from "@google/genai";

class Gemini {


  private ai: GoogleGenAI;

  private model: string = "gemini-3-flash-preview";

  constructor() {

    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

  }



  public async summarizeNews({ contents, instructions }: { contents: string; instructions: string; }): Promise<string | undefined> {

    const data = await this.ai.models.generateContent({
      model: this.model,
      contents,
      config: {
        systemInstruction: instructions,
      }
    });

    return data.text;

  }

}

const gemini = new Gemini();

export default gemini;