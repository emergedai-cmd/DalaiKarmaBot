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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGitUpdateStatus = checkGitUpdateStatus;
exports.checkDepsStatus = checkDepsStatus;
exports.fetchNpmLatestVersion = fetchNpmLatestVersion;
exports.fetchNpmTagVersion = fetchNpmTagVersion;
exports.resolveNpmChannelTag = resolveNpmChannelTag;
exports.compareSemverStrings = compareSemverStrings;
exports.checkUpdateStatus = checkUpdateStatus;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var exec_js_1 = require("../process/exec.js");
var runtime_guard_js_1 = require("./runtime-guard.js");
var update_channels_js_1 = require("./update-channels.js");
function exists(p) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.access(p)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function detectPackageManager(root) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, pm, _a, files;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(root, "package.json"), "utf-8")];
                case 1:
                    raw = _d.sent();
                    parsed = JSON.parse(raw);
                    pm = (_c = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.packageManager) === null || _b === void 0 ? void 0 : _b.split("@")[0]) === null || _c === void 0 ? void 0 : _c.trim();
                    if (pm === "pnpm" || pm === "bun" || pm === "npm") {
                        return [2 /*return*/, pm];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _d.sent();
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, promises_1.default.readdir(root).catch(function () { return []; })];
                case 4:
                    files = _d.sent();
                    if (files.includes("pnpm-lock.yaml")) {
                        return [2 /*return*/, "pnpm"];
                    }
                    if (files.includes("bun.lockb")) {
                        return [2 /*return*/, "bun"];
                    }
                    if (files.includes("package-lock.json")) {
                        return [2 /*return*/, "npm"];
                    }
                    return [2 /*return*/, "unknown"];
            }
        });
    });
}
function detectGitRoot(root) {
    return __awaiter(this, void 0, void 0, function () {
        var res, top;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "rev-parse", "--show-toplevel"], {
                        timeoutMs: 4000,
                    }).catch(function () { return null; })];
                case 1:
                    res = _a.sent();
                    if (!res || res.code !== 0) {
                        return [2 /*return*/, null];
                    }
                    top = res.stdout.trim();
                    return [2 /*return*/, top ? node_path_1.default.resolve(top) : null];
            }
        });
    });
}
function checkGitUpdateStatus(params) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, root, base, branchRes, branch, shaRes, sha, tagRes, tag, upstreamRes, upstream, dirtyRes, dirty, fetchOk, _a, counts, _b, parseCounts, parsed;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    timeoutMs = (_c = params.timeoutMs) !== null && _c !== void 0 ? _c : 6000;
                    root = node_path_1.default.resolve(params.root);
                    base = {
                        root: root,
                        sha: null,
                        tag: null,
                        branch: null,
                        upstream: null,
                        dirty: null,
                        ahead: null,
                        behind: null,
                        fetchOk: null,
                    };
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "rev-parse", "--abbrev-ref", "HEAD"], { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 1:
                    branchRes = _g.sent();
                    if (!branchRes || branchRes.code !== 0) {
                        return [2 /*return*/, __assign(__assign({}, base), { error: ((_d = branchRes === null || branchRes === void 0 ? void 0 : branchRes.stderr) === null || _d === void 0 ? void 0 : _d.trim()) || "git unavailable" })];
                    }
                    branch = branchRes.stdout.trim() || null;
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "rev-parse", "HEAD"], {
                            timeoutMs: timeoutMs,
                        }).catch(function () { return null; })];
                case 2:
                    shaRes = _g.sent();
                    sha = shaRes && shaRes.code === 0 ? shaRes.stdout.trim() : null;
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "describe", "--tags", "--exact-match"], { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 3:
                    tagRes = _g.sent();
                    tag = tagRes && tagRes.code === 0 ? tagRes.stdout.trim() : null;
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "rev-parse", "--abbrev-ref", "@{upstream}"], { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 4:
                    upstreamRes = _g.sent();
                    upstream = upstreamRes && upstreamRes.code === 0 ? upstreamRes.stdout.trim() : null;
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "status", "--porcelain", "--", ":!dist/control-ui/"], { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 5:
                    dirtyRes = _g.sent();
                    dirty = dirtyRes && dirtyRes.code === 0 ? dirtyRes.stdout.trim().length > 0 : null;
                    if (!params.fetch) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "fetch", "--quiet", "--prune"], { timeoutMs: timeoutMs })
                            .then(function (r) { return r.code === 0; })
                            .catch(function () { return false; })];
                case 6:
                    _a = _g.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = null;
                    _g.label = 8;
                case 8:
                    fetchOk = _a;
                    if (!(upstream && upstream.length > 0)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["git", "-C", root, "rev-list", "--left-right", "--count", "HEAD...".concat(upstream)], { timeoutMs: timeoutMs }).catch(function () { return null; })];
                case 9:
                    _b = _g.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _b = null;
                    _g.label = 11;
                case 11:
                    counts = _b;
                    parseCounts = function (raw) {
                        var _a, _b;
                        var parts = raw.trim().split(/\s+/);
                        if (parts.length < 2) {
                            return null;
                        }
                        var ahead = Number.parseInt((_a = parts[0]) !== null && _a !== void 0 ? _a : "", 10);
                        var behind = Number.parseInt((_b = parts[1]) !== null && _b !== void 0 ? _b : "", 10);
                        if (!Number.isFinite(ahead) || !Number.isFinite(behind)) {
                            return null;
                        }
                        return { ahead: ahead, behind: behind };
                    };
                    parsed = counts && counts.code === 0 ? parseCounts(counts.stdout) : null;
                    return [2 /*return*/, {
                            root: root,
                            sha: sha,
                            tag: tag,
                            branch: branch,
                            upstream: upstream,
                            dirty: dirty,
                            ahead: (_e = parsed === null || parsed === void 0 ? void 0 : parsed.ahead) !== null && _e !== void 0 ? _e : null,
                            behind: (_f = parsed === null || parsed === void 0 ? void 0 : parsed.behind) !== null && _f !== void 0 ? _f : null,
                            fetchOk: fetchOk,
                        }];
            }
        });
    });
}
function statMtimeMs(p) {
    return __awaiter(this, void 0, void 0, function () {
        var st, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(p)];
                case 1:
                    st = _b.sent();
                    return [2 /*return*/, st.mtimeMs];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveDepsMarker(params) {
    var root = params.root;
    if (params.manager === "pnpm") {
        return {
            lockfilePath: node_path_1.default.join(root, "pnpm-lock.yaml"),
            markerPath: node_path_1.default.join(root, "node_modules", ".modules.yaml"),
        };
    }
    if (params.manager === "bun") {
        return {
            lockfilePath: node_path_1.default.join(root, "bun.lockb"),
            markerPath: node_path_1.default.join(root, "node_modules"),
        };
    }
    if (params.manager === "npm") {
        return {
            lockfilePath: node_path_1.default.join(root, "package-lock.json"),
            markerPath: node_path_1.default.join(root, "node_modules"),
        };
    }
    return { lockfilePath: null, markerPath: null };
}
function checkDepsStatus(params) {
    return __awaiter(this, void 0, void 0, function () {
        var root, _a, lockfilePath, markerPath, lockExists, markerExists, lockMtime, markerMtime;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    root = node_path_1.default.resolve(params.root);
                    _a = resolveDepsMarker({
                        root: root,
                        manager: params.manager,
                    }), lockfilePath = _a.lockfilePath, markerPath = _a.markerPath;
                    if (!lockfilePath || !markerPath) {
                        return [2 /*return*/, {
                                manager: params.manager,
                                status: "unknown",
                                lockfilePath: lockfilePath,
                                markerPath: markerPath,
                                reason: "unknown package manager",
                            }];
                    }
                    return [4 /*yield*/, exists(lockfilePath)];
                case 1:
                    lockExists = _b.sent();
                    return [4 /*yield*/, exists(markerPath)];
                case 2:
                    markerExists = _b.sent();
                    if (!lockExists) {
                        return [2 /*return*/, {
                                manager: params.manager,
                                status: "unknown",
                                lockfilePath: lockfilePath,
                                markerPath: markerPath,
                                reason: "lockfile missing",
                            }];
                    }
                    if (!markerExists) {
                        return [2 /*return*/, {
                                manager: params.manager,
                                status: "missing",
                                lockfilePath: lockfilePath,
                                markerPath: markerPath,
                                reason: "node_modules marker missing",
                            }];
                    }
                    return [4 /*yield*/, statMtimeMs(lockfilePath)];
                case 3:
                    lockMtime = _b.sent();
                    return [4 /*yield*/, statMtimeMs(markerPath)];
                case 4:
                    markerMtime = _b.sent();
                    if (!lockMtime || !markerMtime) {
                        return [2 /*return*/, {
                                manager: params.manager,
                                status: "unknown",
                                lockfilePath: lockfilePath,
                                markerPath: markerPath,
                            }];
                    }
                    if (lockMtime > markerMtime + 1000) {
                        return [2 /*return*/, {
                                manager: params.manager,
                                status: "stale",
                                lockfilePath: lockfilePath,
                                markerPath: markerPath,
                                reason: "lockfile newer than install marker",
                            }];
                    }
                    return [2 /*return*/, {
                            manager: params.manager,
                            status: "ok",
                            lockfilePath: lockfilePath,
                            markerPath: markerPath,
                        }];
            }
        });
    });
}
function fetchWithTimeout(url, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var ctrl, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctrl = new AbortController();
                    t = setTimeout(function () { return ctrl.abort(); }, Math.max(250, timeoutMs));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fetch(url, { signal: ctrl.signal })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    clearTimeout(t);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchNpmLatestVersion(params) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchNpmTagVersion({ tag: "latest", timeoutMs: params === null || params === void 0 ? void 0 : params.timeoutMs })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, {
                            latestVersion: res.version,
                            error: res.error,
                        }];
            }
        });
    });
}
function fetchNpmTagVersion(params) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, tag, res, json, version, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timeoutMs = (_a = params === null || params === void 0 ? void 0 : params.timeoutMs) !== null && _a !== void 0 ? _a : 3500;
                    tag = params.tag;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetchWithTimeout("https://registry.npmjs.org/openclaw/".concat(encodeURIComponent(tag)), timeoutMs)];
                case 2:
                    res = _b.sent();
                    if (!res.ok) {
                        return [2 /*return*/, { tag: tag, version: null, error: "HTTP ".concat(res.status) }];
                    }
                    return [4 /*yield*/, res.json()];
                case 3:
                    json = (_b.sent());
                    version = typeof (json === null || json === void 0 ? void 0 : json.version) === "string" ? json.version : null;
                    return [2 /*return*/, { tag: tag, version: version }];
                case 4:
                    err_1 = _b.sent();
                    return [2 /*return*/, { tag: tag, version: null, error: String(err_1) }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function resolveNpmChannelTag(params) {
    return __awaiter(this, void 0, void 0, function () {
        var channelTag, channelStatus, latestStatus, cmp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channelTag = (0, update_channels_js_1.channelToNpmTag)(params.channel);
                    return [4 /*yield*/, fetchNpmTagVersion({ tag: channelTag, timeoutMs: params.timeoutMs })];
                case 1:
                    channelStatus = _a.sent();
                    if (params.channel !== "beta") {
                        return [2 /*return*/, { tag: channelTag, version: channelStatus.version }];
                    }
                    return [4 /*yield*/, fetchNpmTagVersion({ tag: "latest", timeoutMs: params.timeoutMs })];
                case 2:
                    latestStatus = _a.sent();
                    if (!latestStatus.version) {
                        return [2 /*return*/, { tag: channelTag, version: channelStatus.version }];
                    }
                    if (!channelStatus.version) {
                        return [2 /*return*/, { tag: "latest", version: latestStatus.version }];
                    }
                    cmp = compareSemverStrings(channelStatus.version, latestStatus.version);
                    if (cmp != null && cmp < 0) {
                        return [2 /*return*/, { tag: "latest", version: latestStatus.version }];
                    }
                    return [2 /*return*/, { tag: channelTag, version: channelStatus.version }];
            }
        });
    });
}
function compareSemverStrings(a, b) {
    var pa = (0, runtime_guard_js_1.parseSemver)(a);
    var pb = (0, runtime_guard_js_1.parseSemver)(b);
    if (!pa || !pb) {
        return null;
    }
    if (pa.major !== pb.major) {
        return pa.major < pb.major ? -1 : 1;
    }
    if (pa.minor !== pb.minor) {
        return pa.minor < pb.minor ? -1 : 1;
    }
    if (pa.patch !== pb.patch) {
        return pa.patch < pb.patch ? -1 : 1;
    }
    return 0;
}
function checkUpdateStatus(params) {
    return __awaiter(this, void 0, void 0, function () {
        var timeoutMs, root, _a, pm, gitRoot, isGit, installKind, git, _b, deps, registry, _c;
        var _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    timeoutMs = (_e = params.timeoutMs) !== null && _e !== void 0 ? _e : 6000;
                    root = params.root ? node_path_1.default.resolve(params.root) : null;
                    if (!!root) return [3 /*break*/, 4];
                    _d = {
                        root: null,
                        installKind: "unknown",
                        packageManager: "unknown"
                    };
                    if (!params.includeRegistry) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchNpmLatestVersion({ timeoutMs: timeoutMs })];
                case 1:
                    _a = _f.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _f.label = 3;
                case 3: return [2 /*return*/, (_d.registry = _a,
                        _d)];
                case 4: return [4 /*yield*/, detectPackageManager(root)];
                case 5:
                    pm = _f.sent();
                    return [4 /*yield*/, detectGitRoot(root)];
                case 6:
                    gitRoot = _f.sent();
                    isGit = gitRoot && node_path_1.default.resolve(gitRoot) === root;
                    installKind = isGit ? "git" : "package";
                    if (!isGit) return [3 /*break*/, 8];
                    return [4 /*yield*/, checkGitUpdateStatus({
                            root: root,
                            timeoutMs: timeoutMs,
                            fetch: Boolean(params.fetchGit),
                        })];
                case 7:
                    _b = _f.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = undefined;
                    _f.label = 9;
                case 9:
                    git = _b;
                    return [4 /*yield*/, checkDepsStatus({ root: root, manager: pm })];
                case 10:
                    deps = _f.sent();
                    if (!params.includeRegistry) return [3 /*break*/, 12];
                    return [4 /*yield*/, fetchNpmLatestVersion({ timeoutMs: timeoutMs })];
                case 11:
                    _c = _f.sent();
                    return [3 /*break*/, 13];
                case 12:
                    _c = undefined;
                    _f.label = 13;
                case 13:
                    registry = _c;
                    return [2 /*return*/, {
                            root: root,
                            installKind: installKind,
                            packageManager: pm,
                            git: git,
                            deps: deps,
                            registry: registry,
                        }];
            }
        });
    });
}
