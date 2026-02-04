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
var client_actions_js_1 = require("./client-actions.js");
var client_js_1 = require("./client.js");
(0, vitest_1.describe)("browser client", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.it)("wraps connection failures with a sandbox hint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var refused, fetchFailed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refused = Object.assign(new Error("connect ECONNREFUSED 127.0.0.1"), {
                        code: "ECONNREFUSED",
                    });
                    fetchFailed = Object.assign(new TypeError("fetch failed"), {
                        cause: refused,
                    });
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockRejectedValue(fetchFailed));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserStatus)("http://127.0.0.1:18791")).rejects.toThrow(/sandboxed session/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds useful timeout messaging for abort-like failures", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockRejectedValue(new Error("aborted")));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserStatus)("http://127.0.0.1:18791")).rejects.toThrow(/timed out/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("surfaces non-2xx responses with body text", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockResolvedValue({
                        ok: false,
                        status: 409,
                        text: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "conflict"];
                        }); }); },
                    }));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserSnapshot)("http://127.0.0.1:18791", { format: "aria", limit: 1 })).rejects.toThrow(/conflict/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds labels + efficient mode query params to snapshots", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, snapshotCall, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    calls = [];
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(url);
                            return [2 /*return*/, {
                                    ok: true,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    ok: true,
                                                    format: "ai",
                                                    targetId: "t1",
                                                    url: "https://x",
                                                    snapshot: "ok",
                                                })];
                                        });
                                    }); },
                                }];
                        });
                    }); }));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserSnapshot)("http://127.0.0.1:18791", {
                            format: "ai",
                            labels: true,
                            mode: "efficient",
                        })).resolves.toMatchObject({ ok: true, format: "ai" })];
                case 1:
                    _a.sent();
                    snapshotCall = calls.find(function (url) { return url.includes("/snapshot?"); });
                    (0, vitest_1.expect)(snapshotCall).toBeTruthy();
                    parsed = new URL(snapshotCall);
                    (0, vitest_1.expect)(parsed.searchParams.get("labels")).toBe("1");
                    (0, vitest_1.expect)(parsed.searchParams.get("mode")).toBe("efficient");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds refs=aria to snapshots when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, snapshotCall, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    calls = [];
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(url);
                            return [2 /*return*/, {
                                    ok: true,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    ok: true,
                                                    format: "ai",
                                                    targetId: "t1",
                                                    url: "https://x",
                                                    snapshot: "ok",
                                                })];
                                        });
                                    }); },
                                }];
                        });
                    }); }));
                    return [4 /*yield*/, (0, client_js_1.browserSnapshot)("http://127.0.0.1:18791", {
                            format: "ai",
                            refs: "aria",
                        })];
                case 1:
                    _a.sent();
                    snapshotCall = calls.find(function (url) { return url.includes("/snapshot?"); });
                    (0, vitest_1.expect)(snapshotCall).toBeTruthy();
                    parsed = new URL(snapshotCall);
                    (0, vitest_1.expect)(parsed.searchParams.get("refs")).toBe("aria");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses the expected endpoints + methods for common calls", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, open, screenshot;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    calls = [];
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn(function (url, init) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push({ url: url, init: init });
                            if (url.endsWith("/tabs") && (!init || init.method === undefined)) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        running: true,
                                                        tabs: [{ targetId: "t1", title: "T", url: "https://x" }],
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.endsWith("/tabs/open")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        targetId: "t2",
                                                        title: "N",
                                                        url: "https://y",
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.endsWith("/navigate")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        targetId: "t1",
                                                        url: "https://y",
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.endsWith("/act")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        targetId: "t1",
                                                        url: "https://x",
                                                        result: 1,
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.endsWith("/hooks/file-chooser")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, ({ ok: true })];
                                        }); }); },
                                    }];
                            }
                            if (url.endsWith("/hooks/dialog")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, ({ ok: true })];
                                        }); }); },
                                    }];
                            }
                            if (url.includes("/console?")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        targetId: "t1",
                                                        messages: [],
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.endsWith("/pdf")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        path: "/tmp/a.pdf",
                                                        targetId: "t1",
                                                        url: "https://x",
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.endsWith("/screenshot")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        path: "/tmp/a.png",
                                                        targetId: "t1",
                                                        url: "https://x",
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            if (url.includes("/snapshot?")) {
                                return [2 /*return*/, {
                                        ok: true,
                                        json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        ok: true,
                                                        format: "aria",
                                                        targetId: "t1",
                                                        url: "https://x",
                                                        nodes: [],
                                                    })];
                                            });
                                        }); },
                                    }];
                            }
                            return [2 /*return*/, {
                                    ok: true,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    enabled: true,
                                                    running: true,
                                                    pid: 1,
                                                    cdpPort: 18792,
                                                    cdpUrl: "http://127.0.0.1:18792",
                                                    chosenBrowser: "chrome",
                                                    userDataDir: "/tmp",
                                                    color: "#FF4500",
                                                    headless: false,
                                                    noSandbox: false,
                                                    executablePath: null,
                                                    attachOnly: false,
                                                })];
                                        });
                                    }); },
                                }];
                        });
                    }); }));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserStatus)("http://127.0.0.1:18791")).resolves.toMatchObject({
                            running: true,
                            cdpPort: 18792,
                        })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserTabs)("http://127.0.0.1:18791")).resolves.toHaveLength(1)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserOpenTab)("http://127.0.0.1:18791", "https://example.com")).resolves.toMatchObject({ targetId: "t2" })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_js_1.browserSnapshot)("http://127.0.0.1:18791", { format: "aria", limit: 1 })).resolves.toMatchObject({ ok: true, format: "aria" })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserNavigate)("http://127.0.0.1:18791", { url: "https://example.com" })).resolves.toMatchObject({ ok: true, targetId: "t1" })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserAct)("http://127.0.0.1:18791", { kind: "click", ref: "1" })).resolves.toMatchObject({ ok: true, targetId: "t1" })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserArmFileChooser)("http://127.0.0.1:18791", {
                            paths: ["/tmp/a.txt"],
                        })).resolves.toMatchObject({ ok: true })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserArmDialog)("http://127.0.0.1:18791", { accept: true })).resolves.toMatchObject({ ok: true })];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserConsoleMessages)("http://127.0.0.1:18791", { level: "error" })).resolves.toMatchObject({ ok: true, targetId: "t1" })];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserPdfSave)("http://127.0.0.1:18791")).resolves.toMatchObject({
                            ok: true,
                            path: "/tmp/a.pdf",
                        })];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, client_actions_js_1.browserScreenshotAction)("http://127.0.0.1:18791", { fullPage: true })).resolves.toMatchObject({ ok: true, path: "/tmp/a.png" })];
                case 11:
                    _c.sent();
                    (0, vitest_1.expect)(calls.some(function (c) { return c.url.endsWith("/tabs"); })).toBe(true);
                    open = calls.find(function (c) { return c.url.endsWith("/tabs/open"); });
                    (0, vitest_1.expect)((_a = open === null || open === void 0 ? void 0 : open.init) === null || _a === void 0 ? void 0 : _a.method).toBe("POST");
                    screenshot = calls.find(function (c) { return c.url.endsWith("/screenshot"); });
                    (0, vitest_1.expect)((_b = screenshot === null || screenshot === void 0 ? void 0 : screenshot.init) === null || _b === void 0 ? void 0 : _b.method).toBe("POST");
                    return [2 /*return*/];
            }
        });
    }); });
});
