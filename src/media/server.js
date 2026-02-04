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
exports.attachMediaRoutes = attachMediaRoutes;
exports.startMediaServer = startMediaServer;
var express_1 = require("express");
var promises_1 = require("node:fs/promises");
var globals_js_1 = require("../globals.js");
var fs_safe_js_1 = require("../infra/fs-safe.js");
var runtime_js_1 = require("../runtime.js");
var mime_js_1 = require("./mime.js");
var store_js_1 = require("./store.js");
var DEFAULT_TTL_MS = 2 * 60 * 1000;
var MAX_MEDIA_ID_CHARS = 200;
var MEDIA_ID_PATTERN = /^[\p{L}\p{N}._-]+$/u;
var MAX_MEDIA_BYTES = store_js_1.MEDIA_MAX_BYTES;
var isValidMediaId = function (id) {
    if (!id) {
        return false;
    }
    if (id.length > MAX_MEDIA_ID_CHARS) {
        return false;
    }
    if (id === "." || id === "..") {
        return false;
    }
    return MEDIA_ID_PATTERN.test(id);
};
function attachMediaRoutes(app, ttlMs, _runtime) {
    var _this = this;
    if (ttlMs === void 0) { ttlMs = DEFAULT_TTL_MS; }
    if (_runtime === void 0) { _runtime = runtime_js_1.defaultRuntime; }
    var mediaDir = (0, store_js_1.getMediaDir)();
    app.get("/media/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id, _a, handle, realPath_1, stat, data, mime, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    if (!isValidMediaId(id)) {
                        res.status(400).send("invalid path");
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, (0, fs_safe_js_1.openFileWithinRoot)({
                            rootDir: mediaDir,
                            relativePath: id,
                        })];
                case 2:
                    _a = _b.sent(), handle = _a.handle, realPath_1 = _a.realPath, stat = _a.stat;
                    if (!(stat.size > MAX_MEDIA_BYTES)) return [3 /*break*/, 4];
                    return [4 /*yield*/, handle.close().catch(function () { })];
                case 3:
                    _b.sent();
                    res.status(413).send("too large");
                    return [2 /*return*/];
                case 4:
                    if (!(Date.now() - stat.mtimeMs > ttlMs)) return [3 /*break*/, 7];
                    return [4 /*yield*/, handle.close().catch(function () { })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.rm(realPath_1).catch(function () { })];
                case 6:
                    _b.sent();
                    res.status(410).send("expired");
                    return [2 /*return*/];
                case 7: return [4 /*yield*/, handle.readFile()];
                case 8:
                    data = _b.sent();
                    return [4 /*yield*/, handle.close().catch(function () { })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: data, filePath: realPath_1 })];
                case 10:
                    mime = _b.sent();
                    if (mime) {
                        res.type(mime);
                    }
                    res.send(data);
                    // best-effort single-use cleanup after response ends
                    res.on("finish", function () {
                        setTimeout(function () {
                            promises_1.default.rm(realPath_1).catch(function () { });
                        }, 50);
                    });
                    return [3 /*break*/, 12];
                case 11:
                    err_1 = _b.sent();
                    if (err_1 instanceof fs_safe_js_1.SafeOpenError) {
                        if (err_1.code === "invalid-path") {
                            res.status(400).send("invalid path");
                            return [2 /*return*/];
                        }
                        if (err_1.code === "not-found") {
                            res.status(404).send("not found");
                            return [2 /*return*/];
                        }
                    }
                    res.status(404).send("not found");
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    // periodic cleanup
    setInterval(function () {
        void (0, store_js_1.cleanOldMedia)(ttlMs);
    }, ttlMs).unref();
}
function startMediaServer(port_1) {
    return __awaiter(this, arguments, void 0, function (port, ttlMs, runtime) {
        var app;
        if (ttlMs === void 0) { ttlMs = DEFAULT_TTL_MS; }
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, express_1.default)();
                    attachMediaRoutes(app, ttlMs, runtime);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var server = app.listen(port);
                            server.once("listening", function () { return resolve(server); });
                            server.once("error", function (err) {
                                runtime.error((0, globals_js_1.danger)("Media server failed: ".concat(String(err))));
                                reject(err);
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
