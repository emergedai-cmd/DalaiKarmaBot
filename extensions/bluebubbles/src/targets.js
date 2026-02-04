"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBlueBubblesHandle = normalizeBlueBubblesHandle;
exports.extractHandleFromChatGuid = extractHandleFromChatGuid;
exports.normalizeBlueBubblesMessagingTarget = normalizeBlueBubblesMessagingTarget;
exports.looksLikeBlueBubblesTargetId = looksLikeBlueBubblesTargetId;
exports.parseBlueBubblesTarget = parseBlueBubblesTarget;
exports.parseBlueBubblesAllowTarget = parseBlueBubblesAllowTarget;
exports.isAllowedBlueBubblesSender = isAllowedBlueBubblesSender;
exports.formatBlueBubblesChatTarget = formatBlueBubblesChatTarget;
var CHAT_ID_PREFIXES = ["chat_id:", "chatid:", "chat:"];
var CHAT_GUID_PREFIXES = ["chat_guid:", "chatguid:", "guid:"];
var CHAT_IDENTIFIER_PREFIXES = ["chat_identifier:", "chatidentifier:", "chatident:"];
var SERVICE_PREFIXES = [
    { prefix: "imessage:", service: "imessage" },
    { prefix: "sms:", service: "sms" },
    { prefix: "auto:", service: "auto" },
];
var CHAT_IDENTIFIER_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var CHAT_IDENTIFIER_HEX_RE = /^[0-9a-f]{24,64}$/i;
function parseRawChatGuid(value) {
    var _a, _b, _c;
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    var parts = trimmed.split(";");
    if (parts.length !== 3) {
        return null;
    }
    var service = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.trim();
    var separator = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.trim();
    var identifier = (_c = parts[2]) === null || _c === void 0 ? void 0 : _c.trim();
    if (!service || !identifier) {
        return null;
    }
    if (separator !== "+" && separator !== "-") {
        return null;
    }
    return "".concat(service, ";").concat(separator, ";").concat(identifier);
}
function stripPrefix(value, prefix) {
    return value.slice(prefix.length).trim();
}
function stripBlueBubblesPrefix(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    if (!trimmed.toLowerCase().startsWith("bluebubbles:")) {
        return trimmed;
    }
    return trimmed.slice("bluebubbles:".length).trim();
}
function looksLikeRawChatIdentifier(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return false;
    }
    if (/^chat\d+$/i.test(trimmed)) {
        return true;
    }
    return CHAT_IDENTIFIER_UUID_RE.test(trimmed) || CHAT_IDENTIFIER_HEX_RE.test(trimmed);
}
function normalizeBlueBubblesHandle(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return "";
    }
    var lowered = trimmed.toLowerCase();
    if (lowered.startsWith("imessage:")) {
        return normalizeBlueBubblesHandle(trimmed.slice(9));
    }
    if (lowered.startsWith("sms:")) {
        return normalizeBlueBubblesHandle(trimmed.slice(4));
    }
    if (lowered.startsWith("auto:")) {
        return normalizeBlueBubblesHandle(trimmed.slice(5));
    }
    if (trimmed.includes("@")) {
        return trimmed.toLowerCase();
    }
    return trimmed.replace(/\s+/g, "");
}
/**
 * Extracts the handle from a chat_guid if it's a DM (1:1 chat).
 * BlueBubbles chat_guid format for DM: "service;-;handle" (e.g., "iMessage;-;+19257864429")
 * Group chat format: "service;+;groupId" (has "+" instead of "-")
 */
