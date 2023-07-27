import type { Museum, MuseumGeneration, MuseumParams } from "@/lib/shared/types";
import { Layout } from "@/lib/shared/museum/layout";
import { TextGenerator } from "../text-generator";
import { ImageGenerator } from "../image-generator";
import { v4 } from "uuid";
import { Bucket } from "../bucket";
import { Store } from "../store";

const imagesHost = process.env.IMAGES_HOST;

export class MuseumGenerator {
  constructor(private imageBucket: Bucket, private store: Store, private date: string) {}

  get key(): string {
    return `maps/${this.date}`;
  }

  private async load(): Promise<MuseumGeneration | undefined> {
    const record = await this.store.get(this.key);
    return record && JSON.parse(record);
  }

  private async save(record: MuseumGeneration): Promise<void> {
    this.store.set(this.key, JSON.stringify(record));
  }

  public async generateMuseum(): Promise<Museum> {
    try {
      const record = await this.load();
      if (record?.status === "generating") throw new Error("Museum is generating.");
      else if (record?.status === "generated") return record.museum;

      this.save({ status: "generating" });
      const params = await this.generateParams();
      const layout = await this.generateLayout();
      await this.generatePaintings(layout, params);
      const museum = { params, grid: layout.grid };
      this.save({ status: "generated", museum });

      return museum;
    } catch (e) {
      this.save({
        status: "failed",
        error: e instanceof Error ? e.message : String(e),
      });
      throw e;
    }
  }

  private async generateParams(): Promise<MuseumParams> {
    const textGen = TextGenerator.create();
    return textGen.generateMuseumParams();
  }

  private async generateLayout(): Promise<Layout> {
    return Layout.generateLayout(5, 5);
  }

  private async generatePaintings(layout: Layout, params: MuseumParams): Promise<void> {
    const rooms = layout.listRooms();
    const imageGen = ImageGenerator.create();
    const images = await imageGen.generateImages(params.prompt, rooms.length);

    for (const index in images) {
      const image = images[index];
      const uuid = v4();
      const imageKey = `paintings/${this.date}/${uuid}.png`;
      await this.imageBucket.put(imageKey, image);
      const imageUrl = `${imagesHost}/${imageKey}`;
      rooms[index].addPainting(imageUrl);
    }
  }
}
