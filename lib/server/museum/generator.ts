import type { Museum, MuseumGeneration, MuseumParams } from "@/lib/shared/types";
import { Layout } from "@/lib/shared/museum/layout";
import { TextGenerator } from "../text-generator";
import { ImageGenerator } from "../image-generator";
import { v4 } from "uuid";
import { Bucket } from "../bucket";
import { Store } from "../store";

export class MuseumGenerator {
  constructor(private imageBucket: Bucket, private store: Store, private date: string) {}

  get key(): string {
    return `maps/${this.date}`;
  }

  public async load(): Promise<MuseumGeneration | undefined> {
    const record = await this.store.get(this.key);
    console.log("loaded", this.key, record);
    return record && JSON.parse(record);
  }

  private async save(record: MuseumGeneration): Promise<void> {
    console.log("saving", this.key, record);
    this.store.set(this.key, JSON.stringify(record));
  }

  public async generateMuseum(): Promise<MuseumGeneration> {
    try {
      let generation = await this.load();
      if (generation) return generation;

      generation = { status: "generating" };
      console.log("Generating new museum");
      this.save(generation);

      const layout = await this.generateLayout();
      const params = await this.generateParams(layout.listRooms().length);
      await this.generatePaintings(layout, params);

      const museum = { params, grid: layout.grid };
      generation = { status: "generated", museum };
      console.log("Generated new museum");
      this.save(generation);

      return generation;
    } catch (e) {
      this.save({
        status: "failed",
        error: e instanceof Error ? e.message : String(e),
      });
      throw e;
    }
  }

  private async generateParams(nPrompts: number): Promise<MuseumParams> {
    const textGen = TextGenerator.create();
    return textGen.generateMuseumParams(nPrompts);
  }

  private async generateLayout(): Promise<Layout> {
    return Layout.generateLayout(5, 5);
  }

  private async generatePaintings(layout: Layout, params: MuseumParams): Promise<void> {
    const rooms = layout.listRooms();
    const imageGen = ImageGenerator.create("stability", {
      model: process.env.STABILITY_MODEL!,
      apiHost: process.env.STABILITY_API_HOST!,
      apiKey: process.env.STABILITY_API_KEY!,
    });
    const images = (
      await Promise.all(params.prompts.map((prompt) => imageGen.generateImages(prompt, 1)))
    ).flat();

    for (const index in images) {
      const image = images[index];
      const uuid = v4();
      const imageKey = `paintings/${this.date}/${uuid}.png`;
      const imageUrl = await this.imageBucket.put(imageKey, image);
      rooms[index].addPainting(imageUrl);
    }
  }
}
