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
exports.parseFrontmatter = parseFrontmatter;
exports.resolveOpenClawMetadata = resolveOpenClawMetadata;
exports.resolveHookInvocationPolicy = resolveHookInvocationPolicy;
exports.resolveHookKey = resolveHookKey;
var json5_1 = require("json5");
var legacy_names_js_1 = require("../compat/legacy-names.js");
var frontmatter_js_1 = require("../markdown/frontmatter.js");
var boolean_js_1 = require("../utils/boolean.js");
function parseFrontmatter(content) {
    return (0, frontmatter_js_1.parseFrontmatterBlock)(content);
}
function normalizeStringList(input) {
    if (!input) {
        return [];
    }
    if (Array.isArray(input)) {
        return input.map(function (value) { return String(value).trim(); }).filter(Boolean);
    }
    if (typeof input === "string") {
        return input
            .split(",")
            .map(function (value) { return value.trim(); })
            .filter(Boolean);
    }
    return [];
}
function parseInstallSpec(input) {
    if (!input || typeof input !== "object") {
        return undefined;
    }
    var raw = input;
    var kindRaw = typeof raw.kind === "string" ? raw.kind : typeof raw.type === "string" ? raw.type : "";
    var kind = kindRaw.trim().toLowerCase();
    if (kind !== "bundled" && kind !== "npm" && kind !== "git") {
        return undefined;
    }
    var spec = {
        kind: kind,
    };
    if (typeof raw.id === "string") {
        spec.id = raw.id;
    }
    if (typeof raw.label === "string") {
        spec.label = raw.label;
    }
    var bins = normalizeStringList(raw.bins);
    if (bins.length > 0) {
        spec.bins = bins;
    }
    if (typeof raw.package === "string") {
        spec.package = raw.package;
    }
    if (typeof raw.repository === "string") {
        spec.repository = raw.repository;
    }
    return spec;
}
function getFrontmatterValue(frontmatter, key) {
    var raw = frontmatter[key];
    return typeof raw === "string" ? raw : undefined;
}
function parseFrontmatterBool(value, fallback) {
    var parsed = (0, boolean_js_1.parseBooleanValue)(value);
    return parsed === undefined ? fallback : parsed;
}
function resolveOpenClawMetadata(frontmatter) {
    var raw = getFrontmatterValue(frontmatter, "metadata");
    if (!raw) {
        return undefined;
    }
    try {
        var parsed = json5_1.default.parse(raw);
        if (!parsed || typeof parsed !== "object") {
            return undefined;
        }
        var metadataRawCandidates = __spreadArray([legacy_names_js_1.MANIFEST_KEY], legacy_names_js_1.LEGACY_MANIFEST_KEYS, true);
        var metadataRaw = void 0;
        for (var _i = 0, metadataRawCandidates_1 = metadataRawCandidates; _i < metadataRawCandidates_1.length; _i++) {
            var key = metadataRawCandidates_1[_i];
            var candidate = parsed[key];
            if (candidate && typeof candidate === "object") {
                metadataRaw = candidate;
                break;
            }
        }
        if (!metadataRaw || typeof metadataRaw !== "object") {
            return undefined;
        }
        var metadataObj = metadataRaw;
        var requiresRaw = typeof metadataObj.requires === "object" && metadataObj.requires !== null
            ? metadataObj.requires
            : undefined;
        var installRaw = Array.isArray(metadataObj.install) ? metadataObj.install : [];
        var install = installRaw
            .map(function (entry) { return parseInstallSpec(entry); })
            .filter(function (entry) { return Boolean(entry); });
        var osRaw = normalizeStringList(metadataObj.os);
        var eventsRaw = normalizeStringList(metadataObj.events);
        return {
            always: typeof metadataObj.always === "boolean" ? metadataObj.always : undefined,
            emoji: typeof metadataObj.emoji === "string" ? metadataObj.emoji : undefined,
            homepage: typeof metadataObj.homepage === "string" ? metadataObj.homepage : undefined,
            hookKey: typeof metadataObj.hookKey === "string" ? metadataObj.hookKey : undefined,
            export: typeof metadataObj.export === "string" ? metadataObj.export : undefined,
            os: osRaw.length > 0 ? osRaw : undefined,
            events: eventsRaw.length > 0 ? eventsRaw : [],
            requires: requiresRaw
                ? {
                    bins: normalizeStringList(requiresRaw.bins),
                    anyBins: normalizeStringList(requiresRaw.anyBins),
                    env: normalizeStringList(requiresRaw.env),
                    config: normalizeStringList(requiresRaw.config),
                }
                : undefined,
            install: install.length > 0 ? install : undefined,
        };
    }
    catch (_a) {
        return undefined;
    }
}
function resolveHookInvocationPolicy(frontmatter) {
    return {
        enabled: parseFrontmatterBool(getFrontmatterValue(frontmatter, "enabled"), true),
    };
}
function resolveHookKey(hookName, entry) {
    var _a, _b;
    return (_b = (_a = entry === null || entry === void 0 ? void 0 : entry.metadata) === null || _a === void 0 ? void 0 : _a.hookKey) !== null && _b !== void 0 ? _b : hookName;
}
