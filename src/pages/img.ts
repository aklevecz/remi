import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, locals }) => {
  const urlSearchParams = new URLSearchParams(request.url);
  console.log(urlSearchParams);
  const img = await locals.runtime.env.R2.get("test.png");
  if (!img) {
    return new Response("Not found", { status: 404 });
  }
  const readableStream = img.body;
  return new Response(readableStream);
};

export const POST: APIRoute = async ({ params, request, locals, cookies }) => {
  console.log("uploading");
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const cookie = cookies.get("clientId");
  if (!cookie) {
    return new Response(JSON.stringify({ message: "no_cookie" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!file) {
    return new Response(JSON.stringify({ message: "no_file" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  const clientId = cookie.value;

  const R2 = locals.runtime.env.R2;
  const imgFileName = clientId;
  await R2.put(imgFileName, file as any, { contentType: file.type } as any);

  return new Response(JSON.stringify({ message: "success" }), {
    headers: { "Content-Type": "application/json" },
  });
};
