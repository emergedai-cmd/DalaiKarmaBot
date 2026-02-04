"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChannelUiCatalog = buildChannelUiCatalog;
exports.listChannelPluginCatalogEntries = listChannelPluginCatalogEntries;
exports.getChannelPluginCatalogEntry = getChannelPluginCatalogEntry;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var legacy_names_js_1 = require("../../compat/legacy-names.js");
var discovery_js_1 = require("../../plugins/discovery.js");
var utils_js_1 = require("../../utils.js");
var ORIGIN_PRIORITY = {
    config: 0,
    workspace: 1,
    global: 2,
    bundled: 3,
};
var DEFAULT_CATALOG_PATHS = [
    node_path_1.default.join(utils_js_1.CONFIG_DIR, "mpm", "plugins.json"),
    node_path_1.default.join(utils_js_1.CONFIG_DIR, "mpm", "catalog.json"),
    node_path_1.default.join(utils_js_1.CONFIG_DIR, "plugins", "catalog.json"),
];
var ENV_CATALOG_PATHS = ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"];
function isRecord(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function parseCatalogEntries(raw) {
    var _a, _b;
    if (Array.isArray(raw)) {
        return raw.filter(function (entry) { return isRecord(entry); });
    }
    if (!isRecord(raw)) {
        return [];
    }
    var list = (_b = (_a = raw.entries) !== null && _a !== void 0 ? _a : raw.packages) !== null && _b !== void 0 ? _b : raw.plugins;
    if (!Array.isArray(list)) {
        return [];
    }
    return list.filter(function (entry) { return isRecord(entry); });
}
function splitEnvPaths(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return [];
    }
    return trimmed
        .split(/[;,]/g)
        .flatMap(function (chunk) { return chunk.split(node_path_1.default.delimiter); })
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function resolveExternalCatalogPaths(options) {
    if (options.catalogPaths && options.catalogPaths.length > 0) {
        return options.catalogPaths.map(function (entry) { return entry.trim(); }).filter(Boolean);
    }
    for (var _i = 0, ENV_CATALOG_PATHS_1 = ENV_CATALOG_PATHS; _i < ENV_CATALOG_PATHS_1.length; _i++) {
        var key = ENV_CATALOG_PATHS_1[_i];
        var raw = process.env[key];
        if (raw && raw.trim()) {
            return splitEnvPaths(raw);
        }
    }
    return DEFAULT_CATALOG_PATHS;
}
function loadExternalCatalogEntries(options) {
    var paths = resolveExternalCatalogPaths(options);
    var entries = [];
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var rawPath = paths_1[_i];
        var resolved = (0, utils_js_1.resolveUserPath)(rawPath);
        if (!node_fs_1.default.existsSync(resolved)) {
            continue;
        }
        try {
            var payload = JSON.parse(node_fs_1.default.readFileSync(resolved, "utf-8"));
            entries.push.apply(entries, parseCatalogEntries(payload));
        }
        catch (_a) {
            // Ignore invalid catalog files.
        }
    }
    return entries;
}
function toChannelMeta(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    var label = (_a = params.channel.label) === null || _a === void 0 ? void 0 : _a.trim();
    if (!label) {
        return null;
    }
    var selectionLabel = ((_b = params.channel.selectionLabel) === null || _b === void 0 ? void 0 : _b.trim()) || label;
    var detailLabel = (_c = params.channel.detailLabel) === null || _c === void 0 ? void 0 : _c.trim();
    var docsPath = ((_d = params.channel.docsPath) === null || _d === void 0 ? void 0 : _d.trim()) || "/channels/".concat(params.id);
    var blurb = ((_e = params.channel.blurb) === null || _e === void 0 ? void 0 : _e.trim()) || "";
    var systemImage = (_f = params.channel.systemImage) === null || _f === void 0 ? void 0 : _f.trim();
    return __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ id: params.id, label: label, selectionLabel: selectionLabel }, (detailLabel ? { detailLabel: detailLabel } : {})), { docsPath: docsPath, docsLabel: ((_g = params.channel.docsLabel) === null || _g === void 0 ? void 0 : _g.trim()) || undefined, blurb: blurb }), (params.channel.aliases ? { aliases: params.channel.aliases } : {})), (params.channel.preferOver ? { preferOver: params.channel.preferOver } : {})), (params.channel.order !== undefined ? { order: params.channel.order } : {})), (params.channel.selectionDocsPrefix
        ? { selectionDocsPrefix: params.channel.selectionDocsPrefix }
        : {})), (params.channel.selectionDocsOmitLabel !== undefined
        ? { selectionDocsOmitLabel: params.channel.selectionDocsOmitLabel }
        : {})), (params.channel.selectionExtras ? { selectionExtras: params.channel.selectionExtras } : {})), (systemImage ? { systemImage: systemImage } : {})), (params.channel.showConfigured !== undefined
        ? { showConfigured: params.channel.showConfigured }
        : {})), (params.channel.quickstartAllowFrom !== undefined
        ? { quickstartAllowFrom: params.channel.quickstartAllowFrom }
        : {})), (params.channel.forceAccountBinding !== undefined
        ? { forceAccountBinding: params.channel.forceAccountBinding }
        : {})), (params.channel.preferSessionLookupForAnnounceTarget !== undefined
        ? {
            preferSessionLookupForAnnounceTarget: params.channel.preferSessionLookupForAnnounceTarget,
        }
        : {}));
}
function resolveInstallInfo(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var npmSpec = (_c = (_b = (_a = params.manifest.install) === null || _a === void 0 ? void 0 : _a.npmSpec) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : (_d = params.packageName) === null || _d === void 0 ? void 0 : _d.trim();
    if (!npmSpec) {
        return null;
    }
    var localPath = ((_f = (_e = params.manifest.install) === null || _e === void 0 ? void 0 : _e.localPath) === null || _f === void 0 ? void 0 : _f.trim()) || undefined;
    if (!localPath && params.workspaceDir && params.packageDir) {
        localPath = node_path_1.default.relative(params.workspaceDir, params.packageDir) || undefined;
    }
    var defaultChoice = (_h = (_g = params.manifest.install) === null || _g === void 0 ? void 0 : _g.defaultChoice) !== null && _h !== void 0 ? _h : (localPath ? "local" : "npm");
    return __assign(__assign({ npmSpec: npmSpec }, (localPath ? { localPath: localPath } : {})), (defaultChoice ? { defaultChoice: defaultChoice } : {}));
}
function buildCatalogEntry(candidate) {
    var _a;
    var manifest = candidate.packageManifest;
    if (!(manifest === null || manifest === void 0 ? void 0 : manifest.channel)) {
        return null;
    }
    var id = (_a = manifest.channel.id) === null || _a === void 0 ? void 0 : _a.trim();
    if (!id) {
        return null;
    }
    var meta = toChannelMeta({ channel: manifest.channel, id: id });
    if (!meta) {
        return null;
    }
    var install = resolveInstallInfo({
        manifest: manifest,
        packageName: candidate.packageName,
        packageDir: candidate.packageDir,
        workspaceDir: candidate.workspaceDir,
    });
    if (!install) {
        return null;
    }
    return { id: id, meta: meta, install: install };
}
function buildExternalCatalogEntry(entry) {
    var manifest = entry[legacy_names_js_1.MANIFEST_KEY];
    return buildCatalogEntry({
        packageName: entry.name,
        packageManifest: manifest,
    });
}
function buildChannelUiCatalog(plugins) {
    var entries = plugins.map(function (plugin) {
        var _a, _b;
        var detailLabel = (_b = (_a = plugin.meta.detailLabel) !== null && _a !== void 0 ? _a : plugin.meta.selectionLabel) !== null && _b !== void 0 ? _b : plugin.meta.label;
        return __assign({ id: plugin.id, label: plugin.meta.label, detailLabel: detailLabel }, (plugin.meta.systemImage ? { systemImage: plugin.meta.systemImage } : {}));
    });
    var order = entries.map(function (entry) { return entry.id; });
    var labels = {};
    var detailLabels = {};
    var systemImages = {};
    var byId = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        labels[entry.id] = entry.label;
        detailLabels[entry.id] = entry.detailLabel;
        if (entry.systemImage) {
            systemImages[entry.id] = entry.systemImage;
        }
        byId[entry.id] = entry;
    }
    return { entries: entries, order: order, labels: labels, detailLabels: detailLabels, systemImages: systemImages, byId: byId };
}
function listChannelPluginCatalogEntries(options) {
    var _a;
    if (options === void 0) { options = {}; }
    var discovery = (0, discovery_js_1.discoverOpenClawPlugins)({ workspaceDir: options.workspaceDir });
    var resolved = new Map();
    for (var _i = 0, _b = discovery.candidates; _i < _b.length; _i++) {
        var candidate = _b[_i];
        var entry = buildCatalogEntry(candidate);
        if (!entry) {
            continue;
        }
        var priority = (_a = ORIGIN_PRIORITY[candidate.origin]) !== null && _a !== void 0 ? _a : 99;
        var existing = resolved.get(entry.id);
        if (!existing || priority < existing.priority) {
            resolved.set(entry.id, { entry: entry, priority: priority });
        }
    }
    var externalEntries = loadExternalCatalogEntries(options)
        .map(function (entry) { return buildExternalCatalogEntry(entry); })
        .filter(function (entry) { return Boolean(entry); });
    for (var _c = 0, externalEntries_1 = externalEntries; _c < externalEntries_1.length; _c++) {
        var entry = externalEntries_1[_c];
        if (!resolved.has(entry.id)) {
            resolved.set(entry.id, { entry: entry, priority: 99 });
        }
    }
    return Array.from(resolved.values())
        .map(function (_a) {
        var entry = _a.entry;
        return entry;
    })
        .toSorted(function (a, b) {
        var _a, _b;
        var orderA = (_a = a.meta.order) !== null && _a !== void 0 ? _a : 999;
        var orderB = (_b = b.meta.order) !== null && _b !== void 0 ? _b : 999;
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        return a.meta.label.localeCompare(b.meta.label);
    });
}
function getChannelPluginCatalogEntry(id, options) {
    if (options === void 0) { options = {}; }
    var trimmed = id.trim();
    if (!trimmed) {
        return undefined;
    }
    return listChannelPluginCatalogEntries(options).find(function (entry) { return entry.id === trimmed; });
}
