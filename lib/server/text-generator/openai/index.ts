import type { TextGenerator } from "..";
import type { MuseumParams } from "@/lib/shared/types";
import { museumFunction } from "./functions";
import { Generator, OpenAIGenerator } from "../../generators";
import { museumParamsPrompt, museumSystemPrompt } from "./prompts";

export class OpenAITextGenerator implements TextGenerator {
  private completer: Generator;

  constructor() {
    this.completer = new OpenAIGenerator(process.env.OPENAI_API_KEY!);
  }

  generateMuseumParams(nPrompts: number): Promise<MuseumParams> {
    return this.completer.completeChatFunction(
      museumSystemPrompt,
      museumParamsPrompt(nPrompts),
      museumFunction
    );
  }
}
