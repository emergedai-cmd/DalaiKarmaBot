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
exports.createNextcloudTalkWebhookServer = createNextcloudTalkWebhookServer;
exports.monitorNextcloudTalkProvider = monitorNextcloudTalkProvider;
var node_http_1 = require("node:http");
var accounts_js_1 = require("./accounts.js");
var inbound_js_1 = require("./inbound.js");
var runtime_js_1 = require("./runtime.js");
var signature_js_1 = require("./signature.js");
var DEFAULT_WEBHOOK_PORT = 8788;
var DEFAULT_WEBHOOK_HOST = "0.0.0.0";
var DEFAULT_WEBHOOK_PATH = "/nextcloud-talk-webhook";
var HEALTH_PATH = "/healthz";
function formatError(err) {
    if (err instanceof Error) {
        return err.message;
    }
    return typeof err === "string" ? err : JSON.stringify(err);
}
function parseWebhookPayload(body) {
    var _a, _b, _c, _d, _e, _f;
    try {
        var data = JSON.parse(body);
        if (!data.type ||
            !((_a = data.actor) === null || _a === void 0 ? void 0 : _a.type) ||
            !((_b = data.actor) === null || _b === void 0 ? void 0 : _b.id) ||
            !((_c = data.object) === null || _c === void 0 ? void 0 : _c.type) ||
            !((_d = data.object) === null || _d === void 0 ? void 0 : _d.id) ||
            !((_e = data.target) === null || _e === void 0 ? void 0 : _e.type) ||
            !((_f = data.target) === null || _f === void 0 ? void 0 : _f.id)) {
            return null;
        }
        return data;
    }
    catch (_g) {
        return null;
    }
}
function payloadToInboundMessage(payload) {
    // Payload doesn't indicate DM vs room; mark as group and let inbound handler refine.
    var isGroupChat = true;
    return {
        messageId: String(payload.object.id),
        roomToken: payload.target.id,
        roomName: payload.target.name,
        senderId: payload.actor.id,
        senderName: payload.actor.name,
        text: payload.object.content || payload.object.name || "",
        mediaType: payload.object.mediaType || "text/plain",
        timestamp: Date.now(),
        isGroupChat: isGroupChat,
    };
}
function readBody(req) {
    return new Promise(function (resolve, reject) {
        var chunks = [];
        req.on("data", function (chunk) { return chunks.push(chunk); });
        req.on("end", function () { return resolve(Buffer.concat(chunks).toString("utf-8")); });
        req.on("error", reject);
    });
}
function createNextcloudTalkWebhookServer(opts) {
    var _this = this;
    var port = opts.port, host = opts.host, path = opts.path, secret = opts.secret, onMessage = opts.onMessage, onError = opts.onError, abortSignal = opts.abortSignal;
    var server = (0, node_http_1.createServer)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, headers, isValid, payload, message, err_1, err_2, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (req.url === HEALTH_PATH) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("ok");
                        return [2 /*return*/];
                    }
                    if (req.url !== path || req.method !== "POST") {
                        res.writeHead(404);
                        res.end();
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, readBody(req)];
                case 2:
                    body = _a.sent();
                    headers = (0, signature_js_1.extractNextcloudTalkHeaders)(req.headers);
                    if (!headers) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Missing signature headers" }));
                        return [2 /*return*/];
                    }
                    isValid = (0, signature_js_1.verifyNextcloudTalkSignature)({
                        signature: headers.signature,
                        random: headers.random,
                        body: body,
                        secret: secret,
                    });
                    if (!isValid) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Invalid signature" }));
                        return [2 /*return*/];
                    }
                    payload = parseWebhookPayload(body);
                    if (!payload) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Invalid payload format" }));
                        return [2 /*return*/];
                    }
                    if (payload.type !== "Create") {
                        res.writeHead(200);
                        res.end();
                        return [2 /*return*/];
                    }
                    message = payloadToInboundMessage(payload);
                    res.writeHead(200);
                    res.end();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, onMessage(message)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    onError === null || onError === void 0 ? void 0 : onError(err_1 instanceof Error ? err_1 : new Error(formatError(err_1)));
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    error = err_2 instanceof Error ? err_2 : new Error(formatError(err_2));
                    onError === null || onError === void 0 ? void 0 : onError(error);
                    if (!res.headersSent) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal server error" }));
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    var start = function () {
        return new Promise(function (resolve) {
            server.listen(port, host, function () { return resolve(); });
        });
    };
    var stop = function () {
        server.close();
    };
    if (abortSignal) {
        abortSignal.addEventListener("abort", stop, { once: true });
    }
    return { server: server, start: start, stop: stop };
}
function monitorNextcloudTalkProvider(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var core, cfg, account, runtime, port, host, path, logger, _a, start, stop, publicUrl;
        var _this = this;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    core = (0, runtime_js_1.getNextcloudTalkRuntime)();
                    cfg = (_b = opts.config) !== null && _b !== void 0 ? _b : core.config.loadConfig();
                    account = (0, accounts_js_1.resolveNextcloudTalkAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    runtime = (_c = opts.runtime) !== null && _c !== void 0 ? _c : {
                        log: function (message) { return core.logging.getChildLogger().info(message); },
                        error: function (message) { return core.logging.getChildLogger().error(message); },
                        exit: function () {
                            throw new Error("Runtime exit not available");
                        },
                    };
                    if (!account.secret) {
                        throw new Error("Nextcloud Talk bot secret not configured for account \"".concat(account.accountId, "\""));
                    }
                    port = (_d = account.config.webhookPort) !== null && _d !== void 0 ? _d : DEFAULT_WEBHOOK_PORT;
                    host = (_e = account.config.webhookHost) !== null && _e !== void 0 ? _e : DEFAULT_WEBHOOK_HOST;
                    path = (_f = account.config.webhookPath) !== null && _f !== void 0 ? _f : DEFAULT_WEBHOOK_PATH;
                    logger = core.logging.getChildLogger({
                        channel: "nextcloud-talk",
                        accountId: account.accountId,
                    });
                    _a = createNextcloudTalkWebhookServer({
                        port: port,
                        host: host,
                        path: path,
                        secret: account.secret,
                        onMessage: function (message) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        core.channel.activity.record({
                                            channel: "nextcloud-talk",
                                            accountId: account.accountId,
                                            direction: "inbound",
                                            at: message.timestamp,
                                        });
                                        if (!opts.onMessage) return [3 /*break*/, 2];
                                        return [4 /*yield*/, opts.onMessage(message)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    case 2: return [4 /*yield*/, (0, inbound_js_1.handleNextcloudTalkInbound)({
                                            message: message,
                                            account: account,
                                            config: cfg,
                                            runtime: runtime,
                                            statusSink: opts.statusSink,
                                        })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        onError: function (error) {
                            logger.error("[nextcloud-talk:".concat(account.accountId, "] webhook error: ").concat(error.message));
                        },
                        abortSignal: opts.abortSignal,
                    }), start = _a.start, stop = _a.stop;
                    return [4 /*yield*/, start()];
                case 1:
                    _h.sent();
                    publicUrl = (_g = account.config.webhookPublicUrl) !== null && _g !== void 0 ? _g : "http://".concat(host === "0.0.0.0" ? "localhost" : host, ":").concat(port).concat(path);
                    logger.info("[nextcloud-talk:".concat(account.accountId, "] webhook listening on ").concat(publicUrl));
                    return [2 /*return*/, { stop: stop }];
            }
        });
    });
}
