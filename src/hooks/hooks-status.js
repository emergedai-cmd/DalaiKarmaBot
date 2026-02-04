"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorkspaceHookStatus = buildWorkspaceHookStatus;
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
var config_js_1 = require("./config.js");
var workspace_js_1 = require("./workspace.js");
function resolveHookKey(entry) {
    var _a, _b;
    return (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.hookKey) !== null && _b !== void 0 ? _b : entry.hook.name;
}
function normalizeInstallOptions(entry) {
    var _a, _b;
    var install = (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.install) !== null && _b !== void 0 ? _b : [];
    if (install.length === 0) {
        return [];
    }
    // For hooks, we just list all install options
    return install.map(function (spec, index) {
        var _a, _b, _c;
        var id = ((_a = spec.id) !== null && _a !== void 0 ? _a : "".concat(spec.kind, "-").concat(index)).trim();
        var bins = (_b = spec.bins) !== null && _b !== void 0 ? _b : [];
        var label = ((_c = spec.label) !== null && _c !== void 0 ? _c : "").trim();
        if (!label) {
            if (spec.kind === "bundled") {
                label = "Bundled with OpenClaw";
            }
            else if (spec.kind === "npm" && spec.package) {
                label = "Install ".concat(spec.package, " (npm)");
            }
            else if (spec.kind === "git" && spec.repository) {
                label = "Install from ".concat(spec.repository);
            }
            else {
                label = "Run installer";
            }
        }
        return { id: id, kind: spec.kind, label: label, bins: bins };
    });
}
function buildHookStatus(entry, config, eligibility) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    var hookKey = resolveHookKey(entry);
    var hookConfig = (0, config_js_1.resolveHookConfig)(config, hookKey);
    var managedByPlugin = entry.hook.source === "openclaw-plugin";
    var disabled = managedByPlugin ? false : (hookConfig === null || hookConfig === void 0 ? void 0 : hookConfig.enabled) === false;
    var always = ((_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.always) === true;
    var emoji = (_c = (_b = entry.metadata) === null || _b === void 0 ? void 0 : _b.emoji) !== null && _c !== void 0 ? _c : entry.frontmatter.emoji;
    var homepageRaw = (_g = (_f = (_e = (_d = entry.metadata) === null || _d === void 0 ? void 0 : _d.homepage) !== null && _e !== void 0 ? _e : entry.frontmatter.homepage) !== null && _f !== void 0 ? _f : entry.frontmatter.website) !== null && _g !== void 0 ? _g : entry.frontmatter.url;
    var homepage = (homepageRaw === null || homepageRaw === void 0 ? void 0 : homepageRaw.trim()) ? homepageRaw.trim() : undefined;
    var events = (_j = (_h = entry.metadata) === null || _h === void 0 ? void 0 : _h.events) !== null && _j !== void 0 ? _j : [];
    var requiredBins = (_m = (_l = (_k = entry.metadata) === null || _k === void 0 ? void 0 : _k.requires) === null || _l === void 0 ? void 0 : _l.bins) !== null && _m !== void 0 ? _m : [];
    var requiredAnyBins = (_q = (_p = (_o = entry.metadata) === null || _o === void 0 ? void 0 : _o.requires) === null || _p === void 0 ? void 0 : _p.anyBins) !== null && _q !== void 0 ? _q : [];
    var requiredEnv = (_t = (_s = (_r = entry.metadata) === null || _r === void 0 ? void 0 : _r.requires) === null || _s === void 0 ? void 0 : _s.env) !== null && _t !== void 0 ? _t : [];
    var requiredConfig = (_w = (_v = (_u = entry.metadata) === null || _u === void 0 ? void 0 : _u.requires) === null || _v === void 0 ? void 0 : _v.config) !== null && _w !== void 0 ? _w : [];
    var requiredOs = (_y = (_x = entry.metadata) === null || _x === void 0 ? void 0 : _x.os) !== null && _y !== void 0 ? _y : [];
    var missingBins = requiredBins.filter(function (bin) {
        var _a, _b;
        if ((0, config_js_1.hasBinary)(bin)) {
            return false;
        }
        if ((_b = (_a = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _a === void 0 ? void 0 : _a.hasBin) === null || _b === void 0 ? void 0 : _b.call(_a, bin)) {
            return false;
        }
        return true;
    });
    var missingAnyBins = requiredAnyBins.length > 0 &&
        !(requiredAnyBins.some(function (bin) { return (0, config_js_1.hasBinary)(bin); }) ||
            ((_0 = (_z = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _z === void 0 ? void 0 : _z.hasAnyBin) === null || _0 === void 0 ? void 0 : _0.call(_z, requiredAnyBins)))
        ? requiredAnyBins
        : [];
    var missingOs = requiredOs.length > 0 &&
        !requiredOs.includes(process.platform) &&
        !((_2 = (_1 = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) === null || _1 === void 0 ? void 0 : _1.platforms) === null || _2 === void 0 ? void 0 : _2.some(function (platform) { return requiredOs.includes(platform); }))
        ? requiredOs
        : [];
    var missingEnv = [];
    for (var _i = 0, requiredEnv_1 = requiredEnv; _i < requiredEnv_1.length; _i++) {
        var envName = requiredEnv_1[_i];
        if (process.env[envName]) {
            continue;
        }
        if ((_3 = hookConfig === null || hookConfig === void 0 ? void 0 : hookConfig.env) === null || _3 === void 0 ? void 0 : _3[envName]) {
            continue;
        }
        missingEnv.push(envName);
    }
    var configChecks = requiredConfig.map(function (pathStr) {
        var value = (0, config_js_1.resolveConfigPath)(config, pathStr);
        var satisfied = (0, config_js_1.isConfigPathTruthy)(config, pathStr);
        return { path: pathStr, value: value, satisfied: satisfied };
    });
    var missingConfig = configChecks.filter(function (check) { return !check.satisfied; }).map(function (check) { return check.path; });
    var missing = always
        ? { bins: [], anyBins: [], env: [], config: [], os: [] }
        : {
            bins: missingBins,
            anyBins: missingAnyBins,
            env: missingEnv,
            config: missingConfig,
            os: missingOs,
        };
    var eligible = !disabled &&
        (always ||
            (missing.bins.length === 0 &&
                missing.anyBins.length === 0 &&
                missing.env.length === 0 &&
                missing.config.length === 0 &&
                missing.os.length === 0));
    return {
        name: entry.hook.name,
        description: entry.hook.description,
        source: entry.hook.source,
        pluginId: entry.hook.pluginId,
        filePath: entry.hook.filePath,
        baseDir: entry.hook.baseDir,
        handlerPath: entry.hook.handlerPath,
        hookKey: hookKey,
        emoji: emoji,
        homepage: homepage,
        events: events,
        always: always,
        disabled: disabled,
        eligible: eligible,
        managedByPlugin: managedByPlugin,
        requirements: {
            bins: requiredBins,
            anyBins: requiredAnyBins,
            env: requiredEnv,
            config: requiredConfig,
            os: requiredOs,
        },
        missing: missing,
        configChecks: configChecks,
        install: normalizeInstallOptions(entry),
    };
}
function buildWorkspaceHookStatus(workspaceDir, opts) {
    var _a, _b;
    var managedHooksDir = (_a = opts === null || opts === void 0 ? void 0 : opts.managedHooksDir) !== null && _a !== void 0 ? _a : node_path_1.default.join(utils_js_1.CONFIG_DIR, "hooks");
    var hookEntries = (_b = opts === null || opts === void 0 ? void 0 : opts.entries) !== null && _b !== void 0 ? _b : (0, workspace_js_1.loadWorkspaceHookEntries)(workspaceDir, opts);
    return {
        workspaceDir: workspaceDir,
        managedHooksDir: managedHooksDir,
        hooks: hookEntries.map(function (entry) { return buildHookStatus(entry, opts === null || opts === void 0 ? void 0 : opts.config, opts === null || opts === void 0 ? void 0 : opts.eligibility); }),
    };
}
