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
(0, vitest_1.describe)("config discord", function () {
    var previousHome;
    (0, vitest_1.beforeEach)(function () {
        previousHome = process.env.HOME;
    });
    (0, vitest_1.afterEach)(function () {
        process.env.HOME = previousHome;
    });
    (0, vitest_1.it)("loads discord guild map + dm group settings", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configDir, loadConfig, cfg;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                        return __generator(this, function (_3) {
                            switch (_3.label) {
                                case 0:
                                    configDir = node_path_1.default.join(home, ".openclaw");
                                    return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                case 1:
                                    _3.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                            channels: {
                                                discord: {
                                                    enabled: true,
                                                    dm: {
                                                        enabled: true,
                                                        allowFrom: ["steipete"],
                                                        groupEnabled: true,
                                                        groupChannels: ["openclaw-dm"],
                                                    },
                                                    actions: {
                                                        emojiUploads: true,
                                                        stickerUploads: false,
                                                        channels: true,
                                                    },
                                                    guilds: {
                                                        "123": {
                                                            slug: "friends-of-openclaw",
                                                            requireMention: false,
                                                            users: ["steipete"],
                                                            channels: {
                                                                general: { allow: true },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _3.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_3.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.discord) === null || _b === void 0 ? void 0 : _b.enabled).toBe(true);
                                    (0, vitest_1.expect)((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.discord) === null || _d === void 0 ? void 0 : _d.dm) === null || _e === void 0 ? void 0 : _e.groupEnabled).toBe(true);
                                    (0, vitest_1.expect)((_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.discord) === null || _g === void 0 ? void 0 : _g.dm) === null || _h === void 0 ? void 0 : _h.groupChannels).toEqual(["openclaw-dm"]);
                                    (0, vitest_1.expect)((_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.discord) === null || _k === void 0 ? void 0 : _k.actions) === null || _l === void 0 ? void 0 : _l.emojiUploads).toBe(true);
                                    (0, vitest_1.expect)((_p = (_o = (_m = cfg.channels) === null || _m === void 0 ? void 0 : _m.discord) === null || _o === void 0 ? void 0 : _o.actions) === null || _p === void 0 ? void 0 : _p.stickerUploads).toBe(false);
                                    (0, vitest_1.expect)((_s = (_r = (_q = cfg.channels) === null || _q === void 0 ? void 0 : _q.discord) === null || _r === void 0 ? void 0 : _r.actions) === null || _s === void 0 ? void 0 : _s.channels).toBe(true);
                                    (0, vitest_1.expect)((_w = (_v = (_u = (_t = cfg.channels) === null || _t === void 0 ? void 0 : _t.discord) === null || _u === void 0 ? void 0 : _u.guilds) === null || _v === void 0 ? void 0 : _v["123"]) === null || _w === void 0 ? void 0 : _w.slug).toBe("friends-of-openclaw");
                                    (0, vitest_1.expect)((_2 = (_1 = (_0 = (_z = (_y = (_x = cfg.channels) === null || _x === void 0 ? void 0 : _x.discord) === null || _y === void 0 ? void 0 : _y.guilds) === null || _z === void 0 ? void 0 : _z["123"]) === null || _0 === void 0 ? void 0 : _0.channels) === null || _1 === void 0 ? void 0 : _1.general) === null || _2 === void 0 ? void 0 : _2.allow).toBe(true);
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
