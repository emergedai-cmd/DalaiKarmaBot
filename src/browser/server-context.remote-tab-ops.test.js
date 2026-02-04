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
vitest_1.vi.mock("./chrome.js", function () { return ({
    isChromeCdpReady: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }),
    isChromeReachable: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }),
    launchOpenClawChrome: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("unexpected launch");
        });
    }); }),
    resolveOpenClawUserDataDir: vitest_1.vi.fn(function () { return "/tmp/openclaw"; }),
    stopOpenClawChrome: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
function makeState(profile) {
    return {
        // oxlint-disable-next-line typescript/no-explicit-any
        server: null,
        port: 0,
        resolved: {
            enabled: true,
            controlPort: 18791,
            cdpProtocol: profile === "remote" ? "https" : "http",
            cdpHost: profile === "remote" ? "browserless.example" : "127.0.0.1",
            cdpIsLoopback: profile !== "remote",
            remoteCdpTimeoutMs: 1500,
            remoteCdpHandshakeTimeoutMs: 3000,
            color: "#FF4500",
            headless: true,
            noSandbox: false,
            attachOnly: false,
            defaultProfile: profile,
            profiles: {
                remote: {
                    cdpUrl: "https://browserless.example/chrome?token=abc",
                    cdpPort: 443,
                    color: "#00AA00",
                },
                openclaw: { cdpPort: 18800, color: "#FF4500" },
            },
        },
        profiles: new Map(),
    };
}
(0, vitest_1.describe)("browser server-context remote profile tab operations", function () {
    (0, vitest_1.it)("uses Playwright tab operations when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listPagesViaPlaywright, createPageViaPlaywright, closePageByTargetIdViaPlaywright, fetchMock, createBrowserRouteContext, state, ctx, remote, tabs, opened;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    listPagesViaPlaywright = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [
                                    { targetId: "T1", title: "Tab 1", url: "https://a.example", type: "page" },
                                ]];
                        });
                    }); });
                    createPageViaPlaywright = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    targetId: "T2",
                                    title: "Tab 2",
                                    url: "https://b.example",
                                    type: "page",
                                })];
                        });
                    }); });
                    closePageByTargetIdViaPlaywright = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    vitest_1.vi.doMock("./pw-ai.js", function () { return ({
                        listPagesViaPlaywright: listPagesViaPlaywright,
                        createPageViaPlaywright: createPageViaPlaywright,
                        closePageByTargetIdViaPlaywright: closePageByTargetIdViaPlaywright,
                    }); });
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected fetch");
                        });
                    }); });
                    global.fetch = fetchMock;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server-context.js"); })];
                case 1:
                    createBrowserRouteContext = (_b.sent()).createBrowserRouteContext;
                    state = makeState("remote");
                    ctx = createBrowserRouteContext({ getState: function () { return state; } });
                    remote = ctx.forProfile("remote");
                    return [4 /*yield*/, remote.listTabs()];
                case 2:
                    tabs = _b.sent();
                    (0, vitest_1.expect)(tabs.map(function (t) { return t.targetId; })).toEqual(["T1"]);
                    return [4 /*yield*/, remote.openTab("https://b.example")];
                case 3:
                    opened = _b.sent();
                    (0, vitest_1.expect)(opened.targetId).toBe("T2");
                    (0, vitest_1.expect)((_a = state.profiles.get("remote")) === null || _a === void 0 ? void 0 : _a.lastTargetId).toBe("T2");
                    return [4 /*yield*/, remote.closeTab("T1")];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(closePageByTargetIdViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: "https://browserless.example/chrome?token=abc",
                        targetId: "T1",
                    });
                    (0, vitest_1.expect)(fetchMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers lastTargetId for remote profiles when targetId is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var responses, listPagesViaPlaywright, fetchMock, createBrowserRouteContext, state, ctx, remote, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    responses = [
                        // ensureTabAvailable() calls listTabs twice
                        [
                            { targetId: "A", title: "A", url: "https://a.example", type: "page" },
                            { targetId: "B", title: "B", url: "https://b.example", type: "page" },
                        ],
                        [
                            { targetId: "A", title: "A", url: "https://a.example", type: "page" },
                            { targetId: "B", title: "B", url: "https://b.example", type: "page" },
                        ],
                        // second ensureTabAvailable() calls listTabs twice, order flips
                        [
                            { targetId: "B", title: "B", url: "https://b.example", type: "page" },
                            { targetId: "A", title: "A", url: "https://a.example", type: "page" },
                        ],
                        [
                            { targetId: "B", title: "B", url: "https://b.example", type: "page" },
                            { targetId: "A", title: "A", url: "https://a.example", type: "page" },
                        ],
                    ];
                    listPagesViaPlaywright = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var next;
                        return __generator(this, function (_a) {
                            next = responses.shift();
                            if (!next) {
                                throw new Error("no more responses");
                            }
                            return [2 /*return*/, next];
                        });
                    }); });
                    vitest_1.vi.doMock("./pw-ai.js", function () { return ({
                        listPagesViaPlaywright: listPagesViaPlaywright,
                        createPageViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error("unexpected create");
                            });
                        }); }),
                        closePageByTargetIdViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error("unexpected close");
                            });
                        }); }),
                    }); });
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected fetch");
                        });
                    }); });
                    global.fetch = fetchMock;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server-context.js"); })];
                case 1:
                    createBrowserRouteContext = (_a.sent()).createBrowserRouteContext;
                    state = makeState("remote");
                    ctx = createBrowserRouteContext({ getState: function () { return state; } });
                    remote = ctx.forProfile("remote");
                    return [4 /*yield*/, remote.ensureTabAvailable()];
                case 2:
                    first = _a.sent();
                    (0, vitest_1.expect)(first.targetId).toBe("A");
                    return [4 /*yield*/, remote.ensureTabAvailable()];
                case 3:
                    second = _a.sent();
                    (0, vitest_1.expect)(second.targetId).toBe("A");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses Playwright focus for remote profiles when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listPagesViaPlaywright, focusPageByTargetIdViaPlaywright, fetchMock, createBrowserRouteContext, state, ctx, remote;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    listPagesViaPlaywright = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [
                                    { targetId: "T1", title: "Tab 1", url: "https://a.example", type: "page" },
                                ]];
                        });
                    }); });
                    focusPageByTargetIdViaPlaywright = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    vitest_1.vi.doMock("./pw-ai.js", function () { return ({
                        listPagesViaPlaywright: listPagesViaPlaywright,
                        focusPageByTargetIdViaPlaywright: focusPageByTargetIdViaPlaywright,
                    }); });
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected fetch");
                        });
                    }); });
                    global.fetch = fetchMock;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server-context.js"); })];
                case 1:
                    createBrowserRouteContext = (_b.sent()).createBrowserRouteContext;
                    state = makeState("remote");
                    ctx = createBrowserRouteContext({ getState: function () { return state; } });
                    remote = ctx.forProfile("remote");
                    return [4 /*yield*/, remote.focusTab("T1")];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(focusPageByTargetIdViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: "https://browserless.example/chrome?token=abc",
                        targetId: "T1",
                    });
                    (0, vitest_1.expect)(fetchMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)((_a = state.profiles.get("remote")) === null || _a === void 0 ? void 0 : _a.lastTargetId).toBe("T1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not swallow Playwright runtime errors for remote profiles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createBrowserRouteContext, state, ctx, remote;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    vitest_1.vi.doMock("./pw-ai.js", function () { return ({
                        listPagesViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error("boom");
                            });
                        }); }),
                    }); });
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected fetch");
                        });
                    }); });
                    global.fetch = fetchMock;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server-context.js"); })];
                case 1:
                    createBrowserRouteContext = (_a.sent()).createBrowserRouteContext;
                    state = makeState("remote");
                    ctx = createBrowserRouteContext({ getState: function () { return state; } });
                    remote = ctx.forProfile("remote");
                    return [4 /*yield*/, (0, vitest_1.expect)(remote.listTabs()).rejects.toThrow(/boom/)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(fetchMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to /json/list when Playwright is not available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createBrowserRouteContext, state, ctx, remote, tabs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    vitest_1.vi.doMock("./pw-ai.js", function () { return ({
                        listPagesViaPlaywright: undefined,
                        createPageViaPlaywright: undefined,
                        closePageByTargetIdViaPlaywright: undefined,
                    }); });
                    fetchMock = vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        var u;
                        return __generator(this, function (_a) {
                            u = String(url);
                            if (!u.includes("/json/list")) {
                                throw new Error("unexpected fetch: ".concat(u));
                            }
                            return [2 /*return*/, {
                                    ok: true,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, [
                                                    {
                                                        id: "T1",
                                                        title: "Tab 1",
                                                        url: "https://a.example",
                                                        webSocketDebuggerUrl: "wss://browserless.example/devtools/page/T1",
                                                        type: "page",
                                                    },
                                                ]];
                                        });
                                    }); },
                                }];
                        });
                    }); });
                    global.fetch = fetchMock;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server-context.js"); })];
                case 1:
                    createBrowserRouteContext = (_a.sent()).createBrowserRouteContext;
                    state = makeState("remote");
                    ctx = createBrowserRouteContext({ getState: function () { return state; } });
                    remote = ctx.forProfile("remote");
                    return [4 /*yield*/, remote.listTabs()];
                case 2:
                    tabs = _a.sent();
                    (0, vitest_1.expect)(tabs.map(function (t) { return t.targetId; })).toEqual(["T1"]);
                    (0, vitest_1.expect)(fetchMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("browser server-context tab selection state", function () {
    (0, vitest_1.it)("updates lastTargetId when openTab is created via CDP", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createBrowserRouteContext, state, ctx, openclaw, opened;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    vitest_1.vi.doUnmock("./pw-ai.js");
                    vitest_1.vi.doMock("./cdp.js", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var actual;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, vitest_1.vi.importActual("./cdp.js")];
                                case 1:
                                    actual = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, actual), { createTargetViaCdp: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, ({ targetId: "CREATED" })];
                                            }); }); }) })];
                            }
                        });
                    }); });
                    fetchMock = vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        var u;
                        return __generator(this, function (_a) {
                            u = String(url);
                            if (!u.includes("/json/list")) {
                                throw new Error("unexpected fetch: ".concat(u));
                            }
                            return [2 /*return*/, {
                                    ok: true,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, [
                                                    {
                                                        id: "CREATED",
                                                        title: "New Tab",
                                                        url: "https://created.example",
                                                        webSocketDebuggerUrl: "ws://127.0.0.1/devtools/page/CREATED",
                                                        type: "page",
                                                    },
                                                ]];
                                        });
                                    }); },
                                }];
                        });
                    }); });
                    global.fetch = fetchMock;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server-context.js"); })];
                case 1:
                    createBrowserRouteContext = (_b.sent()).createBrowserRouteContext;
                    state = makeState("openclaw");
                    ctx = createBrowserRouteContext({ getState: function () { return state; } });
                    openclaw = ctx.forProfile("openclaw");
                    return [4 /*yield*/, openclaw.openTab("https://created.example")];
                case 2:
                    opened = _b.sent();
                    (0, vitest_1.expect)(opened.targetId).toBe("CREATED");
                    (0, vitest_1.expect)((_a = state.profiles.get("openclaw")) === null || _a === void 0 ? void 0 : _a.lastTargetId).toBe("CREATED");
                    return [2 /*return*/];
            }
        });
    }); });
});
