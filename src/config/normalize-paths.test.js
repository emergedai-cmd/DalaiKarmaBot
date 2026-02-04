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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
(0, vitest_1.describe)("normalizeConfigPaths", function () {
    (0, vitest_1.it)("expands tilde for path-ish keys only", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, temp_home_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var normalizeConfigPaths, cfg;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
                        return __generator(this, function (_9) {
                            switch (_9.label) {
                                case 0:
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./normalize-paths.js"); })];
                                case 1:
                                    normalizeConfigPaths = (_9.sent()).normalizeConfigPaths;
                                    cfg = normalizeConfigPaths({
                                        tools: { exec: { pathPrepend: ["~/bin"] } },
                                        plugins: { load: { paths: ["~/plugins/a"] } },
                                        logging: { file: "~/.openclaw/logs/openclaw.log" },
                                        hooks: {
                                            path: "~/.openclaw/hooks.json5",
                                            transformsDir: "~/hooks-xform",
                                        },
                                        channels: {
                                            telegram: {
                                                accounts: {
                                                    personal: {
                                                        tokenFile: "~/.openclaw/telegram.token",
                                                    },
                                                },
                                            },
                                            imessage: {
                                                accounts: { personal: { dbPath: "~/Library/Messages/chat.db" } },
                                            },
                                        },
                                        agents: {
                                            defaults: { workspace: "~/ws-default" },
                                            list: [
                                                {
                                                    id: "main",
                                                    workspace: "~/ws-agent",
                                                    agentDir: "~/.openclaw/agents/main",
                                                    identity: {
                                                        name: "~not-a-path",
                                                    },
                                                    sandbox: { workspaceRoot: "~/sandbox-root" },
                                                },
                                            ],
                                        },
                                    });
                                    (0, vitest_1.expect)((_c = (_b = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b.paths) === null || _c === void 0 ? void 0 : _c[0]).toBe(node_path_1.default.join(home, "plugins", "a"));
                                    (0, vitest_1.expect)((_d = cfg.logging) === null || _d === void 0 ? void 0 : _d.file).toBe(node_path_1.default.join(home, ".openclaw", "logs", "openclaw.log"));
                                    (0, vitest_1.expect)((_e = cfg.hooks) === null || _e === void 0 ? void 0 : _e.path).toBe(node_path_1.default.join(home, ".openclaw", "hooks.json5"));
                                    (0, vitest_1.expect)((_f = cfg.hooks) === null || _f === void 0 ? void 0 : _f.transformsDir).toBe(node_path_1.default.join(home, "hooks-xform"));
                                    (0, vitest_1.expect)((_j = (_h = (_g = cfg.tools) === null || _g === void 0 ? void 0 : _g.exec) === null || _h === void 0 ? void 0 : _h.pathPrepend) === null || _j === void 0 ? void 0 : _j[0]).toBe(node_path_1.default.join(home, "bin"));
                                    (0, vitest_1.expect)((_o = (_m = (_l = (_k = cfg.channels) === null || _k === void 0 ? void 0 : _k.telegram) === null || _l === void 0 ? void 0 : _l.accounts) === null || _m === void 0 ? void 0 : _m.personal) === null || _o === void 0 ? void 0 : _o.tokenFile).toBe(node_path_1.default.join(home, ".openclaw", "telegram.token"));
                                    (0, vitest_1.expect)((_s = (_r = (_q = (_p = cfg.channels) === null || _p === void 0 ? void 0 : _p.imessage) === null || _q === void 0 ? void 0 : _q.accounts) === null || _r === void 0 ? void 0 : _r.personal) === null || _s === void 0 ? void 0 : _s.dbPath).toBe(node_path_1.default.join(home, "Library", "Messages", "chat.db"));
                                    (0, vitest_1.expect)((_u = (_t = cfg.agents) === null || _t === void 0 ? void 0 : _t.defaults) === null || _u === void 0 ? void 0 : _u.workspace).toBe(node_path_1.default.join(home, "ws-default"));
                                    (0, vitest_1.expect)((_x = (_w = (_v = cfg.agents) === null || _v === void 0 ? void 0 : _v.list) === null || _w === void 0 ? void 0 : _w[0]) === null || _x === void 0 ? void 0 : _x.workspace).toBe(node_path_1.default.join(home, "ws-agent"));
                                    (0, vitest_1.expect)((_0 = (_z = (_y = cfg.agents) === null || _y === void 0 ? void 0 : _y.list) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.agentDir).toBe(node_path_1.default.join(home, ".openclaw", "agents", "main"));
                                    (0, vitest_1.expect)((_4 = (_3 = (_2 = (_1 = cfg.agents) === null || _1 === void 0 ? void 0 : _1.list) === null || _2 === void 0 ? void 0 : _2[0]) === null || _3 === void 0 ? void 0 : _3.sandbox) === null || _4 === void 0 ? void 0 : _4.workspaceRoot).toBe(node_path_1.default.join(home, "sandbox-root"));
                                    // Non-path key => do not treat "~" as home expansion.
                                    (0, vitest_1.expect)((_8 = (_7 = (_6 = (_5 = cfg.agents) === null || _5 === void 0 ? void 0 : _5.list) === null || _6 === void 0 ? void 0 : _6[0]) === null || _7 === void 0 ? void 0 : _7.identity) === null || _8 === void 0 ? void 0 : _8.name).toBe("~not-a-path");
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
