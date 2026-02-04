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
exports.registerVoiceCallCli = registerVoiceCallCli;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var utils_js_1 = require("./utils.js");
var webhook_js_1 = require("./webhook.js");
function resolveMode(input) {
    var raw = input.trim().toLowerCase();
    if (raw === "serve" || raw === "off") {
        return raw;
    }
    return "funnel";
}
function resolveDefaultStorePath(config) {
    var _a, _b;
    var preferred = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "voice-calls");
    var resolvedPreferred = (0, utils_js_1.resolveUserPath)(preferred);
    var existing = (_a = [resolvedPreferred].find(function (dir) {
        try {
            return node_fs_1.default.existsSync(node_path_1.default.join(dir, "calls.jsonl")) || node_fs_1.default.existsSync(dir);
        }
        catch (_a) {
            return false;
        }
    })) !== null && _a !== void 0 ? _a : resolvedPreferred;
    var base = ((_b = config.store) === null || _b === void 0 ? void 0 : _b.trim()) ? (0, utils_js_1.resolveUserPath)(config.store) : existing;
    return node_path_1.default.join(base, "calls.jsonl");
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function registerVoiceCallCli(params) {
    var _this = this;
    var program = params.program, config = params.config, ensureRuntime = params.ensureRuntime, logger = params.logger;
    var root = program
        .command("voicecall")
        .description("Voice call utilities")
        .addHelpText("after", function () { return "\nDocs: https://docs.openclaw.ai/cli/voicecall\n"; });
    root
        .command("call")
        .description("Initiate an outbound voice call")
        .requiredOption("-m, --message <text>", "Message to speak when call connects")
        .option("-t, --to <phone>", "Phone number to call (E.164 format, uses config toNumber if not set)")
        .option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var rt, to, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureRuntime()];
                case 1:
                    rt = _b.sent();
                    to = (_a = options.to) !== null && _a !== void 0 ? _a : rt.config.toNumber;
                    if (!to) {
                        throw new Error("Missing --to and no toNumber configured");
                    }
                    return [4 /*yield*/, rt.manager.initiateCall(to, undefined, {
                            message: options.message,
                            mode: options.mode === "notify" || options.mode === "conversation" ? options.mode : undefined,
                        })];
                case 2:
                    result = _b.sent();
                    if (!result.success) {
                        throw new Error(result.error || "initiate failed");
                    }
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify({ callId: result.callId }, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
    root
        .command("start")
        .description("Alias for voicecall call")
        .requiredOption("--to <phone>", "Phone number to call")
        .option("--message <text>", "Message to speak when call connects")
        .option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var rt, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureRuntime()];
                case 1:
                    rt = _a.sent();
                    return [4 /*yield*/, rt.manager.initiateCall(options.to, undefined, {
                            message: options.message,
                            mode: options.mode === "notify" || options.mode === "conversation" ? options.mode : undefined,
                        })];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error || "initiate failed");
                    }
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify({ callId: result.callId }, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
    root
        .command("continue")
        .description("Speak a message and wait for a response")
        .requiredOption("--call-id <id>", "Call ID")
        .requiredOption("--message <text>", "Message to speak")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var rt, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureRuntime()];
                case 1:
                    rt = _a.sent();
                    return [4 /*yield*/, rt.manager.continueCall(options.callId, options.message)];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error || "continue failed");
                    }
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify(result, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
    root
        .command("speak")
        .description("Speak a message without waiting for response")
        .requiredOption("--call-id <id>", "Call ID")
        .requiredOption("--message <text>", "Message to speak")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var rt, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureRuntime()];
                case 1:
                    rt = _a.sent();
                    return [4 /*yield*/, rt.manager.speak(options.callId, options.message)];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error || "speak failed");
                    }
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify(result, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
    root
        .command("end")
        .description("Hang up an active call")
        .requiredOption("--call-id <id>", "Call ID")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var rt, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureRuntime()];
                case 1:
                    rt = _a.sent();
                    return [4 /*yield*/, rt.manager.endCall(options.callId)];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error || "end failed");
                    }
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify(result, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
    root
        .command("status")
        .description("Show call status")
        .requiredOption("--call-id <id>", "Call ID")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var rt, call;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureRuntime()];
                case 1:
                    rt = _a.sent();
                    call = rt.manager.getCall(options.callId);
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify(call !== null && call !== void 0 ? call : { found: false }, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
    root
        .command("tail")
        .description("Tail voice-call JSONL logs (prints new lines; useful during provider tests)")
        .option("--file <path>", "Path to calls.jsonl", resolveDefaultStorePath(config))
        .option("--since <n>", "Print last N lines first", "25")
        .option("--poll <ms>", "Poll interval in ms", "250")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var file, since, pollMs, initial, lines, _i, _a, line, offset, stat, fd, buf, text, _b, _c, line;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    file = options.file;
                    since = Math.max(0, Number((_d = options.since) !== null && _d !== void 0 ? _d : 0));
                    pollMs = Math.max(50, Number((_e = options.poll) !== null && _e !== void 0 ? _e : 250));
                    if (!node_fs_1.default.existsSync(file)) {
                        logger.error("No log file at ".concat(file));
                        process.exit(1);
                    }
                    initial = node_fs_1.default.readFileSync(file, "utf8");
                    lines = initial.split("\n").filter(Boolean);
                    for (_i = 0, _a = lines.slice(Math.max(0, lines.length - since)); _i < _a.length; _i++) {
                        line = _a[_i];
                        // eslint-disable-next-line no-console
                        console.log(line);
                    }
                    offset = Buffer.byteLength(initial, "utf8");
                    _f.label = 1;
                case 1:
                    try {
                        stat = node_fs_1.default.statSync(file);
                        if (stat.size < offset) {
                            offset = 0;
                        }
                        if (stat.size > offset) {
                            fd = node_fs_1.default.openSync(file, "r");
                            try {
                                buf = Buffer.alloc(stat.size - offset);
                                node_fs_1.default.readSync(fd, buf, 0, buf.length, offset);
                                offset = stat.size;
                                text = buf.toString("utf8");
                                for (_b = 0, _c = text.split("\n").filter(Boolean); _b < _c.length; _b++) {
                                    line = _c[_b];
                                    // eslint-disable-next-line no-console
                                    console.log(line);
                                }
                            }
                            finally {
                                node_fs_1.default.closeSync(fd);
                            }
                        }
                    }
                    catch (_g) {
                        // ignore and retry
                    }
                    return [4 /*yield*/, sleep(pollMs)];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    root
        .command("expose")
        .description("Enable/disable Tailscale serve/funnel for the webhook")
        .option("--mode <mode>", "off | serve (tailnet) | funnel (public)", "funnel")
        .option("--path <path>", "Tailscale path to expose (recommend matching serve.path)")
        .option("--port <port>", "Local webhook port")
        .option("--serve-path <path>", "Local webhook path")
        .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var mode, servePort, servePath, tsPath, localUrl, publicUrl, tsInfo, _a, enableUrl;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    mode = resolveMode((_b = options.mode) !== null && _b !== void 0 ? _b : "funnel");
                    servePort = Number((_d = (_c = options.port) !== null && _c !== void 0 ? _c : config.serve.port) !== null && _d !== void 0 ? _d : 3334);
                    servePath = String((_f = (_e = options.servePath) !== null && _e !== void 0 ? _e : config.serve.path) !== null && _f !== void 0 ? _f : "/voice/webhook");
                    tsPath = String((_j = (_g = options.path) !== null && _g !== void 0 ? _g : (_h = config.tailscale) === null || _h === void 0 ? void 0 : _h.path) !== null && _j !== void 0 ? _j : servePath);
                    localUrl = "http://127.0.0.1:".concat(servePort);
                    if (!(mode === "off")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, webhook_js_1.cleanupTailscaleExposureRoute)({ mode: "serve", path: tsPath })];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, (0, webhook_js_1.cleanupTailscaleExposureRoute)({ mode: "funnel", path: tsPath })];
                case 2:
                    _k.sent();
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify({ ok: true, mode: "off", path: tsPath }, null, 2));
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, webhook_js_1.setupTailscaleExposureRoute)({
                        mode: mode,
                        path: tsPath,
                        localUrl: localUrl,
                    })];
                case 4:
                    publicUrl = _k.sent();
                    if (!publicUrl) return [3 /*break*/, 5];
                    _a = null;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, (0, webhook_js_1.getTailscaleSelfInfo)()];
                case 6:
                    _a = _k.sent();
                    _k.label = 7;
                case 7:
                    tsInfo = _a;
                    enableUrl = (tsInfo === null || tsInfo === void 0 ? void 0 : tsInfo.nodeId)
                        ? "https://login.tailscale.com/f/".concat(mode, "?node=").concat(tsInfo.nodeId)
                        : null;
                    // eslint-disable-next-line no-console
                    console.log(JSON.stringify({
                        ok: Boolean(publicUrl),
                        mode: mode,
                        path: tsPath,
                        localUrl: localUrl,
                        publicUrl: publicUrl,
                        hint: publicUrl
                            ? undefined
                            : {
                                note: "Tailscale serve/funnel may be disabled on this tailnet (or require admin enable).",
                                enableUrl: enableUrl,
                            },
                    }, null, 2));
                    return [2 /*return*/];
            }
        });
    }); });
}
