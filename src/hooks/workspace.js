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
exports.loadHookEntriesFromDir = loadHookEntriesFromDir;
exports.buildWorkspaceHookSnapshot = buildWorkspaceHookSnapshot;
exports.loadWorkspaceHookEntries = loadWorkspaceHookEntries;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var legacy_names_js_1 = require("../compat/legacy-names.js");
var utils_js_1 = require("../utils.js");
var bundled_dir_js_1 = require("./bundled-dir.js");
var config_js_1 = require("./config.js");
var frontmatter_js_1 = require("./frontmatter.js");
function filterHookEntries(entries, config, eligibility) {
    return entries.filter(function (entry) { return (0, config_js_1.shouldIncludeHook)({ entry: entry, config: config, eligibility: eligibility }); });
}
function readHookPackageManifest(dir) {
    var manifestPath = node_path_1.default.join(dir, "package.json");
    if (!node_fs_1.default.existsSync(manifestPath)) {
        return null;
    }
    try {
        var raw = node_fs_1.default.readFileSync(manifestPath, "utf-8");
        return JSON.parse(raw);
    }
    catch (_a) {
        return null;
    }
}
function resolvePackageHooks(manifest) {
    var _a;
    var raw = (_a = manifest[legacy_names_js_1.MANIFEST_KEY]) === null || _a === void 0 ? void 0 : _a.hooks;
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw.map(function (entry) { return (typeof entry === "string" ? entry.trim() : ""); }).filter(Boolean);
}
function loadHookFromDir(params) {
    var hookMdPath = node_path_1.default.join(params.hookDir, "HOOK.md");
    if (!node_fs_1.default.existsSync(hookMdPath)) {
        return null;
    }
    try {
        var content = node_fs_1.default.readFileSync(hookMdPath, "utf-8");
        var frontmatter = (0, frontmatter_js_1.parseFrontmatter)(content);
        var name_1 = frontmatter.name || params.nameHint || node_path_1.default.basename(params.hookDir);
        var description = frontmatter.description || "";
        var handlerCandidates = ["handler.ts", "handler.js", "index.ts", "index.js"];
        var handlerPath = void 0;
        for (var _i = 0, handlerCandidates_1 = handlerCandidates; _i < handlerCandidates_1.length; _i++) {
            var candidate = handlerCandidates_1[_i];
            var candidatePath = node_path_1.default.join(params.hookDir, candidate);
            if (node_fs_1.default.existsSync(candidatePath)) {
                handlerPath = candidatePath;
                break;
            }
        }
        if (!handlerPath) {
            console.warn("[hooks] Hook \"".concat(name_1, "\" has HOOK.md but no handler file in ").concat(params.hookDir));
            return null;
        }
        return {
            name: name_1,
            description: description,
            source: params.source,
            pluginId: params.pluginId,
            filePath: hookMdPath,
            baseDir: params.hookDir,
            handlerPath: handlerPath,
        };
    }
    catch (err) {
        console.warn("[hooks] Failed to load hook from ".concat(params.hookDir, ":"), err);
        return null;
    }
}
/**
 * Scan a directory for hooks (subdirectories containing HOOK.md)
 */
