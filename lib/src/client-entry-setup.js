"use strict";
var _1 = require("@told/platform/lib/");
var resolve_url_1 = require("./resolve-url");
_1.setupBrowser();
_1.Platform.urlResolver = resolve_url_1.resolveUrlClient;
//# sourceMappingURL=client-entry-setup.js.map