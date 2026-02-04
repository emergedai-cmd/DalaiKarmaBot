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
var note = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("../terminal/note.js", function () { return ({
    note: note,
}); });
vitest_1.vi.mock("../channels/plugins/index.js", function () { return ({
    listChannelPlugins: function () { return []; },
}); });
var doctor_security_js_1 = require("./doctor-security.js");
(0, vitest_1.describe)("noteSecurityWarnings gateway exposure", function () {
    var prevToken;
    var prevPassword;
    (0, vitest_1.beforeEach)(function () {
        note.mockClear();
        prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
        prevPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
        delete process.env.OPENCLAW_GATEWAY_TOKEN;
        delete process.env.OPENCLAW_GATEWAY_PASSWORD;
    });
    (0, vitest_1.afterEach)(function () {
        if (prevToken === undefined) {
            delete process.env.OPENCLAW_GATEWAY_TOKEN;
        }
        else {
            process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
        }
        if (prevPassword === undefined) {
            delete process.env.OPENCLAW_GATEWAY_PASSWORD;
        }
        else {
            process.env.OPENCLAW_GATEWAY_PASSWORD = prevPassword;
        }
    });
    var lastMessage = function () { var _a, _b; return String((_b = (_a = note.mock.calls.at(-1)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : ""); };
    (0, vitest_1.it)("warns when exposed without auth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { gateway: { bind: "lan" } };
                    return [4 /*yield*/, (0, doctor_security_js_1.noteSecurityWarnings)(cfg)];
                case 1:
                    _a.sent();
                    message = lastMessage();
                    (0, vitest_1.expect)(message).toContain("CRITICAL");
                    (0, vitest_1.expect)(message).toContain("without authentication");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses env token to avoid critical warning", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.OPENCLAW_GATEWAY_TOKEN = "token-123";
                    cfg = { gateway: { bind: "lan" } };
                    return [4 /*yield*/, (0, doctor_security_js_1.noteSecurityWarnings)(cfg)];
                case 1:
                    _a.sent();
                    message = lastMessage();
                    (0, vitest_1.expect)(message).toContain("WARNING");
                    (0, vitest_1.expect)(message).not.toContain("CRITICAL");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats whitespace token as missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        gateway: { bind: "lan", auth: { mode: "token", token: "   " } },
                    };
                    return [4 /*yield*/, (0, doctor_security_js_1.noteSecurityWarnings)(cfg)];
                case 1:
                    _a.sent();
                    message = lastMessage();
                    (0, vitest_1.expect)(message).toContain("CRITICAL");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips warning for loopback bind", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { gateway: { bind: "loopback" } };
                    return [4 /*yield*/, (0, doctor_security_js_1.noteSecurityWarnings)(cfg)];
                case 1:
                    _a.sent();
                    message = lastMessage();
                    (0, vitest_1.expect)(message).toContain("No channel security warnings detected");
                    (0, vitest_1.expect)(message).not.toContain("Gateway bound");
                    return [2 /*return*/];
            }
        });
    }); });
});
