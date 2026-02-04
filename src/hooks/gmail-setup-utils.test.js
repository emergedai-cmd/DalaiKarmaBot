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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var itUnix = process.platform === "win32" ? vitest_1.it.skip : vitest_1.it;
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.resetModules();
});
(0, vitest_1.describe)("resolvePythonExecutablePath", function () {
    itUnix("resolves a working python path and caches the result", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, originalPath, realPython, shimDir, shim, resolvePythonExecutablePath, resolved, cached;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-python-"))];
                case 1:
                    tmp = _a.sent();
                    originalPath = process.env.PATH;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 11, 13]);
                    realPython = node_path_1.default.join(tmp, "python-real");
                    return [4 /*yield*/, promises_1.default.writeFile(realPython, "#!/bin/sh\nexit 0\n", "utf-8")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(realPython, 493)];
                case 4:
                    _a.sent();
                    shimDir = node_path_1.default.join(tmp, "shims");
                    return [4 /*yield*/, promises_1.default.mkdir(shimDir, { recursive: true })];
                case 5:
                    _a.sent();
                    shim = node_path_1.default.join(shimDir, "python3");
                    return [4 /*yield*/, promises_1.default.writeFile(shim, "#!/bin/sh\nif [ \"$1\" = \"-c\" ]; then\n  echo \"".concat(realPython, "\"\n  exit 0\nfi\nexit 1\n"), "utf-8")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(shim, 493)];
                case 7:
                    _a.sent();
                    process.env.PATH = "".concat(shimDir).concat(node_path_1.default.delimiter, "/usr/bin");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gmail-setup-utils.js"); })];
                case 8:
                    resolvePythonExecutablePath = (_a.sent()).resolvePythonExecutablePath;
                    return [4 /*yield*/, resolvePythonExecutablePath()];
                case 9:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved).toBe(realPython);
                    process.env.PATH = "/bin";
                    return [4 /*yield*/, resolvePythonExecutablePath()];
                case 10:
                    cached = _a.sent();
                    (0, vitest_1.expect)(cached).toBe(realPython);
                    return [3 /*break*/, 13];
                case 11:
                    process.env.PATH = originalPath;
                    return [4 /*yield*/, promises_1.default.rm(tmp, { recursive: true, force: true })];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); }, 60000);
});
(0, vitest_1.describe)("ensureTailscaleEndpoint", function () {
    (0, vitest_1.it)("includes stdout and exit code when tailscale serve fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ensureTailscaleEndpoint, runCommandWithTimeout, runCommand, message, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.doMock("../process/exec.js", function () { return ({
                        runCommandWithTimeout: vitest_1.vi.fn(),
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gmail-setup-utils.js"); })];
                case 1:
                    ensureTailscaleEndpoint = (_a.sent()).ensureTailscaleEndpoint;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../process/exec.js"); })];
                case 2:
                    runCommandWithTimeout = (_a.sent()).runCommandWithTimeout;
                    runCommand = vitest_1.vi.mocked(runCommandWithTimeout);
                    runCommand
                        .mockResolvedValueOnce({
                        stdout: JSON.stringify({ Self: { DNSName: "host.tailnet.ts.net." } }),
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    })
                        .mockResolvedValueOnce({
                        stdout: "tailscale output",
                        stderr: "Warning: client version mismatch",
                        code: 1,
                        signal: null,
                        killed: false,
                    });
                    message = "";
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ensureTailscaleEndpoint({
                            mode: "serve",
                            path: "/gmail-pubsub",
                            port: 8788,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    message = err_1 instanceof Error ? err_1.message : String(err_1);
                    return [3 /*break*/, 6];
                case 6:
                    (0, vitest_1.expect)(message).toContain("code=1");
                    (0, vitest_1.expect)(message).toContain("stderr: Warning: client version mismatch");
                    (0, vitest_1.expect)(message).toContain("stdout: tailscale output");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes JSON parse failure details with stdout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ensureTailscaleEndpoint, runCommandWithTimeout, runCommand, message, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.doMock("../process/exec.js", function () { return ({
                        runCommandWithTimeout: vitest_1.vi.fn(),
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./gmail-setup-utils.js"); })];
                case 1:
                    ensureTailscaleEndpoint = (_a.sent()).ensureTailscaleEndpoint;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../process/exec.js"); })];
                case 2:
                    runCommandWithTimeout = (_a.sent()).runCommandWithTimeout;
                    runCommand = vitest_1.vi.mocked(runCommandWithTimeout);
                    runCommand.mockResolvedValueOnce({
                        stdout: "not-json",
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    message = "";
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ensureTailscaleEndpoint({
                            mode: "funnel",
                            path: "/gmail-pubsub",
                            port: 8788,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    message = err_2 instanceof Error ? err_2.message : String(err_2);
                    return [3 /*break*/, 6];
                case 6:
                    (0, vitest_1.expect)(message).toContain("returned invalid JSON");
                    (0, vitest_1.expect)(message).toContain("stdout: not-json");
                    (0, vitest_1.expect)(message).toContain("code=0");
                    return [2 /*return*/];
            }
        });
    }); });
});
