import { PollyClient, SynthesizeSpeechCommand, Engine, OutputFormat, TextType, VoiceId } from "@aws-sdk/client-polly";
import { errRes, errRouter } from "../../errors/error-responder";
import { PollyAudioResultType } from "../../types/news";
import cloudStorage from "../../services/aws/s3";
import { StatusCode } from "../../types";
import { Readable } from "node:stream";


class Polly {

  private client: PollyClient;

  private region: string = process.env.AWS_POLLY_REGION!;

  constructor() {

    if (!this.region) throw new Error("AWS_REGION env not found!");

    this.client = new PollyClient({
      region: this.region,
      credentials: {
        accessKeyId: process.env.POLLY_ACCESS_KEY!,
        secretAccessKey: process.env.POLLY_SECRET_KEY!,
      },
    });

  }


  public async createAndUploadAudio(text: string, newsId: string): Promise<PollyAudioResultType> {

    try {

      // Send text to Polly --> get MP3 back
      const response = await this.client.send(

        new SynthesizeSpeechCommand({
          Text: text,
          TextType: TextType.TEXT,
          OutputFormat: OutputFormat.MP3,
          VoiceId: VoiceId.Stephen,
          Engine: Engine.NEURAL,
          LanguageCode: "en-US",
        })

      );


      if (!response.AudioStream) {
        throw errRes("Polly returned no audio stream", StatusCode.SERVICE_UNAVAILABLE);
      }


      // Stream --> Buffer
      const chunks: Uint8Array[] = [];

      for await (const chunk of response.AudioStream as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);


      // create FILE to upload on s3
      const file: Express.Multer.File = {
        originalname: String(newsId + ".mp3"),
        buffer,
        size: buffer.byteLength,
        mimetype: response.ContentType ?? 'audio/mpeg',
        fieldname: "audio",
        encoding: "",
        stream: Readable.from(buffer),
        destination: "",
        filename: String(newsId),
        path: ""
      }


      const url = await cloudStorage.uploadFile(file, "audio");

      if (!url) throw new Error("S3 upload failed");


      // returning values that will require for file table
      return {
        originalname: String(newsId + ".mp3"),
        url,
        size: Buffer.from(buffer).length,
        duration: Math.round((buffer.byteLength * 8) / (64 * 1000)), // in sec
      }

    } catch (err) {
      throw errRouter(err);
    }

  }


}


const polly = new Polly();

export default polly;