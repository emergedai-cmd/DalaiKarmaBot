"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var browserClientMocks = vitest_1.vi.hoisted(function () { return ({
    browserCloseTab: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({})];
    }); }); }),
    browserFocusTab: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({})];
    }); }); }),
    browserOpenTab: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({})];
    }); }); }),
    browserProfiles: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
    browserSnapshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    ok: true,
                    format: "ai",
                    targetId: "t1",
                    url: "https://example.com",
                    snapshot: "ok",
                })];
        });
    }); }),
    browserStart: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({})];
    }); }); }),
    browserStatus: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    ok: true,
                    running: true,
                    pid: 1,
                    cdpPort: 18792,
                    cdpUrl: "http://127.0.0.1:18792",
                })];
        });
    }); }),
    browserStop: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({})];
    }); }); }),
    browserTabs: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
}); });
vitest_1.vi.mock("../../browser/client.js", function () { return browserClientMocks; });
var browserConfigMocks = vitest_1.vi.hoisted(function () { return ({
    resolveBrowserConfig: vitest_1.vi.fn(function () { return ({
        enabled: true,
        controlPort: 18791,
    }); }),
}); });
vitest_1.vi.mock("../../browser/config.js", function () { return browserConfigMocks; });
var nodesUtilsMocks = vitest_1.vi.hoisted(function () { return ({
    listNodes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
}); });
vitest_1.vi.mock("./nodes-utils.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./nodes-utils.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { listNodes: nodesUtilsMocks.listNodes })];
        }
    });
}); });
var gatewayMocks = vitest_1.vi.hoisted(function () { return ({
    callGatewayTool: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    ok: true,
                    payload: { result: { ok: true, running: true } },
                })];
        });
    }); }),
}); });
vitest_1.vi.mock("./gateway.js", function () { return gatewayMocks; });
var configMocks = vitest_1.vi.hoisted(function () { return ({
    loadConfig: vitest_1.vi.fn(function () { return ({ browser: {} }); }),
}); });
vitest_1.vi.mock("../../config/config.js", function () { return configMocks; });
var toolCommonMocks = vitest_1.vi.hoisted(function () { return ({
    imageResultFromFile: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./common.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./common.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { imageResultFromFile: toolCommonMocks.imageResultFromFile })];
        }
    });
}); });
var constants_js_1 = require("../../browser/constants.js");
var browser_tool_js_1 = require("./browser-tool.js");
(0, vitest_1.describe)("browser tool snapshot maxChars", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
        configMocks.loadConfig.mockReturnValue({ browser: {} });
        nodesUtilsMocks.listNodes.mockResolvedValue([]);
    });
    (0, vitest_1.it)("applies the default ai snapshot limit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "snapshot", snapshotFormat: "ai" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalledWith(undefined, vitest_1.expect.objectContaining({
                        format: "ai",
                        maxChars: constants_js_1.DEFAULT_AI_SNAPSHOT_MAX_CHARS,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects an explicit maxChars override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, override;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    override = 2000;
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, {
                            action: "snapshot",
                            snapshotFormat: "ai",
                            maxChars: override,
                        }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalledWith(undefined, vitest_1.expect.objectContaining({
                        maxChars: override,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips the default when maxChars is explicitly zero", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, _a, opts;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_b = tool.execute) === null || _b === void 0 ? void 0 : _b.call(tool, null, {
                            action: "snapshot",
                            snapshotFormat: "ai",
                            maxChars: 0,
                        }))];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalled();
                    _a = (_c = browserClientMocks.browserSnapshot.mock.calls.at(-1)) !== null && _c !== void 0 ? _c : [], opts = _a[1];
                    (0, vitest_1.expect)(Object.hasOwn(opts !== null && opts !== void 0 ? opts : {}, "maxChars")).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists profiles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "profiles" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserProfiles).toHaveBeenCalledWith(undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes refs mode through to browser snapshot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "snapshot", snapshotFormat: "ai", refs: "aria" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalledWith(undefined, vitest_1.expect.objectContaining({
                        format: "ai",
                        refs: "aria",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses config snapshot defaults when mode is not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    configMocks.loadConfig.mockReturnValue({
                        browser: { snapshotDefaults: { mode: "efficient" } },
                    });
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "snapshot", snapshotFormat: "ai" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalledWith(undefined, vitest_1.expect.objectContaining({
                        mode: "efficient",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not apply config snapshot defaults to aria snapshots", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, _a, opts;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    configMocks.loadConfig.mockReturnValue({
                        browser: { snapshotDefaults: { mode: "efficient" } },
                    });
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_b = tool.execute) === null || _b === void 0 ? void 0 : _b.call(tool, null, { action: "snapshot", snapshotFormat: "aria" }))];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalled();
                    _a = (_c = browserClientMocks.browserSnapshot.mock.calls.at(-1)) !== null && _c !== void 0 ? _c : [], opts = _a[1];
                    (0, vitest_1.expect)(opts === null || opts === void 0 ? void 0 : opts.mode).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults to host when using profile=chrome (even in sandboxed sessions)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)({ sandboxBridgeUrl: "http://127.0.0.1:9999" });
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "snapshot", profile: "chrome", snapshotFormat: "ai" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserSnapshot).toHaveBeenCalledWith(undefined, vitest_1.expect.objectContaining({
                        profile: "chrome",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes to node proxy when target=node", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nodesUtilsMocks.listNodes.mockResolvedValue([
                        {
                            nodeId: "node-1",
                            displayName: "Browser Node",
                            connected: true,
                            caps: ["browser"],
                            commands: ["browser.proxy"],
                        },
                    ]);
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "status", target: "node" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(gatewayMocks.callGatewayTool).toHaveBeenCalledWith("node.invoke", { timeoutMs: 20000 }, vitest_1.expect.objectContaining({
                        nodeId: "node-1",
                        command: "browser.proxy",
                    }));
                    (0, vitest_1.expect)(browserClientMocks.browserStatus).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps sandbox bridge url when node proxy is available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nodesUtilsMocks.listNodes.mockResolvedValue([
                        {
                            nodeId: "node-1",
                            displayName: "Browser Node",
                            connected: true,
                            caps: ["browser"],
                            commands: ["browser.proxy"],
                        },
                    ]);
                    tool = (0, browser_tool_js_1.createBrowserTool)({ sandboxBridgeUrl: "http://127.0.0.1:9999" });
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "status" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserStatus).toHaveBeenCalledWith("http://127.0.0.1:9999", vitest_1.expect.objectContaining({ profile: undefined }));
                    (0, vitest_1.expect)(gatewayMocks.callGatewayTool).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps chrome profile on host when node proxy is available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nodesUtilsMocks.listNodes.mockResolvedValue([
                        {
                            nodeId: "node-1",
                            displayName: "Browser Node",
                            connected: true,
                            caps: ["browser"],
                            commands: ["browser.proxy"],
                        },
                    ]);
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, { action: "status", profile: "chrome" }))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(browserClientMocks.browserStatus).toHaveBeenCalledWith(undefined, vitest_1.expect.objectContaining({ profile: "chrome" }));
                    (0, vitest_1.expect)(gatewayMocks.callGatewayTool).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("browser tool snapshot labels", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
        configMocks.loadConfig.mockReturnValue({ browser: {} });
    });
    (0, vitest_1.it)("returns image + text when labels are requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, imageResult, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tool = (0, browser_tool_js_1.createBrowserTool)();
                    imageResult = {
                        content: [
                            { type: "text", text: "label text" },
                            { type: "image", data: "base64", mimeType: "image/png" },
                        ],
                        details: { path: "/tmp/snap.png" },
                    };
                    toolCommonMocks.imageResultFromFile.mockResolvedValueOnce(imageResult);
                    browserClientMocks.browserSnapshot.mockResolvedValueOnce({
                        ok: true,
                        format: "ai",
                        targetId: "t1",
                        url: "https://example.com",
                        snapshot: "label text",
                        imagePath: "/tmp/snap.png",
                    });
                    return [4 /*yield*/, ((_a = tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, null, {
                            action: "snapshot",
                            snapshotFormat: "ai",
                            labels: true,
                        }))];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(toolCommonMocks.imageResultFromFile).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        path: "/tmp/snap.png",
                        extraText: "label text",
                    }));
                    (0, vitest_1.expect)(result).toEqual(imageResult);
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.content).toHaveLength(2);
                    (0, vitest_1.expect)((_b = result === null || result === void 0 ? void 0 : result.content) === null || _b === void 0 ? void 0 : _b[0]).toMatchObject({ type: "text", text: "label text" });
                    (0, vitest_1.expect)((_c = result === null || result === void 0 ? void 0 : result.content) === null || _c === void 0 ? void 0 : _c[1]).toMatchObject({ type: "image" });
                    return [2 /*return*/];
            }
        });
    }); });
});
