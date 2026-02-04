"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCliChannelOptions = resolveCliChannelOptions;
exports.formatCliChannelOptions = formatCliChannelOptions;
var catalog_js_1 = require("../channels/plugins/catalog.js");
var index_js_1 = require("../channels/plugins/index.js");
var registry_js_1 = require("../channels/registry.js");
var env_js_1 = require("../infra/env.js");
var plugin_registry_js_1 = require("./plugin-registry.js");
function dedupe(values) {
    var seen = new Set();
    var resolved = [];
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        if (!value || seen.has(value)) {
            continue;
        }
        seen.add(value);
        resolved.push(value);
    }
    return resolved;
}
function resolveCliChannelOptions() {
    var catalog = (0, catalog_js_1.listChannelPluginCatalogEntries)().map(function (entry) { return entry.id; });
    var base = dedupe(__spreadArray(__spreadArray([], registry_js_1.CHAT_CHANNEL_ORDER, true), catalog, true));
    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_EAGER_CHANNEL_OPTIONS)) {
        (0, plugin_registry_js_1.ensurePluginRegistryLoaded)();
        var pluginIds = (0, index_js_1.listChannelPlugins)().map(function (plugin) { return plugin.id; });
        return dedupe(__spreadArray(__spreadArray([], base, true), pluginIds, true));
    }
    return base;
}
function formatCliChannelOptions(extra) {
    if (extra === void 0) { extra = []; }
    return __spreadArray(__spreadArray([], extra, true), resolveCliChannelOptions(), true).join("|");
}
