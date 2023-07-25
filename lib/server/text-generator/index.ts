import type { MuseumParams } from "@/lib/shared/types";
import { OpenAITextGenerator } from "./openai";

export abstract class TextGenerator {
  abstract generateMuseumParams(): Promise<MuseumParams>;

  static create(): TextGenerator {
    return new OpenAITextGenerator();
  }
}
