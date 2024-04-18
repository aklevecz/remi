import { db, Painting } from "astro:db";
import { generateUUID } from "../src/lib/utils";

// https://astro.build/db/seed
export default async function () {
  // TODO
  const files = await fetch("http://localhost:8787/remi").then((res) => res.json());
  for (const file of files.objects) {
    const object = await fetch(`http://localhost:8787/remi/${encodeURIComponent(file.key)}`).then((res) => res.json());
    const {title, material, dimensions, rank, year } = object.customMetadata;
    await db.insert(Painting).values([{ key:object.key, title, material, dimensions, rank: rank || 999999, year }]);
  }
  const paintings = await db.select().from(Painting);
  console.log(paintings);
}
