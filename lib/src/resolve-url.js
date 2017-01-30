"use strict";
function resolveUrlClient(url) {
    if (url.indexOf('./') !== 0) {
        return url;
    }
    var pathname = window.location.pathname;
    var prefix = '/';
    if (pathname.match(/^\/api\//)) {
        prefix = '/api/';
    }
    return resolveUrl_inner(url, prefix);
}
exports.resolveUrlClient = resolveUrlClient;
function resolveUrl(url, pathDepthFromApiRoot) {
    if (pathDepthFromApiRoot === void 0) { pathDepthFromApiRoot = 1; }
    if (url.indexOf('./') !== 0) {
        return url;
    }
    var depthPrefix = getPathDepthPrefix(pathDepthFromApiRoot);
    return resolveUrl_inner(url, depthPrefix);
}
exports.resolveUrl = resolveUrl;
function resolveUrl_inner(url, prefix) {
    url = url.substr(2);
    // If file extension, make file
    if (url.match(/[^/]\.[^/]+$/)) {
        return prefix + "resource/" + url + "/file";
    }
    else {
        return "" + prefix + url + "?q";
    }
}
function resolveAllUrls(content, pathDepthFromApiRoot) {
    return content
        .replace(/"(\.\/[^"]+)"/g, function (x) { return '"' + resolveUrl(x.substr(1, x.length - 2), pathDepthFromApiRoot) + '"'; })
        .replace(/'(\.\/[^']+)'/g, function (x) { return '\'' + resolveUrl(x.substr(1, x.length - 2), pathDepthFromApiRoot) + '\''; });
}
exports.resolveAllUrls = resolveAllUrls;
function getPathDepthPrefix(pathDepthFromApiRoot) {
    var depthPrefix = '';
    for (var i = 0; i < pathDepthFromApiRoot; i++) {
        depthPrefix += '../';
    }
    return depthPrefix;
}
exports.getPathDepthPrefix = getPathDepthPrefix;
//# sourceMappingURL=resolve-url.js.map