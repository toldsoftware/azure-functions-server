export function resolveUrlClient(url: string) {
    if (url.indexOf('./') !== 0) { return url; }

    let pathname = window.location.pathname;

    let prefix = '/';

    if (pathname.match(/^\/api\//)) {
        prefix = '/api/';
    }

    return resolveUrl_inner(url, prefix);
}

export function resolveUrl(url: string, pathDepthFromApiRoot = 1) {
    if (url.indexOf('./') !== 0) { return url; }

    let depthPrefix = getPathDepthPrefix(pathDepthFromApiRoot);

    return resolveUrl_inner(url, depthPrefix);
}

function resolveUrl_inner(url: string, prefix: string) {
    url = url.substr(2);

    // If file extension, make file
    if (url.match(/[^/]\.[^/]+$/)) {
        return `${prefix}resource/${url}/file`;
    }
    // Assume is api request
    else {
        return `${prefix}${url}?q`;
    }
}

export function resolveAllUrls(content: string, pathDepthFromApiRoot: number) {
    return content
        .replace(/"(\.\/[^"]+)"/g, x => '"' + resolveUrl(x.substr(1, x.length - 2), pathDepthFromApiRoot) + '"')
        .replace(/'(\.\/[^']+)'/g, x => '\'' + resolveUrl(x.substr(1, x.length - 2), pathDepthFromApiRoot) + '\'')
        ;
}

export function getPathDepthPrefix(pathDepthFromApiRoot: number) {
    let depthPrefix = '';
    for (let i = 0; i < pathDepthFromApiRoot; i++) {
        depthPrefix += '../';
    }

    return depthPrefix;
}