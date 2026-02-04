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
var node_crypto_1 = require("node:crypto");
var vitest_1 = require("vitest");
var webhook_js_1 = require("./webhook.js");
var sign = function (body, secret) {
    return node_crypto_1.default.createHmac("SHA256", secret).update(body).digest("base64");
};
var createRes = function () {
    var res = {
        status: vitest_1.vi.fn(),
        json: vitest_1.vi.fn(),
        headersSent: false,
        // oxlint-disable-next-line typescript/no-explicit-any
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res;
};
(0, vitest_1.describe)("createLineWebhookMiddleware", function () {
    (0, vitest_1.it)("parses JSON from raw string body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEvents, secret, rawBody, middleware, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onEvents = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    secret = "secret";
                    rawBody = JSON.stringify({ events: [{ type: "message" }] });
                    middleware = (0, webhook_js_1.createLineWebhookMiddleware)({ channelSecret: secret, onEvents: onEvents });
                    req = {
                        headers: { "x-line-signature": sign(rawBody, secret) },
                        body: rawBody,
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    res = createRes();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, middleware(req, res, {})];
                case 1:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
                    (0, vitest_1.expect)(onEvents).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ events: vitest_1.expect.any(Array) }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses JSON from raw buffer body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEvents, secret, rawBody, middleware, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onEvents = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    secret = "secret";
                    rawBody = JSON.stringify({ events: [{ type: "follow" }] });
                    middleware = (0, webhook_js_1.createLineWebhookMiddleware)({ channelSecret: secret, onEvents: onEvents });
                    req = {
                        headers: { "x-line-signature": sign(rawBody, secret) },
                        body: Buffer.from(rawBody, "utf-8"),
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    res = createRes();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, middleware(req, res, {})];
                case 1:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
                    (0, vitest_1.expect)(onEvents).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ events: vitest_1.expect.any(Array) }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects invalid JSON payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEvents, secret, rawBody, middleware, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onEvents = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    secret = "secret";
                    rawBody = "not json";
                    middleware = (0, webhook_js_1.createLineWebhookMiddleware)({ channelSecret: secret, onEvents: onEvents });
                    req = {
                        headers: { "x-line-signature": sign(rawBody, secret) },
                        body: rawBody,
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    res = createRes();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, middleware(req, res, {})];
                case 1:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
                    (0, vitest_1.expect)(onEvents).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects webhooks with invalid signatures", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEvents, secret, rawBody, middleware, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onEvents = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    secret = "secret";
                    rawBody = JSON.stringify({ events: [{ type: "message" }] });
                    middleware = (0, webhook_js_1.createLineWebhookMiddleware)({ channelSecret: secret, onEvents: onEvents });
                    req = {
                        headers: { "x-line-signature": "invalid-signature" },
                        body: rawBody,
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    res = createRes();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, middleware(req, res, {})];
                case 1:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(401);
                    (0, vitest_1.expect)(onEvents).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects webhooks with signatures computed using wrong secret", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEvents, correctSecret, wrongSecret, rawBody, middleware, req, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onEvents = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    correctSecret = "correct-secret";
                    wrongSecret = "wrong-secret";
                    rawBody = JSON.stringify({ events: [{ type: "message" }] });
                    middleware = (0, webhook_js_1.createLineWebhookMiddleware)({ channelSecret: correctSecret, onEvents: onEvents });
                    req = {
                        headers: { "x-line-signature": sign(rawBody, wrongSecret) },
                        body: rawBody,
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    res = createRes();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    return [4 /*yield*/, middleware(req, res, {})];
                case 1:
                    // oxlint-disable-next-line typescript/no-explicit-any
                    _a.sent();
                    (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(401);
                    (0, vitest_1.expect)(onEvents).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
