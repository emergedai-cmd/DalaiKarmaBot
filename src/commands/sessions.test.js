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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
// Disable colors for deterministic snapshots.
process.env.FORCE_COLOR = "0";
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return ({
                            agents: {
                                defaults: {
                                    model: { primary: "pi:opus" },
                                    models: { "pi:opus": {} },
                                    contextTokens: 32000,
                                },
                            },
                        }); } })];
        }
    });
}); });
var sessions_js_1 = require("./sessions.js");
var makeRuntime = function () {
    var logs = [];
    return {
        runtime: {
            log: function (msg) { return logs.push(String(msg)); },
            error: function (msg) {
                throw new Error(String(msg));
            },
            exit: function (code) {
                throw new Error("exit ".concat(code));
            },
        },
        logs: logs,
    };
};
var writeStore = function (data) {
    var file = node_path_1.default.join(node_os_1.default.tmpdir(), "sessions-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2), ".json"));
    node_fs_1.default.writeFileSync(file, JSON.stringify(data, null, 2));
    return file;
};
(0, vitest_1.describe)("sessionsCommand", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(new Date("2025-12-06T00:00:00Z"));
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("renders a tabular view with token percentages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, _a, runtime, logs, tableHeader, row;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    store = writeStore({
                        "+15555550123": {
                            sessionId: "abc123",
                            updatedAt: Date.now() - 45 * 60000,
                            inputTokens: 1200,
                            outputTokens: 800,
                            model: "pi:opus",
                        },
                    });
                    _a = makeRuntime(), runtime = _a.runtime, logs = _a.logs;
                    return [4 /*yield*/, (0, sessions_js_1.sessionsCommand)({ store: store }, runtime)];
                case 1:
                    _c.sent();
                    node_fs_1.default.rmSync(store);
                    tableHeader = logs.find(function (line) { return line.includes("Tokens (ctx %"); });
                    (0, vitest_1.expect)(tableHeader).toBeTruthy();
                    row = (_b = logs.find(function (line) { return line.includes("+15555550123"); })) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(row).toContain("2.0k/32k (6%)");
                    (0, vitest_1.expect)(row).toContain("45m ago");
                    (0, vitest_1.expect)(row).toContain("pi:opus");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows placeholder rows when tokens are missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, _a, runtime, logs, row;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    store = writeStore({
                        "discord:group:demo": {
                            sessionId: "xyz",
                            updatedAt: Date.now() - 5 * 60000,
                            thinkingLevel: "high",
                        },
                    });
                    _a = makeRuntime(), runtime = _a.runtime, logs = _a.logs;
                    return [4 /*yield*/, (0, sessions_js_1.sessionsCommand)({ store: store }, runtime)];
                case 1:
                    _c.sent();
                    node_fs_1.default.rmSync(store);
                    row = (_b = logs.find(function (line) { return line.includes("discord:group:demo"); })) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(row).toContain("-".padEnd(20));
                    (0, vitest_1.expect)(row).toContain("think:high");
                    (0, vitest_1.expect)(row).toContain("5m ago");
                    return [2 /*return*/];
            }
        });
    }); });
});
