import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, locals }) => {
    const {name} = params
    const img = await locals.runtime.env.R2.get(name)
    const readableStream = img.body
    return new Response(readableStream)
}