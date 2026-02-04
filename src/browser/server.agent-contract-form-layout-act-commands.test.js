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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_net_1 = require("node:net");
var undici_1 = require("undici");
var vitest_1 = require("vitest");
var testPort = 0;
var cdpBaseUrl = "";
var reachable = false;
var cfgAttachOnly = false;
var cfgEvaluateEnabled = true;
var createTargetId = null;
var prevGatewayPort;
var cdpMocks = vitest_1.vi.hoisted(function () { return ({
    createTargetViaCdp: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("cdp disabled");
        });
    }); }),
    snapshotAria: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    nodes: [{ ref: "1", role: "link", name: "x", depth: 0 }],
                })];
        });
    }); }),
}); });
var pwMocks = vitest_1.vi.hoisted(function () { return ({
    armDialogViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    armFileUploadViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    clickViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    closePageViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    closePlaywrightBrowserConnection: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    downloadViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    url: "https://example.com/report.pdf",
                    suggestedFilename: "report.pdf",
                    path: "/tmp/report.pdf",
                })];
        });
    }); }),
    dragViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    evaluateViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, "ok"];
    }); }); }),
    fillFormViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    getConsoleMessagesViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
    hoverViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    scrollIntoViewViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    navigateViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ url: "https://example.com" })];
    }); }); }),
    pdfViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ buffer: Buffer.from("pdf") })];
    }); }); }),
    pressKeyViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    responseBodyViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    url: "https://example.com/api/data",
                    status: 200,
                    headers: { "content-type": "application/json" },
                    body: '{"ok":true}',
                })];
        });
    }); }),
    resizeViewportViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    selectOptionViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    setInputFilesViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    snapshotAiViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ snapshot: "ok" })];
    }); }); }),
    takeScreenshotViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    buffer: Buffer.from("png"),
                })];
        });
    }); }),
    typeViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    waitForDownloadViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    url: "https://example.com/report.pdf",
                    suggestedFilename: "report.pdf",
                    path: "/tmp/report.pdf",
                })];
        });
    }); }),
    waitForViaPlaywright: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
