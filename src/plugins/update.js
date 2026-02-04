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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.updateNpmInstalledPlugins = updateNpmInstalledPlugins;
exports.syncPluginsForUpdateChannel = syncPluginsForUpdateChannel;
var promises_1 = require("node:fs/promises");
var utils_js_1 = require("../utils.js");
var discovery_js_1 = require("./discovery.js");
var install_js_1 = require("./install.js");
var installs_js_1 = require("./installs.js");
var manifest_js_1 = require("./manifest.js");
function readInstalledPackageVersion(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile("".concat(dir, "/package.json"), "utf-8")];
                case 1:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    return [2 /*return*/, typeof parsed.version === "string" ? parsed.version : undefined];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveBundledPluginSources(params) {
    var _a, _b, _c, _d;
    var discovery = (0, discovery_js_1.discoverOpenClawPlugins)({ workspaceDir: params.workspaceDir });
    var bundled = new Map();
    for (var _i = 0, _e = discovery.candidates; _i < _e.length; _i++) {
        var candidate = _e[_i];
        if (candidate.origin !== "bundled") {
            continue;
        }
        var manifest = (0, manifest_js_1.loadPluginManifest)(candidate.rootDir);
        if (!manifest.ok) {
            continue;
        }
        var pluginId = manifest.manifest.id;
        if (bundled.has(pluginId)) {
            continue;
        }
        var npmSpec = ((_c = (_b = (_a = candidate.packageManifest) === null || _a === void 0 ? void 0 : _a.install) === null || _b === void 0 ? void 0 : _b.npmSpec) === null || _c === void 0 ? void 0 : _c.trim()) ||
            ((_d = candidate.packageName) === null || _d === void 0 ? void 0 : _d.trim()) ||
            undefined;
        bundled.set(pluginId, {
            pluginId: pluginId,
            localPath: candidate.rootDir,
            npmSpec: npmSpec,
        });
    }
    return bundled;
}
function pathsEqual(left, right) {
    if (!left || !right) {
        return false;
    }
    return (0, utils_js_1.resolveUserPath)(left) === (0, utils_js_1.resolveUserPath)(right);
}
function buildLoadPathHelpers(existing) {
    var paths = __spreadArray([], existing, true);
    var resolveSet = function () { return new Set(paths.map(function (entry) { return (0, utils_js_1.resolveUserPath)(entry); })); };
    var resolved = resolveSet();
    var changed = false;
    var addPath = function (value) {
        var normalized = (0, utils_js_1.resolveUserPath)(value);
        if (resolved.has(normalized)) {
            return;
        }
        paths.push(value);
        resolved.add(normalized);
        changed = true;
    };
    var removePath = function (value) {
        var normalized = (0, utils_js_1.resolveUserPath)(value);
        if (!resolved.has(normalized)) {
            return;
        }
        paths = paths.filter(function (entry) { return (0, utils_js_1.resolveUserPath)(entry) !== normalized; });
        resolved = resolveSet();
        changed = true;
    };
    return {
        addPath: addPath,
        removePath: removePath,
        get changed() {
            return changed;
        },
        get paths() {
            return paths;
        },
    };
}
function updateNpmInstalledPlugins(params) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, installs, targets, outcomes, next, changed, _i, targets_1, pluginId, record, installPath, currentVersion, probe, err_1, nextVersion_1, currentLabel_1, result, err_2, nextVersion, _a, currentLabel, nextLabel;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    logger = (_b = params.logger) !== null && _b !== void 0 ? _b : {};
                    installs = (_d = (_c = params.config.plugins) === null || _c === void 0 ? void 0 : _c.installs) !== null && _d !== void 0 ? _d : {};
                    targets = ((_e = params.pluginIds) === null || _e === void 0 ? void 0 : _e.length) ? params.pluginIds : Object.keys(installs);
                    outcomes = [];
                    next = params.config;
                    changed = false;
                    _i = 0, targets_1 = targets;
                    _m.label = 1;
                case 1:
                    if (!(_i < targets_1.length)) return [3 /*break*/, 16];
                    pluginId = targets_1[_i];
                    if ((_f = params.skipIds) === null || _f === void 0 ? void 0 : _f.has(pluginId)) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "skipped",
                            message: "Skipping \"".concat(pluginId, "\" (already updated)."),
                        });
                        return [3 /*break*/, 15];
                    }
                    record = installs[pluginId];
                    if (!record) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "skipped",
                            message: "No install record for \"".concat(pluginId, "\"."),
                        });
                        return [3 /*break*/, 15];
                    }
                    if (record.source !== "npm") {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "skipped",
                            message: "Skipping \"".concat(pluginId, "\" (source: ").concat(record.source, ")."),
                        });
                        return [3 /*break*/, 15];
                    }
                    if (!record.spec) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "skipped",
                            message: "Skipping \"".concat(pluginId, "\" (missing npm spec)."),
                        });
                        return [3 /*break*/, 15];
                    }
                    installPath = void 0;
                    try {
                        installPath = (_g = record.installPath) !== null && _g !== void 0 ? _g : (0, install_js_1.resolvePluginInstallDir)(pluginId);
                    }
                    catch (err) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "error",
                            message: "Invalid install path for \"".concat(pluginId, "\": ").concat(String(err)),
                        });
                        return [3 /*break*/, 15];
                    }
                    return [4 /*yield*/, readInstalledPackageVersion(installPath)];
                case 2:
                    currentVersion = _m.sent();
                    if (!params.dryRun) return [3 /*break*/, 7];
                    probe = void 0;
                    _m.label = 3;
                case 3:
                    _m.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, install_js_1.installPluginFromNpmSpec)({
                            spec: record.spec,
                            mode: "update",
                            dryRun: true,
                            expectedPluginId: pluginId,
                            logger: logger,
                        })];
                case 4:
                    probe = _m.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _m.sent();
                    outcomes.push({
                        pluginId: pluginId,
                        status: "error",
                        message: "Failed to check ".concat(pluginId, ": ").concat(String(err_1)),
                    });
                    return [3 /*break*/, 15];
                case 6:
                    if (!probe.ok) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "error",
                            message: "Failed to check ".concat(pluginId, ": ").concat(probe.error),
                        });
                        return [3 /*break*/, 15];
                    }
                    nextVersion_1 = (_h = probe.version) !== null && _h !== void 0 ? _h : "unknown";
                    currentLabel_1 = currentVersion !== null && currentVersion !== void 0 ? currentVersion : "unknown";
                    if (currentVersion && probe.version && currentVersion === probe.version) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "unchanged",
                            currentVersion: currentVersion !== null && currentVersion !== void 0 ? currentVersion : undefined,
                            nextVersion: (_j = probe.version) !== null && _j !== void 0 ? _j : undefined,
                            message: "".concat(pluginId, " is up to date (").concat(currentLabel_1, ")."),
                        });
                    }
                    else {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "updated",
                            currentVersion: currentVersion !== null && currentVersion !== void 0 ? currentVersion : undefined,
                            nextVersion: (_k = probe.version) !== null && _k !== void 0 ? _k : undefined,
                            message: "Would update ".concat(pluginId, ": ").concat(currentLabel_1, " -> ").concat(nextVersion_1, "."),
                        });
                    }
                    return [3 /*break*/, 15];
                case 7:
                    result = void 0;
                    _m.label = 8;
                case 8:
                    _m.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, install_js_1.installPluginFromNpmSpec)({
                            spec: record.spec,
                            mode: "update",
                            expectedPluginId: pluginId,
                            logger: logger,
                        })];
                case 9:
                    result = _m.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _m.sent();
                    outcomes.push({
                        pluginId: pluginId,
                        status: "error",
                        message: "Failed to update ".concat(pluginId, ": ").concat(String(err_2)),
                    });
                    return [3 /*break*/, 15];
                case 11:
                    if (!result.ok) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "error",
                            message: "Failed to update ".concat(pluginId, ": ").concat(result.error),
                        });
                        return [3 /*break*/, 15];
                    }
                    if (!((_l = result.version) !== null && _l !== void 0)) return [3 /*break*/, 12];
                    _a = _l;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, readInstalledPackageVersion(result.targetDir)];
                case 13:
                    _a = (_m.sent());
                    _m.label = 14;
                case 14:
                    nextVersion = _a;
                    next = (0, installs_js_1.recordPluginInstall)(next, {
                        pluginId: pluginId,
                        source: "npm",
                        spec: record.spec,
                        installPath: result.targetDir,
                        version: nextVersion,
                    });
                    changed = true;
                    currentLabel = currentVersion !== null && currentVersion !== void 0 ? currentVersion : "unknown";
                    nextLabel = nextVersion !== null && nextVersion !== void 0 ? nextVersion : "unknown";
                    if (currentVersion && nextVersion && currentVersion === nextVersion) {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "unchanged",
                            currentVersion: currentVersion !== null && currentVersion !== void 0 ? currentVersion : undefined,
                            nextVersion: nextVersion !== null && nextVersion !== void 0 ? nextVersion : undefined,
                            message: "".concat(pluginId, " already at ").concat(currentLabel, "."),
                        });
                    }
                    else {
                        outcomes.push({
                            pluginId: pluginId,
                            status: "updated",
                            currentVersion: currentVersion !== null && currentVersion !== void 0 ? currentVersion : undefined,
                            nextVersion: nextVersion !== null && nextVersion !== void 0 ? nextVersion : undefined,
                            message: "Updated ".concat(pluginId, ": ").concat(currentLabel, " -> ").concat(nextLabel, "."),
                        });
                    }
                    _m.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 1];
                case 16: return [2 /*return*/, { config: next, changed: changed, outcomes: outcomes }];
            }
        });
    });
}
function syncPluginsForUpdateChannel(params) {
    return __awaiter(this, void 0, void 0, function () {
        var summary, bundled, next, loadHelpers, installs, changed, _i, _a, _b, pluginId, record, bundledInfo, alreadyBundled, _c, _d, _e, pluginId, record, bundledInfo, spec, result, err_3;
        var _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    summary = {
                        switchedToBundled: [],
                        switchedToNpm: [],
                        warnings: [],
                        errors: [],
                    };
                    bundled = resolveBundledPluginSources({ workspaceDir: params.workspaceDir });
                    if (bundled.size === 0) {
                        return [2 /*return*/, { config: params.config, changed: false, summary: summary }];
                    }
                    next = params.config;
                    loadHelpers = buildLoadPathHelpers((_h = (_g = (_f = next.plugins) === null || _f === void 0 ? void 0 : _f.load) === null || _g === void 0 ? void 0 : _g.paths) !== null && _h !== void 0 ? _h : []);
                    installs = (_k = (_j = next.plugins) === null || _j === void 0 ? void 0 : _j.installs) !== null && _k !== void 0 ? _k : {};
                    changed = false;
                    if (!(params.channel === "dev")) return [3 /*break*/, 1];
                    for (_i = 0, _a = Object.entries(installs); _i < _a.length; _i++) {
                        _b = _a[_i], pluginId = _b[0], record = _b[1];
                        bundledInfo = bundled.get(pluginId);
                        if (!bundledInfo) {
                            continue;
                        }
                        loadHelpers.addPath(bundledInfo.localPath);
                        alreadyBundled = record.source === "path" && pathsEqual(record.sourcePath, bundledInfo.localPath);
                        if (alreadyBundled) {
                            continue;
                        }
                        next = (0, installs_js_1.recordPluginInstall)(next, {
                            pluginId: pluginId,
                            source: "path",
                            sourcePath: bundledInfo.localPath,
                            installPath: bundledInfo.localPath,
                            spec: (_l = record.spec) !== null && _l !== void 0 ? _l : bundledInfo.npmSpec,
                            version: record.version,
                        });
                        summary.switchedToBundled.push(pluginId);
                        changed = true;
                    }
                    return [3 /*break*/, 8];
                case 1:
                    _c = 0, _d = Object.entries(installs);
                    _p.label = 2;
                case 2:
                    if (!(_c < _d.length)) return [3 /*break*/, 8];
                    _e = _d[_c], pluginId = _e[0], record = _e[1];
                    bundledInfo = bundled.get(pluginId);
                    if (!bundledInfo) {
                        return [3 /*break*/, 7];
                    }
                    if (record.source === "npm") {
                        loadHelpers.removePath(bundledInfo.localPath);
                        return [3 /*break*/, 7];
                    }
                    if (record.source !== "path") {
                        return [3 /*break*/, 7];
                    }
                    if (!pathsEqual(record.sourcePath, bundledInfo.localPath)) {
                        return [3 /*break*/, 7];
                    }
                    spec = (_m = record.spec) !== null && _m !== void 0 ? _m : bundledInfo.npmSpec;
                    if (!spec) {
                        summary.warnings.push("Missing npm spec for ".concat(pluginId, "; keeping local path."));
                        return [3 /*break*/, 7];
                    }
                    result = void 0;
                    _p.label = 3;
                case 3:
                    _p.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, install_js_1.installPluginFromNpmSpec)({
                            spec: spec,
                            mode: "update",
                            expectedPluginId: pluginId,
                            logger: params.logger,
                        })];
                case 4:
                    result = _p.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _p.sent();
                    summary.errors.push("Failed to install ".concat(pluginId, ": ").concat(String(err_3)));
                    return [3 /*break*/, 7];
                case 6:
                    if (!result.ok) {
                        summary.errors.push("Failed to install ".concat(pluginId, ": ").concat(result.error));
                        return [3 /*break*/, 7];
                    }
                    next = (0, installs_js_1.recordPluginInstall)(next, {
                        pluginId: pluginId,
                        source: "npm",
                        spec: spec,
                        installPath: result.targetDir,
                        version: result.version,
                        sourcePath: undefined,
                    });
                    summary.switchedToNpm.push(pluginId);
                    changed = true;
                    loadHelpers.removePath(bundledInfo.localPath);
                    _p.label = 7;
                case 7:
                    _c++;
                    return [3 /*break*/, 2];
                case 8:
                    if (loadHelpers.changed) {
                        next = __assign(__assign({}, next), { plugins: __assign(__assign({}, next.plugins), { load: __assign(__assign({}, (_o = next.plugins) === null || _o === void 0 ? void 0 : _o.load), { paths: loadHelpers.paths }) }) });
                        changed = true;
                    }
                    return [2 /*return*/, { config: next, changed: changed, summary: summary }];
            }
        });
    });
}
