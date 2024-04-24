export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export function genImgResizeUrl({width, height, quality, url}: {width: number, height: number, quality: number, url: string}) {
    const baseUrl = 'https://baos.haus/cdn-cgi/image/'
    const params = `width=${width},height=${height},quality=${quality}/`
    return `${baseUrl}${params}${url}`
}