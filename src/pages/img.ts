import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, locals }) => {
    const urlSearchParams = new URLSearchParams(request.url);
    console.log(urlSearchParams)
    const img = await locals.runtime.env.R2.get('test.png')
    const readableStream = img.body
    return new Response(readableStream)
}