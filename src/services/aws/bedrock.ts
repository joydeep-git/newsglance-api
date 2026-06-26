// import { BedrockRuntimeClient, ConverseCommand, ConverseCommandOutput } from "@aws-sdk/client-bedrock-runtime";


// class Bedrock {

//   private readonly client: BedrockRuntimeClient;


//   private model: string = "us." + process.env.BEDROCK_MODEL!;

//   constructor() {
//     this.client = new BedrockRuntimeClient({
//       region: process.env.BEDROCK_REGION!,
//       credentials: {
//         accessKeyId: process.env.BEDROCK_ACCESS_KEY!,
//         secretAccessKey: process.env.BEDROCK_SECRET_KEY!,
//       },
//     });
//   }


//   public async summarize({ prompt, systemInstructions }: { prompt: string; systemInstructions: string; }): Promise<string | undefined> {

//     const payload = {
//       messages: [
//         {
//           role: "user" as const,
//           content: [{ text: prompt }],
//         },
//       ],
//       system: [{ text: systemInstructions }],
//       inferenceConfig: {
//         maxTokens: 1024,
//         temperature: 0.7,
//         topP: 0.9,
//       },
//     };

//     const command = new ConverseCommand({
//       modelId: this.model,
//       ...payload,
//     });

//     const response: ConverseCommandOutput = await this.client.send(command);

//     return response?.output?.message?.content?.[0]?.text as string;

//   }

// }

// const bedrock = new Bedrock();

// export default bedrock;


import { BedrockRuntimeClient, ConverseCommand, ConverseCommandOutput } from "@aws-sdk/client-bedrock-runtime";

class Bedrock {
  private readonly client: BedrockRuntimeClient;
  private model: string = process.env.BEDROCK_MODEL || "amazon.nova-lite-v1:0";

  constructor() {
    console.log("🔧 Bedrock Configuration:");
    console.log("Region:", process.env.BEDROCK_REGION);
    console.log("Model:", this.model);
    console.log("Access Key exists:", !!process.env.BEDROCK_ACCESS_KEY);
    console.log("Secret Key exists:", !!process.env.BEDROCK_SECRET_KEY);

    this.client = new BedrockRuntimeClient({
      region: process.env.BEDROCK_REGION!,
      credentials: {
        accessKeyId: process.env.BEDROCK_ACCESS_KEY!,
        secretAccessKey: process.env.BEDROCK_SECRET_KEY!,
      },
    });
  }

  public async summarize({
    prompt,
    systemInstructions
  }: {
    prompt: string;
    systemInstructions: string;
  }): Promise<string | undefined> {

    try {
      console.log("🚀 Attempting to invoke Bedrock model:", this.model);

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
      console.log("✅ Bedrock response received successfully");
      return response?.output?.message?.content?.[0]?.text as string;

    } catch (error: any) {
      console.error("❌ Bedrock Error Details:");
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Code:", error.$metadata?.httpStatusCode);
      console.error("Request ID:", error.$metadata?.requestId);
      console.error("Full Error:", JSON.stringify(error, null, 2));
      throw error;
    }
  }
}

const bedrock = new Bedrock();
export default bedrock;
