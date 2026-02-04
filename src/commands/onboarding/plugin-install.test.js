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
vitest_1.vi.mock("node:fs", function () { return ({
    default: {
        existsSync: vitest_1.vi.fn(),
    },
}); });
var installPluginFromNpmSpec = vitest_1.vi.fn();
vitest_1.vi.mock("../../plugins/install.js", function () { return ({
    installPluginFromNpmSpec: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return installPluginFromNpmSpec.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../../plugins/loader.js", function () { return ({
    loadOpenClawPlugins: vitest_1.vi.fn(),
}); });
var node_fs_1 = require("node:fs");
var test_utils_js_1 = require("./__tests__/test-utils.js");
var plugin_install_js_1 = require("./plugin-install.js");
var baseEntry = {
    id: "zalo",
    meta: {
        id: "zalo",
        label: "Zalo",
        selectionLabel: "Zalo (Bot API)",
        docsPath: "/channels/zalo",
        docsLabel: "zalo",
        blurb: "Test",
    },
    install: {
        npmSpec: "@openclaw/zalo",
        localPath: "extensions/zalo",
    },
};
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.describe)("ensureOnboardingPluginInstalled", function () {
    (0, vitest_1.it)("installs from npm and enables the plugin", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, prompter, cfg, result;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    runtime = (0, test_utils_js_1.makeRuntime)();
                    prompter = (0, test_utils_js_1.makePrompter)({
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "npm"];
                        }); }); }),
                    });
                    cfg = { plugins: { allow: ["other"] } };
                    vitest_1.vi.mocked(node_fs_1.default.existsSync).mockReturnValue(false);
                    installPluginFromNpmSpec.mockResolvedValue({
                        ok: true,
                        pluginId: "zalo",
                        targetDir: "/tmp/zalo",
                        extensions: [],
                    });
                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                            cfg: cfg,
                            entry: baseEntry,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 1:
                    result = _p.sent();
                    (0, vitest_1.expect)(result.installed).toBe(true);
                    (0, vitest_1.expect)((_c = (_b = (_a = result.cfg.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.zalo) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
                    (0, vitest_1.expect)((_d = result.cfg.plugins) === null || _d === void 0 ? void 0 : _d.allow).toContain("zalo");
                    (0, vitest_1.expect)((_g = (_f = (_e = result.cfg.plugins) === null || _e === void 0 ? void 0 : _e.installs) === null || _f === void 0 ? void 0 : _f.zalo) === null || _g === void 0 ? void 0 : _g.source).toBe("npm");
                    (0, vitest_1.expect)((_k = (_j = (_h = result.cfg.plugins) === null || _h === void 0 ? void 0 : _h.installs) === null || _j === void 0 ? void 0 : _j.zalo) === null || _k === void 0 ? void 0 : _k.spec).toBe("@openclaw/zalo");
                    (0, vitest_1.expect)((_o = (_m = (_l = result.cfg.plugins) === null || _l === void 0 ? void 0 : _l.installs) === null || _m === void 0 ? void 0 : _m.zalo) === null || _o === void 0 ? void 0 : _o.installPath).toBe("/tmp/zalo");
                    (0, vitest_1.expect)(installPluginFromNpmSpec).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ spec: "@openclaw/zalo" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses local path when selected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, prompter, cfg, result, expectedPath;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    runtime = (0, test_utils_js_1.makeRuntime)();
                    prompter = (0, test_utils_js_1.makePrompter)({
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "local"];
                        }); }); }),
                    });
                    cfg = {};
                    vitest_1.vi.mocked(node_fs_1.default.existsSync).mockImplementation(function (value) {
                        var raw = String(value);
                        return (raw.endsWith("".concat(node_path_1.default.sep, ".git")) || raw.endsWith("".concat(node_path_1.default.sep, "extensions").concat(node_path_1.default.sep, "zalo")));
                    });
                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                            cfg: cfg,
                            entry: baseEntry,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 1:
                    result = _f.sent();
                    expectedPath = node_path_1.default.resolve(process.cwd(), "extensions/zalo");
                    (0, vitest_1.expect)(result.installed).toBe(true);
                    (0, vitest_1.expect)((_b = (_a = result.cfg.plugins) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b.paths).toContain(expectedPath);
                    (0, vitest_1.expect)((_e = (_d = (_c = result.cfg.plugins) === null || _c === void 0 ? void 0 : _c.entries) === null || _d === void 0 ? void 0 : _d.zalo) === null || _e === void 0 ? void 0 : _e.enabled).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to local on dev channel when local path exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, select, prompter, cfg, firstCall;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtime = (0, test_utils_js_1.makeRuntime)();
                    select = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, "skip"];
                    }); }); });
                    prompter = (0, test_utils_js_1.makePrompter)({ select: select });
                    cfg = { update: { channel: "dev" } };
                    vitest_1.vi.mocked(node_fs_1.default.existsSync).mockImplementation(function (value) {
                        var raw = String(value);
                        return (raw.endsWith("".concat(node_path_1.default.sep, ".git")) || raw.endsWith("".concat(node_path_1.default.sep, "extensions").concat(node_path_1.default.sep, "zalo")));
                    });
                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                            cfg: cfg,
                            entry: baseEntry,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 1:
                    _b.sent();
                    firstCall = (_a = select.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(firstCall === null || firstCall === void 0 ? void 0 : firstCall.initialValue).toBe("local");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to npm on beta channel even when local path exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, select, prompter, cfg, firstCall;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtime = (0, test_utils_js_1.makeRuntime)();
                    select = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, "skip"];
                    }); }); });
                    prompter = (0, test_utils_js_1.makePrompter)({ select: select });
                    cfg = { update: { channel: "beta" } };
                    vitest_1.vi.mocked(node_fs_1.default.existsSync).mockImplementation(function (value) {
                        var raw = String(value);
                        return (raw.endsWith("".concat(node_path_1.default.sep, ".git")) || raw.endsWith("".concat(node_path_1.default.sep, "extensions").concat(node_path_1.default.sep, "zalo")));
                    });
                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                            cfg: cfg,
                            entry: baseEntry,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 1:
                    _b.sent();
                    firstCall = (_a = select.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(firstCall === null || firstCall === void 0 ? void 0 : firstCall.initialValue).toBe("npm");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to local path after npm install failure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, note, confirm, prompter, cfg, result, expectedPath;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runtime = (0, test_utils_js_1.makeRuntime)();
                    note = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    confirm = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, true];
                    }); }); });
                    prompter = (0, test_utils_js_1.makePrompter)({
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "npm"];
                        }); }); }),
                        note: note,
                        confirm: confirm,
                    });
                    cfg = {};
                    vitest_1.vi.mocked(node_fs_1.default.existsSync).mockImplementation(function (value) {
                        var raw = String(value);
                        return (raw.endsWith("".concat(node_path_1.default.sep, ".git")) || raw.endsWith("".concat(node_path_1.default.sep, "extensions").concat(node_path_1.default.sep, "zalo")));
                    });
                    installPluginFromNpmSpec.mockResolvedValue({
                        ok: false,
                        error: "nope",
                    });
                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                            cfg: cfg,
                            entry: baseEntry,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 1:
                    result = _c.sent();
                    expectedPath = node_path_1.default.resolve(process.cwd(), "extensions/zalo");
                    (0, vitest_1.expect)(result.installed).toBe(true);
                    (0, vitest_1.expect)((_b = (_a = result.cfg.plugins) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b.paths).toContain(expectedPath);
                    (0, vitest_1.expect)(note).toHaveBeenCalled();
                    (0, vitest_1.expect)(runtime.error).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
