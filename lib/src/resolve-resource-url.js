"use strict";
function resolveResourceUrl(url) {
    if (url.indexOf('./') !== 0) {
        return url;
    }
    return url;
}
exports.resolveResourceUrl = resolveResourceUrl;
function resolveAllResourceUrls(url) {
    return matchSpecialUrl;
}
exports.resolveAllResourceUrls = resolveAllResourceUrls;
//# sourceMappingURL=resolve-resource-url.js.map