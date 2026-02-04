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
(0, vitest_1.describe)("Nix integration (U3, U5, U9)", function () {
    (0, vitest_1.describe)("U3: isNixMode env var detection", function () {
        (0, vitest_1.it)("isNixMode is false when OPENCLAW_NIX_MODE is not set", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_NIX_MODE: undefined }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var isNixMode;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        isNixMode = (_a.sent()).isNixMode;
                                        (0, vitest_1.expect)(isNixMode).toBe(false);
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
        (0, vitest_1.it)("isNixMode is false when OPENCLAW_NIX_MODE is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_NIX_MODE: "" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var isNixMode;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        isNixMode = (_a.sent()).isNixMode;
                                        (0, vitest_1.expect)(isNixMode).toBe(false);
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
        (0, vitest_1.it)("isNixMode is false when OPENCLAW_NIX_MODE is not '1'", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_NIX_MODE: "true" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var isNixMode;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        isNixMode = (_a.sent()).isNixMode;
                                        (0, vitest_1.expect)(isNixMode).toBe(false);
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
        (0, vitest_1.it)("isNixMode is true when OPENCLAW_NIX_MODE=1", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_NIX_MODE: "1" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var isNixMode;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        isNixMode = (_a.sent()).isNixMode;
                                        (0, vitest_1.expect)(isNixMode).toBe(true);
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
    (0, vitest_1.describe)("U5: CONFIG_PATH and STATE_DIR env var overrides", function () {
        (0, vitest_1.it)("STATE_DIR defaults to ~/.openclaw when env not set", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_STATE_DIR: undefined }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var STATE_DIR;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        STATE_DIR = (_a.sent()).STATE_DIR;
                                        (0, vitest_1.expect)(STATE_DIR).toMatch(/\.openclaw$/);
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
        (0, vitest_1.it)("STATE_DIR respects OPENCLAW_STATE_DIR override", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_STATE_DIR: "/custom/state/dir" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var STATE_DIR;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        STATE_DIR = (_a.sent()).STATE_DIR;
                                        (0, vitest_1.expect)(STATE_DIR).toBe(node_path_1.default.resolve("/custom/state/dir"));
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
        (0, vitest_1.it)("CONFIG_PATH defaults to ~/.openclaw/openclaw.json when env not set", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_CONFIG_PATH: undefined, OPENCLAW_STATE_DIR: undefined }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var CONFIG_PATH;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        CONFIG_PATH = (_a.sent()).CONFIG_PATH;
                                        (0, vitest_1.expect)(CONFIG_PATH).toMatch(/\.openclaw[\\/]openclaw\.json$/);
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
        (0, vitest_1.it)("CONFIG_PATH respects OPENCLAW_CONFIG_PATH override", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_CONFIG_PATH: "/nix/store/abc/openclaw.json" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var CONFIG_PATH;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        CONFIG_PATH = (_a.sent()).CONFIG_PATH;
                                        (0, vitest_1.expect)(CONFIG_PATH).toBe(node_path_1.default.resolve("/nix/store/abc/openclaw.json"));
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
        (0, vitest_1.it)("CONFIG_PATH expands ~ in OPENCLAW_CONFIG_PATH override", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_CONFIG_PATH: "~/.openclaw/custom.json" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var CONFIG_PATH;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                                    case 1:
                                                        CONFIG_PATH = (_a.sent()).CONFIG_PATH;
                                                        (0, vitest_1.expect)(CONFIG_PATH).toBe(node_path_1.default.join(home, ".openclaw", "custom.json"));
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                    case 1:
                                        _a.sent();
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
        (0, vitest_1.it)("CONFIG_PATH uses STATE_DIR when only state dir is overridden", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({
                            OPENCLAW_CONFIG_PATH: undefined,
                            OPENCLAW_STATE_DIR: "/custom/state",
                        }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var CONFIG_PATH;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        CONFIG_PATH = (_a.sent()).CONFIG_PATH;
                                        (0, vitest_1.expect)(CONFIG_PATH).toBe(node_path_1.default.join(node_path_1.default.resolve("/custom/state"), "openclaw.json"));
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
    (0, vitest_1.describe)("U5b: tilde expansion for config paths", function () {
        (0, vitest_1.it)("expands ~ in common path-ish config fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                            var configDir, pluginDir, loadConfig, cfg;
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                            return __generator(this, function (_v) {
                                switch (_v.label) {
                                    case 0:
                                        configDir = node_path_1.default.join(home, ".openclaw");
                                        return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                    case 1:
                                        _v.sent();
                                        pluginDir = node_path_1.default.join(home, "plugins", "demo-plugin");
                                        return [4 /*yield*/, promises_1.default.mkdir(pluginDir, { recursive: true })];
                                    case 2:
                                        _v.sent();
                                        return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pluginDir, "index.js"), 'export default { id: "demo-plugin", register() {} };', "utf-8")];
                                    case 3:
                                        _v.sent();
                                        return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(pluginDir, "openclaw.plugin.json"), JSON.stringify({
                                                id: "demo-plugin",
                                                configSchema: { type: "object", additionalProperties: false, properties: {} },
                                            }, null, 2), "utf-8")];
                                    case 4:
                                        _v.sent();
                                        return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                                plugins: {
                                                    load: {
                                                        paths: ["~/plugins/demo-plugin"],
                                                    },
                                                },
                                                agents: {
                                                    defaults: { workspace: "~/ws-default" },
                                                    list: [
                                                        {
                                                            id: "main",
                                                            workspace: "~/ws-agent",
                                                            agentDir: "~/.openclaw/agents/main",
                                                            sandbox: { workspaceRoot: "~/sandbox-root" },
                                                        },
                                                    ],
                                                },
                                                channels: {
                                                    whatsapp: {
                                                        accounts: {
                                                            personal: {
                                                                authDir: "~/.openclaw/credentials/wa-personal",
                                                            },
                                                        },
                                                    },
                                                },
                                            }, null, 2), "utf-8")];
                                    case 5:
                                        _v.sent();
                                        vitest_1.vi.resetModules();
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 6:
                                        loadConfig = (_v.sent()).loadConfig;
                                        cfg = loadConfig();
                                        (0, vitest_1.expect)((_c = (_b = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b.paths) === null || _c === void 0 ? void 0 : _c[0]).toBe(node_path_1.default.join(home, "plugins", "demo-plugin"));
                                        (0, vitest_1.expect)((_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.workspace).toBe(node_path_1.default.join(home, "ws-default"));
                                        (0, vitest_1.expect)((_h = (_g = (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.list) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.workspace).toBe(node_path_1.default.join(home, "ws-agent"));
                                        (0, vitest_1.expect)((_l = (_k = (_j = cfg.agents) === null || _j === void 0 ? void 0 : _j.list) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.agentDir).toBe(node_path_1.default.join(home, ".openclaw", "agents", "main"));
                                        (0, vitest_1.expect)((_q = (_p = (_o = (_m = cfg.agents) === null || _m === void 0 ? void 0 : _m.list) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.sandbox) === null || _q === void 0 ? void 0 : _q.workspaceRoot).toBe(node_path_1.default.join(home, "sandbox-root"));
                                        (0, vitest_1.expect)((_u = (_t = (_s = (_r = cfg.channels) === null || _r === void 0 ? void 0 : _r.whatsapp) === null || _s === void 0 ? void 0 : _s.accounts) === null || _t === void 0 ? void 0 : _t.personal) === null || _u === void 0 ? void 0 : _u.authDir).toBe(node_path_1.default.join(home, ".openclaw", "credentials", "wa-personal"));
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
    (0, vitest_1.describe)("U6: gateway port resolution", function () {
        (0, vitest_1.it)("uses default when env and config are unset", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_GATEWAY_PORT: undefined }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, DEFAULT_GATEWAY_PORT, resolveGatewayPort;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        _a = _b.sent(), DEFAULT_GATEWAY_PORT = _a.DEFAULT_GATEWAY_PORT, resolveGatewayPort = _a.resolveGatewayPort;
                                        (0, vitest_1.expect)(resolveGatewayPort({})).toBe(DEFAULT_GATEWAY_PORT);
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
        (0, vitest_1.it)("prefers OPENCLAW_GATEWAY_PORT over config", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_GATEWAY_PORT: "19001" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var resolveGatewayPort;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        resolveGatewayPort = (_a.sent()).resolveGatewayPort;
                                        (0, vitest_1.expect)(resolveGatewayPort({ gateway: { port: 19002 } })).toBe(19001);
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
        (0, vitest_1.it)("falls back to config when env is invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withEnvOverride)({ OPENCLAW_GATEWAY_PORT: "nope" }, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var resolveGatewayPort;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 1:
                                        resolveGatewayPort = (_a.sent()).resolveGatewayPort;
                                        (0, vitest_1.expect)(resolveGatewayPort({ gateway: { port: 19003 } })).toBe(19003);
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
    (0, vitest_1.describe)("U9: telegram.tokenFile schema validation", function () {
        (0, vitest_1.it)("accepts config with only botToken", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                            var configDir, loadConfig, cfg;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        configDir = node_path_1.default.join(home, ".openclaw");
                                        return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                    case 1:
                                        _e.sent();
                                        return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                                channels: { telegram: { botToken: "123:ABC" } },
                                            }), "utf-8")];
                                    case 2:
                                        _e.sent();
                                        vitest_1.vi.resetModules();
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 3:
                                        loadConfig = (_e.sent()).loadConfig;
                                        cfg = loadConfig();
                                        (0, vitest_1.expect)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.botToken).toBe("123:ABC");
                                        (0, vitest_1.expect)((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.tokenFile).toBeUndefined();
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
        (0, vitest_1.it)("accepts config with only tokenFile", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                            var configDir, loadConfig, cfg;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        configDir = node_path_1.default.join(home, ".openclaw");
                                        return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                    case 1:
                                        _e.sent();
                                        return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                                channels: { telegram: { tokenFile: "/run/agenix/telegram-token" } },
                                            }), "utf-8")];
                                    case 2:
                                        _e.sent();
                                        vitest_1.vi.resetModules();
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 3:
                                        loadConfig = (_e.sent()).loadConfig;
                                        cfg = loadConfig();
                                        (0, vitest_1.expect)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.tokenFile).toBe("/run/agenix/telegram-token");
                                        (0, vitest_1.expect)((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.botToken).toBeUndefined();
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
        (0, vitest_1.it)("accepts config with both botToken and tokenFile", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                            var configDir, loadConfig, cfg;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        configDir = node_path_1.default.join(home, ".openclaw");
                                        return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
                                    case 1:
                                        _e.sent();
                                        return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(configDir, "openclaw.json"), JSON.stringify({
                                                channels: {
                                                    telegram: {
                                                        botToken: "fallback:token",
                                                        tokenFile: "/run/agenix/telegram-token",
                                                    },
                                                },
                                            }), "utf-8")];
                                    case 2:
                                        _e.sent();
                                        vitest_1.vi.resetModules();
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                    case 3:
                                        loadConfig = (_e.sent()).loadConfig;
                                        cfg = loadConfig();
                                        (0, vitest_1.expect)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.botToken).toBe("fallback:token");
                                        (0, vitest_1.expect)((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.tokenFile).toBe("/run/agenix/telegram-token");
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
});
