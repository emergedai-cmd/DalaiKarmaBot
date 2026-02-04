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
var test_helpers_js_1 = require("./test-helpers.js");
(0, vitest_1.describe)("multi-agent agentDir validation", function () {
    (0, vitest_1.it)("rejects shared agents.list agentDir", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, shared, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_b.sent()).validateConfigObject;
                    shared = node_path_1.default.join((0, node_os_1.tmpdir)(), "openclaw-shared-agentdir");
                    res = validateConfigObject({
                        agents: {
                            list: [
                                { id: "a", agentDir: shared },
                                { id: "b", agentDir: shared },
                            ],
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)(res.issues.some(function (i) { return i.path === "agents.list"; })).toBe(true);
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.message).toContain("Duplicate agentDir");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws on shared agentDir during loadConfig()", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, spy, loadConfig;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                list: [
                                                    { id: "a", agentDir: "~/.openclaw/agents/shared/agent" },
                                                    { id: "b", agentDir: "~/.openclaw/agents/shared/agent" },
                                                ],
                                            },
                                            bindings: [{ agentId: "a", match: { channel: "telegram" } }],
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _a.sent();
                                    vitest_1.vi.resetModules();
                                    spy = vitest_1.vi.spyOn(console, "error").mockImplementation(function () { });
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_a.sent()).loadConfig;
                                    (0, vitest_1.expect)(function () { return loadConfig(); }).toThrow(/duplicate agentDir/i);
                                    (0, vitest_1.expect)(spy.mock.calls.flat().join(" ")).toMatch(/Duplicate agentDir/i);
                                    spy.mockRestore();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
