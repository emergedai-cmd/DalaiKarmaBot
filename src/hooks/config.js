"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConfigPath = resolveConfigPath;
exports.isConfigPathTruthy = isConfigPathTruthy;
exports.resolveHookConfig = resolveHookConfig;
exports.resolveRuntimePlatform = resolveRuntimePlatform;
exports.hasBinary = hasBinary;
exports.shouldIncludeHook = shouldIncludeHook;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var frontmatter_js_1 = require("./frontmatter.js");
var DEFAULT_CONFIG_VALUES = {
    "browser.enabled": true,
    "browser.evaluateEnabled": true,
    "workspace.dir": true,
};
function isTruthy(value) {
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "number") {
        return value !== 0;
    }
    if (typeof value === "string") {
        return value.trim().length > 0;
    }
    return true;
}
function resolveConfigPath(config, pathStr) {
    var parts = pathStr.split(".").filter(Boolean);
    var current = config;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (typeof current !== "object" || current === null) {
            return undefined;
        }
        current = current[part];
    }
    return current;
}
function isConfigPathTruthy(config, pathStr) {
    var value = resolveConfigPath(config, pathStr);
    if (value === undefined && pathStr in DEFAULT_CONFIG_VALUES) {
        return DEFAULT_CONFIG_VALUES[pathStr];
    }
    return isTruthy(value);
}
function resolveHookConfig(config, hookKey) {
    var _a, _b;
    var hooks = (_b = (_a = config === null || config === void 0 ? void 0 : config.hooks) === null || _a === void 0 ? void 0 : _a.internal) === null || _b === void 0 ? void 0 : _b.entries;
    if (!hooks || typeof hooks !== "object") {
        return undefined;
    }
    var entry = hooks[hookKey];
    if (!entry || typeof entry !== "object") {
        return undefined;
    }
    return entry;
}
function resolveRuntimePlatform() {
    return process.platform;
}
function hasBinary(bin) {
    var _a;
    var pathEnv = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
    var parts = pathEnv.split(node_path_1.default.delimiter).filter(Boolean);
    for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
        var part = parts_2[_i];
        var candidate = node_path_1.default.join(part, bin);
        try {
            node_fs_1.default.accessSync(candidate, node_fs_1.default.constants.X_OK);
            return true;
        }
        catch (_b) {
            // keep scanning
        }
    }
    return false;
}
function shouldIncludeHook(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    var entry = params.entry, config = params.config, eligibility = params.eligibility;
    var hookKey = (0, frontmatter_js_1.resolveHookKey)(entry.hook.name, entry);
    var hookConfig = resolveHookConfig(config, hookKey);
    var pluginManaged = entry.hook.source === "openclaw-plugin";
    var osList = (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.os) !== null && _b !== void 0 ? _b : [];
    var remotePlatforms = (_d = (_c = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _c === void 0 ? void 0 : _c.platforms) !== null && _d !== void 0 ? _d : [];
    // Check if explicitly disabled
    if (!pluginManaged && (hookConfig === null || hookConfig === void 0 ? void 0 : hookConfig.enabled) === false) {
        return false;
    }
    // Check OS requirement
    if (osList.length > 0 &&
        !osList.includes(resolveRuntimePlatform()) &&
        !remotePlatforms.some(function (platform) { return osList.includes(platform); })) {
        return false;
    }
    // If marked as 'always', bypass all other checks
    if (((_e = entry.metadata) === null || _e === void 0 ? void 0 : _e.always) === true) {
        return true;
    }
    // Check required binaries (all must be present)
    var requiredBins = (_h = (_g = (_f = entry.metadata) === null || _f === void 0 ? void 0 : _f.requires) === null || _g === void 0 ? void 0 : _g.bins) !== null && _h !== void 0 ? _h : [];
    if (requiredBins.length > 0) {
        for (var _i = 0, requiredBins_1 = requiredBins; _i < requiredBins_1.length; _i++) {
            var bin = requiredBins_1[_i];
            if (hasBinary(bin)) {
                continue;
            }
            if ((_k = (_j = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _j === void 0 ? void 0 : _j.hasBin) === null || _k === void 0 ? void 0 : _k.call(_j, bin)) {
                continue;
            }
            return false;
        }
    }
    // Check anyBins (at least one must be present)
    var requiredAnyBins = (_o = (_m = (_l = entry.metadata) === null || _l === void 0 ? void 0 : _l.requires) === null || _m === void 0 ? void 0 : _m.anyBins) !== null && _o !== void 0 ? _o : [];
    if (requiredAnyBins.length > 0) {
        var anyFound = requiredAnyBins.some(function (bin) { return hasBinary(bin); }) ||
            ((_q = (_p = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _p === void 0 ? void 0 : _p.hasAnyBin) === null || _q === void 0 ? void 0 : _q.call(_p, requiredAnyBins));
        if (!anyFound) {
            return false;
        }
    }
    // Check required environment variables
    var requiredEnv = (_t = (_s = (_r = entry.metadata) === null || _r === void 0 ? void 0 : _r.requires) === null || _s === void 0 ? void 0 : _s.env) !== null && _t !== void 0 ? _t : [];
    if (requiredEnv.length > 0) {
        for (var _y = 0, requiredEnv_1 = requiredEnv; _y < requiredEnv_1.length; _y++) {
            var envName = requiredEnv_1[_y];
            if (process.env[envName]) {
                continue;
            }
            if ((_u = hookConfig === null || hookConfig === void 0 ? void 0 : hookConfig.env) === null || _u === void 0 ? void 0 : _u[envName]) {
                continue;
            }
            return false;
        }
    }
    // Check required config paths
    var requiredConfig = (_x = (_w = (_v = entry.metadata) === null || _v === void 0 ? void 0 : _v.requires) === null || _w === void 0 ? void 0 : _w.config) !== null && _x !== void 0 ? _x : [];
    if (requiredConfig.length > 0) {
        for (var _z = 0, requiredConfig_1 = requiredConfig; _z < requiredConfig_1.length; _z++) {
            var configPath = requiredConfig_1[_z];
            if (!isConfigPathTruthy(config, configPath)) {
                return false;
            }
        }
    }
    return true;
}
