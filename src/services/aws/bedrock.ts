import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandOutput } from "@aws-sdk/client-bedrock-runtime";



class Bedrock {

  private client: BedrockRuntimeClient;

  private model: string = "amazon.nova-lite-v1:0";

  private region: string = "us-east-1";

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: this.region,
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
          role: "user",
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

    const command = new InvokeModelCommand({
      modelId: this.model,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response: InvokeModelCommandOutput = await this.client.send(command);

    const decoded = JSON.parse(new TextDecoder().decode(response.body));

    return decoded?.output?.message?.content?.[0]?.text as string;

  }

}

const bedrock = new Bedrock();

export default bedrock;