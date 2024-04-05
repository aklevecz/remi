import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { name } = params;
  const img = await locals.runtime.env.R2.get(name);
  if (!img) {
    return new Response("Not found", { status: 404 });
  }
  const readableStream = img.body;

  const headers = new Headers();
  if (process.env.NODE_ENV !== "development") {
    img.writeHttpMetadata(headers);
    headers.set("etag", img.httpEtag);
  }
  
  return new Response(readableStream, { headers });
};


