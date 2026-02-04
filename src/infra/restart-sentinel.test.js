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
var restart_sentinel_js_1 = require("./restart-sentinel.js");
(0, vitest_1.describe)("restart sentinel", function () {
    var prevStateDir;
    var tempDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sentinel-"))];
                case 1:
                    tempDir = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tempDir;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (prevStateDir) {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    else {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes and consumes a sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, filePath, read, consumed, empty;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = {
                        kind: "update",
                        status: "ok",
                        ts: Date.now(),
                        sessionKey: "agent:main:whatsapp:dm:+15555550123",
                        stats: { mode: "git" },
                    };
                    return [4 /*yield*/, (0, restart_sentinel_js_1.writeRestartSentinel)(payload)];
                case 1:
                    filePath = _a.sent();
                    (0, vitest_1.expect)(filePath).toBe((0, restart_sentinel_js_1.resolveRestartSentinelPath)());
                    return [4 /*yield*/, (0, restart_sentinel_js_1.readRestartSentinel)()];
                case 2:
                    read = _a.sent();
                    (0, vitest_1.expect)(read === null || read === void 0 ? void 0 : read.payload.kind).toBe("update");
                    return [4 /*yield*/, (0, restart_sentinel_js_1.consumeRestartSentinel)()];
                case 3:
                    consumed = _a.sent();
                    (0, vitest_1.expect)(consumed === null || consumed === void 0 ? void 0 : consumed.payload.sessionKey).toBe(payload.sessionKey);
                    return [4 /*yield*/, (0, restart_sentinel_js_1.readRestartSentinel)()];
                case 4:
                    empty = _a.sent();
                    (0, vitest_1.expect)(empty).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops invalid sentinel payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var filePath, read;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = (0, restart_sentinel_js_1.resolveRestartSentinelPath)();
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(filePath), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(filePath, "not-json", "utf-8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, restart_sentinel_js_1.readRestartSentinel)()];
                case 3:
                    read = _a.sent();
                    (0, vitest_1.expect)(read).toBeNull();
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(filePath)).rejects.toThrow()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("trims log tails", function () {
        var text = "a".repeat(9000);
        var trimmed = (0, restart_sentinel_js_1.trimLogTail)(text, 8000);
        (0, vitest_1.expect)(trimmed === null || trimmed === void 0 ? void 0 : trimmed.length).toBeLessThanOrEqual(8001);
        (0, vitest_1.expect)(trimmed === null || trimmed === void 0 ? void 0 : trimmed.startsWith("…")).toBe(true);
    });
});
