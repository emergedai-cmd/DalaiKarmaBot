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
vitest_1.vi.mock("./openclaw-root.js", function () { return ({
    resolveOpenClawPackageRoot: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./update-check.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./update-check.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { checkUpdateStatus: vitest_1.vi.fn(), fetchNpmTagVersion: vitest_1.vi.fn(), resolveNpmChannelTag: vitest_1.vi.fn() })];
        }
    });
}); });
vitest_1.vi.mock("../version.js", function () { return ({
    VERSION: "1.0.0",
}); });
(0, vitest_1.describe)("update-startup", function () {
    var originalEnv = __assign({}, process.env);
    var tempDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date("2026-01-17T10:00:00Z"));
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-update-check-"))];
                case 1:
                    tempDir = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tempDir;
                    delete process.env.VITEST;
                    process.env.NODE_ENV = "test";
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useRealTimers();
                    process.env = __assign({}, originalEnv);
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs update hint for npm installs when newer tag exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveOpenClawPackageRoot, _a, checkUpdateStatus, resolveNpmChannelTag, runGatewayUpdateCheck, log, statePath, raw, parsed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./openclaw-root.js"); })];
                case 1:
                    resolveOpenClawPackageRoot = (_b.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-check.js"); })];
                case 2:
                    _a = _b.sent(), checkUpdateStatus = _a.checkUpdateStatus, resolveNpmChannelTag = _a.resolveNpmChannelTag;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-startup.js"); })];
                case 3:
                    runGatewayUpdateCheck = (_b.sent()).runGatewayUpdateCheck;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue("/opt/openclaw");
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: "/opt/openclaw",
                        installKind: "package",
                        packageManager: "npm",
                    });
                    vitest_1.vi.mocked(resolveNpmChannelTag).mockResolvedValue({
                        tag: "latest",
                        version: "2.0.0",
                    });
                    log = { info: vitest_1.vi.fn() };
                    return [4 /*yield*/, runGatewayUpdateCheck({
                            cfg: { update: { channel: "stable" } },
                            log: log,
                            isNixMode: false,
                            allowInTests: true,
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(log.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining("update available (latest): v2.0.0"));
                    statePath = node_path_1.default.join(tempDir, "update-check.json");
                    return [4 /*yield*/, promises_1.default.readFile(statePath, "utf-8")];
                case 5:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)(parsed.lastNotifiedVersion).toBe("2.0.0");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses latest when beta tag is older than release", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveOpenClawPackageRoot, _a, checkUpdateStatus, resolveNpmChannelTag, runGatewayUpdateCheck, log, statePath, raw, parsed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./openclaw-root.js"); })];
                case 1:
                    resolveOpenClawPackageRoot = (_b.sent()).resolveOpenClawPackageRoot;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-check.js"); })];
                case 2:
                    _a = _b.sent(), checkUpdateStatus = _a.checkUpdateStatus, resolveNpmChannelTag = _a.resolveNpmChannelTag;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-startup.js"); })];
                case 3:
                    runGatewayUpdateCheck = (_b.sent()).runGatewayUpdateCheck;
                    vitest_1.vi.mocked(resolveOpenClawPackageRoot).mockResolvedValue("/opt/openclaw");
                    vitest_1.vi.mocked(checkUpdateStatus).mockResolvedValue({
                        root: "/opt/openclaw",
                        installKind: "package",
                        packageManager: "npm",
                    });
                    vitest_1.vi.mocked(resolveNpmChannelTag).mockResolvedValue({
                        tag: "latest",
                        version: "2.0.0",
                    });
                    log = { info: vitest_1.vi.fn() };
                    return [4 /*yield*/, runGatewayUpdateCheck({
                            cfg: { update: { channel: "beta" } },
                            log: log,
                            isNixMode: false,
                            allowInTests: true,
                        })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(log.info).toHaveBeenCalledWith(vitest_1.expect.stringContaining("update available (latest): v2.0.0"));
                    statePath = node_path_1.default.join(tempDir, "update-check.json");
                    return [4 /*yield*/, promises_1.default.readFile(statePath, "utf-8")];
                case 5:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)(parsed.lastNotifiedTag).toBe("latest");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips update check when disabled in config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runGatewayUpdateCheck, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./update-startup.js"); })];
                case 1:
                    runGatewayUpdateCheck = (_a.sent()).runGatewayUpdateCheck;
                    log = { info: vitest_1.vi.fn() };
                    return [4 /*yield*/, runGatewayUpdateCheck({
                            cfg: { update: { checkOnStart: false } },
                            log: log,
                            isNixMode: false,
                            allowInTests: true,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(log.info).not.toHaveBeenCalled();
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(node_path_1.default.join(tempDir, "update-check.json"))).rejects.toThrow()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
