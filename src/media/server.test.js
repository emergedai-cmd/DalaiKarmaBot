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
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var MEDIA_DIR = node_path_1.default.join(process.cwd(), "tmp-media-test");
var cleanOldMedia = vitest_1.vi.fn().mockResolvedValue(undefined);
vitest_1.vi.mock("./store.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { getMediaDir: function () { return MEDIA_DIR; }, cleanOldMedia: cleanOldMedia })];
        }
    });
}); });
var startMediaServer = (await Promise.resolve().then(function () { return require("./server.js"); })).startMediaServer;
var MEDIA_MAX_BYTES = (await Promise.resolve().then(function () { return require("./store.js"); })).MEDIA_MAX_BYTES;
var waitForFileRemoval = function (file_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([file_1], args_1, true), void 0, function (file, timeoutMs) {
        var start, _a;
        if (timeoutMs === void 0) { timeoutMs = 200; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    _b.label = 1;
                case 1:
                    if (!(Date.now() - start < timeoutMs)) return [3 /*break*/, 7];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.stat(file)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 7: throw new Error("timed out waiting for ".concat(file, " removal"));
            }
        });
    });
};
(0, vitest_1.describe)("media server", function () {
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(MEDIA_DIR, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(MEDIA_DIR, { recursive: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(MEDIA_DIR, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("serves media and cleans up after send", function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, server, port, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = node_path_1.default.join(MEDIA_DIR, "file1");
                    return [4 /*yield*/, promises_1.default.writeFile(file, "hello")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startMediaServer(0, 5000)];
                case 2:
                    server = _b.sent();
                    port = server.address().port;
                    return [4 /*yield*/, fetch("http://localhost:".concat(port, "/media/file1"))];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, res.text()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe("hello");
                    return [4 /*yield*/, waitForFileRemoval(file)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (r) { return server.close(r); })];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("expires old media", function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, past, server, port, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = node_path_1.default.join(MEDIA_DIR, "old");
                    return [4 /*yield*/, promises_1.default.writeFile(file, "stale")];
                case 1:
                    _a.sent();
                    past = Date.now() - 10000;
                    return [4 /*yield*/, promises_1.default.utimes(file, past / 1000, past / 1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, startMediaServer(0, 1000)];
                case 3:
                    server = _a.sent();
                    port = server.address().port;
                    return [4 /*yield*/, fetch("http://localhost:".concat(port, "/media/old"))];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(410);
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(file)).rejects.toThrow()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return server.close(r); })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks path traversal attempts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server, port, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, startMediaServer(0, 5000)];
                case 1:
                    server = _b.sent();
                    port = server.address().port;
                    return [4 /*yield*/, fetch("http://localhost:".concat(port, "/media/%2e%2e%2fpackage.json"))];
                case 2:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(400);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, res.text()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe("invalid path");
                    return [4 /*yield*/, new Promise(function (r) { return server.close(r); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks symlink escaping outside media dir", function () { return __awaiter(void 0, void 0, void 0, function () {
        var target, link, server, port, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    target = node_path_1.default.join(process.cwd(), "package.json");
                    link = node_path_1.default.join(MEDIA_DIR, "link-out");
                    return [4 /*yield*/, promises_1.default.symlink(target, link)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startMediaServer(0, 5000)];
                case 2:
                    server = _b.sent();
                    port = server.address().port;
                    return [4 /*yield*/, fetch("http://localhost:".concat(port, "/media/link-out"))];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(400);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, res.text()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe("invalid path");
                    return [4 /*yield*/, new Promise(function (r) { return server.close(r); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects invalid media ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, server, port, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = node_path_1.default.join(MEDIA_DIR, "file2");
                    return [4 /*yield*/, promises_1.default.writeFile(file, "hello")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startMediaServer(0, 5000)];
                case 2:
                    server = _b.sent();
                    port = server.address().port;
                    return [4 /*yield*/, fetch("http://localhost:".concat(port, "/media/invalid%20id"))];
                case 3:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(400);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, res.text()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe("invalid path");
                    return [4 /*yield*/, new Promise(function (r) { return server.close(r); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects oversized media files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, server, port, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = node_path_1.default.join(MEDIA_DIR, "big");
                    return [4 /*yield*/, promises_1.default.writeFile(file, "")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.truncate(file, MEDIA_MAX_BYTES + 1)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, startMediaServer(0, 5000)];
                case 3:
                    server = _b.sent();
                    port = server.address().port;
                    return [4 /*yield*/, fetch("http://localhost:".concat(port, "/media/big"))];
                case 4:
                    res = _b.sent();
                    (0, vitest_1.expect)(res.status).toBe(413);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, res.text()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBe("too large");
                    return [4 /*yield*/, new Promise(function (r) { return server.close(r); })];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
