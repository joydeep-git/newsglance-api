import { BedrockRuntimeClient, ConverseCommand, ConverseCommandOutput } from "@aws-sdk/client-bedrock-runtime";


class Bedrock {

  private readonly client: BedrockRuntimeClient;


  private model: string = process.env.BEDROCK_MODEL!;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.BEDROCK_REGION!,
      credentials: {
        accessKeyId: process.env.BEDROCK_ACCESS_KEY!,
        secretAccessKey: process.env.BEDROCK_SECRET_KEY!,
      },
    });
  }


  public async summarize({ prompt, systemInstructions }: { prompt: string; systemInstructions: string; }): Promise<string | undefined> {

    const payload = {
      messages: [
        {
          role: "user" as const,
          content: [{ text: prompt }],
        },
      ],
      system: [{ text: systemInstructions }],
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
      },
    };

    const command = new ConverseCommand({
      modelId: this.model,
      ...payload,
    });

    const response: ConverseCommandOutput = await this.client.send(command);

    return response?.output?.message?.content?.[0]?.text as string;

  }

}

const bedrock = new Bedrock();

export default bedrock;