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
function writePluginFixture(params) {
    return __awaiter(this, void 0, void 0, function () {
        var manifest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(params.dir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(params.dir, "index.js"), "export default { id: \"".concat(params.id, "\", register() {} };"), "utf-8")];
                case 2:
                    _a.sent();
                    manifest = {
                        id: params.id,
                        configSchema: params.schema,
                    };
                    if (params.channels) {
                        manifest.channels = params.channels;
                    }
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(params.dir, "openclaw.plugin.json"), JSON.stringify(manifest, null, 2), "utf-8")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("config plugin validation", function () {
    (0, vitest_1.it)("rejects missing plugin load paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var validateConfigObjectWithPlugins, missingPath, res, hasIssue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 1:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    missingPath = node_path_1.default.join(home, "missing-plugin");
                                    res = validateConfigObjectWithPlugins({
                                        agents: { list: [{ id: "pi" }] },
                                        plugins: { enabled: false, load: { paths: [missingPath] } },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(false);
                                    if (!res.ok) {
                                        hasIssue = res.issues.some(function (issue) {
                                            return issue.path === "plugins.load.paths" && issue.message.includes("plugin path not found");
                                        });
                                        (0, vitest_1.expect)(hasIssue).toBe(true);
                                    }
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
    (0, vitest_1.it)("rejects missing plugin ids in entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var validateConfigObjectWithPlugins, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 1:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    res = validateConfigObjectWithPlugins({
                                        agents: { list: [{ id: "pi" }] },
                                        plugins: { enabled: false, entries: { "missing-plugin": { enabled: true } } },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(false);
                                    if (!res.ok) {
                                        (0, vitest_1.expect)(res.issues).toContainEqual({
                                            path: "plugins.entries.missing-plugin",
                                            message: "plugin not found: missing-plugin",
                                        });
                                    }
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
    (0, vitest_1.it)("rejects missing plugin ids in allow/deny/slots", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var validateConfigObjectWithPlugins, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 1:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    res = validateConfigObjectWithPlugins({
                                        agents: { list: [{ id: "pi" }] },
                                        plugins: {
                                            enabled: false,
                                            allow: ["missing-allow"],
                                            deny: ["missing-deny"],
                                            slots: { memory: "missing-slot" },
                                        },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(false);
                                    if (!res.ok) {
                                        (0, vitest_1.expect)(res.issues).toEqual(vitest_1.expect.arrayContaining([
                                            { path: "plugins.allow", message: "plugin not found: missing-allow" },
                                            { path: "plugins.deny", message: "plugin not found: missing-deny" },
                                            { path: "plugins.slots.memory", message: "plugin not found: missing-slot" },
                                        ]));
                                    }
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
    (0, vitest_1.it)("surfaces plugin config diagnostics", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var pluginDir, validateConfigObjectWithPlugins, res, hasIssue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    pluginDir = node_path_1.default.join(home, "bad-plugin");
                                    return [4 /*yield*/, writePluginFixture({
                                            dir: pluginDir,
                                            id: "bad-plugin",
                                            schema: {
                                                type: "object",
                                                additionalProperties: false,
                                                properties: {
                                                    value: { type: "boolean" },
                                                },
                                                required: ["value"],
                                            },
                                        })];
                                case 1:
                                    _a.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 2:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    res = validateConfigObjectWithPlugins({
                                        agents: { list: [{ id: "pi" }] },
                                        plugins: {
                                            enabled: true,
                                            load: { paths: [pluginDir] },
                                            entries: { "bad-plugin": { config: { value: "nope" } } },
                                        },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(false);
                                    if (!res.ok) {
                                        hasIssue = res.issues.some(function (issue) {
                                            return issue.path === "plugins.entries.bad-plugin.config" &&
                                                issue.message.includes("invalid config");
                                        });
                                        (0, vitest_1.expect)(hasIssue).toBe(true);
                                    }
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
    (0, vitest_1.it)("accepts known plugin ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var validateConfigObjectWithPlugins, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 1:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    res = validateConfigObjectWithPlugins({
                                        agents: { list: [{ id: "pi" }] },
                                        plugins: { enabled: false, entries: { discord: { enabled: true } } },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(true);
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
    (0, vitest_1.it)("accepts plugin heartbeat targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var pluginDir, validateConfigObjectWithPlugins, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    pluginDir = node_path_1.default.join(home, "bluebubbles-plugin");
                                    return [4 /*yield*/, writePluginFixture({
                                            dir: pluginDir,
                                            id: "bluebubbles-plugin",
                                            channels: ["bluebubbles"],
                                            schema: { type: "object" },
                                        })];
                                case 1:
                                    _a.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 2:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    res = validateConfigObjectWithPlugins({
                                        agents: { defaults: { heartbeat: { target: "bluebubbles" } }, list: [{ id: "pi" }] },
                                        plugins: { enabled: false, load: { paths: [pluginDir] } },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(true);
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
    (0, vitest_1.it)("rejects unknown heartbeat targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var validateConfigObjectWithPlugins, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(home, ".openclaw");
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 1:
                                    validateConfigObjectWithPlugins = (_a.sent()).validateConfigObjectWithPlugins;
                                    res = validateConfigObjectWithPlugins({
                                        agents: { defaults: { heartbeat: { target: "not-a-channel" } }, list: [{ id: "pi" }] },
                                    });
                                    (0, vitest_1.expect)(res.ok).toBe(false);
                                    if (!res.ok) {
                                        (0, vitest_1.expect)(res.issues).toContainEqual({
                                            path: "agents.defaults.heartbeat.target",
                                            message: "unknown heartbeat target: not-a-channel",
                                        });
                                    }
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
