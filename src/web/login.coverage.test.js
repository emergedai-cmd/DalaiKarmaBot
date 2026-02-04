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
var baileys_1 = require("@whiskeysockets/baileys");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var rmMock = vitest_1.vi.spyOn(promises_1.default, "rm");
var authDir = node_path_1.default.join(node_os_1.default.tmpdir(), "wa-creds");
vitest_1.vi.mock("../config/config.js", function () { return ({
    loadConfig: function () {
        return ({
            channels: {
                whatsapp: {
                    accounts: {
                        default: { enabled: true, authDir: authDir },
                    },
                },
            },
        });
    },
}); });
vitest_1.vi.mock("./session.js", function () {
    var sockA = { ws: { close: vitest_1.vi.fn() } };
    var sockB = { ws: { close: vitest_1.vi.fn() } };
    var call = 0;
    var createWaSocket = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, (call++ === 0 ? sockA : sockB)];
    }); }); });
    var waitForWaConnection = vitest_1.vi.fn();
    var formatError = vitest_1.vi.fn(function (err) { return "formatted:".concat(String(err)); });
    return {
        createWaSocket: createWaSocket,
        waitForWaConnection: waitForWaConnection,
        formatError: formatError,
        WA_WEB_AUTH_DIR: authDir,
        logoutWeb: vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, promises_1.default.rm((_a = params.authDir) !== null && _a !== void 0 ? _a : authDir, {
                            recursive: true,
                            force: true,
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        }); }),
    };
});
var _a = await Promise.resolve().then(function () { return require("./session.js"); }), createWaSocket = _a.createWaSocket, waitForWaConnection = _a.waitForWaConnection, formatError = _a.formatError;
var loginWeb = (await Promise.resolve().then(function () { return require("./login.js"); })).loginWeb;
(0, vitest_1.describe)("loginWeb coverage", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.clearAllMocks();
        rmMock.mockClear();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("restarts once when WhatsApp requests code 515", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime, firstSock, secondSock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waitForWaConnection
                        .mockRejectedValueOnce({ output: { statusCode: 515 } })
                        .mockResolvedValueOnce(undefined);
                    runtime = { log: vitest_1.vi.fn(), error: vitest_1.vi.fn() };
                    return [4 /*yield*/, loginWeb(false, waitForWaConnection, runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(createWaSocket).toHaveBeenCalledTimes(2);
                    return [4 /*yield*/, createWaSocket.mock.results[0].value];
                case 2:
                    firstSock = _a.sent();
                    (0, vitest_1.expect)(firstSock.ws.close).toHaveBeenCalled();
                    vitest_1.vi.runAllTimers();
                    return [4 /*yield*/, createWaSocket.mock.results[1].value];
                case 3:
                    secondSock = _a.sent();
                    (0, vitest_1.expect)(secondSock.ws.close).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears creds and throws when logged out", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waitForWaConnection.mockRejectedValueOnce({
                        output: { statusCode: baileys_1.DisconnectReason.loggedOut },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(loginWeb(false, waitForWaConnection)).rejects.toThrow(/cache cleared/i)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(rmMock).toHaveBeenCalledWith(authDir, {
                        recursive: true,
                        force: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("formats and rethrows generic errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waitForWaConnection.mockRejectedValueOnce(new Error("boom"));
                    return [4 /*yield*/, (0, vitest_1.expect)(loginWeb(false, waitForWaConnection)).rejects.toThrow("formatted:Error: boom")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(formatError).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
