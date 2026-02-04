"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatConfigPath = formatConfigPath;
exports.logConfigUpdated = logConfigUpdated;
var utils_js_1 = require("../utils.js");
var paths_js_1 = require("./paths.js");
function formatConfigPath(path) {
    if (path === void 0) { path = paths_js_1.CONFIG_PATH; }
    return (0, utils_js_1.displayPath)(path);
}
function logConfigUpdated(runtime, opts) {
    var _a;
    if (opts === void 0) { opts = {}; }
    var path = formatConfigPath((_a = opts.path) !== null && _a !== void 0 ? _a : paths_js_1.CONFIG_PATH);
    var suffix = opts.suffix ? " ".concat(opts.suffix) : "";
    runtime.log("Updated ".concat(path).concat(suffix));
}
