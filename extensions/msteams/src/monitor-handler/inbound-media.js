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
exports.resolveMSTeamsInboundMedia = resolveMSTeamsInboundMedia;
var attachments_js_1 = require("../attachments.js");
function resolveMSTeamsInboundMedia(params) {
    return __awaiter(this, void 0, void 0, function () {
        var attachments, htmlSummary, maxBytes, tokenProvider, allowHosts, conversationType, conversationId, conversationMessageId, activity, log, preserveFilenames, mediaList, onlyHtmlAttachments, messageUrls, attempts, _i, messageUrls_1, messageUrl, graphMedia;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    attachments = params.attachments, htmlSummary = params.htmlSummary, maxBytes = params.maxBytes, tokenProvider = params.tokenProvider, allowHosts = params.allowHosts, conversationType = params.conversationType, conversationId = params.conversationId, conversationMessageId = params.conversationMessageId, activity = params.activity, log = params.log, preserveFilenames = params.preserveFilenames;
                    return [4 /*yield*/, (0, attachments_js_1.downloadMSTeamsAttachments)({
                            attachments: attachments,
                            maxBytes: maxBytes,
                            tokenProvider: tokenProvider,
                            allowHosts: allowHosts,
                            authAllowHosts: params.authAllowHosts,
                            preserveFilenames: preserveFilenames,
                        })];
                case 1:
                    mediaList = _e.sent();
                    if (!(mediaList.length === 0)) return [3 /*break*/, 7];
                    onlyHtmlAttachments = attachments.length > 0 &&
                        attachments.every(function (att) { var _a; return String((_a = att.contentType) !== null && _a !== void 0 ? _a : "").startsWith("text/html"); });
                    if (!onlyHtmlAttachments) return [3 /*break*/, 7];
                    messageUrls = (0, attachments_js_1.buildMSTeamsGraphMessageUrls)({
                        conversationType: conversationType,
                        conversationId: conversationId,
                        messageId: (_a = activity.id) !== null && _a !== void 0 ? _a : undefined,
                        replyToId: (_b = activity.replyToId) !== null && _b !== void 0 ? _b : undefined,
                        conversationMessageId: conversationMessageId,
                        channelData: activity.channelData,
                    });
                    if (!(messageUrls.length === 0)) return [3 /*break*/, 2];
                    log.debug("graph message url unavailable", {
                        conversationType: conversationType,
                        hasChannelData: Boolean(activity.channelData),
                        messageId: (_c = activity.id) !== null && _c !== void 0 ? _c : undefined,
                        replyToId: (_d = activity.replyToId) !== null && _d !== void 0 ? _d : undefined,
                    });
                    return [3 /*break*/, 7];
                case 2:
                    attempts = [];
                    _i = 0, messageUrls_1 = messageUrls;
                    _e.label = 3;
                case 3:
                    if (!(_i < messageUrls_1.length)) return [3 /*break*/, 6];
                    messageUrl = messageUrls_1[_i];
                    return [4 /*yield*/, (0, attachments_js_1.downloadMSTeamsGraphMedia)({
                            messageUrl: messageUrl,
                            tokenProvider: tokenProvider,
                            maxBytes: maxBytes,
                            allowHosts: allowHosts,
                            authAllowHosts: params.authAllowHosts,
                            preserveFilenames: preserveFilenames,
                        })];
                case 4:
                    graphMedia = _e.sent();
                    attempts.push({
                        url: messageUrl,
                        hostedStatus: graphMedia.hostedStatus,
                        attachmentStatus: graphMedia.attachmentStatus,
                        hostedCount: graphMedia.hostedCount,
                        attachmentCount: graphMedia.attachmentCount,
                        tokenError: graphMedia.tokenError,
                    });
                    if (graphMedia.media.length > 0) {
                        mediaList = graphMedia.media;
                        return [3 /*break*/, 6];
                    }
                    if (graphMedia.tokenError) {
                        return [3 /*break*/, 6];
                    }
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    if (mediaList.length === 0) {
                        log.debug("graph media fetch empty", { attempts: attempts });
                    }
                    _e.label = 7;
                case 7:
                    if (mediaList.length > 0) {
                        log.debug("downloaded attachments", { count: mediaList.length });
                    }
                    else if (htmlSummary === null || htmlSummary === void 0 ? void 0 : htmlSummary.imgTags) {
                        log.debug("inline images detected but none downloaded", {
                            imgTags: htmlSummary.imgTags,
                            srcHosts: htmlSummary.srcHosts,
                            dataImages: htmlSummary.dataImages,
                            cidImages: htmlSummary.cidImages,
                        });
                    }
                    return [2 /*return*/, mediaList];
            }
        });
    });
}
