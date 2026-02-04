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
exports.deliverMatrixReplies = deliverMatrixReplies;
var runtime_js_1 = require("../../runtime.js");
var send_js_1 = require("../send.js");
function deliverMatrixReplies(params) {
    return __awaiter(this, void 0, void 0, function () {
        var core, cfg, tableMode, logVerbose, chunkLimit, chunkMode, hasReplied, _i, _a, reply, hasMedia, replyToIdRaw, replyToId, rawText, text, mediaList, shouldIncludeReply, _b, _c, chunk, trimmed, first, _d, mediaList_1, mediaUrl, caption;
        var _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    core = (0, runtime_js_1.getMatrixRuntime)();
                    cfg = core.config.loadConfig();
                    tableMode = (_e = params.tableMode) !== null && _e !== void 0 ? _e : core.channel.text.resolveMarkdownTableMode({
                        cfg: cfg,
                        channel: "matrix",
                        accountId: params.accountId,
                    });
                    logVerbose = function (message) {
                        var _a, _b;
                        if (core.logging.shouldLogVerbose()) {
                            (_b = (_a = params.runtime).log) === null || _b === void 0 ? void 0 : _b.call(_a, message);
                        }
                    };
                    chunkLimit = Math.min(params.textLimit, 4000);
                    chunkMode = core.channel.text.resolveChunkMode(cfg, "matrix", params.accountId);
                    hasReplied = false;
                    _i = 0, _a = params.replies;
                    _o.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    reply = _a[_i];
                    hasMedia = Boolean(reply === null || reply === void 0 ? void 0 : reply.mediaUrl) || ((_g = (_f = reply === null || reply === void 0 ? void 0 : reply.mediaUrls) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0) > 0;
                    if (!(reply === null || reply === void 0 ? void 0 : reply.text) && !hasMedia) {
                        if (reply === null || reply === void 0 ? void 0 : reply.audioAsVoice) {
                            logVerbose("matrix reply has audioAsVoice without media/text; skipping");
                            return [3 /*break*/, 10];
                        }
                        (_j = (_h = params.runtime).error) === null || _j === void 0 ? void 0 : _j.call(_h, "matrix reply missing text/media");
                        return [3 /*break*/, 10];
                    }
                    replyToIdRaw = (_k = reply.replyToId) === null || _k === void 0 ? void 0 : _k.trim();
                    replyToId = params.threadId || params.replyToMode === "off" ? undefined : replyToIdRaw;
                    rawText = (_l = reply.text) !== null && _l !== void 0 ? _l : "";
                    text = core.channel.text.convertMarkdownTables(rawText, tableMode);
                    mediaList = ((_m = reply.mediaUrls) === null || _m === void 0 ? void 0 : _m.length)
                        ? reply.mediaUrls
                        : reply.mediaUrl
                            ? [reply.mediaUrl]
                            : [];
                    shouldIncludeReply = function (id) {
                        return Boolean(id) && (params.replyToMode === "all" || !hasReplied);
                    };
                    if (!(mediaList.length === 0)) return [3 /*break*/, 6];
                    _b = 0, _c = core.channel.text.chunkMarkdownTextWithMode(text, chunkLimit, chunkMode);
                    _o.label = 2;
                case 2:
                    if (!(_b < _c.length)) return [3 /*break*/, 5];
                    chunk = _c[_b];
                    trimmed = chunk.trim();
                    if (!trimmed) {
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, (0, send_js_1.sendMessageMatrix)(params.roomId, trimmed, {
                            client: params.client,
                            replyToId: shouldIncludeReply(replyToId) ? replyToId : undefined,
                            threadId: params.threadId,
                            accountId: params.accountId,
                        })];
                case 3:
                    _o.sent();
                    if (shouldIncludeReply(replyToId)) {
                        hasReplied = true;
                    }
                    _o.label = 4;
                case 4:
                    _b++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 10];
                case 6:
                    first = true;
                    _d = 0, mediaList_1 = mediaList;
                    _o.label = 7;
                case 7:
                    if (!(_d < mediaList_1.length)) return [3 /*break*/, 10];
                    mediaUrl = mediaList_1[_d];
                    caption = first ? text : "";
                    return [4 /*yield*/, (0, send_js_1.sendMessageMatrix)(params.roomId, caption, {
                            client: params.client,
                            mediaUrl: mediaUrl,
                            replyToId: shouldIncludeReply(replyToId) ? replyToId : undefined,
                            threadId: params.threadId,
                            audioAsVoice: reply.audioAsVoice,
                            accountId: params.accountId,
                        })];
                case 8:
                    _o.sent();
                    if (shouldIncludeReply(replyToId)) {
                        hasReplied = true;
                    }
                    first = false;
                    _o.label = 9;
                case 9:
                    _d++;
                    return [3 /*break*/, 7];
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/];
            }
        });
    });
}
