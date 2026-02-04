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
var vitest_1 = require("vitest");
(0, vitest_1.describe)("sandbox config merges", function () {
    (0, vitest_1.it)("resolves sandbox scope deterministically", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxScope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxScope = (_a.sent()).resolveSandboxScope;
                    (0, vitest_1.expect)(resolveSandboxScope({})).toBe("agent");
                    (0, vitest_1.expect)(resolveSandboxScope({ perSession: true })).toBe("session");
                    (0, vitest_1.expect)(resolveSandboxScope({ perSession: false })).toBe("shared");
                    (0, vitest_1.expect)(resolveSandboxScope({ perSession: true, scope: "agent" })).toBe("agent");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("merges sandbox docker env and ulimits (agent wins)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxDockerConfig, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxDockerConfig = (_a.sent()).resolveSandboxDockerConfig;
                    resolved = resolveSandboxDockerConfig({
                        scope: "agent",
                        globalDocker: {
                            env: { LANG: "C.UTF-8", FOO: "1" },
                            ulimits: { nofile: { soft: 10, hard: 20 } },
                        },
                        agentDocker: {
                            env: { FOO: "2", BAR: "3" },
                            ulimits: { nproc: 256 },
                        },
                    });
                    (0, vitest_1.expect)(resolved.env).toEqual({ LANG: "C.UTF-8", FOO: "2", BAR: "3" });
                    (0, vitest_1.expect)(resolved.ulimits).toEqual({
                        nofile: { soft: 10, hard: 20 },
                        nproc: 256,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("merges sandbox docker binds (global + agent combined)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxDockerConfig, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxDockerConfig = (_a.sent()).resolveSandboxDockerConfig;
                    resolved = resolveSandboxDockerConfig({
                        scope: "agent",
                        globalDocker: {
                            binds: ["/var/run/docker.sock:/var/run/docker.sock"],
                        },
                        agentDocker: {
                            binds: ["/home/user/source:/source:rw"],
                        },
                    });
                    (0, vitest_1.expect)(resolved.binds).toEqual([
                        "/var/run/docker.sock:/var/run/docker.sock",
                        "/home/user/source:/source:rw",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns undefined binds when neither global nor agent has binds", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxDockerConfig, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxDockerConfig = (_a.sent()).resolveSandboxDockerConfig;
                    resolved = resolveSandboxDockerConfig({
                        scope: "agent",
                        globalDocker: {},
                        agentDocker: {},
                    });
                    (0, vitest_1.expect)(resolved.binds).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores agent binds under shared scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxDockerConfig, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxDockerConfig = (_a.sent()).resolveSandboxDockerConfig;
                    resolved = resolveSandboxDockerConfig({
                        scope: "shared",
                        globalDocker: {
                            binds: ["/var/run/docker.sock:/var/run/docker.sock"],
                        },
                        agentDocker: {
                            binds: ["/home/user/source:/source:rw"],
                        },
                    });
                    (0, vitest_1.expect)(resolved.binds).toEqual(["/var/run/docker.sock:/var/run/docker.sock"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores agent docker overrides under shared scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxDockerConfig, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxDockerConfig = (_a.sent()).resolveSandboxDockerConfig;
                    resolved = resolveSandboxDockerConfig({
                        scope: "shared",
                        globalDocker: { image: "global" },
                        agentDocker: { image: "agent" },
                    });
                    (0, vitest_1.expect)(resolved.image).toBe("global");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies per-agent browser and prune overrides (ignored under shared scope)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, resolveSandboxBrowserConfig, resolveSandboxPruneConfig, browser, prune, browserShared, pruneShared;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    _a = _b.sent(), resolveSandboxBrowserConfig = _a.resolveSandboxBrowserConfig, resolveSandboxPruneConfig = _a.resolveSandboxPruneConfig;
                    browser = resolveSandboxBrowserConfig({
                        scope: "agent",
                        globalBrowser: { enabled: false, headless: false, enableNoVnc: true },
                        agentBrowser: { enabled: true, headless: true, enableNoVnc: false },
                    });
                    (0, vitest_1.expect)(browser.enabled).toBe(true);
                    (0, vitest_1.expect)(browser.headless).toBe(true);
                    (0, vitest_1.expect)(browser.enableNoVnc).toBe(false);
                    prune = resolveSandboxPruneConfig({
                        scope: "agent",
                        globalPrune: { idleHours: 24, maxAgeDays: 7 },
                        agentPrune: { idleHours: 0, maxAgeDays: 1 },
                    });
                    (0, vitest_1.expect)(prune).toEqual({ idleHours: 0, maxAgeDays: 1 });
                    browserShared = resolveSandboxBrowserConfig({
                        scope: "shared",
                        globalBrowser: { enabled: false },
                        agentBrowser: { enabled: true },
                    });
                    (0, vitest_1.expect)(browserShared.enabled).toBe(false);
                    pruneShared = resolveSandboxPruneConfig({
                        scope: "shared",
                        globalPrune: { idleHours: 24, maxAgeDays: 7 },
                        agentPrune: { idleHours: 0, maxAgeDays: 1 },
                    });
                    (0, vitest_1.expect)(pruneShared).toEqual({ idleHours: 24, maxAgeDays: 7 });
                    return [2 /*return*/];
            }
        });
    }); });
});
