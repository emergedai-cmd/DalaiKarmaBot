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
vitest_1.vi.mock("./session.js", function () {
    var createWaSocket = vitest_1.vi.fn(function (_printQr, _verbose, opts) { return __awaiter(void 0, void 0, void 0, function () {
        var sock;
        return __generator(this, function (_a) {
            sock = { ws: { close: vitest_1.vi.fn() } };
            if (opts === null || opts === void 0 ? void 0 : opts.onQr) {
                setImmediate(function () { var _a; return (_a = opts.onQr) === null || _a === void 0 ? void 0 : _a.call(opts, "qr-data"); });
            }
            return [2 /*return*/, sock];
        });
    }); });
    var waitForWaConnection = vitest_1.vi.fn();
    var formatError = vitest_1.vi.fn(function (err) { return "formatted:".concat(String(err)); });
    var getStatusCode = vitest_1.vi.fn(function (err) {
        var _a, _b;
        return (_b = (_a = err === null || err === void 0 ? void 0 : err.output) === null || _a === void 0 ? void 0 : _a.statusCode) !== null && _b !== void 0 ? _b : err === null || err === void 0 ? void 0 : err.status;
    });
    var webAuthExists = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, false];
    }); }); });
    var readWebSelfId = vitest_1.vi.fn(function () { return ({ e164: null, jid: null }); });
    var logoutWeb = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); });
    return {
        createWaSocket: createWaSocket,
        waitForWaConnection: waitForWaConnection,
        formatError: formatError,
        getStatusCode: getStatusCode,
        webAuthExists: webAuthExists,
        readWebSelfId: readWebSelfId,
        logoutWeb: logoutWeb,
    };
});
vitest_1.vi.mock("./qr-image.js", function () { return ({
    renderQrPngBase64: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, "base64"];
    }); }); }),
}); });
var _a = await Promise.resolve().then(function () { return require("./login-qr.js"); }), startWebLoginWithQr = _a.startWebLoginWithQr, waitForWebLogin = _a.waitForWebLogin;
var _b = await Promise.resolve().then(function () { return require("./session.js"); }), createWaSocket = _b.createWaSocket, waitForWaConnection = _b.waitForWaConnection, logoutWeb = _b.logoutWeb;
(0, vitest_1.describe)("login-qr", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("restarts login once on status 515 and completes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var start, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waitForWaConnection
                        .mockRejectedValueOnce({ output: { statusCode: 515 } })
                        .mockResolvedValueOnce(undefined);
                    return [4 /*yield*/, startWebLoginWithQr({ timeoutMs: 5000 })];
                case 1:
                    start = _a.sent();
                    (0, vitest_1.expect)(start.qrDataUrl).toBe("data:image/png;base64,base64");
                    return [4 /*yield*/, waitForWebLogin({ timeoutMs: 5000 })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.connected).toBe(true);
                    (0, vitest_1.expect)(createWaSocket).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(logoutWeb).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
