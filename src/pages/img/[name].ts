import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, locals }) => {
    const {name} = params
    const img = await locals.runtime.env.R2.get(name)
    if (!img) {
        return new Response('Not found', {status: 404})
    
    }
    const readableStream = img.body

    // Create a new headers object
    const headers = new Headers();

    // Write the image metadata to the headers
    img.writeHttpMetadata(headers);
    headers.set('etag', img.httpEtag);
    // console.log(headers)
    return new Response(readableStream, {headers});
}