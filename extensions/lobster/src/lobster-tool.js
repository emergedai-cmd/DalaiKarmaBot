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
exports.createLobsterTool = createLobsterTool;
var typebox_1 = require("@sinclair/typebox");
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
function resolveExecutablePath(lobsterPathRaw) {
    var lobsterPath = (lobsterPathRaw === null || lobsterPathRaw === void 0 ? void 0 : lobsterPathRaw.trim()) || "lobster";
    // SECURITY:
    // Never allow arbitrary executables (e.g. /bin/bash). If the caller overrides
    // the path, it must still be the lobster binary (by name) and be absolute.
    if (lobsterPath !== "lobster") {
        if (!node_path_1.default.isAbsolute(lobsterPath)) {
            throw new Error("lobsterPath must be an absolute path (or omit to use PATH)");
        }
        var base = node_path_1.default.basename(lobsterPath).toLowerCase();
        var allowed = process.platform === "win32" ? ["lobster.exe", "lobster.cmd", "lobster.bat"] : ["lobster"];
        if (!allowed.includes(base)) {
            throw new Error("lobsterPath must point to the lobster executable");
        }
        var stat = void 0;
        try {
            stat = node_fs_1.default.statSync(lobsterPath);
        }
        catch (_a) {
            throw new Error("lobsterPath must exist");
        }
        if (!stat.isFile()) {
            throw new Error("lobsterPath must point to a file");
        }
        if (process.platform !== "win32") {
            try {
                node_fs_1.default.accessSync(lobsterPath, node_fs_1.default.constants.X_OK);
            }
            catch (_b) {
                throw new Error("lobsterPath must be executable");
            }
        }
    }
    return lobsterPath;
}
function normalizeForCwdSandbox(p) {
    var normalized = node_path_1.default.normalize(p);
    return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function resolveCwd(cwdRaw) {
    if (typeof cwdRaw !== "string" || !cwdRaw.trim()) {
        return process.cwd();
    }
    var cwd = cwdRaw.trim();
    if (node_path_1.default.isAbsolute(cwd)) {
        throw new Error("cwd must be a relative path");
    }
    var base = process.cwd();
    var resolved = node_path_1.default.resolve(base, cwd);
    var rel = node_path_1.default.relative(normalizeForCwdSandbox(base), normalizeForCwdSandbox(resolved));
    if (rel === "" || rel === ".") {
        return resolved;
    }
    if (rel.startsWith("..") || node_path_1.default.isAbsolute(rel)) {
        throw new Error("cwd must stay within the gateway working directory");
    }
    return resolved;
}
function isWindowsSpawnErrorThatCanUseShell(err) {
    if (!err || typeof err !== "object") {
        return false;
    }
    var code = err.code;
    // On Windows, spawning scripts discovered on PATH (e.g. lobster.cmd) can fail
    // with EINVAL, and PATH discovery itself can fail with ENOENT when the binary
    // is only available via PATHEXT/script wrappers.
    return code === "EINVAL" || code === "ENOENT";
}
function runLobsterSubprocessOnce(params, useShell) {
    return __awaiter(this, void 0, void 0, function () {
        var execPath, argv, cwd, timeoutMs, maxStdoutBytes, env, nodeOptions;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    execPath = params.execPath, argv = params.argv, cwd = params.cwd;
                    timeoutMs = Math.max(200, params.timeoutMs);
                    maxStdoutBytes = Math.max(1024, params.maxStdoutBytes);
                    env = __assign(__assign({}, process.env), { LOBSTER_MODE: "tool" });
                    nodeOptions = (_a = env.NODE_OPTIONS) !== null && _a !== void 0 ? _a : "";
                    if (nodeOptions.includes("--inspect")) {
                        delete env.NODE_OPTIONS;
                    }
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var _a, _b, _c, _d;
                            var child = (0, node_child_process_1.spawn)(execPath, argv, {
                                cwd: cwd,
                                stdio: ["ignore", "pipe", "pipe"],
                                env: env,
                                shell: useShell,
                                windowsHide: useShell ? true : undefined,
                            });
                            var stdout = "";
                            var stdoutBytes = 0;
                            var stderr = "";
                            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.setEncoding("utf8");
                            (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.setEncoding("utf8");
                            (_c = child.stdout) === null || _c === void 0 ? void 0 : _c.on("data", function (chunk) {
                                var str = String(chunk);
                                stdoutBytes += Buffer.byteLength(str, "utf8");
                                if (stdoutBytes > maxStdoutBytes) {
                                    try {
                                        child.kill("SIGKILL");
                                    }
                                    finally {
                                        reject(new Error("lobster output exceeded maxStdoutBytes"));
                                    }
                                    return;
                                }
                                stdout += str;
                            });
                            (_d = child.stderr) === null || _d === void 0 ? void 0 : _d.on("data", function (chunk) {
                                stderr += String(chunk);
                            });
                            var timer = setTimeout(function () {
                                try {
                                    child.kill("SIGKILL");
                                }
                                finally {
                                    reject(new Error("lobster subprocess timed out"));
                                }
                            }, timeoutMs);
                            child.once("error", function (err) {
                                clearTimeout(timer);
                                reject(err);
                            });
                            child.once("exit", function (code) {
                                clearTimeout(timer);
                                if (code !== 0) {
                                    reject(new Error("lobster failed (".concat(code !== null && code !== void 0 ? code : "?", "): ").concat(stderr.trim() || stdout.trim())));
                                    return;
                                }
                                resolve({ stdout: stdout });
                            });
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function runLobsterSubprocess(params) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, runLobsterSubprocessOnce(params, false)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    if (!(process.platform === "win32" && isWindowsSpawnErrorThatCanUseShell(err_1))) return [3 /*break*/, 4];
                    return [4 /*yield*/, runLobsterSubprocessOnce(params, true)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: throw err_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function parseEnvelope(stdout) {
    var trimmed = stdout.trim();
    var tryParse = function (input) {
        try {
            return JSON.parse(input);
        }
        catch (_a) {
            return undefined;
        }
    };
    var parsed = tryParse(trimmed);
    // Some environments can leak extra stdout (e.g. warnings/logs) before the
    // final JSON envelope. Be tolerant and parse the last JSON-looking suffix.
    if (parsed === undefined) {
        var suffixMatch = trimmed.match(/({[\s\S]*}|\[[\s\S]*])\s*$/);
        if (suffixMatch === null || suffixMatch === void 0 ? void 0 : suffixMatch[1]) {
            parsed = tryParse(suffixMatch[1]);
        }
    }
    if (parsed === undefined) {
        throw new Error("lobster returned invalid JSON");
    }
    if (!parsed || typeof parsed !== "object") {
        throw new Error("lobster returned invalid JSON envelope");
    }
    var ok = parsed.ok;
    if (ok === true || ok === false) {
        return parsed;
    }
    throw new Error("lobster returned invalid JSON envelope");
}
function createLobsterTool(api) {
    return {
        name: "lobster",
        description: "Run Lobster pipelines as a local-first workflow runtime (typed JSON envelope + resumable approvals).",
        parameters: typebox_1.Type.Object({
            // NOTE: Prefer string enums in tool schemas; some providers reject unions/anyOf.
            action: typebox_1.Type.Unsafe({ type: "string", enum: ["run", "resume"] }),
            pipeline: typebox_1.Type.Optional(typebox_1.Type.String()),
            argsJson: typebox_1.Type.Optional(typebox_1.Type.String()),
            token: typebox_1.Type.Optional(typebox_1.Type.String()),
            approve: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
            // SECURITY: Do not allow the agent to choose an executable path.
            // Host can configure the lobster binary via plugin config.
            lobsterPath: typebox_1.Type.Optional(typebox_1.Type.String({ description: "(deprecated) Use plugin config instead." })),
            cwd: typebox_1.Type.Optional(typebox_1.Type.String({
                description: "Relative working directory (optional). Must stay within the gateway working directory.",
            })),
            timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
            maxStdoutBytes: typebox_1.Type.Optional(typebox_1.Type.Number()),
        }),
        execute: function (_id, params) {
            return __awaiter(this, void 0, void 0, function () {
                var action, execPath, cwd, timeoutMs, maxStdoutBytes, argv, stdout, envelope;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            action = typeof params.action === "string" ? params.action.trim() : "";
                            if (!action) {
                                throw new Error("action required");
                            }
                            // SECURITY: never allow tool callers (agent/user) to select executables.
                            // If a host needs to override the binary, it must do so via plugin config.
                            // We still validate the parameter shape to prevent reintroducing an RCE footgun.
                            if (typeof params.lobsterPath === "string" && params.lobsterPath.trim()) {
                                resolveExecutablePath(params.lobsterPath);
                            }
                            execPath = resolveExecutablePath(typeof ((_a = api.pluginConfig) === null || _a === void 0 ? void 0 : _a.lobsterPath) === "string"
                                ? api.pluginConfig.lobsterPath
                                : undefined);
                            cwd = resolveCwd(params.cwd);
                            timeoutMs = typeof params.timeoutMs === "number" ? params.timeoutMs : 20000;
                            maxStdoutBytes = typeof params.maxStdoutBytes === "number" ? params.maxStdoutBytes : 512000;
                            argv = (function () {
                                if (action === "run") {
                                    var pipeline = typeof params.pipeline === "string" ? params.pipeline : "";
                                    if (!pipeline.trim()) {
                                        throw new Error("pipeline required");
                                    }
                                    var argv_1 = ["run", "--mode", "tool", pipeline];
                                    var argsJson = typeof params.argsJson === "string" ? params.argsJson : "";
                                    if (argsJson.trim()) {
                                        argv_1.push("--args-json", argsJson);
                                    }
                                    return argv_1;
                                }
                                if (action === "resume") {
                                    var token = typeof params.token === "string" ? params.token : "";
                                    if (!token.trim()) {
                                        throw new Error("token required");
                                    }
                                    var approve = params.approve;
                                    if (typeof approve !== "boolean") {
                                        throw new Error("approve required");
                                    }
                                    return ["resume", "--token", token, "--approve", approve ? "yes" : "no"];
                                }
                                throw new Error("Unknown action: ".concat(action));
                            })();
                            if (((_b = api.runtime) === null || _b === void 0 ? void 0 : _b.version) && ((_c = api.logger) === null || _c === void 0 ? void 0 : _c.debug)) {
                                api.logger.debug("lobster plugin runtime=".concat(api.runtime.version));
                            }
                            return [4 /*yield*/, runLobsterSubprocess({
                                    execPath: execPath,
                                    argv: argv,
                                    cwd: cwd,
                                    timeoutMs: timeoutMs,
                                    maxStdoutBytes: maxStdoutBytes,
                                })];
                        case 1:
                            stdout = (_d.sent()).stdout;
                            envelope = parseEnvelope(stdout);
                            return [2 /*return*/, {
                                    content: [{ type: "text", text: JSON.stringify(envelope, null, 2) }],
                                    details: envelope,
                                }];
                    }
                });
            });
        },
    };
}
