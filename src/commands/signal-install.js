"use strict";
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
exports.installSignalCli = installSignalCli;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_https_1 = require("node:https");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var promises_2 = require("node:stream/promises");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
function looksLikeArchive(name) {
    return name.endsWith(".tar.gz") || name.endsWith(".tgz") || name.endsWith(".zip");
}
function pickAsset(assets, platform) {
    var withName = assets.filter(function (asset) {
        return Boolean(asset.name && asset.browser_download_url);
    });
    var byName = function (pattern) {
        return withName.find(function (asset) { return pattern.test(asset.name.toLowerCase()); });
    };
    if (platform === "linux") {
        return (byName(/linux-native/) ||
            byName(/linux/) ||
            withName.find(function (asset) { return looksLikeArchive(asset.name.toLowerCase()); }));
    }
    if (platform === "darwin") {
        return (byName(/macos|osx|darwin/) ||
            withName.find(function (asset) { return looksLikeArchive(asset.name.toLowerCase()); }));
    }
    if (platform === "win32") {
        return (byName(/windows|win/) || withName.find(function (asset) { return looksLikeArchive(asset.name.toLowerCase()); }));
    }
    return withName.find(function (asset) { return looksLikeArchive(asset.name.toLowerCase()); });
}
function downloadToFile(url_1, dest_1) {
    return __awaiter(this, arguments, void 0, function (url, dest, maxRedirects) {
        if (maxRedirects === void 0) { maxRedirects = 5; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var req = (0, node_https_1.request)(url, function (res) {
                            var _a;
                            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
                                var location_1 = res.headers.location;
                                if (!location_1 || maxRedirects <= 0) {
                                    reject(new Error("Redirect loop or missing Location header"));
                                    return;
                                }
                                var redirectUrl = new URL(location_1, url).href;
                                resolve(downloadToFile(redirectUrl, dest, maxRedirects - 1));
                                return;
                            }
                            if (!res.statusCode || res.statusCode >= 400) {
                                reject(new Error("HTTP ".concat((_a = res.statusCode) !== null && _a !== void 0 ? _a : "?", " downloading file")));
                                return;
                            }
                            var out = (0, node_fs_1.createWriteStream)(dest);
                            (0, promises_2.pipeline)(res, out).then(resolve).catch(reject);
                        });
                        req.on("error", reject);
                        req.end();
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function findSignalCliBinary(root) {
    return __awaiter(this, void 0, void 0, function () {
        var candidates, enqueue;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    candidates = [];
                    enqueue = function (dir, depth) { return __awaiter(_this, void 0, void 0, function () {
                        var entries, _i, entries_1, entry, full;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (depth > 3) {
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, promises_1.default.readdir(dir, { withFileTypes: true }).catch(function () { return []; })];
                                case 1:
                                    entries = _a.sent();
                                    _i = 0, entries_1 = entries;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < entries_1.length)) return [3 /*break*/, 6];
                                    entry = entries_1[_i];
                                    full = node_path_1.default.join(dir, entry.name);
                                    if (!entry.isDirectory()) return [3 /*break*/, 4];
                                    return [4 /*yield*/, enqueue(full, depth + 1)];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (entry.isFile() && entry.name === "signal-cli") {
                                        candidates.push(full);
                                    }
                                    _a.label = 5;
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, enqueue(root, 0)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, (_a = candidates[0]) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
function installSignalCli(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, response, payload, version, assets, asset, assetName, assetUrl, tmpDir, archivePath, installRoot, cliPath;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (process.platform === "win32") {
                        return [2 /*return*/, {
                                ok: false,
                                error: "Signal CLI auto-install is not supported on Windows yet.",
                            }];
                    }
                    apiUrl = "https://api.github.com/repos/AsamK/signal-cli/releases/latest";
                    return [4 /*yield*/, fetch(apiUrl, {
                            headers: {
                                "User-Agent": "openclaw",
                                Accept: "application/vnd.github+json",
                            },
                        })];
                case 1:
                    response = _f.sent();
                    if (!response.ok) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "Failed to fetch release info (".concat(response.status, ")"),
                            }];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    payload = (_f.sent());
                    version = (_b = (_a = payload.tag_name) === null || _a === void 0 ? void 0 : _a.replace(/^v/, "")) !== null && _b !== void 0 ? _b : "unknown";
                    assets = (_c = payload.assets) !== null && _c !== void 0 ? _c : [];
                    asset = pickAsset(assets, process.platform);
                    assetName = (_d = asset === null || asset === void 0 ? void 0 : asset.name) !== null && _d !== void 0 ? _d : "";
                    assetUrl = (_e = asset === null || asset === void 0 ? void 0 : asset.browser_download_url) !== null && _e !== void 0 ? _e : "";
                    if (!assetName || !assetUrl) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "No compatible release asset found for this platform.",
                            }];
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-signal-"))];
                case 3:
                    tmpDir = _f.sent();
                    archivePath = node_path_1.default.join(tmpDir, assetName);
                    runtime.log("Downloading signal-cli ".concat(version, " (").concat(assetName, ")\u2026"));
                    return [4 /*yield*/, downloadToFile(assetUrl, archivePath)];
                case 4:
                    _f.sent();
                    installRoot = node_path_1.default.join(utils_js_1.CONFIG_DIR, "tools", "signal-cli", version);
                    return [4 /*yield*/, promises_1.default.mkdir(installRoot, { recursive: true })];
                case 5:
                    _f.sent();
                    if (!assetName.endsWith(".zip")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["unzip", "-q", archivePath, "-d", installRoot], {
                            timeoutMs: 60000,
                        })];
                case 6:
                    _f.sent();
                    return [3 /*break*/, 10];
                case 7:
                    if (!(assetName.endsWith(".tar.gz") || assetName.endsWith(".tgz"))) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["tar", "-xzf", archivePath, "-C", installRoot], {
                            timeoutMs: 60000,
                        })];
                case 8:
                    _f.sent();
                    return [3 /*break*/, 10];
                case 9: return [2 /*return*/, { ok: false, error: "Unsupported archive type: ".concat(assetName) }];
                case 10: return [4 /*yield*/, findSignalCliBinary(installRoot)];
                case 11:
                    cliPath = _f.sent();
                    if (!cliPath) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "signal-cli binary not found after extracting ".concat(assetName),
                            }];
                    }
                    return [4 /*yield*/, promises_1.default.chmod(cliPath, 493).catch(function () { })];
                case 12:
                    _f.sent();
                    return [2 /*return*/, { ok: true, cliPath: cliPath, version: version }];
            }
        });
    });
}
