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
exports.resolvePythonExecutablePath = resolvePythonExecutablePath;
exports.ensureDependency = ensureDependency;
exports.ensureGcloudAuth = ensureGcloudAuth;
exports.runGcloud = runGcloud;
exports.ensureTopic = ensureTopic;
exports.ensureSubscription = ensureSubscription;
exports.ensureTailscaleEndpoint = ensureTailscaleEndpoint;
exports.resolveProjectIdFromGogCredentials = resolveProjectIdFromGogCredentials;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var skills_js_1 = require("../agents/skills.js");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
var gmail_js_1 = require("./gmail.js");
var cachedPythonPath;
var MAX_OUTPUT_CHARS = 800;
function trimOutput(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    if (trimmed.length <= MAX_OUTPUT_CHARS) {
        return trimmed;
    }
    return "".concat(trimmed.slice(0, MAX_OUTPUT_CHARS), "\u2026");
}
function formatCommandFailure(command, result) {
    var _a;
    var code = (_a = result.code) !== null && _a !== void 0 ? _a : "null";
    var signal = result.signal ? ", signal=".concat(result.signal) : "";
    var killed = result.killed ? ", killed=true" : "";
    var stderr = trimOutput(result.stderr);
    var stdout = trimOutput(result.stdout);
    var lines = ["".concat(command, " failed (code=").concat(code).concat(signal).concat(killed, ")")];
    if (stderr) {
        lines.push("stderr: ".concat(stderr));
    }
    if (stdout) {
        lines.push("stdout: ".concat(stdout));
    }
    return lines.join("\n");
}
function formatCommandResult(command, result) {
    var _a;
    var code = (_a = result.code) !== null && _a !== void 0 ? _a : "null";
    var signal = result.signal ? ", signal=".concat(result.signal) : "";
    var killed = result.killed ? ", killed=true" : "";
    var stderr = trimOutput(result.stderr);
    var stdout = trimOutput(result.stdout);
    var lines = ["".concat(command, " exited (code=").concat(code).concat(signal).concat(killed, ")")];
    if (stderr) {
        lines.push("stderr: ".concat(stderr));
    }
    if (stdout) {
        lines.push("stdout: ".concat(stdout));
    }
    return lines.join("\n");
}
function formatJsonParseFailure(command, result, err) {
    var reason = err instanceof Error ? err.message : String(err);
    return "".concat(command, " returned invalid JSON: ").concat(reason, "\n").concat(formatCommandResult(command, result));
}
function formatCommand(command, args) {
    return __spreadArray([command], args, true).join(" ");
}
function findExecutablesOnPath(bins) {
    var _a;
    var pathEnv = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
    var parts = pathEnv.split(node_path_1.default.delimiter).filter(Boolean);
    var seen = new Set();
    var matches = [];
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        for (var _b = 0, bins_1 = bins; _b < bins_1.length; _b++) {
            var bin = bins_1[_b];
            var candidate = node_path_1.default.join(part, bin);
            if (seen.has(candidate)) {
                continue;
            }
            try {
                node_fs_1.default.accessSync(candidate, node_fs_1.default.constants.X_OK);
                matches.push(candidate);
                seen.add(candidate);
            }
            catch (_c) {
                // keep scanning
            }
        }
    }
    return matches;
}
function ensurePathIncludes(dirPath, position) {
    var _a;
    var pathEnv = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
    var parts = pathEnv.split(node_path_1.default.delimiter).filter(Boolean);
    if (parts.includes(dirPath)) {
        return;
    }
    var next = position === "prepend" ? __spreadArray([dirPath], parts, true) : __spreadArray(__spreadArray([], parts, true), [dirPath], false);
    process.env.PATH = next.join(node_path_1.default.delimiter);
}
function ensureGcloudOnPath() {
    if ((0, skills_js_1.hasBinary)("gcloud")) {
        return true;
    }
    var candidates = [
        "/opt/homebrew/share/google-cloud-sdk/bin/gcloud",
        "/usr/local/share/google-cloud-sdk/bin/gcloud",
        "/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin/gcloud",
        "/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin/gcloud",
    ];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        try {
            node_fs_1.default.accessSync(candidate, node_fs_1.default.constants.X_OK);
            ensurePathIncludes(node_path_1.default.dirname(candidate), "append");
            return true;
        }
        catch (_a) {
            // keep scanning
        }
    }
    return false;
}
function resolvePythonExecutablePath() {
    return __awaiter(this, void 0, void 0, function () {
        var candidates, _i, candidates_2, candidate, res, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cachedPythonPath !== undefined) {
                        return [2 /*return*/, cachedPythonPath !== null && cachedPythonPath !== void 0 ? cachedPythonPath : undefined];
                    }
                    candidates = findExecutablesOnPath(["python3", "python"]);
                    _i = 0, candidates_2 = candidates;
                    _a.label = 1;
                case 1:
                    if (!(_i < candidates_2.length)) return [3 /*break*/, 4];
                    candidate = candidates_2[_i];
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([candidate, "-c", "import os, sys; print(os.path.realpath(sys.executable))"], { timeoutMs: 2000 })];
                case 2:
                    res = _a.sent();
                    if (res.code !== 0) {
                        return [3 /*break*/, 3];
                    }
                    resolved = res.stdout.trim().split(/\s+/)[0];
                    if (!resolved) {
                        return [3 /*break*/, 3];
                    }
                    try {
                        node_fs_1.default.accessSync(resolved, node_fs_1.default.constants.X_OK);
                        cachedPythonPath = resolved;
                        return [2 /*return*/, resolved];
                    }
                    catch (_b) {
                        // keep scanning
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    cachedPythonPath = null;
                    return [2 /*return*/, undefined];
            }
        });
    });
}
function gcloudEnv() {
    return __awaiter(this, void 0, void 0, function () {
        var pythonPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.env.CLOUDSDK_PYTHON) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, resolvePythonExecutablePath()];
                case 1:
                    pythonPath = _a.sent();
                    if (!pythonPath) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, { CLOUDSDK_PYTHON: pythonPath }];
            }
        });
    });
}
function runGcloudCommand(args, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = exec_js_1.runCommandWithTimeout;
                    _b = [__spreadArray(["gcloud"], args, true)];
                    _c = {
                        timeoutMs: timeoutMs
                    };
                    return [4 /*yield*/, gcloudEnv()];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.env = _d.sent(),
                            _c)]))];
                case 2: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function ensureDependency(bin, brewArgs) {
    return __awaiter(this, void 0, void 0, function () {
        var brewEnv, _a, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (bin === "gcloud" && ensureGcloudOnPath()) {
                        return [2 /*return*/];
                    }
                    if ((0, skills_js_1.hasBinary)(bin)) {
                        return [2 /*return*/];
                    }
                    if (process.platform !== "darwin") {
                        throw new Error("".concat(bin, " not installed; install it and retry"));
                    }
                    if (!(0, skills_js_1.hasBinary)("brew")) {
                        throw new Error("Homebrew not installed (install brew and retry)");
                    }
                    if (!(bin === "gcloud")) return [3 /*break*/, 2];
                    return [4 /*yield*/, gcloudEnv()];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _b.label = 3;
                case 3:
                    brewEnv = _a;
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(__spreadArray(["brew", "install"], brewArgs, true), {
                            timeoutMs: 600000,
                            env: brewEnv,
                        })];
                case 4:
                    result = _b.sent();
                    if (result.code !== 0) {
                        throw new Error("brew install failed for ".concat(bin, ": ").concat(result.stderr || result.stdout));
                    }
                    if (!(0, skills_js_1.hasBinary)(bin)) {
                        throw new Error("".concat(bin, " still not available after brew install"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function ensureGcloudAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var res, login;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGcloudCommand(["auth", "list", "--filter", "status:ACTIVE", "--format", "value(account)"], 30000)];
                case 1:
                    res = _a.sent();
                    if (res.code === 0 && res.stdout.trim()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runGcloudCommand(["auth", "login"], 600000)];
                case 2:
                    login = _a.sent();
                    if (login.code !== 0) {
                        throw new Error(login.stderr || "gcloud auth login failed");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function runGcloud(args) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGcloudCommand(args, 120000)];
                case 1:
                    result = _a.sent();
                    if (result.code !== 0) {
                        throw new Error(result.stderr || result.stdout || "gcloud command failed");
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function ensureTopic(projectId, topicName) {
    return __awaiter(this, void 0, void 0, function () {
        var describe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGcloudCommand(["pubsub", "topics", "describe", topicName, "--project", projectId], 30000)];
                case 1:
                    describe = _a.sent();
                    if (describe.code === 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runGcloud(["pubsub", "topics", "create", topicName, "--project", projectId])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureSubscription(projectId, subscription, topicName, pushEndpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var describe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGcloudCommand(["pubsub", "subscriptions", "describe", subscription, "--project", projectId], 30000)];
                case 1:
                    describe = _a.sent();
                    if (!(describe.code === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, runGcloud([
                            "pubsub",
                            "subscriptions",
                            "update",
                            subscription,
                            "--project",
                            projectId,
                            "--push-endpoint",
                            pushEndpoint,
                        ])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, runGcloud([
                        "pubsub",
                        "subscriptions",
                        "create",
                        subscription,
                        "--project",
                        projectId,
                        "--topic",
                        topicName,
                        "--push-endpoint",
                        pushEndpoint,
                    ])];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureTailscaleEndpoint(params) {
    return __awaiter(this, void 0, void 0, function () {
        var statusArgs, statusCommand, status, parsed, dnsName, target, pathArg, funnelArgs, funnelCommand, funnelResult, baseUrl;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (params.mode === "off") {
                        return [2 /*return*/, ""];
                    }
                    statusArgs = ["status", "--json"];
                    statusCommand = formatCommand("tailscale", statusArgs);
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(__spreadArray(["tailscale"], statusArgs, true), {
                            timeoutMs: 30000,
                        })];
                case 1:
                    status = _c.sent();
                    if (status.code !== 0) {
                        throw new Error(formatCommandFailure(statusCommand, status));
                    }
                    try {
                        parsed = JSON.parse(status.stdout);
                    }
                    catch (err) {
                        throw new Error(formatJsonParseFailure(statusCommand, status, err), { cause: err });
                    }
                    dnsName = (_b = (_a = parsed.Self) === null || _a === void 0 ? void 0 : _a.DNSName) === null || _b === void 0 ? void 0 : _b.replace(/\.$/, "");
                    if (!dnsName) {
                        throw new Error("tailscale DNS name missing; run tailscale up");
                    }
                    target = typeof params.target === "string" && params.target.trim().length > 0
                        ? params.target.trim()
                        : params.port
                            ? String(params.port)
                            : "";
                    if (!target) {
                        throw new Error("tailscale target missing; set a port or target URL");
                    }
                    pathArg = (0, gmail_js_1.normalizeServePath)(params.path);
                    funnelArgs = [params.mode, "--bg", "--set-path", pathArg, "--yes", target];
                    funnelCommand = formatCommand("tailscale", funnelArgs);
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(__spreadArray(["tailscale"], funnelArgs, true), {
                            timeoutMs: 30000,
                        })];
                case 2:
                    funnelResult = _c.sent();
                    if (funnelResult.code !== 0) {
                        throw new Error(formatCommandFailure(funnelCommand, funnelResult));
                    }
                    baseUrl = "https://".concat(dnsName).concat(pathArg);
                    // Funnel/serve strips pathArg before proxying; keep it only in the public URL.
                    return [2 /*return*/, params.token ? "".concat(baseUrl, "?token=").concat(params.token) : baseUrl];
            }
        });
    });
}
function resolveProjectIdFromGogCredentials() {
    return __awaiter(this, void 0, void 0, function () {
        var candidates, _i, candidates_3, candidate, raw, parsed, clientId, projectNumber, res, projectId, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    candidates = gogCredentialsPaths();
                    _i = 0, candidates_3 = candidates;
                    _b.label = 1;
                case 1:
                    if (!(_i < candidates_3.length)) return [3 /*break*/, 6];
                    candidate = candidates_3[_i];
                    if (!node_fs_1.default.existsSync(candidate)) {
                        return [3 /*break*/, 5];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    raw = node_fs_1.default.readFileSync(candidate, "utf-8");
                    parsed = JSON.parse(raw);
                    clientId = extractGogClientId(parsed);
                    projectNumber = extractProjectNumber(clientId);
                    if (!projectNumber) {
                        return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, runGcloudCommand([
                            "projects",
                            "list",
                            "--filter",
                            "projectNumber=".concat(projectNumber),
                            "--format",
                            "value(projectId)",
                        ], 30000)];
                case 3:
                    res = _b.sent();
                    if (res.code !== 0) {
                        return [3 /*break*/, 5];
                    }
                    projectId = res.stdout.trim().split(/\s+/)[0];
                    if (projectId) {
                        return [2 /*return*/, projectId];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
function gogCredentialsPaths() {
    var paths = [];
    var xdg = process.env.XDG_CONFIG_HOME;
    if (xdg) {
        paths.push(node_path_1.default.join(xdg, "gogcli", "credentials.json"));
    }
    paths.push((0, utils_js_1.resolveUserPath)("~/.config/gogcli/credentials.json"));
    if (process.platform === "darwin") {
        paths.push((0, utils_js_1.resolveUserPath)("~/Library/Application Support/gogcli/credentials.json"));
    }
    return paths;
}
function extractGogClientId(parsed) {
    var installed = parsed.installed;
    var web = parsed.web;
    var candidate = (installed === null || installed === void 0 ? void 0 : installed.client_id) || (web === null || web === void 0 ? void 0 : web.client_id) || parsed.client_id || "";
    return typeof candidate === "string" ? candidate : null;
}
function extractProjectNumber(clientId) {
    var _a;
    if (!clientId) {
        return null;
    }
    var match = clientId.match(/^(\d+)-/);
    return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
}