function makeProc(pid) {
    if (pid === void 0) { pid = 123; }
    var handlers = new Map();
    return {
        pid: pid,
        killed: false,
        exitCode: null,
        on: function (event, cb) {
            var _a;
            handlers.set(event, __spreadArray(__spreadArray([], ((_a = handlers.get(event)) !== null && _a !== void 0 ? _a : []), true), [cb], false));
            return undefined;
        },
        emitExit: function () {
            var _a;
            for (var _i = 0, _b = (_a = handlers.get("exit")) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
                var cb = _b[_i];
                cb(0);
            }
        },
        kill: function () {
            return true;
        },
    };
}
var proc = makeProc();
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return ({
                            browser: {
                                enabled: true,
                                evaluateEnabled: cfgEvaluateEnabled,
                                color: "#FF4500",
                                attachOnly: cfgAttachOnly,
                                headless: true,
                                defaultProfile: "openclaw",
                                profiles: {
                                    openclaw: { cdpPort: testPort + 1, color: "#FF4500" },
                                },
                            },
                        }); }, writeConfigFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }) })];
        }
    });
}); });
var launchCalls = vitest_1.vi.hoisted(function () { return []; });
vitest_1.vi.mock("./chrome.js", function () { return ({
    isChromeCdpReady: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, reachable];
    }); }); }),
    isChromeReachable: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, reachable];
    }); }); }),
    launchOpenClawChrome: vitest_1.vi.fn(function (_resolved, profile) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            launchCalls.push({ port: profile.cdpPort });
            reachable = true;
            return [2 /*return*/, {
                    pid: 123,
                    exe: { kind: "chrome", path: "/fake/chrome" },
                    userDataDir: "/tmp/openclaw",
                    cdpPort: profile.cdpPort,
                    startedAt: Date.now(),
                    proc: proc,
                }];
        });
    }); }),
    resolveOpenClawUserDataDir: vitest_1.vi.fn(function () { return "/tmp/openclaw"; }),
    stopOpenClawChrome: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            reachable = false;
            return [2 /*return*/];
        });
    }); }),
}); });
vitest_1.vi.mock("./cdp.js", function () { return ({
    createTargetViaCdp: cdpMocks.createTargetViaCdp,
    normalizeCdpWsUrl: vitest_1.vi.fn(function (wsUrl) { return wsUrl; }),
    snapshotAria: cdpMocks.snapshotAria,
    getHeadersWithAuth: vitest_1.vi.fn(function () { return ({}); }),
    appendCdpPath: vitest_1.vi.fn(function (cdpUrl, path) {
        var base = cdpUrl.replace(/\/$/, "");
        var suffix = path.startsWith("/") ? path : "/".concat(path);
        return "".concat(base).concat(suffix);
    }),
}); });
vitest_1.vi.mock("./pw-ai.js", function () { return pwMocks; });
vitest_1.vi.mock("../media/store.js", function () { return ({
    ensureMediaDir: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
    saveMediaBuffer: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ path: "/tmp/fake.png" })];
    }); }); }),
}); });
vitest_1.vi.mock("./screenshot.js", function () { return ({
    DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES: 128,
    DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE: 64,
    normalizeBrowserScreenshot: vitest_1.vi.fn(function (buf) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    buffer: buf,
                    contentType: "image/png",
                })];
        });
    }); }),
}); });
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        var port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var s = (0, node_net_1.createServer)();
                            s.once("error", reject);
                            s.listen(0, "127.0.0.1", function () {
                                var assigned = s.address().port;
                                s.close(function (err) { return (err ? reject(err) : resolve(assigned)); });
                            });
                        })];
                case 1:
                    port = _a.sent();
                    if (port < 65535) {
                        return [2 /*return*/, port];
                    }
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
function makeResponse(body, init) {
    var _this = this;
    var _a, _b, _c;
    var ok = (_a = init === null || init === void 0 ? void 0 : init.ok) !== null && _a !== void 0 ? _a : true;
    var status = (_b = init === null || init === void 0 ? void 0 : init.status) !== null && _b !== void 0 ? _b : 200;
    var text = (_c = init === null || init === void 0 ? void 0 : init.text) !== null && _c !== void 0 ? _c : "";
    return {
        ok: ok,
        status: status,
        json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, body];
        }); }); },
        text: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, text];
        }); }); },
    };
}
(0, vitest_1.describe)("browser control server", function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, fn, _b, _c, fn, putNewCalls;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    reachable = false;
                    cfgAttachOnly = false;
                    cfgEvaluateEnabled = true;
                    createTargetId = null;
                    cdpMocks.createTargetViaCdp.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (createTargetId) {
                                return [2 /*return*/, { targetId: createTargetId }];
                            }
                            throw new Error("cdp disabled");
                        });
                    }); });
                    for (_i = 0, _a = Object.values(pwMocks); _i < _a.length; _i++) {
                        fn = _a[_i];
                        fn.mockClear();
                    }
                    for (_b = 0, _c = Object.values(cdpMocks); _b < _c.length; _b++) {
                        fn = _c[_b];
                        fn.mockClear();
                    }
                    return [4 /*yield*/, getFreePort()];
                case 1:
                    testPort = _d.sent();
                    cdpBaseUrl = "http://127.0.0.1:".concat(testPort + 1);
                    prevGatewayPort = process.env.OPENCLAW_GATEWAY_PORT;
                    process.env.OPENCLAW_GATEWAY_PORT = String(testPort - 2);
                    putNewCalls = 0;
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var u;
                        return __generator(this, function (_a) {
                            u = String(url);
                            if (u.includes("/json/list")) {
                                if (!reachable) {
                                    return [2 /*return*/, makeResponse([])];
                                }
                                return [2 /*return*/, makeResponse([
                                        {
                                            id: "abcd1234",
                                            title: "Tab",
                                            url: "https://example.com",
                                            webSocketDebuggerUrl: "ws://127.0.0.1/devtools/page/abcd1234",
                                            type: "page",
                                        },
                                        {
                                            id: "abce9999",
                                            title: "Other",
                                            url: "https://other",
                                            webSocketDebuggerUrl: "ws://127.0.0.1/devtools/page/abce9999",
                                            type: "page",
                                        },
                                    ])];
                            }
                            if (u.includes("/json/new?")) {
                                if ((init === null || init === void 0 ? void 0 : init.method) === "PUT") {
                                    putNewCalls += 1;
                                    if (putNewCalls === 1) {
                                        return [2 /*return*/, makeResponse({}, { ok: false, status: 405, text: "" })];
                                    }
                                }
                                return [2 /*return*/, makeResponse({
                                        id: "newtab1",
                                        title: "",
                                        url: "about:blank",
                                        webSocketDebuggerUrl: "ws://127.0.0.1/devtools/page/newtab1",
                                        type: "page",
                                    })];
                            }
                            if (u.includes("/json/activate/")) {
                                return [2 /*return*/, makeResponse("ok")];
                            }
                            if (u.includes("/json/close/")) {
                                return [2 /*return*/, makeResponse("ok")];
                            }
                            return [2 /*return*/, makeResponse({}, { ok: false, status: 500, text: "unexpected" })];
                        });
                    }); }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var stopBrowserControlServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.unstubAllGlobals();
                    vitest_1.vi.restoreAllMocks();
                    if (prevGatewayPort === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_PORT;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_PORT = prevGatewayPort;
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./server.js"); })];
                case 1:
                    stopBrowserControlServer = (_a.sent()).stopBrowserControlServer;
                    return [4 /*yield*/, stopBrowserControlServer()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var startServerAndBase = function () { return __awaiter(void 0, void 0, void 0, function () {
        var startBrowserControlServerFromConfig, base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./server.js"); })];
                case 1:
                    startBrowserControlServerFromConfig = (_a.sent()).startBrowserControlServerFromConfig;
                    return [4 /*yield*/, startBrowserControlServerFromConfig()];
                case 2:
                    _a.sent();
                    base = "http://127.0.0.1:".concat(testPort);
                    return [4 /*yield*/, (0, undici_1.fetch)("".concat(base, "/start"), { method: "POST" }).then(function (r) { return r.json(); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, base];
            }
        });
    }); };
    var postJson = function (url, body) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, undici_1.fetch)(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: body === undefined ? undefined : JSON.stringify(body),
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2: return [2 /*return*/, (_a.sent())];
            }
        });
    }); };
    var slowTimeoutMs = process.platform === "win32" ? 40000 : 20000;
    (0, vitest_1.it)("agent contract: form + layout act commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var base, select, fill, resize, wait, evalRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startServerAndBase()];
                case 1:
                    base = _a.sent();
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "select",
                            ref: "5",
                            values: ["a", "b"],
                        })];
                case 2:
                    select = _a.sent();
                    (0, vitest_1.expect)(select.ok).toBe(true);
                    (0, vitest_1.expect)(pwMocks.selectOptionViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: cdpBaseUrl,
                        targetId: "abcd1234",
                        ref: "5",
                        values: ["a", "b"],
                    });
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "fill",
                            fields: [{ ref: "6", type: "textbox", value: "hello" }],
                        })];
                case 3:
                    fill = _a.sent();
                    (0, vitest_1.expect)(fill.ok).toBe(true);
                    (0, vitest_1.expect)(pwMocks.fillFormViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: cdpBaseUrl,
                        targetId: "abcd1234",
                        fields: [{ ref: "6", type: "textbox", value: "hello" }],
                    });
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "resize",
                            width: 800,
                            height: 600,
                        })];
                case 4:
                    resize = _a.sent();
                    (0, vitest_1.expect)(resize.ok).toBe(true);
                    (0, vitest_1.expect)(pwMocks.resizeViewportViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: cdpBaseUrl,
                        targetId: "abcd1234",
                        width: 800,
                        height: 600,
                    });
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "wait",
                            timeMs: 5,
                        })];
                case 5:
                    wait = _a.sent();
                    (0, vitest_1.expect)(wait.ok).toBe(true);
                    (0, vitest_1.expect)(pwMocks.waitForViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: cdpBaseUrl,
                        targetId: "abcd1234",
                        timeMs: 5,
                        text: undefined,
                        textGone: undefined,
                    });
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "evaluate",
                            fn: "() => 1",
                        })];
                case 6:
                    evalRes = _a.sent();
                    (0, vitest_1.expect)(evalRes.ok).toBe(true);
                    (0, vitest_1.expect)(evalRes.result).toBe("ok");
                    (0, vitest_1.expect)(pwMocks.evaluateViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: cdpBaseUrl,
                        targetId: "abcd1234",
                        fn: "() => 1",
                        ref: undefined,
                    });
                    return [2 /*return*/];
            }
        });
    }); }, slowTimeoutMs);
    (0, vitest_1.it)("blocks act:evaluate when browser.evaluateEnabled=false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var base, waitRes, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfgEvaluateEnabled = false;
                    return [4 /*yield*/, startServerAndBase()];
                case 1:
                    base = _a.sent();
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "wait",
                            fn: "() => window.ready === true",
                        })];
                case 2:
                    waitRes = _a.sent();
                    (0, vitest_1.expect)(waitRes.error).toContain("browser.evaluateEnabled=false");
                    (0, vitest_1.expect)(pwMocks.waitForViaPlaywright).not.toHaveBeenCalled();
                    return [4 /*yield*/, postJson("".concat(base, "/act"), {
                            kind: "evaluate",
                            fn: "() => 1",
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.error).toContain("browser.evaluateEnabled=false");
                    (0, vitest_1.expect)(pwMocks.evaluateViaPlaywright).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); }, slowTimeoutMs);
    (0, vitest_1.it)("agent contract: hooks + response + downloads + screenshot", function () { return __awaiter(void 0, void 0, void 0, function () {
        var base, upload, uploadWithRef, uploadWithInputRef, uploadWithElement, dialog, waitDownload, download, responseBody, consoleRes, pdf, shot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startServerAndBase()];
                case 1:
                    base = _a.sent();
                    return [4 /*yield*/, postJson("".concat(base, "/hooks/file-chooser"), {
                            paths: ["/tmp/a.txt"],
                            timeoutMs: 1234,
                        })];
                case 2:
                    upload = _a.sent();
                    (0, vitest_1.expect)(upload).toMatchObject({ ok: true });
                    (0, vitest_1.expect)(pwMocks.armFileUploadViaPlaywright).toHaveBeenCalledWith({
                        cdpUrl: cdpBaseUrl,
                        targetId: "abcd1234",
                        paths: ["/tmp/a.txt"],
                        timeoutMs: 1234,
                    });
                    return [4 /*yield*/, postJson("".concat(base, "/hooks/file-chooser"), {
                            paths: ["/tmp/b.txt"],
                            ref: "e12",
                        })];
                case 3:
                    uploadWithRef = _a.sent();
                    (0, vitest_1.expect)(uploadWithRef).toMatchObject({ ok: true });
                    return [4 /*yield*/, postJson("".concat(base, "/hooks/file-chooser"), {
                            paths: ["/tmp/c.txt"],
                            inputRef: "e99",
                        })];
                case 4:
                    uploadWithInputRef = _a.sent();
                    (0, vitest_1.expect)(uploadWithInputRef).toMatchObject({ ok: true });
                    return [4 /*yield*/, postJson("".concat(base, "/hooks/file-chooser"), {
                            paths: ["/tmp/d.txt"],
                            element: "input[type=file]",
                        })];
                case 5:
                    uploadWithElement = _a.sent();
                    (0, vitest_1.expect)(uploadWithElement).toMatchObject({ ok: true });
                    return [4 /*yield*/, postJson("".concat(base, "/hooks/dialog"), {
                            accept: true,
                            timeoutMs: 5678,
                        })];
                case 6:
                    dialog = _a.sent();
                    (0, vitest_1.expect)(dialog).toMatchObject({ ok: true });
                    return [4 /*yield*/, postJson("".concat(base, "/wait/download"), {
                            path: "/tmp/report.pdf",
                            timeoutMs: 1111,
                        })];
                case 7:
                    waitDownload = _a.sent();
                    (0, vitest_1.expect)(waitDownload).toMatchObject({ ok: true });
                    return [4 /*yield*/, postJson("".concat(base, "/download"), {
                            ref: "e12",
                            path: "/tmp/report.pdf",
                        })];
                case 8:
                    download = _a.sent();
                    (0, vitest_1.expect)(download).toMatchObject({ ok: true });
                    return [4 /*yield*/, postJson("".concat(base, "/response/body"), {
                            url: "**/api/data",
                            timeoutMs: 2222,
                            maxChars: 10,
                        })];
                case 9:
                    responseBody = _a.sent();
                    (0, vitest_1.expect)(responseBody).toMatchObject({ ok: true });
                    return [4 /*yield*/, (0, undici_1.fetch)("".concat(base, "/console?level=error")).then(function (r) { return r.json(); })];
                case 10:
                    consoleRes = (_a.sent());
                    (0, vitest_1.expect)(consoleRes.ok).toBe(true);
                    (0, vitest_1.expect)(Array.isArray(consoleRes.messages)).toBe(true);
                    return [4 /*yield*/, postJson("".concat(base, "/pdf"), {})];
                case 11:
                    pdf = _a.sent();
                    (0, vitest_1.expect)(pdf.ok).toBe(true);
                    (0, vitest_1.expect)(typeof pdf.path).toBe("string");
                    return [4 /*yield*/, postJson("".concat(base, "/screenshot"), {
                            element: "body",
                            type: "jpeg",
                        })];
                case 12:
                    shot = _a.sent();
                    (0, vitest_1.expect)(shot.ok).toBe(true);
                    (0, vitest_1.expect)(typeof shot.path).toBe("string");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("agent contract: stop endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var base, stopped;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startServerAndBase()];
                case 1:
                    base = _a.sent();
                    return [4 /*yield*/, (0, undici_1.fetch)("".concat(base, "/stop"), {
                            method: "POST",
                        }).then(function (r) { return r.json(); })];
                case 2:
                    stopped = (_a.sent());
                    (0, vitest_1.expect)(stopped.ok).toBe(true);
                    (0, vitest_1.expect)(stopped.stopped).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
