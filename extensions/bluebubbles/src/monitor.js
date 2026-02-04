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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBlueBubblesMessageId = resolveBlueBubblesMessageId;
exports._resetBlueBubblesShortIdState = _resetBlueBubblesShortIdState;
exports.registerBlueBubblesWebhookTarget = registerBlueBubblesWebhookTarget;
exports.handleBlueBubblesWebhookRequest = handleBlueBubblesWebhookRequest;
exports.monitorBlueBubblesProvider = monitorBlueBubblesProvider;
exports.resolveWebhookPathFromConfig = resolveWebhookPathFromConfig;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var attachments_js_1 = require("./attachments.js");
var chat_js_1 = require("./chat.js");
var media_send_js_1 = require("./media-send.js");
var probe_js_1 = require("./probe.js");
var reactions_js_1 = require("./reactions.js");
var runtime_js_1 = require("./runtime.js");
var send_js_1 = require("./send.js");
var targets_js_1 = require("./targets.js");
var DEFAULT_WEBHOOK_PATH = "/bluebubbles-webhook";
var DEFAULT_TEXT_LIMIT = 4000;
var invalidAckReactions = new Set();
var REPLY_CACHE_MAX = 2000;
var REPLY_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
// Best-effort cache for resolving reply context when BlueBubbles webhooks omit sender/body.
var blueBubblesReplyCacheByMessageId = new Map();
// Bidirectional maps for short ID ↔ message GUID resolution (token savings optimization)
var blueBubblesShortIdToUuid = new Map();
var blueBubblesUuidToShortId = new Map();
var blueBubblesShortIdCounter = 0;
function trimOrUndefined(value) {
    var trimmed = value === null || value === void 0 ? void 0 : value.trim();
    return trimmed ? trimmed : undefined;
}
function generateShortId() {
    blueBubblesShortIdCounter += 1;
    return String(blueBubblesShortIdCounter);
}
function rememberBlueBubblesReplyCache(entry) {
    var messageId = entry.messageId.trim();
    if (!messageId) {
        return __assign(__assign({}, entry), { shortId: "" });
    }
    // Check if we already have a short ID for this GUID
    var shortId = blueBubblesUuidToShortId.get(messageId);
    if (!shortId) {
        shortId = generateShortId();
        blueBubblesShortIdToUuid.set(shortId, messageId);
        blueBubblesUuidToShortId.set(messageId, shortId);
    }
    var fullEntry = __assign(__assign({}, entry), { messageId: messageId, shortId: shortId });
    // Refresh insertion order.
    blueBubblesReplyCacheByMessageId.delete(messageId);
    blueBubblesReplyCacheByMessageId.set(messageId, fullEntry);
    // Opportunistic prune.
    var cutoff = Date.now() - REPLY_CACHE_TTL_MS;
    for (var _i = 0, blueBubblesReplyCacheByMessageId_1 = blueBubblesReplyCacheByMessageId; _i < blueBubblesReplyCacheByMessageId_1.length; _i++) {
        var _a = blueBubblesReplyCacheByMessageId_1[_i], key = _a[0], value = _a[1];
        if (value.timestamp < cutoff) {
            blueBubblesReplyCacheByMessageId.delete(key);
            // Clean up short ID mappings for expired entries
            if (value.shortId) {
                blueBubblesShortIdToUuid.delete(value.shortId);
                blueBubblesUuidToShortId.delete(key);
            }
            continue;
        }
        break;
    }
    while (blueBubblesReplyCacheByMessageId.size > REPLY_CACHE_MAX) {
        var oldest = blueBubblesReplyCacheByMessageId.keys().next().value;
        if (!oldest) {
            break;
        }
        var oldEntry = blueBubblesReplyCacheByMessageId.get(oldest);
        blueBubblesReplyCacheByMessageId.delete(oldest);
        // Clean up short ID mappings for evicted entries
        if (oldEntry === null || oldEntry === void 0 ? void 0 : oldEntry.shortId) {
            blueBubblesShortIdToUuid.delete(oldEntry.shortId);
            blueBubblesUuidToShortId.delete(oldest);
        }
    }
    return fullEntry;
}
/**
 * Resolves a short message ID (e.g., "1", "2") to a full BlueBubbles GUID.
 * Returns the input unchanged if it's already a GUID or not found in the mapping.
 */
function resolveBlueBubblesMessageId(shortOrUuid, opts) {
    var trimmed = shortOrUuid.trim();
    if (!trimmed) {
        return trimmed;
    }
    // If it looks like a short ID (numeric), try to resolve it
    if (/^\d+$/.test(trimmed)) {
        var uuid = blueBubblesShortIdToUuid.get(trimmed);
        if (uuid) {
            return uuid;
        }
        if (opts === null || opts === void 0 ? void 0 : opts.requireKnownShortId) {
            throw new Error("BlueBubbles short message id \"".concat(trimmed, "\" is no longer available. Use MessageSidFull."));
        }
    }
    // Return as-is (either already a UUID or not found)
    return trimmed;
}
/**
 * Resets the short ID state. Only use in tests.
 * @internal
 */
function _resetBlueBubblesShortIdState() {
    blueBubblesShortIdToUuid.clear();
    blueBubblesUuidToShortId.clear();
    blueBubblesReplyCacheByMessageId.clear();
    blueBubblesShortIdCounter = 0;
}
/**
 * Gets the short ID for a message GUID, if one exists.
 */
function getShortIdForUuid(uuid) {
    return blueBubblesUuidToShortId.get(uuid.trim());
}
function resolveReplyContextFromCache(params) {
    var replyToId = params.replyToId.trim();
    if (!replyToId) {
        return null;
    }
    var cached = blueBubblesReplyCacheByMessageId.get(replyToId);
    if (!cached) {
        return null;
    }
    if (cached.accountId !== params.accountId) {
        return null;
    }
    var cutoff = Date.now() - REPLY_CACHE_TTL_MS;
    if (cached.timestamp < cutoff) {
        blueBubblesReplyCacheByMessageId.delete(replyToId);
        return null;
    }
    var chatGuid = trimOrUndefined(params.chatGuid);
    var chatIdentifier = trimOrUndefined(params.chatIdentifier);
    var cachedChatGuid = trimOrUndefined(cached.chatGuid);
    var cachedChatIdentifier = trimOrUndefined(cached.chatIdentifier);
    var chatId = typeof params.chatId === "number" ? params.chatId : undefined;
    var cachedChatId = typeof cached.chatId === "number" ? cached.chatId : undefined;
    // Avoid cross-chat collisions if we have identifiers.
    if (chatGuid && cachedChatGuid && chatGuid !== cachedChatGuid) {
        return null;
    }
    if (!chatGuid &&
        chatIdentifier &&
        cachedChatIdentifier &&
        chatIdentifier !== cachedChatIdentifier) {
        return null;
    }
    if (!chatGuid && !chatIdentifier && chatId && cachedChatId && chatId !== cachedChatId) {
        return null;
    }
    return cached;
}
function logVerbose(core, runtime, message) {
    var _a;
    if (core.logging.shouldLogVerbose()) {
        (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[bluebubbles] ".concat(message));
    }
}
function logGroupAllowlistHint(params) {
    var _a;
    var log = (_a = params.runtime.log) !== null && _a !== void 0 ? _a : console.log;
    var nameHint = params.chatName ? " (group name: ".concat(params.chatName, ")") : "";
    var accountHint = params.accountId
        ? " (or channels.bluebubbles.accounts.".concat(params.accountId, ".groupAllowFrom)")
        : "";
    if (params.entry) {
        log("[bluebubbles] group message blocked (".concat(params.reason, "). Allow this group by adding ") +
            "\"".concat(params.entry, "\" to channels.bluebubbles.groupAllowFrom").concat(nameHint, "."));
        log("[bluebubbles] add to config: channels.bluebubbles.groupAllowFrom=[\"".concat(params.entry, "\"]").concat(accountHint, "."));
        return;
    }
    log("[bluebubbles] group message blocked (".concat(params.reason, "). Allow groups by setting ") +
        "channels.bluebubbles.groupPolicy=\"open\" or adding a group id to " +
        "channels.bluebubbles.groupAllowFrom".concat(accountHint).concat(nameHint, "."));
}
/**
 * Default debounce window for inbound message coalescing (ms).
 * This helps combine URL text + link preview balloon messages that BlueBubbles
 * sends as separate webhook events when no explicit inbound debounce config exists.
 */
var DEFAULT_INBOUND_DEBOUNCE_MS = 500;
/**
 * Combines multiple debounced messages into a single message for processing.
 * Used when multiple webhook events arrive within the debounce window.
 */
function combineDebounceEntries(entries) {
    var _a, _b, _c, _d;
    if (entries.length === 0) {
        throw new Error("Cannot combine empty entries");
    }
    if (entries.length === 1) {
        return entries[0].message;
    }
    // Use the first message as the base (typically the text message)
    var first = entries[0].message;
    // Combine text from all entries, filtering out duplicates and empty strings
    var seenTexts = new Set();
    var textParts = [];
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var text = entry.message.text.trim();
        if (!text) {
            continue;
        }
        // Skip duplicate text (URL might be in both text message and balloon)
        var normalizedText = text.toLowerCase();
        if (seenTexts.has(normalizedText)) {
            continue;
        }
        seenTexts.add(normalizedText);
        textParts.push(text);
    }
    // Merge attachments from all entries
    var allAttachments = entries.flatMap(function (e) { var _a; return (_a = e.message.attachments) !== null && _a !== void 0 ? _a : []; });
    // Use the latest timestamp
    var timestamps = entries
        .map(function (e) { return e.message.timestamp; })
        .filter(function (t) { return typeof t === "number"; });
    var latestTimestamp = timestamps.length > 0 ? Math.max.apply(Math, timestamps) : first.timestamp;
    // Collect all message IDs for reference
    var messageIds = entries
        .map(function (e) { return e.message.messageId; })
        .filter(function (id) { return Boolean(id); });
    // Prefer reply context from any entry that has it
    var entryWithReply = entries.find(function (e) { return e.message.replyToId; });
    return __assign(__assign({}, first), { text: textParts.join(" "), attachments: allAttachments.length > 0 ? allAttachments : first.attachments, timestamp: latestTimestamp, 
        // Use first message's ID as primary (for reply reference), but we've coalesced others
        messageId: (_a = messageIds[0]) !== null && _a !== void 0 ? _a : first.messageId, 
        // Preserve reply context if present
        replyToId: (_b = entryWithReply === null || entryWithReply === void 0 ? void 0 : entryWithReply.message.replyToId) !== null && _b !== void 0 ? _b : first.replyToId, replyToBody: (_c = entryWithReply === null || entryWithReply === void 0 ? void 0 : entryWithReply.message.replyToBody) !== null && _c !== void 0 ? _c : first.replyToBody, replyToSender: (_d = entryWithReply === null || entryWithReply === void 0 ? void 0 : entryWithReply.message.replyToSender) !== null && _d !== void 0 ? _d : first.replyToSender, 
        // Clear balloonBundleId since we've combined (the combined message is no longer just a balloon)
        balloonBundleId: undefined });
}
var webhookTargets = new Map();
/**
 * Maps webhook targets to their inbound debouncers.
 * Each target gets its own debouncer keyed by a unique identifier.
 */
var targetDebouncers = new Map();
function resolveBlueBubblesDebounceMs(config, core) {
    var _a, _b;
    var inbound = (_a = config.messages) === null || _a === void 0 ? void 0 : _a.inbound;
    var hasExplicitDebounce = typeof (inbound === null || inbound === void 0 ? void 0 : inbound.debounceMs) === "number" || typeof ((_b = inbound === null || inbound === void 0 ? void 0 : inbound.byChannel) === null || _b === void 0 ? void 0 : _b.bluebubbles) === "number";
    if (!hasExplicitDebounce) {
        return DEFAULT_INBOUND_DEBOUNCE_MS;
    }
    return core.channel.debounce.resolveInboundDebounceMs({ cfg: config, channel: "bluebubbles" });
}
/**
 * Creates or retrieves a debouncer for a webhook target.
 */
