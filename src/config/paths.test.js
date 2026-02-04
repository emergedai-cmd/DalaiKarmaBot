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
var paths_js_1 = require("./paths.js");
(0, vitest_1.describe)("oauth paths", function () {
    (0, vitest_1.it)("prefers OPENCLAW_OAUTH_DIR over OPENCLAW_STATE_DIR", function () {
        var env = {
            OPENCLAW_OAUTH_DIR: "/custom/oauth",
            OPENCLAW_STATE_DIR: "/custom/state",
        };
        (0, vitest_1.expect)((0, paths_js_1.resolveOAuthDir)(env, "/custom/state")).toBe(node_path_1.default.resolve("/custom/oauth"));
        (0, vitest_1.expect)((0, paths_js_1.resolveOAuthPath)(env, "/custom/state")).toBe(node_path_1.default.join(node_path_1.default.resolve("/custom/oauth"), "oauth.json"));
    });
    (0, vitest_1.it)("derives oauth path from OPENCLAW_STATE_DIR when unset", function () {
        var env = {
            OPENCLAW_STATE_DIR: "/custom/state",
        };
        (0, vitest_1.expect)((0, paths_js_1.resolveOAuthDir)(env, "/custom/state")).toBe(node_path_1.default.join("/custom/state", "credentials"));
        (0, vitest_1.expect)((0, paths_js_1.resolveOAuthPath)(env, "/custom/state")).toBe(node_path_1.default.join("/custom/state", "credentials", "oauth.json"));
    });
});
(0, vitest_1.describe)("state + config path candidates", function () {
    (0, vitest_1.it)("uses OPENCLAW_STATE_DIR when set", function () {
        var env = {
            OPENCLAW_STATE_DIR: "/new/state",
        };
        (0, vitest_1.expect)((0, paths_js_1.resolveStateDir)(env, function () { return "/home/test"; })).toBe(node_path_1.default.resolve("/new/state"));
    });
    (0, vitest_1.it)("orders default config candidates in a stable order", function () {
        var home = "/home/test";
        var candidates = (0, paths_js_1.resolveDefaultConfigCandidates)({}, function () { return home; });
        var expected = [
            node_path_1.default.join(home, ".openclaw", "openclaw.json"),
            node_path_1.default.join(home, ".openclaw", "clawdbot.json"),
            node_path_1.default.join(home, ".openclaw", "moltbot.json"),
            node_path_1.default.join(home, ".openclaw", "moldbot.json"),
            node_path_1.default.join(home, ".clawdbot", "openclaw.json"),
            node_path_1.default.join(home, ".clawdbot", "clawdbot.json"),
            node_path_1.default.join(home, ".clawdbot", "moltbot.json"),
            node_path_1.default.join(home, ".clawdbot", "moldbot.json"),
            node_path_1.default.join(home, ".moltbot", "openclaw.json"),
            node_path_1.default.join(home, ".moltbot", "clawdbot.json"),
            node_path_1.default.join(home, ".moltbot", "moltbot.json"),
            node_path_1.default.join(home, ".moltbot", "moldbot.json"),
            node_path_1.default.join(home, ".moldbot", "openclaw.json"),
            node_path_1.default.join(home, ".moldbot", "clawdbot.json"),
            node_path_1.default.join(home, ".moldbot", "moltbot.json"),
            node_path_1.default.join(home, ".moldbot", "moldbot.json"),
        ];
        (0, vitest_1.expect)(candidates).toEqual(expected);
    });
    (0, vitest_1.it)("prefers ~/.openclaw when it exists and legacy dir is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, newDir, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-state-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    newDir = node_path_1.default.join(root, ".openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(newDir, { recursive: true })];
                case 3:
                    _a.sent();
                    resolved = (0, paths_js_1.resolveStateDir)({}, function () { return root; });
                    (0, vitest_1.expect)(resolved).toBe(newDir);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("CONFIG_PATH prefers existing config when present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, previousHome, previousUserProfile, previousHomeDrive, previousHomePath, previousOpenClawConfig, previousOpenClawState, legacyDir, legacyPath, parsed, CONFIG_PATH;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-config-"))];
                case 1:
                    root = _a.sent();
                    previousHome = process.env.HOME;
                    previousUserProfile = process.env.USERPROFILE;
                    previousHomeDrive = process.env.HOMEDRIVE;
                    previousHomePath = process.env.HOMEPATH;
                    previousOpenClawConfig = process.env.OPENCLAW_CONFIG_PATH;
                    previousOpenClawState = process.env.OPENCLAW_STATE_DIR;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    legacyDir = node_path_1.default.join(root, ".openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(legacyDir, { recursive: true })];
                case 3:
                    _a.sent();
                    legacyPath = node_path_1.default.join(legacyDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(legacyPath, "{}", "utf-8")];
                case 4:
                    _a.sent();
                    process.env.HOME = root;
                    if (process.platform === "win32") {
                        process.env.USERPROFILE = root;
                        parsed = node_path_1.default.win32.parse(root);
                        process.env.HOMEDRIVE = parsed.root.replace(/\\$/, "");
                        process.env.HOMEPATH = root.slice(parsed.root.length - 1);
                    }
                    delete process.env.OPENCLAW_CONFIG_PATH;
                    delete process.env.OPENCLAW_STATE_DIR;
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./paths.js"); })];
                case 5:
                    CONFIG_PATH = (_a.sent()).CONFIG_PATH;
                    (0, vitest_1.expect)(CONFIG_PATH).toBe(legacyPath);
                    return [3 /*break*/, 8];
                case 6:
                    if (previousHome === undefined) {
                        delete process.env.HOME;
                    }
                    else {
                        process.env.HOME = previousHome;
                    }
                    if (previousUserProfile === undefined) {
                        delete process.env.USERPROFILE;
                    }
                    else {
                        process.env.USERPROFILE = previousUserProfile;
                    }
                    if (previousHomeDrive === undefined) {
                        delete process.env.HOMEDRIVE;
                    }
                    else {
                        process.env.HOMEDRIVE = previousHomeDrive;
                    }
                    if (previousHomePath === undefined) {
                        delete process.env.HOMEPATH;
                    }
                    else {
                        process.env.HOMEPATH = previousHomePath;
                    }
                    if (previousOpenClawConfig === undefined) {
                        delete process.env.OPENCLAW_CONFIG_PATH;
                    }
                    else {
                        process.env.OPENCLAW_CONFIG_PATH = previousOpenClawConfig;
                    }
                    if (previousOpenClawConfig === undefined) {
                        delete process.env.OPENCLAW_CONFIG_PATH;
                    }
                    else {
                        process.env.OPENCLAW_CONFIG_PATH = previousOpenClawConfig;
                    }
                    if (previousOpenClawState === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousOpenClawState;
                    }
                    if (previousOpenClawState === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousOpenClawState;
                    }
                    return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    vitest_1.vi.resetModules();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects state dir overrides when config is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, legacyDir, legacyConfig, overrideDir, env, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-config-override-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 5, 7]);
                    legacyDir = node_path_1.default.join(root, ".openclaw");
                    return [4 /*yield*/, promises_1.default.mkdir(legacyDir, { recursive: true })];
                case 3:
                    _a.sent();
                    legacyConfig = node_path_1.default.join(legacyDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(legacyConfig, "{}", "utf-8")];
                case 4:
                    _a.sent();
                    overrideDir = node_path_1.default.join(root, "override");
                    env = { OPENCLAW_STATE_DIR: overrideDir };
                    resolved = (0, paths_js_1.resolveConfigPath)(env, overrideDir, function () { return root; });
                    (0, vitest_1.expect)(resolved).toBe(node_path_1.default.join(overrideDir, "openclaw.json"));
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
});
