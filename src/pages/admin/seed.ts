import type { APIRoute } from "astro";
import { getDb } from "../../lib/db";

// One-time migration endpoint: rebuilds the D1 Painting/Tattoo tables from the
// authoritative R2 object metadata. Gated behind the same admin `auth` cookie
// used by the rest of /admin. Safe to re-run (upserts by key). Remove once the
// migration off Astro Studio is confirmed.

async function expectedAuth(): Promise<string> {
  const encoder = new TextEncoder();
  const secret = encoder.encode("BAOBAOPIZZASURPRISE");
  const data = encoder.encode("bao" + "frog");
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const GET: APIRoute = async ({ locals, cookies }) => {
  const auth = cookies.get("auth");
  if (!auth || auth.value !== (await expectedAuth())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const R2 = locals.runtime.env.R2;
  const db = getDb(locals.runtime.env.DB);

  // Walk all objects under a prefix, including their customMetadata.
  const listAll = async (prefix: string) => {
    const objects: R2Object[] = [];
    let cursor: string | undefined;
    do {
      const page = await R2.list({ prefix, include: ["customMetadata"], cursor } as any);
      objects.push(...page.objects);
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    return objects;
  };

  const paintings = await listAll("paintings/");
  let paintingCount = 0;
  for (const obj of paintings) {
    const m = (obj.customMetadata ?? {}) as Record<string, string>;
    await db.addOrUpdatePainting({
      key: obj.key,
      title: m.title ?? "",
      material: m.material ?? "",
      dimensions: m.dimensions ?? "",
      rank: parseInt(m.rank ?? "999"),
      year: parseInt(m.year ?? "0"),
      updatedAt: obj.uploaded ?? new Date(),
    });
    paintingCount++;
  }

  const tattoos = await listAll("tattoos/");
  let tattooCount = 0;
  for (const obj of tattoos) {
    const m = (obj.customMetadata ?? {}) as Record<string, string>;
    await db.addOrUpdateTattoo({ key: obj.key, name: m.name ?? "" });
    tattooCount++;
  }

  return new Response(JSON.stringify({ paintings: paintingCount, tattoos: tattooCount }, null, 2), {
    headers: { "content-type": "application/json" },
  });
};