function getOrCreateDebouncer(target) {
    var _this = this;
    var existing = targetDebouncers.get(target);
    if (existing) {
        return existing;
    }
    var account = target.account, config = target.config, runtime = target.runtime, core = target.core;
    var debouncer = core.channel.debounce.createInboundDebouncer({
        debounceMs: resolveBlueBubblesDebounceMs(config, core),
        buildKey: function (entry) {
            var _a, _b, _c, _d, _e, _f, _g;
            var msg = entry.message;
            // Prefer stable, shared identifiers to coalesce rapid-fire webhook events for the
            // same message (e.g., text-only then text+attachment).
            //
            // For balloons (URL previews, stickers, etc), BlueBubbles often uses a different
            // messageId than the originating text. When present, key by associatedMessageGuid
            // to keep text + balloon coalescing working.
            var balloonBundleId = (_a = msg.balloonBundleId) === null || _a === void 0 ? void 0 : _a.trim();
            var associatedMessageGuid = (_b = msg.associatedMessageGuid) === null || _b === void 0 ? void 0 : _b.trim();
            if (balloonBundleId && associatedMessageGuid) {
                return "bluebubbles:".concat(account.accountId, ":balloon:").concat(associatedMessageGuid);
            }
            var messageId = (_c = msg.messageId) === null || _c === void 0 ? void 0 : _c.trim();
            if (messageId) {
                return "bluebubbles:".concat(account.accountId, ":msg:").concat(messageId);
            }
            var chatKey = (_g = (_e = (_d = msg.chatGuid) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : (_f = msg.chatIdentifier) === null || _f === void 0 ? void 0 : _f.trim()) !== null && _g !== void 0 ? _g : (msg.chatId ? String(msg.chatId) : "dm");
            return "bluebubbles:".concat(account.accountId, ":").concat(chatKey, ":").concat(msg.senderId);
        },
        shouldDebounce: function (entry) {
            var msg = entry.message;
            // Skip debouncing for from-me messages (they're just cached, not processed)
            if (msg.fromMe) {
                return false;
            }
            // Skip debouncing for control commands - process immediately
            if (core.channel.text.hasControlCommand(msg.text, config)) {
                return false;
            }
            // Debounce all other messages to coalesce rapid-fire webhook events
            // (e.g., text+image arriving as separate webhooks for the same messageId)
            return true;
        },
        onFlush: function (entries) { return __awaiter(_this, void 0, void 0, function () {
            var flushTarget, combined, count, preview;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (entries.length === 0) {
                            return [2 /*return*/];
                        }
                        flushTarget = entries[0].target;
                        if (!(entries.length === 1)) return [3 /*break*/, 2];
                        // Single message - process normally
                        return [4 /*yield*/, processMessage(entries[0].message, flushTarget)];
                    case 1:
                        // Single message - process normally
                        _b.sent();
                        return [2 /*return*/];
                    case 2:
                        combined = combineDebounceEntries(entries);
                        if (core.logging.shouldLogVerbose()) {
                            count = entries.length;
                            preview = combined.text.slice(0, 50);
                            (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[bluebubbles] coalesced ".concat(count, " messages: \"").concat(preview).concat(combined.text.length > 50 ? "..." : "", "\""));
                        }
                        return [4 /*yield*/, processMessage(combined, flushTarget)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onError: function (err) {
            var _a;
            (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[".concat(account.accountId, "] [bluebubbles] debounce flush failed: ").concat(String(err)));
        },
    });
    targetDebouncers.set(target, debouncer);
    return debouncer;
}
/**
 * Removes a debouncer for a target (called during unregistration).
 */
function removeDebouncer(target) {
    targetDebouncers.delete(target);
}
function normalizeWebhookPath(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return "/";
    }
    var withSlash = trimmed.startsWith("/") ? trimmed : "/".concat(trimmed);
    if (withSlash.length > 1 && withSlash.endsWith("/")) {
        return withSlash.slice(0, -1);
    }
    return withSlash;
}
function registerBlueBubblesWebhookTarget(target) {
    var _a;
    var key = normalizeWebhookPath(target.path);
    var normalizedTarget = __assign(__assign({}, target), { path: key });
    var existing = (_a = webhookTargets.get(key)) !== null && _a !== void 0 ? _a : [];
    var next = __spreadArray(__spreadArray([], existing, true), [normalizedTarget], false);
    webhookTargets.set(key, next);
    return function () {
        var _a;
        var updated = ((_a = webhookTargets.get(key)) !== null && _a !== void 0 ? _a : []).filter(function (entry) { return entry !== normalizedTarget; });
        if (updated.length > 0) {
            webhookTargets.set(key, updated);
        }
        else {
            webhookTargets.delete(key);
        }
        // Clean up debouncer when target is unregistered
        removeDebouncer(normalizedTarget);
    };
}
function readJsonBody(req, maxBytes) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunks = [];
                    total = 0;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            req.on("data", function (chunk) {
                                total += chunk.length;
                                if (total > maxBytes) {
                                    resolve({ ok: false, error: "payload too large" });
                                    req.destroy();
                                    return;
                                }
                                chunks.push(chunk);
                            });
                            req.on("end", function () {
                                var _a, _b;
                                try {
                                    var raw = Buffer.concat(chunks).toString("utf8");
                                    if (!raw.trim()) {
                                        resolve({ ok: false, error: "empty payload" });
                                        return;
                                    }
                                    try {
                                        resolve({ ok: true, value: JSON.parse(raw) });
                                        return;
                                    }
                                    catch (_c) {
                                        var params = new URLSearchParams(raw);
                                        var payload = (_b = (_a = params.get("payload")) !== null && _a !== void 0 ? _a : params.get("data")) !== null && _b !== void 0 ? _b : params.get("message");
                                        if (payload) {
                                            resolve({ ok: true, value: JSON.parse(payload) });
                                            return;
                                        }
                                        throw new Error("invalid json");
                                    }
                                }
                                catch (err) {
                                    resolve({ ok: false, error: err instanceof Error ? err.message : String(err) });
                                }
                            });
                            req.on("error", function (err) {
                                resolve({ ok: false, error: err instanceof Error ? err.message : String(err) });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function asRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : null;
}
function readString(record, key) {
    if (!record) {
        return undefined;
    }
    var value = record[key];
    return typeof value === "string" ? value : undefined;
}
function readNumber(record, key) {
    if (!record) {
        return undefined;
    }
    var value = record[key];
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function readBoolean(record, key) {
    if (!record) {
        return undefined;
    }
    var value = record[key];
    return typeof value === "boolean" ? value : undefined;
}
function extractAttachments(message) {
    var _a, _b, _c, _d;
    var raw = message["attachments"];
    if (!Array.isArray(raw)) {
        return [];
    }
    var out = [];
    for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
        var entry = raw_1[_i];
        var record = asRecord(entry);
        if (!record) {
            continue;
        }
        out.push({
            guid: readString(record, "guid"),
            uti: readString(record, "uti"),
            mimeType: (_a = readString(record, "mimeType")) !== null && _a !== void 0 ? _a : readString(record, "mime_type"),
            transferName: (_b = readString(record, "transferName")) !== null && _b !== void 0 ? _b : readString(record, "transfer_name"),
            totalBytes: (_c = readNumberLike(record, "totalBytes")) !== null && _c !== void 0 ? _c : readNumberLike(record, "total_bytes"),
            height: readNumberLike(record, "height"),
            width: readNumberLike(record, "width"),
            originalROWID: (_d = readNumberLike(record, "originalROWID")) !== null && _d !== void 0 ? _d : readNumberLike(record, "rowid"),
        });
    }
    return out;
}
function buildAttachmentPlaceholder(attachments) {
    if (attachments.length === 0) {
        return "";
    }
    var mimeTypes = attachments.map(function (entry) { var _a; return (_a = entry.mimeType) !== null && _a !== void 0 ? _a : ""; });
    var allImages = mimeTypes.every(function (entry) { return entry.startsWith("image/"); });
    var allVideos = mimeTypes.every(function (entry) { return entry.startsWith("video/"); });
    var allAudio = mimeTypes.every(function (entry) { return entry.startsWith("audio/"); });
    var tag = allImages
        ? "<media:image>"
        : allVideos
            ? "<media:video>"
            : allAudio
                ? "<media:audio>"
                : "<media:attachment>";
    var label = allImages ? "image" : allVideos ? "video" : allAudio ? "audio" : "file";
    var suffix = attachments.length === 1 ? label : "".concat(label, "s");
    return "".concat(tag, " (").concat(attachments.length, " ").concat(suffix, ")");
}
function buildMessagePlaceholder(message) {
    var _a;
    var attachmentPlaceholder = buildAttachmentPlaceholder((_a = message.attachments) !== null && _a !== void 0 ? _a : []);
    if (attachmentPlaceholder) {
        return attachmentPlaceholder;
    }
    if (message.balloonBundleId) {
        return "<media:sticker>";
    }
    return "";
}
// Returns inline reply tag like "[[reply_to:4]]" for prepending to message body
function formatReplyTag(message) {
    // Prefer short ID
    var rawId = message.replyToShortId || message.replyToId;
    if (!rawId) {
        return null;
    }
    return "[[reply_to:".concat(rawId, "]]");
}
function readNumberLike(record, key) {
    if (!record) {
        return undefined;
    }
    var value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        var parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return undefined;
}
function extractReplyMetadata(message) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    var replyRaw = (_g = (_f = (_e = (_d = (_c = (_b = (_a = message["replyTo"]) !== null && _a !== void 0 ? _a : message["reply_to"]) !== null && _b !== void 0 ? _b : message["replyToMessage"]) !== null && _c !== void 0 ? _c : message["reply_to_message"]) !== null && _d !== void 0 ? _d : message["repliedMessage"]) !== null && _e !== void 0 ? _e : message["quotedMessage"]) !== null && _f !== void 0 ? _f : message["associatedMessage"]) !== null && _g !== void 0 ? _g : message["reply"];
    var replyRecord = asRecord(replyRaw);
    var replyHandle = (_j = (_h = asRecord(replyRecord === null || replyRecord === void 0 ? void 0 : replyRecord["handle"])) !== null && _h !== void 0 ? _h : asRecord(replyRecord === null || replyRecord === void 0 ? void 0 : replyRecord["sender"])) !== null && _j !== void 0 ? _j : null;
    var replySenderRaw = (_p = (_o = (_m = (_l = (_k = readString(replyHandle, "address")) !== null && _k !== void 0 ? _k : readString(replyHandle, "handle")) !== null && _l !== void 0 ? _l : readString(replyHandle, "id")) !== null && _m !== void 0 ? _m : readString(replyRecord, "senderId")) !== null && _o !== void 0 ? _o : readString(replyRecord, "sender")) !== null && _p !== void 0 ? _p : readString(replyRecord, "from");
    var normalizedSender = replySenderRaw
        ? (0, targets_js_1.normalizeBlueBubblesHandle)(replySenderRaw) || replySenderRaw.trim()
        : undefined;
    var replyToBody = (_t = (_s = (_r = (_q = readString(replyRecord, "text")) !== null && _q !== void 0 ? _q : readString(replyRecord, "body")) !== null && _r !== void 0 ? _r : readString(replyRecord, "message")) !== null && _s !== void 0 ? _s : readString(replyRecord, "subject")) !== null && _t !== void 0 ? _t : undefined;
    var directReplyId = (_2 = (_1 = (_0 = (_z = (_y = (_x = (_w = (_v = (_u = readString(message, "replyToMessageGuid")) !== null && _u !== void 0 ? _u : readString(message, "replyToGuid")) !== null && _v !== void 0 ? _v : readString(message, "replyGuid")) !== null && _w !== void 0 ? _w : readString(message, "selectedMessageGuid")) !== null && _x !== void 0 ? _x : readString(message, "selectedMessageId")) !== null && _y !== void 0 ? _y : readString(message, "replyToMessageId")) !== null && _z !== void 0 ? _z : readString(message, "replyId")) !== null && _0 !== void 0 ? _0 : readString(replyRecord, "guid")) !== null && _1 !== void 0 ? _1 : readString(replyRecord, "id")) !== null && _2 !== void 0 ? _2 : readString(replyRecord, "messageId");
    var associatedType = (_3 = readNumberLike(message, "associatedMessageType")) !== null && _3 !== void 0 ? _3 : readNumberLike(message, "associated_message_type");
    var associatedGuid = (_5 = (_4 = readString(message, "associatedMessageGuid")) !== null && _4 !== void 0 ? _4 : readString(message, "associated_message_guid")) !== null && _5 !== void 0 ? _5 : readString(message, "associatedMessageId");
    var isReactionAssociation = typeof associatedType === "number" && REACTION_TYPE_MAP.has(associatedType);
    var replyToId = directReplyId !== null && directReplyId !== void 0 ? directReplyId : (!isReactionAssociation ? associatedGuid : undefined);
    var threadOriginatorGuid = readString(message, "threadOriginatorGuid");
    var messageGuid = readString(message, "guid");
    var fallbackReplyId = !replyToId && threadOriginatorGuid && threadOriginatorGuid !== messageGuid
        ? threadOriginatorGuid
        : undefined;
    return {
        replyToId: ((_6 = (replyToId !== null && replyToId !== void 0 ? replyToId : fallbackReplyId)) === null || _6 === void 0 ? void 0 : _6.trim()) || undefined,
        replyToBody: (replyToBody === null || replyToBody === void 0 ? void 0 : replyToBody.trim()) || undefined,
        replyToSender: normalizedSender || undefined,
    };
}
function readFirstChatRecord(message) {
    var chats = message["chats"];
    if (!Array.isArray(chats) || chats.length === 0) {
        return null;
    }
    var first = chats[0];
    return asRecord(first);
}
function normalizeParticipantEntry(entry) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (typeof entry === "string" || typeof entry === "number") {
        var raw = String(entry).trim();
        if (!raw) {
            return null;
        }
        var normalized = (0, targets_js_1.normalizeBlueBubblesHandle)(raw) || raw;
        return normalized ? { id: normalized } : null;
    }
    var record = asRecord(entry);
    if (!record) {
        return null;
    }
    var nestedHandle = (_c = (_b = (_a = asRecord(record["handle"])) !== null && _a !== void 0 ? _a : asRecord(record["sender"])) !== null && _b !== void 0 ? _b : asRecord(record["contact"])) !== null && _c !== void 0 ? _c : null;
    var idRaw = (_l = (_k = (_j = (_h = (_g = (_f = (_e = (_d = readString(record, "address")) !== null && _d !== void 0 ? _d : readString(record, "handle")) !== null && _e !== void 0 ? _e : readString(record, "id")) !== null && _f !== void 0 ? _f : readString(record, "phoneNumber")) !== null && _g !== void 0 ? _g : readString(record, "phone_number")) !== null && _h !== void 0 ? _h : readString(record, "email")) !== null && _j !== void 0 ? _j : readString(nestedHandle, "address")) !== null && _k !== void 0 ? _k : readString(nestedHandle, "handle")) !== null && _l !== void 0 ? _l : readString(nestedHandle, "id");
    var nameRaw = (_q = (_p = (_o = (_m = readString(record, "displayName")) !== null && _m !== void 0 ? _m : readString(record, "name")) !== null && _o !== void 0 ? _o : readString(record, "title")) !== null && _p !== void 0 ? _p : readString(nestedHandle, "displayName")) !== null && _q !== void 0 ? _q : readString(nestedHandle, "name");
    var normalizedId = idRaw ? (0, targets_js_1.normalizeBlueBubblesHandle)(idRaw) || idRaw.trim() : "";
    if (!normalizedId) {
        return null;
    }
    var name = (nameRaw === null || nameRaw === void 0 ? void 0 : nameRaw.trim()) || undefined;
    return { id: normalizedId, name: name };
}
function normalizeParticipantList(raw) {
    if (!Array.isArray(raw) || raw.length === 0) {
        return [];
    }
    var seen = new Set();
    var output = [];
    for (var _i = 0, raw_2 = raw; _i < raw_2.length; _i++) {
        var entry = raw_2[_i];
        var normalized = normalizeParticipantEntry(entry);
        if (!(normalized === null || normalized === void 0 ? void 0 : normalized.id)) {
            continue;
        }
        var key = normalized.id.toLowerCase();
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        output.push(normalized);
    }
    return output;
}
function formatGroupMembers(params) {
    var _a, _b;
    var seen = new Set();
    var ordered = [];
    for (var _i = 0, _c = (_a = params.participants) !== null && _a !== void 0 ? _a : []; _i < _c.length; _i++) {
        var entry = _c[_i];
        if (!(entry === null || entry === void 0 ? void 0 : entry.id)) {
            continue;
        }
        var key = entry.id.toLowerCase();
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        ordered.push(entry);
    }
    if (ordered.length === 0 && ((_b = params.fallback) === null || _b === void 0 ? void 0 : _b.id)) {
        ordered.push(params.fallback);
    }
    if (ordered.length === 0) {
        return undefined;
    }
    return ordered.map(function (entry) { return (entry.name ? "".concat(entry.name, " (").concat(entry.id, ")") : entry.id); }).join(", ");
}
function resolveGroupFlagFromChatGuid(chatGuid) {
    var guid = chatGuid === null || chatGuid === void 0 ? void 0 : chatGuid.trim();
    if (!guid) {
        return undefined;
    }
    var parts = guid.split(";");
    if (parts.length >= 3) {
        if (parts[1] === "+") {
            return true;
        }
        if (parts[1] === "-") {
            return false;
        }
    }
    if (guid.includes(";+;")) {
        return true;
    }
    if (guid.includes(";-;")) {
        return false;
    }
    return undefined;
}
function extractChatIdentifierFromChatGuid(chatGuid) {
    var _a;
    var guid = chatGuid === null || chatGuid === void 0 ? void 0 : chatGuid.trim();
    if (!guid) {
        return undefined;
    }
    var parts = guid.split(";");
    if (parts.length < 3) {
        return undefined;
    }
    var identifier = (_a = parts[2]) === null || _a === void 0 ? void 0 : _a.trim();
    return identifier || undefined;
}
function formatGroupAllowlistEntry(params) {
    var _a, _b;
    var guid = (_a = params.chatGuid) === null || _a === void 0 ? void 0 : _a.trim();
    if (guid) {
        return "chat_guid:".concat(guid);
    }
    var chatId = params.chatId;
    if (typeof chatId === "number" && Number.isFinite(chatId)) {
        return "chat_id:".concat(chatId);
    }
    var identifier = (_b = params.chatIdentifier) === null || _b === void 0 ? void 0 : _b.trim();
    if (identifier) {
        return "chat_identifier:".concat(identifier);
    }
    return null;
}
var REACTION_TYPE_MAP = new Map([
    [2000, { emoji: "❤️", action: "added" }],
    [2001, { emoji: "👍", action: "added" }],
    [2002, { emoji: "👎", action: "added" }],
    [2003, { emoji: "😂", action: "added" }],
    [2004, { emoji: "‼️", action: "added" }],
    [2005, { emoji: "❓", action: "added" }],
    [3000, { emoji: "❤️", action: "removed" }],
    [3001, { emoji: "👍", action: "removed" }],
    [3002, { emoji: "👎", action: "removed" }],
    [3003, { emoji: "😂", action: "removed" }],
    [3004, { emoji: "‼️", action: "removed" }],
    [3005, { emoji: "❓", action: "removed" }],
]);
// Maps tapback text patterns (e.g., "Loved", "Liked") to emoji + action
var TAPBACK_TEXT_MAP = new Map([
    ["loved", { emoji: "❤️", action: "added" }],
    ["liked", { emoji: "👍", action: "added" }],
    ["disliked", { emoji: "👎", action: "added" }],
    ["laughed at", { emoji: "😂", action: "added" }],
    ["emphasized", { emoji: "‼️", action: "added" }],
    ["questioned", { emoji: "❓", action: "added" }],
    // Removal patterns (e.g., "Removed a heart from")
    ["removed a heart from", { emoji: "❤️", action: "removed" }],
    ["removed a like from", { emoji: "👍", action: "removed" }],
    ["removed a dislike from", { emoji: "👎", action: "removed" }],
    ["removed a laugh from", { emoji: "😂", action: "removed" }],
    ["removed an emphasis from", { emoji: "‼️", action: "removed" }],
    ["removed a question from", { emoji: "❓", action: "removed" }],
]);
var TAPBACK_EMOJI_REGEX = /(?:\p{Regional_Indicator}{2})|(?:[0-9#*]\uFE0F?\u20E3)|(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?)*)/u;
function extractFirstEmoji(text) {
    var match = text.match(TAPBACK_EMOJI_REGEX);
    return match ? match[0] : null;
}
function extractQuotedTapbackText(text) {
    var match = text.match(/[“"]([^”"]+)[”"]/s);
    return match ? match[1] : null;
}
function isTapbackAssociatedType(type) {
    return typeof type === "number" && Number.isFinite(type) && type >= 2000 && type < 4000;
}
function resolveTapbackActionHint(type) {
    if (typeof type !== "number" || !Number.isFinite(type)) {
        return undefined;
    }
    if (type >= 3000 && type < 4000) {
        return "removed";
    }
    if (type >= 2000 && type < 3000) {
        return "added";
    }
    return undefined;
}
function resolveTapbackContext(message) {
    var _a, _b, _c, _d;
    var associatedType = message.associatedMessageType;
    var hasTapbackType = isTapbackAssociatedType(associatedType);
    var hasTapbackMarker = Boolean(message.associatedMessageEmoji) || Boolean(message.isTapback);
    if (!hasTapbackType && !hasTapbackMarker) {
        return null;
    }
    var replyToId = ((_a = message.associatedMessageGuid) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = message.replyToId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
    var actionHint = resolveTapbackActionHint(associatedType);
    var emojiHint = ((_c = message.associatedMessageEmoji) === null || _c === void 0 ? void 0 : _c.trim()) || ((_d = REACTION_TYPE_MAP.get(associatedType !== null && associatedType !== void 0 ? associatedType : -1)) === null || _d === void 0 ? void 0 : _d.emoji);
    return { emojiHint: emojiHint, actionHint: actionHint, replyToId: replyToId };
}
// Detects tapback text patterns like 'Loved "message"' and converts to structured format
function parseTapbackText(params) {
    var _a, _b, _c, _d, _e, _f;
    var trimmed = params.text.trim();
    var lower = trimmed.toLowerCase();
    if (!trimmed) {
        return null;
    }
    for (var _i = 0, TAPBACK_TEXT_MAP_1 = TAPBACK_TEXT_MAP; _i < TAPBACK_TEXT_MAP_1.length; _i++) {
        var _g = TAPBACK_TEXT_MAP_1[_i], pattern = _g[0], _h = _g[1], emoji = _h.emoji, action = _h.action;
        if (lower.startsWith(pattern)) {
            // Extract quoted text if present (e.g., 'Loved "hello"' -> "hello")
            var afterPattern = trimmed.slice(pattern.length).trim();
            if (params.requireQuoted) {
                var strictMatch = afterPattern.match(/^[“"](.+)[”"]$/s);
                if (!strictMatch) {
                    return null;
                }
                return { emoji: emoji, action: action, quotedText: strictMatch[1] };
            }
            var quotedText = (_b = (_a = extractQuotedTapbackText(afterPattern)) !== null && _a !== void 0 ? _a : extractQuotedTapbackText(trimmed)) !== null && _b !== void 0 ? _b : afterPattern;
            return { emoji: emoji, action: action, quotedText: quotedText };
        }
    }
    if (lower.startsWith("reacted")) {
        var emoji = (_c = extractFirstEmoji(trimmed)) !== null && _c !== void 0 ? _c : params.emojiHint;
        if (!emoji) {
            return null;
        }
        var quotedText = extractQuotedTapbackText(trimmed);
        if (params.requireQuoted && !quotedText) {
            return null;
        }
        var fallback = trimmed.slice("reacted".length).trim();
        return { emoji: emoji, action: (_d = params.actionHint) !== null && _d !== void 0 ? _d : "added", quotedText: quotedText !== null && quotedText !== void 0 ? quotedText : fallback };
    }
    if (lower.startsWith("removed")) {
        var emoji = (_e = extractFirstEmoji(trimmed)) !== null && _e !== void 0 ? _e : params.emojiHint;
        if (!emoji) {
            return null;
        }
        var quotedText = extractQuotedTapbackText(trimmed);
        if (params.requireQuoted && !quotedText) {
            return null;
        }
        var fallback = trimmed.slice("removed".length).trim();
        return { emoji: emoji, action: (_f = params.actionHint) !== null && _f !== void 0 ? _f : "removed", quotedText: quotedText !== null && quotedText !== void 0 ? quotedText : fallback };
    }
    return null;
}
function maskSecret(value) {
    if (value.length <= 6) {
        return "***";
    }
    return "".concat(value.slice(0, 2), "***").concat(value.slice(-2));
}
function resolveBlueBubblesAckReaction(params) {
    var raw = (0, plugin_sdk_1.resolveAckReaction)(params.cfg, params.agentId).trim();
    if (!raw) {
        return null;
    }
    try {
        (0, reactions_js_1.normalizeBlueBubblesReactionInput)(raw);
        return raw;
    }
    catch (_a) {
        var key = raw.toLowerCase();
        if (!invalidAckReactions.has(key)) {
            invalidAckReactions.add(key);
            logVerbose(params.core, params.runtime, "ack reaction skipped (unsupported for BlueBubbles): ".concat(raw));
        }
        return null;
    }
}
function extractMessagePayload(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var dataRaw = (_b = (_a = payload.data) !== null && _a !== void 0 ? _a : payload.payload) !== null && _b !== void 0 ? _b : payload.event;
    var data = (_c = asRecord(dataRaw)) !== null && _c !== void 0 ? _c : (typeof dataRaw === "string" ? ((_d = asRecord(JSON.parse(dataRaw))) !== null && _d !== void 0 ? _d : null) : null);
    var messageRaw = (_f = (_e = payload.message) !== null && _e !== void 0 ? _e : data === null || data === void 0 ? void 0 : data.message) !== null && _f !== void 0 ? _f : data;
    var message = (_g = asRecord(messageRaw)) !== null && _g !== void 0 ? _g : (typeof messageRaw === "string" ? ((_h = asRecord(JSON.parse(messageRaw))) !== null && _h !== void 0 ? _h : null) : null);
    if (!message) {
        return null;
    }
    return message;
}
function normalizeWebhookMessage(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38;
    var message = extractMessagePayload(payload);
    if (!message) {
        return null;
    }
    var text = (_c = (_b = (_a = readString(message, "text")) !== null && _a !== void 0 ? _a : readString(message, "body")) !== null && _b !== void 0 ? _b : readString(message, "subject")) !== null && _c !== void 0 ? _c : "";
    var handleValue = (_d = message.handle) !== null && _d !== void 0 ? _d : message.sender;
    var handle = (_e = asRecord(handleValue)) !== null && _e !== void 0 ? _e : (typeof handleValue === "string" ? { address: handleValue } : null);
    var senderId = (_l = (_k = (_j = (_h = (_g = (_f = readString(handle, "address")) !== null && _f !== void 0 ? _f : readString(handle, "handle")) !== null && _g !== void 0 ? _g : readString(handle, "id")) !== null && _h !== void 0 ? _h : readString(message, "senderId")) !== null && _j !== void 0 ? _j : readString(message, "sender")) !== null && _k !== void 0 ? _k : readString(message, "from")) !== null && _l !== void 0 ? _l : "";
    var senderName = (_p = (_o = (_m = readString(handle, "displayName")) !== null && _m !== void 0 ? _m : readString(handle, "name")) !== null && _o !== void 0 ? _o : readString(message, "senderName")) !== null && _p !== void 0 ? _p : undefined;
    var chat = (_r = (_q = asRecord(message.chat)) !== null && _q !== void 0 ? _q : asRecord(message.conversation)) !== null && _r !== void 0 ? _r : null;
    var chatFromList = readFirstChatRecord(message);
    var chatGuid = (_y = (_x = (_w = (_v = (_u = (_t = (_s = readString(message, "chatGuid")) !== null && _s !== void 0 ? _s : readString(message, "chat_guid")) !== null && _t !== void 0 ? _t : readString(chat, "chatGuid")) !== null && _u !== void 0 ? _u : readString(chat, "chat_guid")) !== null && _v !== void 0 ? _v : readString(chat, "guid")) !== null && _w !== void 0 ? _w : readString(chatFromList, "chatGuid")) !== null && _x !== void 0 ? _x : readString(chatFromList, "chat_guid")) !== null && _y !== void 0 ? _y : readString(chatFromList, "guid");
    var chatIdentifier = (_6 = (_5 = (_4 = (_3 = (_2 = (_1 = (_0 = (_z = readString(message, "chatIdentifier")) !== null && _z !== void 0 ? _z : readString(message, "chat_identifier")) !== null && _0 !== void 0 ? _0 : readString(chat, "chatIdentifier")) !== null && _1 !== void 0 ? _1 : readString(chat, "chat_identifier")) !== null && _2 !== void 0 ? _2 : readString(chat, "identifier")) !== null && _3 !== void 0 ? _3 : readString(chatFromList, "chatIdentifier")) !== null && _4 !== void 0 ? _4 : readString(chatFromList, "chat_identifier")) !== null && _5 !== void 0 ? _5 : readString(chatFromList, "identifier")) !== null && _6 !== void 0 ? _6 : extractChatIdentifierFromChatGuid(chatGuid);
    var chatId = (_13 = (_12 = (_11 = (_10 = (_9 = (_8 = (_7 = readNumberLike(message, "chatId")) !== null && _7 !== void 0 ? _7 : readNumberLike(message, "chat_id")) !== null && _8 !== void 0 ? _8 : readNumberLike(chat, "chatId")) !== null && _9 !== void 0 ? _9 : readNumberLike(chat, "chat_id")) !== null && _10 !== void 0 ? _10 : readNumberLike(chat, "id")) !== null && _11 !== void 0 ? _11 : readNumberLike(chatFromList, "chatId")) !== null && _12 !== void 0 ? _12 : readNumberLike(chatFromList, "chat_id")) !== null && _13 !== void 0 ? _13 : readNumberLike(chatFromList, "id");
    var chatName = (_18 = (_17 = (_16 = (_15 = (_14 = readString(message, "chatName")) !== null && _14 !== void 0 ? _14 : readString(chat, "displayName")) !== null && _15 !== void 0 ? _15 : readString(chat, "name")) !== null && _16 !== void 0 ? _16 : readString(chatFromList, "displayName")) !== null && _17 !== void 0 ? _17 : readString(chatFromList, "name")) !== null && _18 !== void 0 ? _18 : undefined;
    var chatParticipants = chat ? chat["participants"] : undefined;
    var messageParticipants = message["participants"];
    var chatsParticipants = chatFromList ? chatFromList["participants"] : undefined;
    var participants = Array.isArray(chatParticipants)
        ? chatParticipants
        : Array.isArray(messageParticipants)
            ? messageParticipants
            : Array.isArray(chatsParticipants)
                ? chatsParticipants
                : [];
    var normalizedParticipants = normalizeParticipantList(participants);
    var participantsCount = participants.length;
    var groupFromChatGuid = resolveGroupFlagFromChatGuid(chatGuid);
    var explicitIsGroup = (_21 = (_20 = (_19 = readBoolean(message, "isGroup")) !== null && _19 !== void 0 ? _19 : readBoolean(message, "is_group")) !== null && _20 !== void 0 ? _20 : readBoolean(chat, "isGroup")) !== null && _21 !== void 0 ? _21 : readBoolean(message, "group");
    var isGroup = typeof groupFromChatGuid === "boolean"
        ? groupFromChatGuid
        : (explicitIsGroup !== null && explicitIsGroup !== void 0 ? explicitIsGroup : participantsCount > 2);
    var fromMe = (_22 = readBoolean(message, "isFromMe")) !== null && _22 !== void 0 ? _22 : readBoolean(message, "is_from_me");
    var messageId = (_25 = (_24 = (_23 = readString(message, "guid")) !== null && _23 !== void 0 ? _23 : readString(message, "id")) !== null && _24 !== void 0 ? _24 : readString(message, "messageId")) !== null && _25 !== void 0 ? _25 : undefined;
    var balloonBundleId = readString(message, "balloonBundleId");
    var associatedMessageGuid = (_28 = (_27 = (_26 = readString(message, "associatedMessageGuid")) !== null && _26 !== void 0 ? _26 : readString(message, "associated_message_guid")) !== null && _27 !== void 0 ? _27 : readString(message, "associatedMessageId")) !== null && _28 !== void 0 ? _28 : undefined;
    var associatedMessageType = (_29 = readNumberLike(message, "associatedMessageType")) !== null && _29 !== void 0 ? _29 : readNumberLike(message, "associated_message_type");
    var associatedMessageEmoji = (_33 = (_32 = (_31 = (_30 = readString(message, "associatedMessageEmoji")) !== null && _30 !== void 0 ? _30 : readString(message, "associated_message_emoji")) !== null && _31 !== void 0 ? _31 : readString(message, "reactionEmoji")) !== null && _32 !== void 0 ? _32 : readString(message, "reaction_emoji")) !== null && _33 !== void 0 ? _33 : undefined;
    var isTapback = (_36 = (_35 = (_34 = readBoolean(message, "isTapback")) !== null && _34 !== void 0 ? _34 : readBoolean(message, "is_tapback")) !== null && _35 !== void 0 ? _35 : readBoolean(message, "tapback")) !== null && _36 !== void 0 ? _36 : undefined;
    var timestampRaw = (_38 = (_37 = readNumber(message, "date")) !== null && _37 !== void 0 ? _37 : readNumber(message, "dateCreated")) !== null && _38 !== void 0 ? _38 : readNumber(message, "timestamp");
    var timestamp = typeof timestampRaw === "number"
        ? timestampRaw > 1000000000000
            ? timestampRaw
            : timestampRaw * 1000
        : undefined;
    var normalizedSender = (0, targets_js_1.normalizeBlueBubblesHandle)(senderId);
    if (!normalizedSender) {
        return null;
    }
    var replyMetadata = extractReplyMetadata(message);
    return {
        text: text,
        senderId: normalizedSender,
        senderName: senderName,
        messageId: messageId,
        timestamp: timestamp,
        isGroup: isGroup,
        chatId: chatId,
        chatGuid: chatGuid,
        chatIdentifier: chatIdentifier,
        chatName: chatName,
        fromMe: fromMe,
        attachments: extractAttachments(message),
        balloonBundleId: balloonBundleId,
        associatedMessageGuid: associatedMessageGuid,
        associatedMessageType: associatedMessageType,
        associatedMessageEmoji: associatedMessageEmoji,
        isTapback: isTapback,
        participants: normalizedParticipants,
        replyToId: replyMetadata.replyToId,
        replyToBody: replyMetadata.replyToBody,
        replyToSender: replyMetadata.replyToSender,
    };
}
function normalizeWebhookReaction(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30;
    var message = extractMessagePayload(payload);
    if (!message) {
        return null;
    }
    var associatedGuid = (_b = (_a = readString(message, "associatedMessageGuid")) !== null && _a !== void 0 ? _a : readString(message, "associated_message_guid")) !== null && _b !== void 0 ? _b : readString(message, "associatedMessageId");
    var associatedType = (_c = readNumberLike(message, "associatedMessageType")) !== null && _c !== void 0 ? _c : readNumberLike(message, "associated_message_type");
    if (!associatedGuid || associatedType === undefined) {
        return null;
    }
    var mapping = REACTION_TYPE_MAP.get(associatedType);
    var associatedEmoji = (_f = (_e = (_d = readString(message, "associatedMessageEmoji")) !== null && _d !== void 0 ? _d : readString(message, "associated_message_emoji")) !== null && _e !== void 0 ? _e : readString(message, "reactionEmoji")) !== null && _f !== void 0 ? _f : readString(message, "reaction_emoji");
    var emoji = (_g = ((associatedEmoji === null || associatedEmoji === void 0 ? void 0 : associatedEmoji.trim()) || (mapping === null || mapping === void 0 ? void 0 : mapping.emoji))) !== null && _g !== void 0 ? _g : "reaction:".concat(associatedType);
    var action = (_j = (_h = mapping === null || mapping === void 0 ? void 0 : mapping.action) !== null && _h !== void 0 ? _h : resolveTapbackActionHint(associatedType)) !== null && _j !== void 0 ? _j : "added";
    var handleValue = (_k = message.handle) !== null && _k !== void 0 ? _k : message.sender;
    var handle = (_l = asRecord(handleValue)) !== null && _l !== void 0 ? _l : (typeof handleValue === "string" ? { address: handleValue } : null);
    var senderId = (_s = (_r = (_q = (_p = (_o = (_m = readString(handle, "address")) !== null && _m !== void 0 ? _m : readString(handle, "handle")) !== null && _o !== void 0 ? _o : readString(handle, "id")) !== null && _p !== void 0 ? _p : readString(message, "senderId")) !== null && _q !== void 0 ? _q : readString(message, "sender")) !== null && _r !== void 0 ? _r : readString(message, "from")) !== null && _s !== void 0 ? _s : "";
    var senderName = (_v = (_u = (_t = readString(handle, "displayName")) !== null && _t !== void 0 ? _t : readString(handle, "name")) !== null && _u !== void 0 ? _u : readString(message, "senderName")) !== null && _v !== void 0 ? _v : undefined;
    var chat = (_x = (_w = asRecord(message.chat)) !== null && _w !== void 0 ? _w : asRecord(message.conversation)) !== null && _x !== void 0 ? _x : null;
    var chatFromList = readFirstChatRecord(message);
    var chatGuid = (_4 = (_3 = (_2 = (_1 = (_0 = (_z = (_y = readString(message, "chatGuid")) !== null && _y !== void 0 ? _y : readString(message, "chat_guid")) !== null && _z !== void 0 ? _z : readString(chat, "chatGuid")) !== null && _0 !== void 0 ? _0 : readString(chat, "chat_guid")) !== null && _1 !== void 0 ? _1 : readString(chat, "guid")) !== null && _2 !== void 0 ? _2 : readString(chatFromList, "chatGuid")) !== null && _3 !== void 0 ? _3 : readString(chatFromList, "chat_guid")) !== null && _4 !== void 0 ? _4 : readString(chatFromList, "guid");
    var chatIdentifier = (_12 = (_11 = (_10 = (_9 = (_8 = (_7 = (_6 = (_5 = readString(message, "chatIdentifier")) !== null && _5 !== void 0 ? _5 : readString(message, "chat_identifier")) !== null && _6 !== void 0 ? _6 : readString(chat, "chatIdentifier")) !== null && _7 !== void 0 ? _7 : readString(chat, "chat_identifier")) !== null && _8 !== void 0 ? _8 : readString(chat, "identifier")) !== null && _9 !== void 0 ? _9 : readString(chatFromList, "chatIdentifier")) !== null && _10 !== void 0 ? _10 : readString(chatFromList, "chat_identifier")) !== null && _11 !== void 0 ? _11 : readString(chatFromList, "identifier")) !== null && _12 !== void 0 ? _12 : extractChatIdentifierFromChatGuid(chatGuid);
    var chatId = (_19 = (_18 = (_17 = (_16 = (_15 = (_14 = (_13 = readNumberLike(message, "chatId")) !== null && _13 !== void 0 ? _13 : readNumberLike(message, "chat_id")) !== null && _14 !== void 0 ? _14 : readNumberLike(chat, "chatId")) !== null && _15 !== void 0 ? _15 : readNumberLike(chat, "chat_id")) !== null && _16 !== void 0 ? _16 : readNumberLike(chat, "id")) !== null && _17 !== void 0 ? _17 : readNumberLike(chatFromList, "chatId")) !== null && _18 !== void 0 ? _18 : readNumberLike(chatFromList, "chat_id")) !== null && _19 !== void 0 ? _19 : readNumberLike(chatFromList, "id");
    var chatName = (_24 = (_23 = (_22 = (_21 = (_20 = readString(message, "chatName")) !== null && _20 !== void 0 ? _20 : readString(chat, "displayName")) !== null && _21 !== void 0 ? _21 : readString(chat, "name")) !== null && _22 !== void 0 ? _22 : readString(chatFromList, "displayName")) !== null && _23 !== void 0 ? _23 : readString(chatFromList, "name")) !== null && _24 !== void 0 ? _24 : undefined;
    var chatParticipants = chat ? chat["participants"] : undefined;
    var messageParticipants = message["participants"];
    var chatsParticipants = chatFromList ? chatFromList["participants"] : undefined;
    var participants = Array.isArray(chatParticipants)
        ? chatParticipants
        : Array.isArray(messageParticipants)
            ? messageParticipants
            : Array.isArray(chatsParticipants)
                ? chatsParticipants
                : [];
    var participantsCount = participants.length;
    var groupFromChatGuid = resolveGroupFlagFromChatGuid(chatGuid);
    var explicitIsGroup = (_27 = (_26 = (_25 = readBoolean(message, "isGroup")) !== null && _25 !== void 0 ? _25 : readBoolean(message, "is_group")) !== null && _26 !== void 0 ? _26 : readBoolean(chat, "isGroup")) !== null && _27 !== void 0 ? _27 : readBoolean(message, "group");
    var isGroup = typeof groupFromChatGuid === "boolean"
        ? groupFromChatGuid
        : (explicitIsGroup !== null && explicitIsGroup !== void 0 ? explicitIsGroup : participantsCount > 2);
    var fromMe = (_28 = readBoolean(message, "isFromMe")) !== null && _28 !== void 0 ? _28 : readBoolean(message, "is_from_me");
    var timestampRaw = (_30 = (_29 = readNumberLike(message, "date")) !== null && _29 !== void 0 ? _29 : readNumberLike(message, "dateCreated")) !== null && _30 !== void 0 ? _30 : readNumberLike(message, "timestamp");
    var timestamp = typeof timestampRaw === "number"
        ? timestampRaw > 1000000000000
            ? timestampRaw
            : timestampRaw * 1000
        : undefined;
    var normalizedSender = (0, targets_js_1.normalizeBlueBubblesHandle)(senderId);
    if (!normalizedSender) {
        return null;
    }
    return {
        action: action,
        emoji: emoji,
        senderId: normalizedSender,
        senderName: senderName,
        messageId: associatedGuid,
        timestamp: timestamp,
        isGroup: isGroup,
        chatId: chatId,
        chatGuid: chatGuid,
        chatIdentifier: chatIdentifier,
        chatName: chatName,
        fromMe: fromMe,
    };
}
function handleBlueBubblesWebhookRequest(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, path, targets, body, payload, firstTarget, eventTypeRaw, eventType, allowedEventTypes, reaction, message, matching, _loop_1, _i, matching_1, target;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://localhost");
                    path = normalizeWebhookPath(url.pathname);
                    targets = webhookTargets.get(path);
                    if (!targets || targets.length === 0) {
                        return [2 /*return*/, false];
                    }
                    if (req.method !== "POST") {
                        res.statusCode = 405;
                        res.setHeader("Allow", "POST");
                        res.end("Method Not Allowed");
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, readJsonBody(req, 1024 * 1024)];
                case 1:
                    body = _k.sent();
                    if (!body.ok) {
                        res.statusCode = body.error === "payload too large" ? 413 : 400;
                        res.end((_b = body.error) !== null && _b !== void 0 ? _b : "invalid payload");
                        console.warn("[bluebubbles] webhook rejected: ".concat((_c = body.error) !== null && _c !== void 0 ? _c : "invalid payload"));
                        return [2 /*return*/, true];
                    }
                    payload = (_d = asRecord(body.value)) !== null && _d !== void 0 ? _d : {};
                    firstTarget = targets[0];
                    if (firstTarget) {
                        logVerbose(firstTarget.core, firstTarget.runtime, "webhook received path=".concat(path, " keys=").concat(Object.keys(payload).join(",") || "none"));
                    }
                    eventTypeRaw = payload.type;
                    eventType = typeof eventTypeRaw === "string" ? eventTypeRaw.trim() : "";
                    allowedEventTypes = new Set([
                        "new-message",
                        "updated-message",
                        "message-reaction",
                        "reaction",
                    ]);
                    if (eventType && !allowedEventTypes.has(eventType)) {
                        res.statusCode = 200;
                        res.end("ok");
                        if (firstTarget) {
                            logVerbose(firstTarget.core, firstTarget.runtime, "webhook ignored type=".concat(eventType));
                        }
                        return [2 /*return*/, true];
                    }
                    reaction = normalizeWebhookReaction(payload);
                    if ((eventType === "updated-message" ||
                        eventType === "message-reaction" ||
                        eventType === "reaction") &&
                        !reaction) {
                        res.statusCode = 200;
                        res.end("ok");
                        if (firstTarget) {
                            logVerbose(firstTarget.core, firstTarget.runtime, "webhook ignored ".concat(eventType || "event", " without reaction"));
                        }
                        return [2 /*return*/, true];
                    }
                    message = reaction ? null : normalizeWebhookMessage(payload);
                    if (!message && !reaction) {
                        res.statusCode = 400;
                        res.end("invalid payload");
                        console.warn("[bluebubbles] webhook rejected: unable to parse message payload");
                        return [2 /*return*/, true];
                    }
                    matching = targets.filter(function (target) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        var token = (_a = target.account.config.password) === null || _a === void 0 ? void 0 : _a.trim();
                        if (!token) {
                            return true;
                        }
                        var guidParam = (_b = url.searchParams.get("guid")) !== null && _b !== void 0 ? _b : url.searchParams.get("password");
                        var headerToken = (_e = (_d = (_c = req.headers["x-guid"]) !== null && _c !== void 0 ? _c : req.headers["x-password"]) !== null && _d !== void 0 ? _d : req.headers["x-bluebubbles-guid"]) !== null && _e !== void 0 ? _e : req.headers["authorization"];
                        var guid = (_g = (_f = (Array.isArray(headerToken) ? headerToken[0] : headerToken)) !== null && _f !== void 0 ? _f : guidParam) !== null && _g !== void 0 ? _g : "";
                        if (guid && guid.trim() === token) {
                            return true;
                        }
                        var remote = (_j = (_h = req.socket) === null || _h === void 0 ? void 0 : _h.remoteAddress) !== null && _j !== void 0 ? _j : "";
                        if (remote === "127.0.0.1" || remote === "::1" || remote === "::ffff:127.0.0.1") {
                            return true;
                        }
                        return false;
                    });
                    if (matching.length === 0) {
                        res.statusCode = 401;
                        res.end("unauthorized");
                        console.warn("[bluebubbles] webhook rejected: unauthorized guid=".concat(maskSecret((_f = (_e = url.searchParams.get("guid")) !== null && _e !== void 0 ? _e : url.searchParams.get("password")) !== null && _f !== void 0 ? _f : "")));
                        return [2 /*return*/, true];
                    }
                    _loop_1 = function (target) {
                        (_g = target.statusSink) === null || _g === void 0 ? void 0 : _g.call(target, { lastInboundAt: Date.now() });
                        if (reaction) {
                            processReaction(reaction, target).catch(function (err) {
                                var _a, _b;
                                (_b = (_a = target.runtime).error) === null || _b === void 0 ? void 0 : _b.call(_a, "[".concat(target.account.accountId, "] BlueBubbles reaction failed: ").concat(String(err)));
                            });
                        }
                        else if (message) {
                            // Route messages through debouncer to coalesce rapid-fire events
                            // (e.g., text message + URL balloon arriving as separate webhooks)
                            var debouncer = getOrCreateDebouncer(target);
                            debouncer.enqueue({ message: message, target: target }).catch(function (err) {
                                var _a, _b;
                                (_b = (_a = target.runtime).error) === null || _b === void 0 ? void 0 : _b.call(_a, "[".concat(target.account.accountId, "] BlueBubbles webhook failed: ").concat(String(err)));
                            });
                        }
                    };
                    for (_i = 0, matching_1 = matching; _i < matching_1.length; _i++) {
                        target = matching_1[_i];
                        _loop_1(target);
                    }
                    res.statusCode = 200;
                    res.end("ok");
                    if (reaction) {
                        if (firstTarget) {
                            logVerbose(firstTarget.core, firstTarget.runtime, "webhook accepted reaction sender=".concat(reaction.senderId, " msg=").concat(reaction.messageId, " action=").concat(reaction.action));
                        }
                    }
                    else if (message) {
                        if (firstTarget) {
                            logVerbose(firstTarget.core, firstTarget.runtime, "webhook accepted sender=".concat(message.senderId, " group=").concat(message.isGroup, " chatGuid=").concat((_h = message.chatGuid) !== null && _h !== void 0 ? _h : "", " chatId=").concat((_j = message.chatId) !== null && _j !== void 0 ? _j : ""));
                        }
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function processMessage(message, target) {
    return __awaiter(this, void 0, void 0, function () {
        var account, config, runtime, core, statusSink, groupFlag, isGroup, text, attachments, placeholder, tapbackContext, tapbackParsed, isTapbackMessage, rawBody, cacheMessageId, messageShortId, cacheInboundMessage, dmPolicy, groupPolicy, configAllowFrom, configGroupAllowFrom, storeAllowFrom, effectiveAllowFrom, effectiveGroupAllowFrom, groupAllowEntry, groupName, allowed, allowed, _a, code, created, err_1, chatId, chatGuid, chatIdentifier, peerId, route, messageText, mentionRegexes, wasMentioned, canDetectMention, requireMention, useAccessGroups, hasControlCmd, ownerAllowedForCommands, groupAllowedForCommands, dmAuthorized, commandGate, commandAuthorized, shouldBypassMention, effectiveWasMentioned, baseUrl, password, maxBytes, mediaUrls, mediaPaths, mediaTypes, _i, attachments_1, attachment, downloaded, saved, err_2, replyToId, replyToBody, replyToSender, replyToShortId, cached, preview, replyTag, baseBody, fromLabel, groupSubject, groupMembers, storePath, envelopeOptions, previousTimestamp, body, chatGuidForActions, target_1, ackReactionScope, removeAckAfterReply, ackReactionValue, shouldAckReaction, ackMessageId, ackReactionPromise, sendReadReceipts, err_3, outboundTarget, maybeEnqueueOutboundMessageId, ctxPayload, sentMessage, streamingActive, typingRestartTimer, typingRestartDelayMs, clearTypingRestartTimer, restartTypingSoon, shouldStopTyping;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
        return __generator(this, function (_19) {
            switch (_19.label) {
                case 0:
                    account = target.account, config = target.config, runtime = target.runtime, core = target.core, statusSink = target.statusSink;
                    groupFlag = resolveGroupFlagFromChatGuid(message.chatGuid);
                    isGroup = typeof groupFlag === "boolean" ? groupFlag : message.isGroup;
                    text = message.text.trim();
                    attachments = (_b = message.attachments) !== null && _b !== void 0 ? _b : [];
                    placeholder = buildMessagePlaceholder(message);
                    tapbackContext = resolveTapbackContext(message);
                    tapbackParsed = parseTapbackText({
                        text: text,
                        emojiHint: tapbackContext === null || tapbackContext === void 0 ? void 0 : tapbackContext.emojiHint,
                        actionHint: tapbackContext === null || tapbackContext === void 0 ? void 0 : tapbackContext.actionHint,
                        requireQuoted: !tapbackContext,
                    });
                    isTapbackMessage = Boolean(tapbackParsed);
                    rawBody = tapbackParsed
                        ? tapbackParsed.action === "removed"
                            ? "removed ".concat(tapbackParsed.emoji, " reaction")
                            : "reacted with ".concat(tapbackParsed.emoji)
                        : text || placeholder;
                    cacheMessageId = (_c = message.messageId) === null || _c === void 0 ? void 0 : _c.trim();
                    cacheInboundMessage = function () {
                        var _a;
                        if (!cacheMessageId) {
                            return;
                        }
                        var cacheEntry = rememberBlueBubblesReplyCache({
                            accountId: account.accountId,
                            messageId: cacheMessageId,
                            chatGuid: message.chatGuid,
                            chatIdentifier: message.chatIdentifier,
                            chatId: message.chatId,
                            senderLabel: message.fromMe ? "me" : message.senderId,
                            body: rawBody,
                            timestamp: (_a = message.timestamp) !== null && _a !== void 0 ? _a : Date.now(),
                        });
                        messageShortId = cacheEntry.shortId;
                    };
                    if (message.fromMe) {
                        // Cache from-me messages so reply context can resolve sender/body.
                        cacheInboundMessage();
                        return [2 /*return*/];
                    }
                    if (!rawBody) {
                        logVerbose(core, runtime, "drop: empty text sender=".concat(message.senderId));
                        return [2 /*return*/];
                    }
                    logVerbose(core, runtime, "msg sender=".concat(message.senderId, " group=").concat(isGroup, " textLen=").concat(text.length, " attachments=").concat(attachments.length, " chatGuid=").concat((_d = message.chatGuid) !== null && _d !== void 0 ? _d : "", " chatId=").concat((_e = message.chatId) !== null && _e !== void 0 ? _e : ""));
                    dmPolicy = (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing";
                    groupPolicy = (_g = account.config.groupPolicy) !== null && _g !== void 0 ? _g : "allowlist";
                    configAllowFrom = ((_h = account.config.allowFrom) !== null && _h !== void 0 ? _h : []).map(function (entry) { return String(entry); });
                    configGroupAllowFrom = ((_j = account.config.groupAllowFrom) !== null && _j !== void 0 ? _j : []).map(function (entry) { return String(entry); });
                    return [4 /*yield*/, core.channel.pairing
                            .readAllowFromStore("bluebubbles")
                            .catch(function () { return []; })];
                case 1:
                    storeAllowFrom = _19.sent();
                    effectiveAllowFrom = __spreadArray(__spreadArray([], configAllowFrom, true), storeAllowFrom, true).map(function (entry) { return String(entry).trim(); })
                        .filter(Boolean);
                    effectiveGroupAllowFrom = __spreadArray(__spreadArray([], (configGroupAllowFrom.length > 0 ? configGroupAllowFrom : configAllowFrom), true), storeAllowFrom, true).map(function (entry) { return String(entry).trim(); })
                        .filter(Boolean);
                    groupAllowEntry = formatGroupAllowlistEntry({
                        chatGuid: message.chatGuid,
                        chatId: (_k = message.chatId) !== null && _k !== void 0 ? _k : undefined,
                        chatIdentifier: (_l = message.chatIdentifier) !== null && _l !== void 0 ? _l : undefined,
                    });
                    groupName = ((_m = message.chatName) === null || _m === void 0 ? void 0 : _m.trim()) || undefined;
                    if (!isGroup) return [3 /*break*/, 2];
                    if (groupPolicy === "disabled") {
                        logVerbose(core, runtime, "Blocked BlueBubbles group message (groupPolicy=disabled)");
                        logGroupAllowlistHint({
                            runtime: runtime,
                            reason: "groupPolicy=disabled",
                            entry: groupAllowEntry,
                            chatName: groupName,
                            accountId: account.accountId,
                        });
                        return [2 /*return*/];
                    }
                    if (groupPolicy === "allowlist") {
                        if (effectiveGroupAllowFrom.length === 0) {
                            logVerbose(core, runtime, "Blocked BlueBubbles group message (no allowlist)");
                            logGroupAllowlistHint({
                                runtime: runtime,
                                reason: "groupPolicy=allowlist (empty allowlist)",
                                entry: groupAllowEntry,
                                chatName: groupName,
                                accountId: account.accountId,
                            });
                            return [2 /*return*/];
                        }
                        allowed = (0, targets_js_1.isAllowedBlueBubblesSender)({
                            allowFrom: effectiveGroupAllowFrom,
                            sender: message.senderId,
                            chatId: (_o = message.chatId) !== null && _o !== void 0 ? _o : undefined,
                            chatGuid: (_p = message.chatGuid) !== null && _p !== void 0 ? _p : undefined,
                            chatIdentifier: (_q = message.chatIdentifier) !== null && _q !== void 0 ? _q : undefined,
                        });
                        if (!allowed) {
                            logVerbose(core, runtime, "Blocked BlueBubbles sender ".concat(message.senderId, " (not in groupAllowFrom)"));
                            logVerbose(core, runtime, "drop: group sender not allowed sender=".concat(message.senderId, " allowFrom=").concat(effectiveGroupAllowFrom.join(",")));
                            logGroupAllowlistHint({
                                runtime: runtime,
                                reason: "groupPolicy=allowlist (not allowlisted)",
                                entry: groupAllowEntry,
                                chatName: groupName,
                                accountId: account.accountId,
                            });
                            return [2 /*return*/];
                        }
                    }
                    return [3 /*break*/, 10];
                case 2:
                    if (dmPolicy === "disabled") {
                        logVerbose(core, runtime, "Blocked BlueBubbles DM from ".concat(message.senderId));
                        logVerbose(core, runtime, "drop: dmPolicy disabled sender=".concat(message.senderId));
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 10];
                    allowed = (0, targets_js_1.isAllowedBlueBubblesSender)({
                        allowFrom: effectiveAllowFrom,
                        sender: message.senderId,
                        chatId: (_r = message.chatId) !== null && _r !== void 0 ? _r : undefined,
                        chatGuid: (_s = message.chatGuid) !== null && _s !== void 0 ? _s : undefined,
                        chatIdentifier: (_t = message.chatIdentifier) !== null && _t !== void 0 ? _t : undefined,
                    });
                    if (!!allowed) return [3 /*break*/, 10];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 8];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: "bluebubbles",
                            id: message.senderId,
                            meta: { name: message.senderName },
                        })];
                case 3:
                    _a = _19.sent(), code = _a.code, created = _a.created;
                    (_u = runtime.log) === null || _u === void 0 ? void 0 : _u.call(runtime, "[bluebubbles] pairing request sender=".concat(message.senderId, " created=").concat(created));
                    if (!created) return [3 /*break*/, 7];
                    logVerbose(core, runtime, "bluebubbles pairing request sender=".concat(message.senderId));
                    _19.label = 4;
                case 4:
                    _19.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(message.senderId, core.channel.pairing.buildPairingReply({
                            channel: "bluebubbles",
                            idLine: "Your BlueBubbles sender id: ".concat(message.senderId),
                            code: code,
                        }), { cfg: config, accountId: account.accountId })];
                case 5:
                    _19.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _19.sent();
                    logVerbose(core, runtime, "bluebubbles pairing reply failed for ".concat(message.senderId, ": ").concat(String(err_1)));
                    (_v = runtime.error) === null || _v === void 0 ? void 0 : _v.call(runtime, "[bluebubbles] pairing reply failed sender=".concat(message.senderId, ": ").concat(String(err_1)));
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    logVerbose(core, runtime, "Blocked unauthorized BlueBubbles sender ".concat(message.senderId, " (dmPolicy=").concat(dmPolicy, ")"));
                    logVerbose(core, runtime, "drop: dm sender not allowed sender=".concat(message.senderId, " allowFrom=").concat(effectiveAllowFrom.join(",")));
                    _19.label = 9;
                case 9: return [2 /*return*/];
                case 10:
                    chatId = (_w = message.chatId) !== null && _w !== void 0 ? _w : undefined;
                    chatGuid = (_x = message.chatGuid) !== null && _x !== void 0 ? _x : undefined;
                    chatIdentifier = (_y = message.chatIdentifier) !== null && _y !== void 0 ? _y : undefined;
                    peerId = isGroup
                        ? ((_z = chatGuid !== null && chatGuid !== void 0 ? chatGuid : chatIdentifier) !== null && _z !== void 0 ? _z : (chatId ? String(chatId) : "group"))
                        : message.senderId;
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: config,
                        channel: "bluebubbles",
                        accountId: account.accountId,
                        peer: {
                            kind: isGroup ? "group" : "dm",
                            id: peerId,
                        },
                    });
                    messageText = text;
                    mentionRegexes = core.channel.mentions.buildMentionRegexes(config, route.agentId);
                    wasMentioned = isGroup
                        ? core.channel.mentions.matchesMentionPatterns(messageText, mentionRegexes)
                        : true;
                    canDetectMention = mentionRegexes.length > 0;
                    requireMention = core.channel.groups.resolveRequireMention({
                        cfg: config,
                        channel: "bluebubbles",
                        groupId: peerId,
                        accountId: account.accountId,
                    });
                    useAccessGroups = ((_0 = config.commands) === null || _0 === void 0 ? void 0 : _0.useAccessGroups) !== false;
                    hasControlCmd = core.channel.text.hasControlCommand(messageText, config);
                    ownerAllowedForCommands = effectiveAllowFrom.length > 0
                        ? (0, targets_js_1.isAllowedBlueBubblesSender)({
                            allowFrom: effectiveAllowFrom,
                            sender: message.senderId,
                            chatId: (_1 = message.chatId) !== null && _1 !== void 0 ? _1 : undefined,
                            chatGuid: (_2 = message.chatGuid) !== null && _2 !== void 0 ? _2 : undefined,
                            chatIdentifier: (_3 = message.chatIdentifier) !== null && _3 !== void 0 ? _3 : undefined,
                        })
                        : false;
                    groupAllowedForCommands = effectiveGroupAllowFrom.length > 0
                        ? (0, targets_js_1.isAllowedBlueBubblesSender)({
                            allowFrom: effectiveGroupAllowFrom,
                            sender: message.senderId,
                            chatId: (_4 = message.chatId) !== null && _4 !== void 0 ? _4 : undefined,
                            chatGuid: (_5 = message.chatGuid) !== null && _5 !== void 0 ? _5 : undefined,
                            chatIdentifier: (_6 = message.chatIdentifier) !== null && _6 !== void 0 ? _6 : undefined,
                        })
                        : false;
                    dmAuthorized = dmPolicy === "open" || ownerAllowedForCommands;
                    commandGate = (0, plugin_sdk_1.resolveControlCommandGate)({
                        useAccessGroups: useAccessGroups,
                        authorizers: [
                            { configured: effectiveAllowFrom.length > 0, allowed: ownerAllowedForCommands },
                            { configured: effectiveGroupAllowFrom.length > 0, allowed: groupAllowedForCommands },
                        ],
                        allowTextCommands: true,
                        hasControlCommand: hasControlCmd,
                    });
                    commandAuthorized = isGroup ? commandGate.commandAuthorized : dmAuthorized;
                    // Block control commands from unauthorized senders in groups
                    if (isGroup && commandGate.shouldBlock) {
                        (0, plugin_sdk_1.logInboundDrop)({
                            log: function (msg) { return logVerbose(core, runtime, msg); },
                            channel: "bluebubbles",
                            reason: "control command (unauthorized)",
                            target: message.senderId,
                        });
                        return [2 /*return*/];
                    }
                    shouldBypassMention = isGroup && requireMention && !wasMentioned && commandAuthorized && hasControlCmd;
                    effectiveWasMentioned = wasMentioned || shouldBypassMention;
                    // Skip group messages that require mention but weren't mentioned
                    if (isGroup && requireMention && canDetectMention && !wasMentioned && !shouldBypassMention) {
                        logVerbose(core, runtime, "bluebubbles: skipping group message (no mention)");
                        return [2 /*return*/];
                    }
                    // Cache allowed inbound messages so later replies can resolve sender/body without
                    // surfacing dropped content (allowlist/mention/command gating).
                    cacheInboundMessage();
                    baseUrl = (_7 = account.config.serverUrl) === null || _7 === void 0 ? void 0 : _7.trim();
                    password = (_8 = account.config.password) === null || _8 === void 0 ? void 0 : _8.trim();
                    maxBytes = account.config.mediaMaxMb && account.config.mediaMaxMb > 0
                        ? account.config.mediaMaxMb * 1024 * 1024
                        : 8 * 1024 * 1024;
                    mediaUrls = [];
                    mediaPaths = [];
                    mediaTypes = [];
                    if (!(attachments.length > 0)) return [3 /*break*/, 18];
                    if (!(!baseUrl || !password)) return [3 /*break*/, 11];
                    logVerbose(core, runtime, "attachment download skipped (missing serverUrl/password)");
                    return [3 /*break*/, 18];
                case 11:
                    _i = 0, attachments_1 = attachments;
                    _19.label = 12;
                case 12:
                    if (!(_i < attachments_1.length)) return [3 /*break*/, 18];
                    attachment = attachments_1[_i];
                    if (!attachment.guid) {
                        return [3 /*break*/, 17];
                    }
                    if (attachment.totalBytes && attachment.totalBytes > maxBytes) {
                        logVerbose(core, runtime, "attachment too large guid=".concat(attachment.guid, " bytes=").concat(attachment.totalBytes));
                        return [3 /*break*/, 17];
                    }
                    _19.label = 13;
                case 13:
                    _19.trys.push([13, 16, , 17]);
                    return [4 /*yield*/, (0, attachments_js_1.downloadBlueBubblesAttachment)(attachment, {
                            cfg: config,
                            accountId: account.accountId,
                            maxBytes: maxBytes,
                        })];
                case 14:
                    downloaded = _19.sent();
                    return [4 /*yield*/, core.channel.media.saveMediaBuffer(downloaded.buffer, downloaded.contentType, "inbound", maxBytes)];
                case 15:
                    saved = _19.sent();
                    mediaPaths.push(saved.path);
                    mediaUrls.push(saved.path);
                    if (saved.contentType) {
                        mediaTypes.push(saved.contentType);
                    }
                    return [3 /*break*/, 17];
                case 16:
                    err_2 = _19.sent();
                    logVerbose(core, runtime, "attachment download failed guid=".concat(attachment.guid, " err=").concat(String(err_2)));
                    return [3 /*break*/, 17];
                case 17:
                    _i++;
                    return [3 /*break*/, 12];
                case 18:
                    replyToId = message.replyToId;
                    replyToBody = message.replyToBody;
                    replyToSender = message.replyToSender;
                    if (isTapbackMessage && (tapbackContext === null || tapbackContext === void 0 ? void 0 : tapbackContext.replyToId)) {
                        replyToId = tapbackContext.replyToId;
                    }
                    if (replyToId) {
                        cached = resolveReplyContextFromCache({
                            accountId: account.accountId,
                            replyToId: replyToId,
                            chatGuid: message.chatGuid,
                            chatIdentifier: message.chatIdentifier,
                            chatId: message.chatId,
                        });
                        if (cached) {
                            if (!replyToBody && cached.body) {
                                replyToBody = cached.body;
                            }
                            if (!replyToSender && cached.senderLabel) {
                                replyToSender = cached.senderLabel;
                            }
                            replyToShortId = cached.shortId;
                            if (core.logging.shouldLogVerbose()) {
                                preview = ((_9 = cached.body) !== null && _9 !== void 0 ? _9 : "").replace(/\s+/g, " ").slice(0, 120);
                                logVerbose(core, runtime, "reply-context cache hit replyToId=".concat(replyToId, " sender=").concat(replyToSender !== null && replyToSender !== void 0 ? replyToSender : "", " body=\"").concat(preview, "\""));
                            }
                        }
                    }
                    // If no cached short ID, try to get one from the UUID directly
                    if (replyToId && !replyToShortId) {
                        replyToShortId = getShortIdForUuid(replyToId);
                    }
                    replyTag = formatReplyTag({ replyToId: replyToId, replyToShortId: replyToShortId });
                    baseBody = replyTag
                        ? isTapbackMessage
                            ? "".concat(rawBody, " ").concat(replyTag)
                            : "".concat(replyTag, " ").concat(rawBody)
                        : rawBody;
                    fromLabel = isGroup ? undefined : message.senderName || "user:".concat(message.senderId);
                    groupSubject = isGroup ? ((_10 = message.chatName) === null || _10 === void 0 ? void 0 : _10.trim()) || undefined : undefined;
                    groupMembers = isGroup
                        ? formatGroupMembers({
                            participants: message.participants,
                            fallback: message.senderId ? { id: message.senderId, name: message.senderName } : undefined,
                        })
                        : undefined;
                    storePath = core.channel.session.resolveStorePath((_11 = config.session) === null || _11 === void 0 ? void 0 : _11.store, {
                        agentId: route.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(config);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath,
                        sessionKey: route.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "BlueBubbles",
                        from: fromLabel,
                        timestamp: message.timestamp,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: baseBody,
                    });
                    chatGuidForActions = chatGuid;
                    if (!(!chatGuidForActions && baseUrl && password)) return [3 /*break*/, 20];
                    target_1 = isGroup && (chatId || chatIdentifier)
                        ? chatId
                            ? { kind: "chat_id", chatId: chatId }
                            : { kind: "chat_identifier", chatIdentifier: chatIdentifier !== null && chatIdentifier !== void 0 ? chatIdentifier : "" }
                        : { kind: "handle", address: message.senderId };
                    if (!(target_1.kind !== "chat_identifier" || target_1.chatIdentifier)) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                            baseUrl: baseUrl,
                            password: password,
                            target: target_1,
                        })];
                case 19:
                    chatGuidForActions =
                        (_12 = (_19.sent())) !== null && _12 !== void 0 ? _12 : undefined;
                    _19.label = 20;
                case 20:
                    ackReactionScope = (_14 = (_13 = config.messages) === null || _13 === void 0 ? void 0 : _13.ackReactionScope) !== null && _14 !== void 0 ? _14 : "group-mentions";
                    removeAckAfterReply = (_16 = (_15 = config.messages) === null || _15 === void 0 ? void 0 : _15.removeAckAfterReply) !== null && _16 !== void 0 ? _16 : false;
                    ackReactionValue = resolveBlueBubblesAckReaction({
                        cfg: config,
                        agentId: route.agentId,
                        core: core,
                        runtime: runtime,
                    });
                    shouldAckReaction = function () {
                        return Boolean(ackReactionValue &&
                            core.channel.reactions.shouldAckReaction({
                                scope: ackReactionScope,
                                isDirect: !isGroup,
                                isGroup: isGroup,
                                isMentionableGroup: isGroup,
                                requireMention: Boolean(requireMention),
                                canDetectMention: canDetectMention,
                                effectiveWasMentioned: effectiveWasMentioned,
                                shouldBypassMention: shouldBypassMention,
                            }));
                    };
                    ackMessageId = ((_17 = message.messageId) === null || _17 === void 0 ? void 0 : _17.trim()) || "";
                    ackReactionPromise = shouldAckReaction() && ackMessageId && chatGuidForActions && ackReactionValue
                        ? (0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: chatGuidForActions,
                            messageGuid: ackMessageId,
                            emoji: ackReactionValue,
                            opts: { cfg: config, accountId: account.accountId },
                        }).then(function () { return true; }, function (err) {
                            logVerbose(core, runtime, "ack reaction failed chatGuid=".concat(chatGuidForActions, " msg=").concat(ackMessageId, ": ").concat(String(err)));
                            return false;
                        })
                        : null;
                    sendReadReceipts = account.config.sendReadReceipts !== false;
                    if (!(chatGuidForActions && baseUrl && password && sendReadReceipts)) return [3 /*break*/, 25];
                    _19.label = 21;
                case 21:
                    _19.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, (0, chat_js_1.markBlueBubblesChatRead)(chatGuidForActions, {
                            cfg: config,
                            accountId: account.accountId,
                        })];
                case 22:
                    _19.sent();
                    logVerbose(core, runtime, "marked read chatGuid=".concat(chatGuidForActions));
                    return [3 /*break*/, 24];
                case 23:
                    err_3 = _19.sent();
                    (_18 = runtime.error) === null || _18 === void 0 ? void 0 : _18.call(runtime, "[bluebubbles] mark read failed: ".concat(String(err_3)));
                    return [3 /*break*/, 24];
                case 24: return [3 /*break*/, 26];
                case 25:
                    if (!sendReadReceipts) {
                        logVerbose(core, runtime, "mark read skipped (sendReadReceipts=false)");
                    }
                    else {
                        logVerbose(core, runtime, "mark read skipped (missing chatGuid or credentials)");
                    }
                    _19.label = 26;
                case 26:
                    outboundTarget = isGroup
                        ? (0, targets_js_1.formatBlueBubblesChatTarget)({
                            chatId: chatId,
                            chatGuid: chatGuidForActions !== null && chatGuidForActions !== void 0 ? chatGuidForActions : chatGuid,
                            chatIdentifier: chatIdentifier,
                        }) || peerId
                        : chatGuidForActions
                            ? (0, targets_js_1.formatBlueBubblesChatTarget)({ chatGuid: chatGuidForActions })
                            : message.senderId;
                    maybeEnqueueOutboundMessageId = function (messageId, snippet) {
                        var trimmed = messageId === null || messageId === void 0 ? void 0 : messageId.trim();
                        if (!trimmed || trimmed === "ok" || trimmed === "unknown") {
                            return;
                        }
                        // Cache outbound message to get short ID
                        var cacheEntry = rememberBlueBubblesReplyCache({
                            accountId: account.accountId,
                            messageId: trimmed,
                            chatGuid: chatGuidForActions !== null && chatGuidForActions !== void 0 ? chatGuidForActions : chatGuid,
                            chatIdentifier: chatIdentifier,
                            chatId: chatId,
                            senderLabel: "me",
                            body: snippet !== null && snippet !== void 0 ? snippet : "",
                            timestamp: Date.now(),
                        });
                        var displayId = cacheEntry.shortId || trimmed;
                        var preview = snippet ? " \"".concat(snippet.slice(0, 12)).concat(snippet.length > 12 ? "…" : "", "\"") : "";
                        core.system.enqueueSystemEvent("Assistant sent".concat(preview, " [message_id:").concat(displayId, "]"), {
                            sessionKey: route.sessionKey,
                            contextKey: "bluebubbles:outbound:".concat(outboundTarget, ":").concat(trimmed),
                        });
                    };
                    ctxPayload = {
                        Body: body,
                        BodyForAgent: body,
                        RawBody: rawBody,
                        CommandBody: rawBody,
                        BodyForCommands: rawBody,
                        MediaUrl: mediaUrls[0],
                        MediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
                        MediaPath: mediaPaths[0],
                        MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
                        MediaType: mediaTypes[0],
                        MediaTypes: mediaTypes.length > 0 ? mediaTypes : undefined,
                        From: isGroup ? "group:".concat(peerId) : "bluebubbles:".concat(message.senderId),
                        To: "bluebubbles:".concat(outboundTarget),
                        SessionKey: route.sessionKey,
                        AccountId: route.accountId,
                        ChatType: isGroup ? "group" : "direct",
                        ConversationLabel: fromLabel,
                        // Use short ID for token savings (agent can use this to reference the message)
                        ReplyToId: replyToShortId || replyToId,
                        ReplyToIdFull: replyToId,
                        ReplyToBody: replyToBody,
                        ReplyToSender: replyToSender,
                        GroupSubject: groupSubject,
                        GroupMembers: groupMembers,
                        SenderName: message.senderName || undefined,
                        SenderId: message.senderId,
                        Provider: "bluebubbles",
                        Surface: "bluebubbles",
                        // Use short ID for token savings (agent can use this to reference the message)
                        MessageSid: messageShortId || message.messageId,
                        MessageSidFull: message.messageId,
                        Timestamp: message.timestamp,
                        OriginatingChannel: "bluebubbles",
                        OriginatingTo: "bluebubbles:".concat(outboundTarget),
                        WasMentioned: effectiveWasMentioned,
                        CommandAuthorized: commandAuthorized,
                    };
                    sentMessage = false;
                    streamingActive = false;
                    typingRestartDelayMs = 150;
                    clearTypingRestartTimer = function () {
                        if (typingRestartTimer) {
                            clearTimeout(typingRestartTimer);
                            typingRestartTimer = undefined;
                        }
                    };
                    restartTypingSoon = function () {
                        if (!streamingActive || !chatGuidForActions || !baseUrl || !password) {
                            return;
                        }
                        clearTypingRestartTimer();
                        typingRestartTimer = setTimeout(function () {
                            typingRestartTimer = undefined;
                            if (!streamingActive) {
                                return;
                            }
                            (0, chat_js_1.sendBlueBubblesTyping)(chatGuidForActions, true, {
                                cfg: config,
                                accountId: account.accountId,
                            }).catch(function (err) {
                                var _a;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[bluebubbles] typing restart failed: ".concat(String(err)));
                            });
                        }, typingRestartDelayMs);
                    };
                    _19.label = 27;
                case 27:
                    _19.trys.push([27, , 29, 30]);
                    return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                            ctx: ctxPayload,
                            cfg: config,
                            dispatcherOptions: {
                                deliver: function (payload, info) { return __awaiter(_this, void 0, void 0, function () {
                                    var rawReplyToId, replyToMessageGuid, mediaList, tableMode_1, text_1, first, _i, mediaList_1, mediaUrl, caption, result, cachedBody, textLimit, chunkMode, tableMode, text, chunks, i, chunk, result;
                                    var _a, _b, _c, _d;
                                    return __generator(this, function (_e) {
                                        switch (_e.label) {
                                            case 0:
                                                rawReplyToId = typeof payload.replyToId === "string" ? payload.replyToId.trim() : "";
                                                replyToMessageGuid = rawReplyToId
                                                    ? resolveBlueBubblesMessageId(rawReplyToId, { requireKnownShortId: true })
                                                    : "";
                                                mediaList = ((_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length)
                                                    ? payload.mediaUrls
                                                    : payload.mediaUrl
                                                        ? [payload.mediaUrl]
                                                        : [];
                                                if (!(mediaList.length > 0)) return [3 /*break*/, 5];
                                                tableMode_1 = core.channel.text.resolveMarkdownTableMode({
                                                    cfg: config,
                                                    channel: "bluebubbles",
                                                    accountId: account.accountId,
                                                });
                                                text_1 = core.channel.text.convertMarkdownTables((_b = payload.text) !== null && _b !== void 0 ? _b : "", tableMode_1);
                                                first = true;
                                                _i = 0, mediaList_1 = mediaList;
                                                _e.label = 1;
                                            case 1:
                                                if (!(_i < mediaList_1.length)) return [3 /*break*/, 4];
                                                mediaUrl = mediaList_1[_i];
                                                caption = first ? text_1 : undefined;
                                                first = false;
                                                return [4 /*yield*/, (0, media_send_js_1.sendBlueBubblesMedia)({
                                                        cfg: config,
                                                        to: outboundTarget,
                                                        mediaUrl: mediaUrl,
                                                        caption: caption !== null && caption !== void 0 ? caption : undefined,
                                                        replyToId: replyToMessageGuid || null,
                                                        accountId: account.accountId,
                                                    })];
                                            case 2:
                                                result = _e.sent();
                                                cachedBody = (caption !== null && caption !== void 0 ? caption : "").trim() || "<media:attachment>";
                                                maybeEnqueueOutboundMessageId(result.messageId, cachedBody);
                                                sentMessage = true;
                                                statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                                                if (info.kind === "block") {
                                                    restartTypingSoon();
                                                }
                                                _e.label = 3;
                                            case 3:
                                                _i++;
                                                return [3 /*break*/, 1];
                                            case 4: return [2 /*return*/];
                                            case 5:
                                                textLimit = account.config.textChunkLimit && account.config.textChunkLimit > 0
                                                    ? account.config.textChunkLimit
                                                    : DEFAULT_TEXT_LIMIT;
                                                chunkMode = (_c = account.config.chunkMode) !== null && _c !== void 0 ? _c : "length";
                                                tableMode = core.channel.text.resolveMarkdownTableMode({
                                                    cfg: config,
                                                    channel: "bluebubbles",
                                                    accountId: account.accountId,
                                                });
                                                text = core.channel.text.convertMarkdownTables((_d = payload.text) !== null && _d !== void 0 ? _d : "", tableMode);
                                                chunks = chunkMode === "newline"
                                                    ? core.channel.text.chunkTextWithMode(text, textLimit, chunkMode)
                                                    : core.channel.text.chunkMarkdownText(text, textLimit);
                                                if (!chunks.length && text) {
                                                    chunks.push(text);
                                                }
                                                if (!chunks.length) {
                                                    return [2 /*return*/];
                                                }
                                                i = 0;
                                                _e.label = 6;
                                            case 6:
                                                if (!(i < chunks.length)) return [3 /*break*/, 9];
                                                chunk = chunks[i];
                                                return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(outboundTarget, chunk, {
                                                        cfg: config,
                                                        accountId: account.accountId,
                                                        replyToMessageGuid: replyToMessageGuid || undefined,
                                                    })];
                                            case 7:
                                                result = _e.sent();
                                                maybeEnqueueOutboundMessageId(result.messageId, chunk);
                                                sentMessage = true;
                                                statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                                                if (info.kind === "block") {
                                                    restartTypingSoon();
                                                }
                                                _e.label = 8;
                                            case 8:
                                                i++;
                                                return [3 /*break*/, 6];
                                            case 9: return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onReplyStart: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var err_4;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!chatGuidForActions) {
                                                    return [2 /*return*/];
                                                }
                                                if (!baseUrl || !password) {
                                                    return [2 /*return*/];
                                                }
                                                streamingActive = true;
                                                clearTypingRestartTimer();
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, (0, chat_js_1.sendBlueBubblesTyping)(chatGuidForActions, true, {
                                                        cfg: config,
                                                        accountId: account.accountId,
                                                    })];
                                            case 2:
                                                _b.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                err_4 = _b.sent();
                                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[bluebubbles] typing start failed: ".concat(String(err_4)));
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onIdle: function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (!chatGuidForActions) {
                                            return [2 /*return*/];
                                        }
                                        if (!baseUrl || !password) {
                                            return [2 /*return*/];
                                        }
                                        return [2 /*return*/];
                                    });
                                }); },
                                onError: function (err, info) {
                                    var _a;
                                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "BlueBubbles ".concat(info.kind, " reply failed: ").concat(String(err)));
                                },
                            },
                            replyOptions: {
                                disableBlockStreaming: typeof account.config.blockStreaming === "boolean"
                                    ? !account.config.blockStreaming
                                    : undefined,
                            },
                        })];
                case 28:
                    _19.sent();
                    return [3 /*break*/, 30];
                case 29:
                    shouldStopTyping = Boolean(chatGuidForActions && baseUrl && password) && (streamingActive || !sentMessage);
                    streamingActive = false;
                    clearTypingRestartTimer();
                    if (sentMessage && chatGuidForActions && ackMessageId) {
                        core.channel.reactions.removeAckReactionAfterReply({
                            removeAfterReply: removeAckAfterReply,
                            ackReactionPromise: ackReactionPromise,
                            ackReactionValue: ackReactionValue !== null && ackReactionValue !== void 0 ? ackReactionValue : null,
                            remove: function () {
                                return (0, reactions_js_1.sendBlueBubblesReaction)({
                                    chatGuid: chatGuidForActions,
                                    messageGuid: ackMessageId,
                                    emoji: ackReactionValue !== null && ackReactionValue !== void 0 ? ackReactionValue : "",
                                    remove: true,
                                    opts: { cfg: config, accountId: account.accountId },
                                });
                            },
                            onError: function (err) {
                                (0, plugin_sdk_1.logAckFailure)({
                                    log: function (msg) { return logVerbose(core, runtime, msg); },
                                    channel: "bluebubbles",
                                    target: "".concat(chatGuidForActions, "/").concat(ackMessageId),
                                    error: err,
                                });
                            },
                        });
                    }
                    if (shouldStopTyping) {
                        // Stop typing after streaming completes to avoid a stuck indicator.
                        (0, chat_js_1.sendBlueBubblesTyping)(chatGuidForActions, false, {
                            cfg: config,
                            accountId: account.accountId,
                        }).catch(function (err) {
                            (0, plugin_sdk_1.logTypingFailure)({
                                log: function (msg) { return logVerbose(core, runtime, msg); },
                                channel: "bluebubbles",
                                action: "stop",
                                target: chatGuidForActions,
                                error: err,
                            });
                        });
                    }
                    return [7 /*endfinally*/];
                case 30: return [2 /*return*/];
            }
        });
    });
}
function processReaction(reaction, target) {
    return __awaiter(this, void 0, void 0, function () {
        var account, config, runtime, core, dmPolicy, groupPolicy, configAllowFrom, configGroupAllowFrom, storeAllowFrom, effectiveAllowFrom, effectiveGroupAllowFrom, allowed, allowed, chatId, chatGuid, chatIdentifier, peerId, route, senderLabel, chatLabel, messageDisplayId, text;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    account = target.account, config = target.config, runtime = target.runtime, core = target.core;
                    if (reaction.fromMe) {
                        return [2 /*return*/];
                    }
                    dmPolicy = (_a = account.config.dmPolicy) !== null && _a !== void 0 ? _a : "pairing";
                    groupPolicy = (_b = account.config.groupPolicy) !== null && _b !== void 0 ? _b : "allowlist";
                    configAllowFrom = ((_c = account.config.allowFrom) !== null && _c !== void 0 ? _c : []).map(function (entry) { return String(entry); });
                    configGroupAllowFrom = ((_d = account.config.groupAllowFrom) !== null && _d !== void 0 ? _d : []).map(function (entry) { return String(entry); });
                    return [4 /*yield*/, core.channel.pairing
                            .readAllowFromStore("bluebubbles")
                            .catch(function () { return []; })];
                case 1:
                    storeAllowFrom = _q.sent();
                    effectiveAllowFrom = __spreadArray(__spreadArray([], configAllowFrom, true), storeAllowFrom, true).map(function (entry) { return String(entry).trim(); })
                        .filter(Boolean);
                    effectiveGroupAllowFrom = __spreadArray(__spreadArray([], (configGroupAllowFrom.length > 0 ? configGroupAllowFrom : configAllowFrom), true), storeAllowFrom, true).map(function (entry) { return String(entry).trim(); })
                        .filter(Boolean);
                    if (reaction.isGroup) {
                        if (groupPolicy === "disabled") {
                            return [2 /*return*/];
                        }
                        if (groupPolicy === "allowlist") {
                            if (effectiveGroupAllowFrom.length === 0) {
                                return [2 /*return*/];
                            }
                            allowed = (0, targets_js_1.isAllowedBlueBubblesSender)({
                                allowFrom: effectiveGroupAllowFrom,
                                sender: reaction.senderId,
                                chatId: (_e = reaction.chatId) !== null && _e !== void 0 ? _e : undefined,
                                chatGuid: (_f = reaction.chatGuid) !== null && _f !== void 0 ? _f : undefined,
                                chatIdentifier: (_g = reaction.chatIdentifier) !== null && _g !== void 0 ? _g : undefined,
                            });
                            if (!allowed) {
                                return [2 /*return*/];
                            }
                        }
                    }
                    else {
                        if (dmPolicy === "disabled") {
                            return [2 /*return*/];
                        }
                        if (dmPolicy !== "open") {
                            allowed = (0, targets_js_1.isAllowedBlueBubblesSender)({
                                allowFrom: effectiveAllowFrom,
                                sender: reaction.senderId,
                                chatId: (_h = reaction.chatId) !== null && _h !== void 0 ? _h : undefined,
                                chatGuid: (_j = reaction.chatGuid) !== null && _j !== void 0 ? _j : undefined,
                                chatIdentifier: (_k = reaction.chatIdentifier) !== null && _k !== void 0 ? _k : undefined,
                            });
                            if (!allowed) {
                                return [2 /*return*/];
                            }
                        }
                    }
                    chatId = (_l = reaction.chatId) !== null && _l !== void 0 ? _l : undefined;
                    chatGuid = (_m = reaction.chatGuid) !== null && _m !== void 0 ? _m : undefined;
                    chatIdentifier = (_o = reaction.chatIdentifier) !== null && _o !== void 0 ? _o : undefined;
                    peerId = reaction.isGroup
                        ? ((_p = chatGuid !== null && chatGuid !== void 0 ? chatGuid : chatIdentifier) !== null && _p !== void 0 ? _p : (chatId ? String(chatId) : "group"))
                        : reaction.senderId;
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: config,
                        channel: "bluebubbles",
                        accountId: account.accountId,
                        peer: {
                            kind: reaction.isGroup ? "group" : "dm",
                            id: peerId,
                        },
                    });
                    senderLabel = reaction.senderName || reaction.senderId;
                    chatLabel = reaction.isGroup ? " in group:".concat(peerId) : "";
                    messageDisplayId = getShortIdForUuid(reaction.messageId) || reaction.messageId;
                    text = reaction.action === "removed"
                        ? "".concat(senderLabel, " removed ").concat(reaction.emoji, " reaction [[reply_to:").concat(messageDisplayId, "]]").concat(chatLabel)
                        : "".concat(senderLabel, " reacted with ").concat(reaction.emoji, " [[reply_to:").concat(messageDisplayId, "]]").concat(chatLabel);
                    core.system.enqueueSystemEvent(text, {
                        sessionKey: route.sessionKey,
                        contextKey: "bluebubbles:reaction:".concat(reaction.action, ":").concat(peerId, ":").concat(reaction.messageId, ":").concat(reaction.senderId, ":").concat(reaction.emoji),
                    });
                    logVerbose(core, runtime, "reaction event enqueued: ".concat(text));
                    return [2 /*return*/];
            }
        });
    });
}
function monitorBlueBubblesProvider(options) {
    return __awaiter(this, void 0, void 0, function () {
        var account, config, runtime, abortSignal, statusSink, core, path, serverInfo, unregister;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    account = options.account, config = options.config, runtime = options.runtime, abortSignal = options.abortSignal, statusSink = options.statusSink;
                    core = (0, runtime_js_1.getBlueBubblesRuntime)();
                    path = ((_a = options.webhookPath) === null || _a === void 0 ? void 0 : _a.trim()) || DEFAULT_WEBHOOK_PATH;
                    return [4 /*yield*/, (0, probe_js_1.fetchBlueBubblesServerInfo)({
                            baseUrl: account.baseUrl,
                            password: account.config.password,
                            accountId: account.accountId,
                            timeoutMs: 5000,
                        }).catch(function () { return null; })];
                case 1:
                    serverInfo = _c.sent();
                    if (serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.os_version) {
                        (_b = runtime.log) === null || _b === void 0 ? void 0 : _b.call(runtime, "[".concat(account.accountId, "] BlueBubbles server macOS ").concat(serverInfo.os_version));
                    }
                    unregister = registerBlueBubblesWebhookTarget({
                        account: account,
                        config: config,
                        runtime: runtime,
                        core: core,
                        path: path,
                        statusSink: statusSink,
                    });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var _a;
                            var stop = function () {
                                unregister();
                                resolve();
                            };
                            if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                                stop();
                                return;
                            }
                            abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", stop, { once: true });
                            (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[".concat(account.accountId, "] BlueBubbles webhook listening on ").concat(normalizeWebhookPath(path)));
                        })];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function resolveWebhookPathFromConfig(config) {
    var _a;
    var raw = (_a = config === null || config === void 0 ? void 0 : config.webhookPath) === null || _a === void 0 ? void 0 : _a.trim();
    if (raw) {
        return normalizeWebhookPath(raw);
    }
    return DEFAULT_WEBHOOK_PATH;
}
