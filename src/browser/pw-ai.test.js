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
vitest_1.vi.mock("playwright-core", function () { return ({
    chromium: {
        connectOverCDP: vitest_1.vi.fn(),
    },
}); });
function createPage(opts) {
    var _a;
    var session = {
        send: vitest_1.vi.fn().mockResolvedValue({
            targetInfo: { targetId: opts.targetId },
        }),
        detach: vitest_1.vi.fn().mockResolvedValue(undefined),
    };
    var context = {
        newCDPSession: vitest_1.vi.fn().mockResolvedValue(session),
    };
    var click = vitest_1.vi.fn().mockResolvedValue(undefined);
    var dblclick = vitest_1.vi.fn().mockResolvedValue(undefined);
    var fill = vitest_1.vi.fn().mockResolvedValue(undefined);
    var locator = vitest_1.vi.fn().mockReturnValue({ click: click, dblclick: dblclick, fill: fill });
    var page = __assign({ context: function () { return context; }, locator: locator, on: vitest_1.vi.fn() }, (opts.hasSnapshotForAI === false
        ? {}
        : {
            _snapshotForAI: vitest_1.vi.fn().mockResolvedValue({ full: (_a = opts.snapshotFull) !== null && _a !== void 0 ? _a : "SNAP" }),
        }));
    return { page: page, session: session, locator: locator, click: click, fill: fill };
}
function createBrowser(pages) {
    var ctx = {
        pages: function () { return pages; },
        on: vitest_1.vi.fn(),
    };
    return {
        contexts: function () { return [ctx]; },
        on: vitest_1.vi.fn(),
        close: vitest_1.vi.fn().mockResolvedValue(undefined),
    };
}
function importModule() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pw-ai.js"); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var mod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importModule()];
            case 1:
                mod = _a.sent();
                return [4 /*yield*/, mod.closePlaywrightBrowserConnection()];
            case 2:
                _a.sent();
                vitest_1.vi.clearAllMocks();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("pw-ai", function () {
    (0, vitest_1.it)("captures an ai snapshot via Playwright for a specific target", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chromium, p1, p2, browser, mod, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("playwright-core"); })];
                case 1:
                    chromium = (_a.sent()).chromium;
                    p1 = createPage({ targetId: "T1", snapshotFull: "ONE" });
                    p2 = createPage({ targetId: "T2", snapshotFull: "TWO" });
                    browser = createBrowser([p1.page, p2.page]);
                    chromium.connectOverCDP.mockResolvedValue(browser);
                    return [4 /*yield*/, importModule()];
                case 2:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.snapshotAiViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T2",
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.snapshot).toBe("TWO");
                    (0, vitest_1.expect)(p1.session.detach).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(p2.session.detach).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("registers aria refs from ai snapshots for act commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chromium, snapshot, p1, browser, mod, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("playwright-core"); })];
                case 1:
                    chromium = (_a.sent()).chromium;
                    snapshot = ['- button "OK" [ref=e1]', '- link "Docs" [ref=e2]'].join("\n");
                    p1 = createPage({ targetId: "T1", snapshotFull: snapshot });
                    browser = createBrowser([p1.page]);
                    chromium.connectOverCDP.mockResolvedValue(browser);
                    return [4 /*yield*/, importModule()];
                case 2:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.snapshotAiViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.refs).toMatchObject({
                        e1: { role: "button", name: "OK" },
                        e2: { role: "link", name: "Docs" },
                    });
                    return [4 /*yield*/, mod.clickViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            ref: "e1",
                        })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(p1.locator).toHaveBeenCalledWith("aria-ref=e1");
                    (0, vitest_1.expect)(p1.click).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("truncates oversized snapshots", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chromium, longSnapshot, p1, browser, mod, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("playwright-core"); })];
                case 1:
                    chromium = (_a.sent()).chromium;
                    longSnapshot = "A".repeat(20);
                    p1 = createPage({ targetId: "T1", snapshotFull: longSnapshot });
                    browser = createBrowser([p1.page]);
                    chromium.connectOverCDP.mockResolvedValue(browser);
                    return [4 /*yield*/, importModule()];
                case 2:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.snapshotAiViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            maxChars: 10,
                        })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.truncated).toBe(true);
                    (0, vitest_1.expect)(res.snapshot.startsWith("AAAAAAAAAA")).toBe(true);
                    (0, vitest_1.expect)(res.snapshot).toContain("TRUNCATED");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clicks a ref using aria-ref locator", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chromium, p1, browser, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("playwright-core"); })];
                case 1:
                    chromium = (_a.sent()).chromium;
                    p1 = createPage({ targetId: "T1" });
                    browser = createBrowser([p1.page]);
                    chromium.connectOverCDP.mockResolvedValue(browser);
                    return [4 /*yield*/, importModule()];
                case 2:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.clickViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            ref: "76",
                        })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(p1.locator).toHaveBeenCalledWith("aria-ref=76");
                    (0, vitest_1.expect)(p1.click).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails with a clear error when _snapshotForAI is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chromium, p1, browser, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("playwright-core"); })];
                case 1:
                    chromium = (_a.sent()).chromium;
                    p1 = createPage({ targetId: "T1", hasSnapshotForAI: false });
                    browser = createBrowser([p1.page]);
                    chromium.connectOverCDP.mockResolvedValue(browser);
                    return [4 /*yield*/, importModule()];
                case 2:
                    mod = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(mod.snapshotAiViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                        })).rejects.toThrow(/_snapshotForAI/i)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reuses the CDP connection for repeated calls", function () { return __awaiter(void 0, void 0, void 0, function () {
        var chromium, p1, browser, connect, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("playwright-core"); })];
                case 1:
                    chromium = (_a.sent()).chromium;
                    p1 = createPage({ targetId: "T1", snapshotFull: "ONE" });
                    browser = createBrowser([p1.page]);
                    connect = vitest_1.vi.spyOn(chromium, "connectOverCDP");
                    connect.mockResolvedValue(browser);
                    return [4 /*yield*/, importModule()];
                case 2:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.snapshotAiViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, mod.clickViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            ref: "1",
                        })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(connect).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
