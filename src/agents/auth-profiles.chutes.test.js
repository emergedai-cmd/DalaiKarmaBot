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
var auth_profiles_js_1 = require("./auth-profiles.js");
var chutes_oauth_js_1 = require("./chutes-oauth.js");
(0, vitest_1.describe)("auth-profiles (chutes)", function () {
    var previousStateDir = process.env.OPENCLAW_STATE_DIR;
    var previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
    var previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    var previousChutesClientId = process.env.CHUTES_CLIENT_ID;
    var tempDir = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.unstubAllGlobals();
                    if (!tempDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    tempDir = null;
                    _a.label = 2;
                case 2:
                    if (previousStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousStateDir;
                    }
                    if (previousAgentDir === undefined) {
                        delete process.env.OPENCLAW_AGENT_DIR;
                    }
                    else {
                        process.env.OPENCLAW_AGENT_DIR = previousAgentDir;
                    }
                    if (previousPiAgentDir === undefined) {
                        delete process.env.PI_CODING_AGENT_DIR;
                    }
                    else {
                        process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
                    }
                    if (previousChutesClientId === undefined) {
                        delete process.env.CHUTES_CLIENT_ID;
                    }
                    else {
                        process.env.CHUTES_CLIENT_ID = previousChutesClientId;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refreshes expired Chutes OAuth credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authProfilePath, store, fetchSpy, loaded, resolved, persisted, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-chutes-"))];
                case 1:
                    tempDir = _e.sent();
                    process.env.OPENCLAW_STATE_DIR = tempDir;
                    process.env.OPENCLAW_AGENT_DIR = node_path_1.default.join(tempDir, "agents", "main", "agent");
                    process.env.PI_CODING_AGENT_DIR = process.env.OPENCLAW_AGENT_DIR;
                    authProfilePath = node_path_1.default.join(tempDir, "agents", "main", "agent", "auth-profiles.json");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(authProfilePath), { recursive: true })];
                case 2:
                    _e.sent();
                    store = {
                        version: 1,
                        profiles: {
                            "chutes:default": {
                                type: "oauth",
                                provider: "chutes",
                                access: "at_old",
                                refresh: "rt_old",
                                expires: Date.now() - 60000,
                                clientId: "cid_test",
                            },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(authProfilePath, "".concat(JSON.stringify(store), "\n"))];
                case 3:
                    _e.sent();
                    fetchSpy = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input.toString();
                            if (url !== chutes_oauth_js_1.CHUTES_TOKEN_ENDPOINT) {
                                return [2 /*return*/, new Response("not found", { status: 404 })];
                            }
                            return [2 /*return*/, new Response(JSON.stringify({
                                    access_token: "at_new",
                                    expires_in: 3600,
                                }), { status: 200, headers: { "Content-Type": "application/json" } })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchSpy);
                    loaded = (0, auth_profiles_js_1.ensureAuthProfileStore)();
                    return [4 /*yield*/, (0, auth_profiles_js_1.resolveApiKeyForProfile)({
                            store: loaded,
                            profileId: "chutes:default",
                        })];
                case 4:
                    resolved = _e.sent();
                    (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.apiKey).toBe("at_new");
                    (0, vitest_1.expect)(fetchSpy).toHaveBeenCalled();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(authProfilePath, "utf8")];
                case 5:
                    persisted = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)((_d = (_c = persisted.profiles) === null || _c === void 0 ? void 0 : _c["chutes:default"]) === null || _d === void 0 ? void 0 : _d.access).toBe("at_new");
                    return [2 /*return*/];
            }
        });
    }); });
});
