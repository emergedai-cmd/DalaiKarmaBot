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
var node_http_1 = require("node:http");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var ws_js_1 = require("../infra/ws.js");
var runtime_js_1 = require("../runtime.js");
var a2ui_js_1 = require("./a2ui.js");
var server_js_1 = require("./server.js");
(0, vitest_1.describe)("canvas host", function () {
    (0, vitest_1.it)("injects live reload script", function () {
        var out = (0, a2ui_js_1.injectCanvasLiveReload)("<html><body>Hello</body></html>");
        (0, vitest_1.expect)(out).toContain(a2ui_js_1.CANVAS_WS_PATH);
        (0, vitest_1.expect)(out).toContain("location.reload");
        (0, vitest_1.expect)(out).toContain("openclawCanvasA2UIAction");
        (0, vitest_1.expect)(out).toContain("openclawSendUserAction");
    });
    (0, vitest_1.it)("creates a default index.html when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, server, res, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-canvas-"))];
                case 1:
                    dir = _a.sent();
                    return [4 /*yield*/, (0, server_js_1.startCanvasHost)({
                            runtime: runtime_js_1.defaultRuntime,
                            rootDir: dir,
                            port: 0,
                            listenHost: "127.0.0.1",
                            allowInTests: true,
                        })];
                case 2:
                    server = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 9]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(server.port).concat(a2ui_js_1.CANVAS_HOST_PATH, "/"))];
                case 4:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 5:
                    html = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(html).toContain("Interactive test page");
                    (0, vitest_1.expect)(html).toContain("openclawSendUserAction");
                    (0, vitest_1.expect)(html).toContain(a2ui_js_1.CANVAS_WS_PATH);
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, server.close()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips live reload injection when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, server, res, html, wsRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-canvas-"))];
                case 1:
                    dir = _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "index.html"), "<html><body>no-reload</body></html>", "utf8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, server_js_1.startCanvasHost)({
                            runtime: runtime_js_1.defaultRuntime,
                            rootDir: dir,
                            port: 0,
                            listenHost: "127.0.0.1",
                            allowInTests: true,
                            liveReload: false,
                        })];
                case 3:
                    server = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, , 8, 11]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(server.port).concat(a2ui_js_1.CANVAS_HOST_PATH, "/"))];
                case 5:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 6:
                    html = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(html).toContain("no-reload");
                    (0, vitest_1.expect)(html).not.toContain(a2ui_js_1.CANVAS_WS_PATH);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(server.port).concat(a2ui_js_1.CANVAS_WS_PATH))];
                case 7:
                    wsRes = _a.sent();
                    (0, vitest_1.expect)(wsRes.status).toBe(404);
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, server.close()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 10:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("serves canvas content from the mounted base path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, handler, server, port, res, html, miss;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-canvas-"))];
                case 1:
                    dir = _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "index.html"), "<html><body>v1</body></html>", "utf8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, server_js_1.createCanvasHostHandler)({
                            runtime: runtime_js_1.defaultRuntime,
                            rootDir: dir,
                            basePath: a2ui_js_1.CANVAS_HOST_PATH,
                            allowInTests: true,
                        })];
                case 3:
                    handler = _a.sent();
                    server = (0, node_http_1.createServer)(function (req, res) {
                        void (function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, handler.handleHttpRequest(req, res)];
                                    case 1:
                                        if (_a.sent()) {
                                            return [2 /*return*/];
                                        }
                                        res.statusCode = 404;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("Not Found");
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                    });
                    server.on("upgrade", function (req, socket, head) {
                        if (handler.handleUpgrade(req, socket, head)) {
                            return;
                        }
                        socket.destroy();
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return server.listen(0, "127.0.0.1", resolve); })];
                case 4:
                    _a.sent();
                    port = server.address().port;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, , 9, 13]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port).concat(a2ui_js_1.CANVAS_HOST_PATH, "/"))];
                case 6:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 7:
                    html = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(html).toContain("v1");
                    (0, vitest_1.expect)(html).toContain(a2ui_js_1.CANVAS_WS_PATH);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/"))];
                case 8:
                    miss = _a.sent();
                    (0, vitest_1.expect)(miss.status).toBe(404);
                    return [3 /*break*/, 13];
                case 9: return [4 /*yield*/, handler.close()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            return server.close(function (err) { return (err ? reject(err) : resolve()); });
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reuses a handler without closing it twice", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, handler, originalClose, closeSpy, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-canvas-"))];
                case 1:
                    dir = _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "index.html"), "<html><body>v1</body></html>", "utf8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, server_js_1.createCanvasHostHandler)({
                            runtime: runtime_js_1.defaultRuntime,
                            rootDir: dir,
                            basePath: a2ui_js_1.CANVAS_HOST_PATH,
                            allowInTests: true,
                        })];
                case 3:
                    handler = _a.sent();
                    originalClose = handler.close;
                    closeSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, originalClose()];
                    }); }); });
                    handler.close = closeSpy;
                    return [4 /*yield*/, (0, server_js_1.startCanvasHost)({
                            runtime: runtime_js_1.defaultRuntime,
                            handler: handler,
                            ownsHandler: false,
                            port: 0,
                            listenHost: "127.0.0.1",
                            allowInTests: true,
                        })];
                case 4:
                    server = _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, , 6, 10]);
                    (0, vitest_1.expect)(server.port).toBeGreaterThan(0);
                    return [3 /*break*/, 10];
                case 6: return [4 /*yield*/, server.close()];
                case 7:
                    _a.sent();
                    (0, vitest_1.expect)(closeSpy).not.toHaveBeenCalled();
                    return [4 /*yield*/, originalClose()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("serves HTML with injection and broadcasts reload on file changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, index, server, res, html, ws_2, msg, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-canvas-"))];
                case 1:
                    dir = _b.sent();
                    index = node_path_1.default.join(dir, "index.html");
                    return [4 /*yield*/, promises_1.default.writeFile(index, "<html><body>v1</body></html>", "utf8")];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, server_js_1.startCanvasHost)({
                            runtime: runtime_js_1.defaultRuntime,
                            rootDir: dir,
                            port: 0,
                            listenHost: "127.0.0.1",
                            allowInTests: true,
                        })];
                case 3:
                    server = _b.sent();
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, , 11, 14]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(server.port).concat(a2ui_js_1.CANVAS_HOST_PATH, "/"))];
                case 5:
                    res = _b.sent();
                    return [4 /*yield*/, res.text()];
                case 6:
                    html = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(html).toContain("v1");
                    (0, vitest_1.expect)(html).toContain(a2ui_js_1.CANVAS_WS_PATH);
                    ws_2 = new ws_1.WebSocket("ws://127.0.0.1:".concat(server.port).concat(a2ui_js_1.CANVAS_WS_PATH));
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var timer = setTimeout(function () { return reject(new Error("ws open timeout")); }, 5000);
                            ws_2.on("open", function () {
                                clearTimeout(timer);
                                resolve();
                            });
                            ws_2.on("error", function (err) {
                                clearTimeout(timer);
                                reject(err);
                            });
                        })];
                case 7:
                    _b.sent();
                    msg = new Promise(function (resolve, reject) {
                        var timer = setTimeout(function () { return reject(new Error("reload timeout")); }, 10000);
                        ws_2.on("message", function (data) {
                            clearTimeout(timer);
                            resolve((0, ws_js_1.rawDataToString)(data));
                        });
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(index, "<html><body>v2</body></html>", "utf8")];
                case 9:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, msg];
                case 10:
                    _a.apply(void 0, [_b.sent()]).toBe("reload");
                    ws_2.close();
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, server.close()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 13:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("serves the gateway-hosted A2UI scaffold", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, a2uiRoot, bundlePath, createdBundle, _a, server, res, html, bundleRes, js;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-canvas-"))];
                case 1:
                    dir = _b.sent();
                    a2uiRoot = node_path_1.default.resolve(process.cwd(), "src/canvas-host/a2ui");
                    bundlePath = node_path_1.default.join(a2uiRoot, "a2ui.bundle.js");
                    createdBundle = false;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, promises_1.default.stat(bundlePath)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    _a = _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(bundlePath, "window.openclawA2UI = {};", "utf8")];
                case 5:
                    _b.sent();
                    createdBundle = true;
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, (0, server_js_1.startCanvasHost)({
                        runtime: runtime_js_1.defaultRuntime,
                        rootDir: dir,
                        port: 0,
                        listenHost: "127.0.0.1",
                        allowInTests: true,
                    })];
                case 7:
                    server = _b.sent();
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, , 13, 18]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(server.port, "/__openclaw__/a2ui/"))];
                case 9:
                    res = _b.sent();
                    return [4 /*yield*/, res.text()];
                case 10:
                    html = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(html).toContain("openclaw-a2ui-host");
                    (0, vitest_1.expect)(html).toContain("openclawCanvasA2UIAction");
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(server.port, "/__openclaw__/a2ui/a2ui.bundle.js"))];
                case 11:
                    bundleRes = _b.sent();
                    return [4 /*yield*/, bundleRes.text()];
                case 12:
                    js = _b.sent();
                    (0, vitest_1.expect)(bundleRes.status).toBe(200);
                    (0, vitest_1.expect)(js).toContain("openclawA2UI");
                    return [3 /*break*/, 18];
                case 13: return [4 /*yield*/, server.close()];
                case 14:
                    _b.sent();
                    if (!createdBundle) return [3 /*break*/, 16];
                    return [4 /*yield*/, promises_1.default.rm(bundlePath, { force: true })];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 17:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); });
});
