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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var lobster_tool_js_1 = require("./lobster-tool.js");
function writeFakeLobsterScript(scriptBody_1) {
    return __awaiter(this, arguments, void 0, function (scriptBody, prefix) {
        var dir, isWindows, scriptPath, cmdPath, cmd, binPath, file;
        if (prefix === void 0) { prefix = "openclaw-lobster-plugin-"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), prefix))];
                case 1:
                    dir = _a.sent();
                    isWindows = process.platform === "win32";
                    if (!isWindows) return [3 /*break*/, 4];
                    scriptPath = node_path_1.default.join(dir, "lobster.js");
                    cmdPath = node_path_1.default.join(dir, "lobster.cmd");
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, scriptBody, { encoding: "utf8" })];
                case 2:
                    _a.sent();
                    cmd = "@echo off\r\n\"".concat(process.execPath, "\" \"").concat(scriptPath, "\" %*\r\n");
                    return [4 /*yield*/, promises_1.default.writeFile(cmdPath, cmd, { encoding: "utf8" })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { dir: dir, binPath: cmdPath }];
                case 4:
                    binPath = node_path_1.default.join(dir, "lobster");
                    file = "#!/usr/bin/env node\n".concat(scriptBody, "\n");
                    return [4 /*yield*/, promises_1.default.writeFile(binPath, file, { encoding: "utf8", mode: 493 })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, { dir: dir, binPath: binPath }];
            }
        });
    });
}
function writeFakeLobster(params) {
    return __awaiter(this, void 0, void 0, function () {
        var scriptBody;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    scriptBody = "const payload = ".concat(JSON.stringify(params.payload), ";\n") +
                        "process.stdout.write(JSON.stringify(payload));\n";
                    return [4 /*yield*/, writeFakeLobsterScript(scriptBody)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fakeApi(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: "lobster", name: "lobster", source: "test", config: {}, pluginConfig: {}, 
        // oxlint-disable-next-line typescript/no-explicit-any
        runtime: { version: "test" }, logger: { info: function () { }, warn: function () { }, error: function () { }, debug: function () { } }, registerTool: function () { }, registerHttpHandler: function () { }, registerChannel: function () { }, registerGatewayMethod: function () { }, registerCli: function () { }, registerService: function () { }, registerProvider: function () { }, registerHook: function () { }, registerHttpRoute: function () { }, registerCommand: function () { }, on: function () { }, resolvePath: function (p) { return p; } }, overrides);
}
function fakeCtx(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ config: {}, workspaceDir: "/tmp", agentDir: "/tmp", agentId: "main", sessionKey: "main", messageChannel: undefined, agentAccountId: undefined, sandboxed: false }, overrides);
}
(0, vitest_1.describe)("lobster plugin tool", function () {
    (0, vitest_1.it)("runs lobster and returns parsed envelope in details", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fake, originalPath, tool, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFakeLobster({
                        payload: { ok: true, status: "ok", output: [{ hello: "world" }], requiresApproval: null },
                    })];
                case 1:
                    fake = _a.sent();
                    originalPath = process.env.PATH;
                    process.env.PATH = "".concat(fake.dir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, tool.execute("call1", {
                            action: "run",
                            pipeline: "noop",
                            timeoutMs: 1000,
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.details).toMatchObject({ ok: true, status: "ok" });
                    return [3 /*break*/, 5];
                case 4:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("tolerates noisy stdout before the JSON envelope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, dir, originalPath, tool, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = { ok: true, status: "ok", output: [], requiresApproval: null };
                    return [4 /*yield*/, writeFakeLobsterScript("const payload = ".concat(JSON.stringify(payload), ";\n") +
                            "console.log(\"noise before json\");\n" +
                            "process.stdout.write(JSON.stringify(payload));\n", "openclaw-lobster-plugin-noisy-")];
                case 1:
                    dir = (_a.sent()).dir;
                    originalPath = process.env.PATH;
                    process.env.PATH = "".concat(dir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, tool.execute("call-noisy", {
                            action: "run",
                            pipeline: "noop",
                            timeoutMs: 1000,
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.details).toMatchObject({ ok: true, status: "ok" });
                    return [3 /*break*/, 5];
                case 4:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires absolute lobsterPath when provided (even though it is ignored)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fake, originalPath, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFakeLobster({
                        payload: { ok: true, status: "ok", output: [{ hello: "world" }], requiresApproval: null },
                    })];
                case 1:
                    fake = _a.sent();
                    originalPath = process.env.PATH;
                    process.env.PATH = "".concat(fake.dir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call2", {
                            action: "run",
                            pipeline: "noop",
                            lobsterPath: "./lobster",
                        })).rejects.toThrow(/absolute path/)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects lobsterPath (deprecated) when invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fake, originalPath, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFakeLobster({
                        payload: { ok: true, status: "ok", output: [{ hello: "world" }], requiresApproval: null },
                    })];
                case 1:
                    fake = _a.sent();
                    originalPath = process.env.PATH;
                    process.env.PATH = "".concat(fake.dir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call2b", {
                            action: "run",
                            pipeline: "noop",
                            lobsterPath: "/bin/bash",
                        })).rejects.toThrow(/lobster executable/)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects absolute cwd", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call2c", {
                            action: "run",
                            pipeline: "noop",
                            cwd: "/tmp",
                        })).rejects.toThrow(/cwd must be a relative path/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects cwd that escapes the gateway working directory", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call2d", {
                            action: "run",
                            pipeline: "noop",
                            cwd: "../../etc",
                        })).rejects.toThrow(/must stay within/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses pluginConfig.lobsterPath when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fake, originalPath, tool, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFakeLobster({
                        payload: { ok: true, status: "ok", output: [{ hello: "world" }], requiresApproval: null },
                    })];
                case 1:
                    fake = _a.sent();
                    originalPath = process.env.PATH;
                    process.env.PATH = node_path_1.default.dirname(process.execPath);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi({ pluginConfig: { lobsterPath: fake.binPath } }));
                    return [4 /*yield*/, tool.execute("call-plugin-config", {
                            action: "run",
                            pipeline: "noop",
                            timeoutMs: 1000,
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.details).toMatchObject({ ok: true, status: "ok" });
                    return [3 /*break*/, 5];
                case 4:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects invalid JSON from lobster", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, originalPath, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFakeLobsterScript("process.stdout.write(\"nope\");\n", "openclaw-lobster-plugin-bad-")];
                case 1:
                    dir = (_a.sent()).dir;
                    originalPath = process.env.PATH;
                    process.env.PATH = "".concat(dir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    tool = (0, lobster_tool_js_1.createLobsterTool)(fakeApi());
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("call3", {
                            action: "run",
                            pipeline: "noop",
                        })).rejects.toThrow(/invalid JSON/)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("can be gated off in sandboxed contexts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, factoryTool;
        var _a;
        return __generator(this, function (_b) {
            api = fakeApi();
            factoryTool = function (ctx) {
                if (ctx.sandboxed) {
                    return null;
                }
                return (0, lobster_tool_js_1.createLobsterTool)(api);
            };
            (0, vitest_1.expect)(factoryTool(fakeCtx({ sandboxed: true }))).toBeNull();
            (0, vitest_1.expect)((_a = factoryTool(fakeCtx({ sandboxed: false }))) === null || _a === void 0 ? void 0 : _a.name).toBe("lobster");
            return [2 /*return*/];
        });
    }); });
});
