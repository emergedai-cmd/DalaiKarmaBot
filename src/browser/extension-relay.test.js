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
var node_http_1 = require("node:http");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var extension_relay_js_1 = require("./extension-relay.js");
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        var port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var s = (0, node_http_1.createServer)();
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
function waitForOpen(ws) {
    return new Promise(function (resolve, reject) {
        ws.once("open", function () { return resolve(); });
        ws.once("error", reject);
    });
}
function waitForError(ws) {
    return new Promise(function (resolve, reject) {
        ws.once("error", function (err) { return resolve(err instanceof Error ? err : new Error(String(err))); });
        ws.once("open", function () { return reject(new Error("expected websocket error")); });
    });
}
function relayAuthHeaders(url) {
    return (0, extension_relay_js_1.getChromeExtensionRelayAuthHeaders)(url);
}
function createMessageQueue(ws) {
    var queue = [];
    var waiter = null;
    var waiterReject = null;
    var waiterTimer = null;
    var flushWaiter = function (value) {
        if (!waiter) {
            return false;
        }
        var resolve = waiter;
        waiter = null;
        var reject = waiterReject;
        waiterReject = null;
        if (waiterTimer) {
            clearTimeout(waiterTimer);
        }
        waiterTimer = null;
        if (reject) {
            // no-op (kept for symmetry)
        }
        resolve(value);
        return true;
    };
    ws.on("message", function (data) {
        var text = typeof data === "string"
            ? data
            : Buffer.isBuffer(data)
                ? data.toString("utf8")
                : Array.isArray(data)
                    ? Buffer.concat(data).toString("utf8")
                    : Buffer.from(data).toString("utf8");
        if (flushWaiter(text)) {
            return;
        }
        queue.push(text);
    });
    ws.on("error", function (err) {
        if (!waiterReject) {
            return;
        }
        var reject = waiterReject;
        waiterReject = null;
        waiter = null;
        if (waiterTimer) {
            clearTimeout(waiterTimer);
        }
        waiterTimer = null;
        reject(err instanceof Error ? err : new Error(String(err)));
    });
    var next = function (timeoutMs) {
        if (timeoutMs === void 0) { timeoutMs = 5000; }
        return new Promise(function (resolve, reject) {
            var existing = queue.shift();
            if (existing !== undefined) {
                return resolve(existing);
            }
            waiter = resolve;
            waiterReject = reject;
            waiterTimer = setTimeout(function () {
                waiter = null;
                waiterReject = null;
                waiterTimer = null;
                reject(new Error("timeout"));
            }, timeoutMs);
        });
    };
    return { next: next };
}
function waitForListMatch(fetchList_1, predicate_1) {
    return __awaiter(this, arguments, void 0, function (fetchList, predicate, timeoutMs, intervalMs) {
        var deadline, value;
        if (timeoutMs === void 0) { timeoutMs = 2000; }
        if (intervalMs === void 0) { intervalMs = 50; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deadline = Date.now() + timeoutMs;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetchList()];
                case 2:
                    value = _a.sent();
                    if (predicate(value)) {
                        return [2 /*return*/, value];
                    }
                    if (Date.now() >= deadline) {
                        throw new Error("timeout waiting for list update");
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, intervalMs); })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("chrome extension relay server", function () {
    var cdpUrl = "";
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cdpUrl) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, extension_relay_js_1.stopChromeExtensionRelayServer)({ cdpUrl: cdpUrl }).catch(function () { })];
                case 1:
                    _a.sent();
                    cdpUrl = "";
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("advertises CDP WS only when extension is connected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, v1, ext, v2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _b.sent();
                    cdpUrl = "http://127.0.0.1:".concat(port);
                    return [4 /*yield*/, (0, extension_relay_js_1.ensureChromeExtensionRelayServer)({ cdpUrl: cdpUrl })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, fetch("".concat(cdpUrl, "/json/version"), {
                            headers: relayAuthHeaders(cdpUrl),
                        }).then(function (r) { return r.json(); })];
                case 3:
                    v1 = (_b.sent());
                    (0, vitest_1.expect)(v1.webSocketDebuggerUrl).toBeUndefined();
                    ext = new ws_1.default("ws://127.0.0.1:".concat(port, "/extension"));
                    return [4 /*yield*/, waitForOpen(ext)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, fetch("".concat(cdpUrl, "/json/version"), {
                            headers: relayAuthHeaders(cdpUrl),
                        }).then(function (r) { return r.json(); })];
                case 5:
                    v2 = (_b.sent());
                    (0, vitest_1.expect)(String((_a = v2.webSocketDebuggerUrl) !== null && _a !== void 0 ? _a : "")).toContain("/cdp");
                    ext.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects CDP access without relay auth token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, res, cdp, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _a.sent();
                    cdpUrl = "http://127.0.0.1:".concat(port);
                    return [4 /*yield*/, (0, extension_relay_js_1.ensureChromeExtensionRelayServer)({ cdpUrl: cdpUrl })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetch("".concat(cdpUrl, "/json/version"))];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(401);
                    cdp = new ws_1.default("ws://127.0.0.1:".concat(port, "/cdp"));
                    return [4 /*yield*/, waitForError(cdp)];
                case 4:
                    err = _a.sent();
                    (0, vitest_1.expect)(err.message).toContain("401");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("tracks attached page targets and exposes them via CDP + /json/list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, ext, list, list2, cdp, q, res1, _a, _b, received, _c, _d, _e, _f, _g, _h, _j, _k, res2, evt;
        var _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _p.sent();
                    cdpUrl = "http://127.0.0.1:".concat(port);
                    return [4 /*yield*/, (0, extension_relay_js_1.ensureChromeExtensionRelayServer)({ cdpUrl: cdpUrl })];
                case 2:
                    _p.sent();
                    ext = new ws_1.default("ws://127.0.0.1:".concat(port, "/extension"));
                    return [4 /*yield*/, waitForOpen(ext)];
                case 3:
                    _p.sent();
                    // Simulate a tab attach coming from the extension.
                    ext.send(JSON.stringify({
                        method: "forwardCDPEvent",
                        params: {
                            method: "Target.attachedToTarget",
                            params: {
                                sessionId: "cb-tab-1",
                                targetInfo: {
                                    targetId: "t1",
                                    type: "page",
                                    title: "Example",
                                    url: "https://example.com",
                                },
                                waitingForDebugger: false,
                            },
                        },
                    }));
                    return [4 /*yield*/, fetch("".concat(cdpUrl, "/json/list"), {
                            headers: relayAuthHeaders(cdpUrl),
                        }).then(function (r) { return r.json(); })];
                case 4:
                    list = (_p.sent());
                    (0, vitest_1.expect)(list.some(function (t) { return t.id === "t1" && t.url === "https://example.com"; })).toBe(true);
                    // Simulate navigation updating tab metadata.
                    ext.send(JSON.stringify({
                        method: "forwardCDPEvent",
                        params: {
                            method: "Target.targetInfoChanged",
                            params: {
                                targetInfo: {
                                    targetId: "t1",
                                    type: "page",
                                    title: "DER STANDARD",
                                    url: "https://www.derstandard.at/",
                                },
                            },
                        },
                    }));
                    return [4 /*yield*/, waitForListMatch(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch("".concat(cdpUrl, "/json/list"), {
                                            headers: relayAuthHeaders(cdpUrl),
                                        }).then(function (r) { return r.json(); })];
                                    case 1: return [2 /*return*/, (_a.sent())];
                                }
                            });
                        }); }, function (list) {
                            return list.some(function (t) {
                                return t.id === "t1" && t.url === "https://www.derstandard.at/" && t.title === "DER STANDARD";
                            });
                        })];
                case 5:
                    list2 = _p.sent();
                    (0, vitest_1.expect)(list2.some(function (t) {
                        return t.id === "t1" && t.url === "https://www.derstandard.at/" && t.title === "DER STANDARD";
                    })).toBe(true);
                    cdp = new ws_1.default("ws://127.0.0.1:".concat(port, "/cdp"), {
                        headers: relayAuthHeaders("ws://127.0.0.1:".concat(port, "/cdp")),
                    });
                    return [4 /*yield*/, waitForOpen(cdp)];
                case 6:
                    _p.sent();
                    q = createMessageQueue(cdp);
                    cdp.send(JSON.stringify({ id: 1, method: "Target.getTargets" }));
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, q.next()];
                case 7:
                    res1 = _b.apply(_a, [_p.sent()]);
                    (0, vitest_1.expect)(res1.id).toBe(1);
                    (0, vitest_1.expect)(JSON.stringify((_l = res1.result) !== null && _l !== void 0 ? _l : {})).toContain("t1");
                    cdp.send(JSON.stringify({
                        id: 2,
                        method: "Target.attachToTarget",
                        params: { targetId: "t1" },
                    }));
                    received = [];
                    _d = (_c = received).push;
                    _f = (_e = JSON).parse;
                    return [4 /*yield*/, q.next()];
                case 8:
                    _d.apply(_c, [_f.apply(_e, [_p.sent()])]);
                    _h = (_g = received).push;
                    _k = (_j = JSON).parse;
                    return [4 /*yield*/, q.next()];
                case 9:
                    _h.apply(_g, [_k.apply(_j, [_p.sent()])]);
                    res2 = received.find(function (m) { return m.id === 2; });
                    (0, vitest_1.expect)(res2 === null || res2 === void 0 ? void 0 : res2.id).toBe(2);
                    (0, vitest_1.expect)(JSON.stringify((_m = res2 === null || res2 === void 0 ? void 0 : res2.result) !== null && _m !== void 0 ? _m : {})).toContain("cb-tab-1");
                    evt = received.find(function (m) { return m.method === "Target.attachedToTarget"; });
                    (0, vitest_1.expect)(evt === null || evt === void 0 ? void 0 : evt.method).toBe("Target.attachedToTarget");
                    (0, vitest_1.expect)(JSON.stringify((_o = evt === null || evt === void 0 ? void 0 : evt.params) !== null && _o !== void 0 ? _o : {})).toContain("t1");
                    cdp.close();
                    ext.close();
                    return [2 /*return*/];
            }
        });
    }); }, 15000);
    (0, vitest_1.it)("rebroadcasts attach when a session id is reused for a new target", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, ext, cdp, q, first, _a, _b, received, _c, _d, _e, _f, _g, _h, _j, _k, detached, attached;
        var _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _p.sent();
                    cdpUrl = "http://127.0.0.1:".concat(port);
                    return [4 /*yield*/, (0, extension_relay_js_1.ensureChromeExtensionRelayServer)({ cdpUrl: cdpUrl })];
                case 2:
                    _p.sent();
                    ext = new ws_1.default("ws://127.0.0.1:".concat(port, "/extension"));
                    return [4 /*yield*/, waitForOpen(ext)];
                case 3:
                    _p.sent();
                    cdp = new ws_1.default("ws://127.0.0.1:".concat(port, "/cdp"), {
                        headers: relayAuthHeaders("ws://127.0.0.1:".concat(port, "/cdp")),
                    });
                    return [4 /*yield*/, waitForOpen(cdp)];
                case 4:
                    _p.sent();
                    q = createMessageQueue(cdp);
                    ext.send(JSON.stringify({
                        method: "forwardCDPEvent",
                        params: {
                            method: "Target.attachedToTarget",
                            params: {
                                sessionId: "shared-session",
                                targetInfo: {
                                    targetId: "t1",
                                    type: "page",
                                    title: "First",
                                    url: "https://example.com",
                                },
                                waitingForDebugger: false,
                            },
                        },
                    }));
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, q.next()];
                case 5:
                    first = _b.apply(_a, [_p.sent()]);
                    (0, vitest_1.expect)(first.method).toBe("Target.attachedToTarget");
                    (0, vitest_1.expect)(JSON.stringify((_l = first.params) !== null && _l !== void 0 ? _l : {})).toContain("t1");
                    ext.send(JSON.stringify({
                        method: "forwardCDPEvent",
                        params: {
                            method: "Target.attachedToTarget",
                            params: {
                                sessionId: "shared-session",
                                targetInfo: {
                                    targetId: "t2",
                                    type: "page",
                                    title: "Second",
                                    url: "https://example.org",
                                },
                                waitingForDebugger: false,
                            },
                        },
                    }));
                    received = [];
                    _d = (_c = received).push;
                    _f = (_e = JSON).parse;
                    return [4 /*yield*/, q.next()];
                case 6:
                    _d.apply(_c, [_f.apply(_e, [_p.sent()])]);
                    _h = (_g = received).push;
                    _k = (_j = JSON).parse;
                    return [4 /*yield*/, q.next()];
                case 7:
                    _h.apply(_g, [_k.apply(_j, [_p.sent()])]);
                    detached = received.find(function (m) { return m.method === "Target.detachedFromTarget"; });
                    attached = received.find(function (m) { return m.method === "Target.attachedToTarget"; });
                    (0, vitest_1.expect)(JSON.stringify((_m = detached === null || detached === void 0 ? void 0 : detached.params) !== null && _m !== void 0 ? _m : {})).toContain("t1");
                    (0, vitest_1.expect)(JSON.stringify((_o = attached === null || attached === void 0 ? void 0 : attached.params) !== null && _o !== void 0 ? _o : {})).toContain("t2");
                    cdp.close();
                    ext.close();
                    return [2 /*return*/];
            }
        });
    }); });
});