function extractHandleFromChatGuid(chatGuid) {
    var _a;
    var parts = chatGuid.split(";");
    // DM format: service;-;handle (3 parts, middle is "-")
    if (parts.length === 3 && parts[1] === "-") {
        var handle = (_a = parts[2]) === null || _a === void 0 ? void 0 : _a.trim();
        if (handle) {
            return normalizeBlueBubblesHandle(handle);
        }
    }
    return null;
}
function normalizeBlueBubblesMessagingTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    trimmed = stripBlueBubblesPrefix(trimmed);
    if (!trimmed) {
        return undefined;
    }
    try {
        var parsed = parseBlueBubblesTarget(trimmed);
        if (parsed.kind === "chat_id") {
            return "chat_id:".concat(parsed.chatId);
        }
        if (parsed.kind === "chat_guid") {
            // For DM chat_guids, normalize to just the handle for easier comparison.
            // This allows "chat_guid:iMessage;-;+1234567890" to match "+1234567890".
            var handle_1 = extractHandleFromChatGuid(parsed.chatGuid);
            if (handle_1) {
                return handle_1;
            }
            // For group chats or unrecognized formats, keep the full chat_guid
            return "chat_guid:".concat(parsed.chatGuid);
        }
        if (parsed.kind === "chat_identifier") {
            return "chat_identifier:".concat(parsed.chatIdentifier);
        }
        var handle = normalizeBlueBubblesHandle(parsed.to);
        if (!handle) {
            return undefined;
        }
        return parsed.service === "auto" ? handle : "".concat(parsed.service, ":").concat(handle);
    }
    catch (_a) {
        return trimmed;
    }
}
function looksLikeBlueBubblesTargetId(raw, normalized) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    var candidate = stripBlueBubblesPrefix(trimmed);
    if (!candidate) {
        return false;
    }
    if (parseRawChatGuid(candidate)) {
        return true;
    }
    var lowered = candidate.toLowerCase();
    if (/^(imessage|sms|auto):/.test(lowered)) {
        return true;
    }
    if (/^(chat_id|chatid|chat|chat_guid|chatguid|guid|chat_identifier|chatidentifier|chatident|group):/.test(lowered)) {
        return true;
    }
    // Recognize chat<digits> patterns (e.g., "chat660250192681427962") as chat IDs
    if (/^chat\d+$/i.test(candidate)) {
        return true;
    }
    if (looksLikeRawChatIdentifier(candidate)) {
        return true;
    }
    if (candidate.includes("@")) {
        return true;
    }
    var digitsOnly = candidate.replace(/[\s().-]/g, "");
    if (/^\+?\d{3,}$/.test(digitsOnly)) {
        return true;
    }
    if (normalized) {
        var normalizedTrimmed = normalized.trim();
        if (!normalizedTrimmed) {
            return false;
        }
        var normalizedLower = normalizedTrimmed.toLowerCase();
        if (/^(imessage|sms|auto):/.test(normalizedLower) ||
            /^(chat_id|chat_guid|chat_identifier):/.test(normalizedLower)) {
            return true;
        }
    }
    return false;
}
function parseBlueBubblesTarget(raw) {
    var trimmed = stripBlueBubblesPrefix(raw);
    if (!trimmed) {
        throw new Error("BlueBubbles target is required");
    }
    var lower = trimmed.toLowerCase();
    var _loop_1 = function (prefix, service) {
        if (lower.startsWith(prefix)) {
            var remainder = stripPrefix(trimmed, prefix);
            if (!remainder) {
                throw new Error("".concat(prefix, " target is required"));
            }
            var remainderLower_1 = remainder.toLowerCase();
            var isChatTarget = CHAT_ID_PREFIXES.some(function (p) { return remainderLower_1.startsWith(p); }) ||
                CHAT_GUID_PREFIXES.some(function (p) { return remainderLower_1.startsWith(p); }) ||
                CHAT_IDENTIFIER_PREFIXES.some(function (p) { return remainderLower_1.startsWith(p); }) ||
                remainderLower_1.startsWith("group:");
            if (isChatTarget) {
                return { value: parseBlueBubblesTarget(remainder) };
            }
            return { value: { kind: "handle", to: remainder, service: service } };
        }
    };
    for (var _i = 0, SERVICE_PREFIXES_1 = SERVICE_PREFIXES; _i < SERVICE_PREFIXES_1.length; _i++) {
        var _a = SERVICE_PREFIXES_1[_i], prefix = _a.prefix, service = _a.service;
        var state_1 = _loop_1(prefix, service);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    for (var _b = 0, CHAT_ID_PREFIXES_1 = CHAT_ID_PREFIXES; _b < CHAT_ID_PREFIXES_1.length; _b++) {
        var prefix = CHAT_ID_PREFIXES_1[_b];
        if (lower.startsWith(prefix)) {
            var value = stripPrefix(trimmed, prefix);
            var chatId = Number.parseInt(value, 10);
            if (!Number.isFinite(chatId)) {
                throw new Error("Invalid chat_id: ".concat(value));
            }
            return { kind: "chat_id", chatId: chatId };
        }
    }
    for (var _c = 0, CHAT_GUID_PREFIXES_1 = CHAT_GUID_PREFIXES; _c < CHAT_GUID_PREFIXES_1.length; _c++) {
        var prefix = CHAT_GUID_PREFIXES_1[_c];
        if (lower.startsWith(prefix)) {
            var value = stripPrefix(trimmed, prefix);
            if (!value) {
                throw new Error("chat_guid is required");
            }
            return { kind: "chat_guid", chatGuid: value };
        }
    }
    for (var _d = 0, CHAT_IDENTIFIER_PREFIXES_1 = CHAT_IDENTIFIER_PREFIXES; _d < CHAT_IDENTIFIER_PREFIXES_1.length; _d++) {
        var prefix = CHAT_IDENTIFIER_PREFIXES_1[_d];
        if (lower.startsWith(prefix)) {
            var value = stripPrefix(trimmed, prefix);
            if (!value) {
                throw new Error("chat_identifier is required");
            }
            return { kind: "chat_identifier", chatIdentifier: value };
        }
    }
    if (lower.startsWith("group:")) {
        var value = stripPrefix(trimmed, "group:");
        var chatId = Number.parseInt(value, 10);
        if (Number.isFinite(chatId)) {
            return { kind: "chat_id", chatId: chatId };
        }
        if (!value) {
            throw new Error("group target is required");
        }
        return { kind: "chat_guid", chatGuid: value };
    }
    var rawChatGuid = parseRawChatGuid(trimmed);
    if (rawChatGuid) {
        return { kind: "chat_guid", chatGuid: rawChatGuid };
    }
    // Handle chat<digits> pattern (e.g., "chat660250192681427962") as chat_identifier
    // These are BlueBubbles chat identifiers (the third part of a chat GUID), not numeric IDs
    if (/^chat\d+$/i.test(trimmed)) {
        return { kind: "chat_identifier", chatIdentifier: trimmed };
    }
    // Handle UUID/hex chat identifiers (e.g., "8b9c1a10536d4d86a336ea03ab7151cc")
    if (looksLikeRawChatIdentifier(trimmed)) {
        return { kind: "chat_identifier", chatIdentifier: trimmed };
    }
    return { kind: "handle", to: trimmed, service: "auto" };
}
function parseBlueBubblesAllowTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return { kind: "handle", handle: "" };
    }
    var lower = trimmed.toLowerCase();
    for (var _i = 0, SERVICE_PREFIXES_2 = SERVICE_PREFIXES; _i < SERVICE_PREFIXES_2.length; _i++) {
        var prefix = SERVICE_PREFIXES_2[_i].prefix;
        if (lower.startsWith(prefix)) {
            var remainder = stripPrefix(trimmed, prefix);
            if (!remainder) {
                return { kind: "handle", handle: "" };
            }
            return parseBlueBubblesAllowTarget(remainder);
        }
    }
    for (var _a = 0, CHAT_ID_PREFIXES_2 = CHAT_ID_PREFIXES; _a < CHAT_ID_PREFIXES_2.length; _a++) {
        var prefix = CHAT_ID_PREFIXES_2[_a];
        if (lower.startsWith(prefix)) {
            var value = stripPrefix(trimmed, prefix);
            var chatId = Number.parseInt(value, 10);
            if (Number.isFinite(chatId)) {
                return { kind: "chat_id", chatId: chatId };
            }
        }
    }
    for (var _b = 0, CHAT_GUID_PREFIXES_2 = CHAT_GUID_PREFIXES; _b < CHAT_GUID_PREFIXES_2.length; _b++) {
        var prefix = CHAT_GUID_PREFIXES_2[_b];
        if (lower.startsWith(prefix)) {
            var value = stripPrefix(trimmed, prefix);
            if (value) {
                return { kind: "chat_guid", chatGuid: value };
            }
        }
    }
    for (var _c = 0, CHAT_IDENTIFIER_PREFIXES_2 = CHAT_IDENTIFIER_PREFIXES; _c < CHAT_IDENTIFIER_PREFIXES_2.length; _c++) {
        var prefix = CHAT_IDENTIFIER_PREFIXES_2[_c];
        if (lower.startsWith(prefix)) {
            var value = stripPrefix(trimmed, prefix);
            if (value) {
                return { kind: "chat_identifier", chatIdentifier: value };
            }
        }
    }
    if (lower.startsWith("group:")) {
        var value = stripPrefix(trimmed, "group:");
        var chatId = Number.parseInt(value, 10);
        if (Number.isFinite(chatId)) {
            return { kind: "chat_id", chatId: chatId };
        }
        if (value) {
            return { kind: "chat_guid", chatGuid: value };
        }
    }
    // Handle chat<digits> pattern (e.g., "chat660250192681427962") as chat_identifier
    // These are BlueBubbles chat identifiers (the third part of a chat GUID), not numeric IDs
    if (/^chat\d+$/i.test(trimmed)) {
        return { kind: "chat_identifier", chatIdentifier: trimmed };
    }
    // Handle UUID/hex chat identifiers (e.g., "8b9c1a10536d4d86a336ea03ab7151cc")
    if (looksLikeRawChatIdentifier(trimmed)) {
        return { kind: "chat_identifier", chatIdentifier: trimmed };
    }
    return { kind: "handle", handle: normalizeBlueBubblesHandle(trimmed) };
}
function isAllowedBlueBubblesSender(params) {
    var _a, _b, _c;
    var allowFrom = params.allowFrom.map(function (entry) { return String(entry).trim(); });
    if (allowFrom.length === 0) {
        return true;
    }
    if (allowFrom.includes("*")) {
        return true;
    }
    var senderNormalized = normalizeBlueBubblesHandle(params.sender);
    var chatId = (_a = params.chatId) !== null && _a !== void 0 ? _a : undefined;
    var chatGuid = (_b = params.chatGuid) === null || _b === void 0 ? void 0 : _b.trim();
    var chatIdentifier = (_c = params.chatIdentifier) === null || _c === void 0 ? void 0 : _c.trim();
    for (var _i = 0, allowFrom_1 = allowFrom; _i < allowFrom_1.length; _i++) {
        var entry = allowFrom_1[_i];
        if (!entry) {
            continue;
        }
        var parsed = parseBlueBubblesAllowTarget(entry);
        if (parsed.kind === "chat_id" && chatId !== undefined) {
            if (parsed.chatId === chatId) {
                return true;
            }
        }
        else if (parsed.kind === "chat_guid" && chatGuid) {
            if (parsed.chatGuid === chatGuid) {
                return true;
            }
        }
        else if (parsed.kind === "chat_identifier" && chatIdentifier) {
            if (parsed.chatIdentifier === chatIdentifier) {
                return true;
            }
        }
        else if (parsed.kind === "handle" && senderNormalized) {
            if (parsed.handle === senderNormalized) {
                return true;
            }
        }
    }
    return false;
}
function formatBlueBubblesChatTarget(params) {
    var _a, _b;
    if (params.chatId && Number.isFinite(params.chatId)) {
        return "chat_id:".concat(params.chatId);
    }
    var guid = (_a = params.chatGuid) === null || _a === void 0 ? void 0 : _a.trim();
    if (guid) {
        return "chat_guid:".concat(guid);
    }
    var identifier = (_b = params.chatIdentifier) === null || _b === void 0 ? void 0 : _b.trim();
    if (identifier) {
        return "chat_identifier:".concat(identifier);
    }
    return "";
}
