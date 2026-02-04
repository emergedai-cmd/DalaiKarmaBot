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
(0, vitest_1.describe)("onboard (non-interactive): Vercel AI Gateway", function () {
    (0, vitest_1.it)("stores the API key and configures the default model", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prev, tempHome, runtime, runNonInteractiveOnboarding, CONFIG_PATH, cfg, _a, _b, ensureAuthProfileStore, store, profile;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    prev = {
                        home: process.env.HOME,
                        stateDir: process.env.OPENCLAW_STATE_DIR,
                        configPath: process.env.OPENCLAW_CONFIG_PATH,
                        skipChannels: process.env.OPENCLAW_SKIP_CHANNELS,
                        skipGmail: process.env.OPENCLAW_SKIP_GMAIL_WATCHER,
                        skipCron: process.env.OPENCLAW_SKIP_CRON,
                        skipCanvas: process.env.OPENCLAW_SKIP_CANVAS_HOST,
                        token: process.env.OPENCLAW_GATEWAY_TOKEN,
                        password: process.env.OPENCLAW_GATEWAY_PASSWORD,
                    };
                    process.env.OPENCLAW_SKIP_CHANNELS = "1";
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = "1";
                    process.env.OPENCLAW_SKIP_CRON = "1";
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = "1";
                    delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    delete process.env.OPENCLAW_GATEWAY_PASSWORD;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-onboard-gateway-"))];
                case 1:
                    tempHome = _m.sent();
                    process.env.HOME = tempHome;
                    process.env.OPENCLAW_STATE_DIR = tempHome;
                    process.env.OPENCLAW_CONFIG_PATH = node_path_1.default.join(tempHome, "openclaw.json");
                    vitest_1.vi.resetModules();
                    runtime = {
                        log: function () { },
                        error: function (msg) {
                            throw new Error(msg);
                        },
                        exit: function (code) {
                            throw new Error("exit:".concat(code));
                        },
                    };
                    _m.label = 2;
                case 2:
                    _m.trys.push([2, , 8, 10]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./onboard-non-interactive.js"); })];
                case 3:
                    runNonInteractiveOnboarding = (_m.sent()).runNonInteractiveOnboarding;
                    return [4 /*yield*/, runNonInteractiveOnboarding({
                            nonInteractive: true,
                            authChoice: "ai-gateway-api-key",
                            aiGatewayApiKey: "gateway-test-key",
                            skipHealth: true,
                            skipChannels: true,
                            skipSkills: true,
                            json: true,
                        }, runtime)];
                case 4:
                    _m.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 5:
                    CONFIG_PATH = (_m.sent()).CONFIG_PATH;
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(CONFIG_PATH, "utf8")];
                case 6:
                    cfg = _b.apply(_a, [_m.sent()]);
                    (0, vitest_1.expect)((_e = (_d = (_c = cfg.auth) === null || _c === void 0 ? void 0 : _c.profiles) === null || _d === void 0 ? void 0 : _d["vercel-ai-gateway:default"]) === null || _e === void 0 ? void 0 : _e.provider).toBe("vercel-ai-gateway");
                    (0, vitest_1.expect)((_h = (_g = (_f = cfg.auth) === null || _f === void 0 ? void 0 : _f.profiles) === null || _g === void 0 ? void 0 : _g["vercel-ai-gateway:default"]) === null || _h === void 0 ? void 0 : _h.mode).toBe("api_key");
                    (0, vitest_1.expect)((_l = (_k = (_j = cfg.agents) === null || _j === void 0 ? void 0 : _j.defaults) === null || _k === void 0 ? void 0 : _k.model) === null || _l === void 0 ? void 0 : _l.primary).toBe("vercel-ai-gateway/anthropic/claude-opus-4.5");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/auth-profiles.js"); })];
                case 7:
                    ensureAuthProfileStore = (_m.sent()).ensureAuthProfileStore;
                    store = ensureAuthProfileStore();
                    profile = store.profiles["vercel-ai-gateway:default"];
                    (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.type).toBe("api_key");
                    if ((profile === null || profile === void 0 ? void 0 : profile.type) === "api_key") {
                        (0, vitest_1.expect)(profile.provider).toBe("vercel-ai-gateway");
                        (0, vitest_1.expect)(profile.key).toBe("gateway-test-key");
                    }
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, promises_1.default.rm(tempHome, { recursive: true, force: true })];
                case 9:
                    _m.sent();
                    process.env.HOME = prev.home;
                    process.env.OPENCLAW_STATE_DIR = prev.stateDir;
                    process.env.OPENCLAW_CONFIG_PATH = prev.configPath;
                    process.env.OPENCLAW_SKIP_CHANNELS = prev.skipChannels;
                    process.env.OPENCLAW_SKIP_GMAIL_WATCHER = prev.skipGmail;
                    process.env.OPENCLAW_SKIP_CRON = prev.skipCron;
                    process.env.OPENCLAW_SKIP_CANVAS_HOST = prev.skipCanvas;
                    process.env.OPENCLAW_GATEWAY_TOKEN = prev.token;
                    process.env.OPENCLAW_GATEWAY_PASSWORD = prev.password;
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); }, 60000);
});