function loadHooksFromDir(params) {
    var dir = params.dir, source = params.source, pluginId = params.pluginId;
    if (!node_fs_1.default.existsSync(dir)) {
        return [];
    }
    var stat = node_fs_1.default.statSync(dir);
    if (!stat.isDirectory()) {
        return [];
    }
    var hooks = [];
    var entries = node_fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        if (!entry.isDirectory()) {
            continue;
        }
        var hookDir = node_path_1.default.join(dir, entry.name);
        var manifest = readHookPackageManifest(hookDir);
        var packageHooks = manifest ? resolvePackageHooks(manifest) : [];
        if (packageHooks.length > 0) {
            for (var _a = 0, packageHooks_1 = packageHooks; _a < packageHooks_1.length; _a++) {
                var hookPath = packageHooks_1[_a];
                var resolvedHookDir = node_path_1.default.resolve(hookDir, hookPath);
                var hook_1 = loadHookFromDir({
                    hookDir: resolvedHookDir,
                    source: source,
                    pluginId: pluginId,
                    nameHint: node_path_1.default.basename(resolvedHookDir),
                });
                if (hook_1) {
                    hooks.push(hook_1);
                }
            }
            continue;
        }
        var hook = loadHookFromDir({
            hookDir: hookDir,
            source: source,
            pluginId: pluginId,
            nameHint: entry.name,
        });
        if (hook) {
            hooks.push(hook);
        }
    }
    return hooks;
}
function loadHookEntriesFromDir(params) {
    var hooks = loadHooksFromDir({
        dir: params.dir,
        source: params.source,
        pluginId: params.pluginId,
    });
    return hooks.map(function (hook) {
        var frontmatter = {};
        try {
            var raw = node_fs_1.default.readFileSync(hook.filePath, "utf-8");
            frontmatter = (0, frontmatter_js_1.parseFrontmatter)(raw);
        }
        catch (_a) {
            // ignore malformed hooks
        }
        var entry = {
            hook: __assign(__assign({}, hook), { source: params.source, pluginId: params.pluginId }),
            frontmatter: frontmatter,
            metadata: (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter),
            invocation: (0, frontmatter_js_1.resolveHookInvocationPolicy)(frontmatter),
        };
        return entry;
    });
}
function loadHookEntries(workspaceDir, opts) {
    var _a, _b, _c, _d, _e, _f, _g;
    var managedHooksDir = (_a = opts === null || opts === void 0 ? void 0 : opts.managedHooksDir) !== null && _a !== void 0 ? _a : node_path_1.default.join(utils_js_1.CONFIG_DIR, "hooks");
    var workspaceHooksDir = node_path_1.default.join(workspaceDir, "hooks");
    var bundledHooksDir = (_b = opts === null || opts === void 0 ? void 0 : opts.bundledHooksDir) !== null && _b !== void 0 ? _b : (0, bundled_dir_js_1.resolveBundledHooksDir)();
    var extraDirsRaw = (_g = (_f = (_e = (_d = (_c = opts === null || opts === void 0 ? void 0 : opts.config) === null || _c === void 0 ? void 0 : _c.hooks) === null || _d === void 0 ? void 0 : _d.internal) === null || _e === void 0 ? void 0 : _e.load) === null || _f === void 0 ? void 0 : _f.extraDirs) !== null && _g !== void 0 ? _g : [];
    var extraDirs = extraDirsRaw
        .map(function (d) { return (typeof d === "string" ? d.trim() : ""); })
        .filter(Boolean);
    var bundledHooks = bundledHooksDir
        ? loadHooksFromDir({
            dir: bundledHooksDir,
            source: "openclaw-bundled",
        })
        : [];
    var extraHooks = extraDirs.flatMap(function (dir) {
        var resolved = (0, utils_js_1.resolveUserPath)(dir);
        return loadHooksFromDir({
            dir: resolved,
            source: "openclaw-workspace", // Extra dirs treated as workspace
        });
    });
    var managedHooks = loadHooksFromDir({
        dir: managedHooksDir,
        source: "openclaw-managed",
    });
    var workspaceHooks = loadHooksFromDir({
        dir: workspaceHooksDir,
        source: "openclaw-workspace",
    });
    var merged = new Map();
    // Precedence: extra < bundled < managed < workspace (workspace wins)
    for (var _i = 0, extraHooks_1 = extraHooks; _i < extraHooks_1.length; _i++) {
        var hook = extraHooks_1[_i];
        merged.set(hook.name, hook);
    }
    for (var _h = 0, bundledHooks_1 = bundledHooks; _h < bundledHooks_1.length; _h++) {
        var hook = bundledHooks_1[_h];
        merged.set(hook.name, hook);
    }
    for (var _j = 0, managedHooks_1 = managedHooks; _j < managedHooks_1.length; _j++) {
        var hook = managedHooks_1[_j];
        merged.set(hook.name, hook);
    }
    for (var _k = 0, workspaceHooks_1 = workspaceHooks; _k < workspaceHooks_1.length; _k++) {
        var hook = workspaceHooks_1[_k];
        merged.set(hook.name, hook);
    }
    return Array.from(merged.values()).map(function (hook) {
        var frontmatter = {};
        try {
            var raw = node_fs_1.default.readFileSync(hook.filePath, "utf-8");
            frontmatter = (0, frontmatter_js_1.parseFrontmatter)(raw);
        }
        catch (_a) {
            // ignore malformed hooks
        }
        return {
            hook: hook,
            frontmatter: frontmatter,
            metadata: (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter),
            invocation: (0, frontmatter_js_1.resolveHookInvocationPolicy)(frontmatter),
        };
    });
}
function buildWorkspaceHookSnapshot(workspaceDir, opts) {
    var _a;
    var hookEntries = (_a = opts === null || opts === void 0 ? void 0 : opts.entries) !== null && _a !== void 0 ? _a : loadHookEntries(workspaceDir, opts);
    var eligible = filterHookEntries(hookEntries, opts === null || opts === void 0 ? void 0 : opts.config, opts === null || opts === void 0 ? void 0 : opts.eligibility);
    return {
        hooks: eligible.map(function (entry) {
            var _a, _b;
            return ({
                name: entry.hook.name,
                events: (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.events) !== null && _b !== void 0 ? _b : [],
            });
        }),
        resolvedHooks: eligible.map(function (entry) { return entry.hook; }),
        version: opts === null || opts === void 0 ? void 0 : opts.snapshotVersion,
    };
}
function loadWorkspaceHookEntries(workspaceDir, opts) {
    return loadHookEntries(workspaceDir, opts);
}
