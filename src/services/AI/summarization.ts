import { errorPrinter, errRes } from "@/errors/error-responder";
import bedrock from "../aws/bedrock";
import gemini from "../google/gemini";
import { StatusCode } from "@/types";


class AiSummarization {

  private summaryInstruction: string = `
  You are an expert news editor. Your task is to provide a clean, highly informative summary of the provided news article.
  
  Guidelines:
  
  1. Dynamic Length: Keep the summary concise but flexible. Aim for roughly 100 - 120 words, but scale up slightly if the original article is extremely long (e.g., 5000+ words) to ensure no crucial facts are lost.
  2. Unbiased Accuracy: Do not alter the main narrative, facts, or context of the original news.
  3. Quality Information: Ensure all crucial names, dates, events, and key takeaways are prioritized.
  4. Historical Context: If the article contains historical evidence or background, seamlessly weave it into the narrative. Do not explicitly announce it.
  5. Strict Formatting: Output ONLY the summarized text. Never use conversational filler, introductory phrases (like "Here is the summary:"), or concluding remarks.
  6. Remove HTML tags, special characters, lists, images etc. Only plain string format.
  7. Display contents in lists, it is easy to read and remember.
  `;


  private audioPrompt = `You are a professional news narrator. 
    
    Rewrite the following news article as an engaging audio story of exactly 300-320 words.
  
    Rules:
    - Use storytelling narrative tone
    - Keep all key facts accurate  
    - Structure: Hook → Key Facts → Impact → Quick Conclusion
    - No bullet points, headers, or markdown
    - Plain flowing prose only (this goes to text-to-speech)
    - Be concise but engaging `;




  public async generateSummary({ content, isAudio }: { content: string; isAudio: boolean; }): Promise<string> {

    const instructions = isAudio ? this.audioPrompt : this.summaryInstruction;


    let response: string | undefined;

    // generate from AWS
    try {

      response = await bedrock.summarize({ prompt: content, systemInstructions: instructions });

    } catch (err) {
      errorPrinter("Bedrock Error :", err);
    }


    // use gemini
    if (!response) {

      try {

        response = await gemini.summarizeNews({ contents: content, instructions });

      } catch (err) {
        errorPrinter("Gemini Error:", err);
      }

    }

    if (!response) {
      throw errRes("AI Summarization failed!", StatusCode.SERVICE_UNAVAILABLE);
    }

    return response;

  }



}


const aiSummarization = new AiSummarization();

export default aiSummarization;