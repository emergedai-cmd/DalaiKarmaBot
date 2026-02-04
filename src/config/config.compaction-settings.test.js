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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var test_helpers_js_1 = require("./test-helpers.js");
(0, vitest_1.describe)("config compaction settings", function () {
    (0, vitest_1.it)("preserves memory flush config values", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
                        return __generator(this, function (_y) {
                            switch (_y.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _y.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                defaults: {
                                                    compaction: {
                                                        mode: "safeguard",
                                                        reserveTokensFloor: 12345,
                                                        memoryFlush: {
                                                            enabled: false,
                                                            softThresholdTokens: 1234,
                                                            prompt: "Write notes.",
                                                            systemPrompt: "Flush memory now.",
                                                        },
                                                    },
                                                },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _y.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_y.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.compaction) === null || _c === void 0 ? void 0 : _c.reserveTokensFloor).toBe(12345);
                                    (0, vitest_1.expect)((_f = (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.compaction) === null || _f === void 0 ? void 0 : _f.mode).toBe("safeguard");
                                    (0, vitest_1.expect)((_k = (_j = (_h = (_g = cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults) === null || _h === void 0 ? void 0 : _h.compaction) === null || _j === void 0 ? void 0 : _j.memoryFlush) === null || _k === void 0 ? void 0 : _k.enabled).toBe(false);
                                    (0, vitest_1.expect)((_p = (_o = (_m = (_l = cfg.agents) === null || _l === void 0 ? void 0 : _l.defaults) === null || _m === void 0 ? void 0 : _m.compaction) === null || _o === void 0 ? void 0 : _o.memoryFlush) === null || _p === void 0 ? void 0 : _p.softThresholdTokens).toBe(1234);
                                    (0, vitest_1.expect)((_t = (_s = (_r = (_q = cfg.agents) === null || _q === void 0 ? void 0 : _q.defaults) === null || _r === void 0 ? void 0 : _r.compaction) === null || _s === void 0 ? void 0 : _s.memoryFlush) === null || _t === void 0 ? void 0 : _t.prompt).toBe("Write notes.");
                                    (0, vitest_1.expect)((_x = (_w = (_v = (_u = cfg.agents) === null || _u === void 0 ? void 0 : _u.defaults) === null || _v === void 0 ? void 0 : _v.compaction) === null || _w === void 0 ? void 0 : _w.memoryFlush) === null || _x === void 0 ? void 0 : _x.systemPrompt).toBe("Flush memory now.");
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
    (0, vitest_1.it)("defaults compaction mode to safeguard", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _g.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            agents: {
                                                defaults: {
                                                    compaction: {
                                                        reserveTokensFloor: 9000,
                                                    },
                                                },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _g.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_g.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.compaction) === null || _c === void 0 ? void 0 : _c.mode).toBe("safeguard");
                                    (0, vitest_1.expect)((_f = (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.compaction) === null || _f === void 0 ? void 0 : _f.reserveTokensFloor).toBe(9000);
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
