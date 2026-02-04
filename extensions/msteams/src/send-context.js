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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMSTeamsSendContext = resolveMSTeamsSendContext;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var conversation_store_fs_js_1 = require("./conversation-store-fs.js");
var runtime_js_1 = require("./runtime.js");
var sdk_js_1 = require("./sdk.js");
var token_js_1 = require("./token.js");
/**
 * Parse the target value into a conversation reference lookup key.
 * Supported formats:
 * - conversation:19:abc@thread.tacv2 → lookup by conversation ID
 * - user:aad-object-id → lookup by user AAD object ID
 * - 19:abc@thread.tacv2 → direct conversation ID
 */
function parseRecipient(to) {
    var trimmed = to.trim();
    var finalize = function (type, id) {
        var normalized = id.trim();
        if (!normalized) {
            throw new Error("Invalid target value: missing ".concat(type, " id"));
        }
        return { type: type, id: normalized };
    };
    if (trimmed.startsWith("conversation:")) {
        return finalize("conversation", trimmed.slice("conversation:".length));
    }
    if (trimmed.startsWith("user:")) {
        return finalize("user", trimmed.slice("user:".length));
    }
    // Assume it's a conversation ID if it looks like one
    if (trimmed.startsWith("19:") || trimmed.includes("@thread")) {
        return finalize("conversation", trimmed);
    }
    // Otherwise treat as user ID
    return finalize("user", trimmed);
}
/**
 * Find a stored conversation reference for the given recipient.
 */
function findConversationReference(recipient) {
    return __awaiter(this, void 0, void 0, function () {
        var ref, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(recipient.type === "conversation")) return [3 /*break*/, 2];
                    return [4 /*yield*/, recipient.store.get(recipient.id)];
                case 1:
                    ref = _a.sent();
                    if (ref) {
                        return [2 /*return*/, { conversationId: recipient.id, ref: ref }];
                    }
                    return [2 /*return*/, null];
                case 2: return [4 /*yield*/, recipient.store.findByUserId(recipient.id)];
                case 3:
                    found = _a.sent();
                    if (!found) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, { conversationId: found.conversationId, ref: found.reference }];
            }
        });
    });
}
function resolveMSTeamsSendContext(params) {
    return __awaiter(this, void 0, void 0, function () {
        var msteamsCfg, creds, store, recipient, found, conversationId, ref, core, log, _a, sdk, authConfig, adapter, tokenProvider, storedConversationType, conversationType, sharePointSiteId, mediaMaxBytes;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    msteamsCfg = (_b = params.cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams;
                    if (!(msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.enabled)) {
                        throw new Error("msteams provider is not enabled");
                    }
                    creds = (0, token_js_1.resolveMSTeamsCredentials)(msteamsCfg);
                    if (!creds) {
                        throw new Error("msteams credentials not configured");
                    }
                    store = (0, conversation_store_fs_js_1.createMSTeamsConversationStoreFs)();
                    recipient = parseRecipient(params.to);
                    return [4 /*yield*/, findConversationReference(__assign(__assign({}, recipient), { store: store }))];
                case 1:
                    found = _f.sent();
                    if (!found) {
                        throw new Error("No conversation reference found for ".concat(recipient.type, ":").concat(recipient.id, ". ") +
                            "The bot must receive a message from this conversation before it can send proactively.");
                    }
                    conversationId = found.conversationId, ref = found.ref;
                    core = (0, runtime_js_1.getMSTeamsRuntime)();
                    log = core.logging.getChildLogger({ name: "msteams:send" });
                    return [4 /*yield*/, (0, sdk_js_1.loadMSTeamsSdkWithAuth)(creds)];
                case 2:
                    _a = _f.sent(), sdk = _a.sdk, authConfig = _a.authConfig;
                    adapter = (0, sdk_js_1.createMSTeamsAdapter)(authConfig, sdk);
                    tokenProvider = new sdk.MsalTokenProvider(authConfig);
                    storedConversationType = (_e = (_d = (_c = ref.conversation) === null || _c === void 0 ? void 0 : _c.conversationType) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== null && _e !== void 0 ? _e : "";
                    if (storedConversationType === "personal") {
                        conversationType = "personal";
                    }
                    else if (storedConversationType === "channel") {
                        conversationType = "channel";
                    }
                    else {
                        // groupChat, or unknown defaults to groupChat behavior
                        conversationType = "groupChat";
                    }
                    sharePointSiteId = msteamsCfg.sharePointSiteId;
                    mediaMaxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                        cfg: params.cfg,
                        resolveChannelLimitMb: function (_a) {
                            var _b, _c;
                            var cfg = _a.cfg;
                            return (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams) === null || _c === void 0 ? void 0 : _c.mediaMaxMb;
                        },
                    });
                    return [2 /*return*/, {
                            appId: creds.appId,
                            conversationId: conversationId,
                            ref: ref,
                            adapter: adapter,
                            log: log,
                            conversationType: conversationType,
                            tokenProvider: tokenProvider,
                            sharePointSiteId: sharePointSiteId,
                            mediaMaxBytes: mediaMaxBytes,
                        }];
            }
        });
    });
}
