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
var node_events_1 = require("node:events");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var logging_js_1 = require("../logging.js");
var test_helpers_js_1 = require("./test-helpers.js");
var _a = await Promise.resolve().then(function () { return require("./session.js"); }), createWaSocket = _a.createWaSocket, formatError = _a.formatError, logWebSelfId = _a.logWebSelfId, waitForWaConnection = _a.waitForWaConnection;
(0, vitest_1.describe)("web session", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, test_helpers_js_1.resetBaileysMocks)();
        (0, test_helpers_js_1.resetLoadConfigMock)();
    });
    (0, vitest_1.afterEach)(function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)(null);
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("creates WA socket with QR handler", function () { return __awaiter(void 0, void 0, void 0, function () {
        var makeWASocket, passed, passedLogger, sock, saveCreds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createWaSocket(true, false)];
                case 1:
                    _a.sent();
                    makeWASocket = test_helpers_js_1.baileys.makeWASocket;
                    (0, vitest_1.expect)(makeWASocket).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ printQRInTerminal: false }));
                    passed = makeWASocket.mock.calls[0][0];
                    passedLogger = passed.logger;
                    (0, vitest_1.expect)(passedLogger === null || passedLogger === void 0 ? void 0 : passedLogger.level).toBe("silent");
                    (0, vitest_1.expect)(typeof (passedLogger === null || passedLogger === void 0 ? void 0 : passedLogger.trace)).toBe("function");
                    sock = (0, test_helpers_js_1.getLastSocket)();
                    return [4 /*yield*/, test_helpers_js_1.baileys.useMultiFileAuthState.mock.results[0].value];
                case 2:
                    saveCreds = (_a.sent()).saveCreds;
                    // trigger creds.update listener
                    sock.ev.emit("creds.update", {});
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(saveCreds).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("waits for connection open", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ev, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ev = new node_events_1.EventEmitter();
                    promise = waitForWaConnection({ ev: ev });
                    ev.emit("connection.update", { connection: "open" });
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).resolves.toBeUndefined()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects when connection closes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ev, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ev = new node_events_1.EventEmitter();
                    promise = waitForWaConnection({ ev: ev });
                    ev.emit("connection.update", {
                        connection: "close",
                        lastDisconnect: new Error("bye"),
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).rejects.toBeInstanceOf(Error)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logWebSelfId prints cached E.164 when creds exist", function () {
        var existsSpy = vitest_1.vi.spyOn(node_fs_1.default, "existsSync").mockImplementation(function (p) {
            if (typeof p !== "string") {
                return false;
            }
            return p.endsWith("creds.json");
        });
        var readSpy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync").mockImplementation(function (p) {
            if (typeof p === "string" && p.endsWith("creds.json")) {
                return JSON.stringify({ me: { id: "12345@s.whatsapp.net" } });
            }
            throw new Error("unexpected readFileSync path: ".concat(String(p)));
        });
        var runtime = {
            log: vitest_1.vi.fn(),
            error: vitest_1.vi.fn(),
            exit: vitest_1.vi.fn(),
        };
        logWebSelfId("/tmp/wa-creds", runtime, true);
        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Web Channel: +12345 (jid 12345@s.whatsapp.net)"));
        existsSpy.mockRestore();
        readSpy.mockRestore();
    });
    (0, vitest_1.it)("formatError prints Boom-like payload message", function () {
        var err = {
            error: {
                isBoom: true,
                output: {
                    statusCode: 408,
                    payload: {
                        statusCode: 408,
                        error: "Request Time-out",
                        message: "QR refs attempts ended",
                    },
                },
            },
        };
        (0, vitest_1.expect)(formatError(err)).toContain("status=408");
        (0, vitest_1.expect)(formatError(err)).toContain("Request Time-out");
        (0, vitest_1.expect)(formatError(err)).toContain("QR refs attempts ended");
    });
    (0, vitest_1.it)("does not clobber creds backup when creds.json is corrupted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var credsSuffix, copySpy, existsSpy, statSpy, readSpy, sock, saveCreds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    credsSuffix = node_path_1.default.join(".openclaw", "credentials", "whatsapp", "default", "creds.json");
                    copySpy = vitest_1.vi.spyOn(node_fs_1.default, "copyFileSync").mockImplementation(function () { });
                    existsSpy = vitest_1.vi.spyOn(node_fs_1.default, "existsSync").mockImplementation(function (p) {
                        if (typeof p !== "string") {
                            return false;
                        }
                        return p.endsWith(credsSuffix);
                    });
                    statSpy = vitest_1.vi.spyOn(node_fs_1.default, "statSync").mockImplementation(function (p) {
                        if (typeof p === "string" && p.endsWith(credsSuffix)) {
                            return { isFile: function () { return true; }, size: 12 };
                        }
                        throw new Error("unexpected statSync path: ".concat(String(p)));
                    });
                    readSpy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync").mockImplementation(function (p) {
                        if (typeof p === "string" && p.endsWith(credsSuffix)) {
                            return "{";
                        }
                        throw new Error("unexpected readFileSync path: ".concat(String(p)));
                    });
                    return [4 /*yield*/, createWaSocket(false, false)];
                case 1:
                    _a.sent();
                    sock = (0, test_helpers_js_1.getLastSocket)();
                    return [4 /*yield*/, test_helpers_js_1.baileys.useMultiFileAuthState.mock.results[0].value];
                case 2:
                    saveCreds = (_a.sent()).saveCreds;
                    sock.ev.emit("creds.update", {});
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(copySpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(saveCreds).toHaveBeenCalled();
                    copySpy.mockRestore();
                    existsSpy.mockRestore();
                    statSpy.mockRestore();
                    readSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("serializes creds.update saves to avoid overlapping writes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var inFlight, maxInFlight, release, gate, saveCreds, sock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inFlight = 0;
                    maxInFlight = 0;
                    release = null;
                    gate = new Promise(function (resolve) {
                        release = resolve;
                    });
                    saveCreds = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    inFlight += 1;
                                    maxInFlight = Math.max(maxInFlight, inFlight);
                                    return [4 /*yield*/, gate];
                                case 1:
                                    _a.sent();
                                    inFlight -= 1;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    test_helpers_js_1.baileys.useMultiFileAuthState.mockResolvedValueOnce({
                        state: { creds: {}, keys: {} },
                        saveCreds: saveCreds,
                    });
                    return [4 /*yield*/, createWaSocket(false, false)];
                case 1:
                    _a.sent();
                    sock = (0, test_helpers_js_1.getLastSocket)();
                    sock.ev.emit("creds.update", {});
                    sock.ev.emit("creds.update", {});
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(inFlight).toBe(1);
                    release === null || release === void 0 ? void 0 : release();
                    // let both queued saves complete
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    // let both queued saves complete
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(saveCreds).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(maxInFlight).toBe(1);
                    (0, vitest_1.expect)(inFlight).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rotates creds backup when creds.json is valid JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
        var credsSuffix, backupSuffix, copySpy, existsSpy, statSpy, readSpy, sock, saveCreds, args;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    credsSuffix = node_path_1.default.join(".openclaw", "credentials", "whatsapp", "default", "creds.json");
                    backupSuffix = node_path_1.default.join(".openclaw", "credentials", "whatsapp", "default", "creds.json.bak");
                    copySpy = vitest_1.vi.spyOn(node_fs_1.default, "copyFileSync").mockImplementation(function () { });
                    existsSpy = vitest_1.vi.spyOn(node_fs_1.default, "existsSync").mockImplementation(function (p) {
                        if (typeof p !== "string") {
                            return false;
                        }
                        return p.endsWith(credsSuffix);
                    });
                    statSpy = vitest_1.vi.spyOn(node_fs_1.default, "statSync").mockImplementation(function (p) {
                        if (typeof p === "string" && p.endsWith(credsSuffix)) {
                            return { isFile: function () { return true; }, size: 12 };
                        }
                        throw new Error("unexpected statSync path: ".concat(String(p)));
                    });
                    readSpy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync").mockImplementation(function (p) {
                        if (typeof p === "string" && p.endsWith(credsSuffix)) {
                            return "{}";
                        }
                        throw new Error("unexpected readFileSync path: ".concat(String(p)));
                    });
                    return [4 /*yield*/, createWaSocket(false, false)];
                case 1:
                    _d.sent();
                    sock = (0, test_helpers_js_1.getLastSocket)();
                    return [4 /*yield*/, test_helpers_js_1.baileys.useMultiFileAuthState.mock.results[0].value];
                case 2:
                    saveCreds = (_d.sent()).saveCreds;
                    sock.ev.emit("creds.update", {});
                    return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(copySpy).toHaveBeenCalledTimes(1);
                    args = (_a = copySpy.mock.calls[0]) !== null && _a !== void 0 ? _a : [];
                    (0, vitest_1.expect)(String((_b = args[0]) !== null && _b !== void 0 ? _b : "")).toContain(credsSuffix);
                    (0, vitest_1.expect)(String((_c = args[1]) !== null && _c !== void 0 ? _c : "")).toContain(backupSuffix);
                    (0, vitest_1.expect)(saveCreds).toHaveBeenCalled();
                    copySpy.mockRestore();
                    existsSpy.mockRestore();
                    statSpy.mockRestore();
                    readSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
