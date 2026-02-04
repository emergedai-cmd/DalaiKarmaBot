"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDiscordWebhookId = resolveDiscordWebhookId;
exports.resolveDiscordSenderIdentity = resolveDiscordSenderIdentity;
exports.resolveDiscordSenderLabel = resolveDiscordSenderLabel;
var format_js_1 = require("./format.js");
function resolveDiscordWebhookId(message) {
    var _a;
    var candidate = (_a = message.webhookId) !== null && _a !== void 0 ? _a : message.webhook_id;
    return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}
function resolveDiscordSenderIdentity(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var pkInfo = (_a = params.pluralkitInfo) !== null && _a !== void 0 ? _a : null;
    var pkMember = (_b = pkInfo === null || pkInfo === void 0 ? void 0 : pkInfo.member) !== null && _b !== void 0 ? _b : undefined;
    var pkSystem = (_c = pkInfo === null || pkInfo === void 0 ? void 0 : pkInfo.system) !== null && _c !== void 0 ? _c : undefined;
    var memberId = (_d = pkMember === null || pkMember === void 0 ? void 0 : pkMember.id) === null || _d === void 0 ? void 0 : _d.trim();
    var memberNameRaw = (_f = (_e = pkMember === null || pkMember === void 0 ? void 0 : pkMember.display_name) !== null && _e !== void 0 ? _e : pkMember === null || pkMember === void 0 ? void 0 : pkMember.name) !== null && _f !== void 0 ? _f : "";
    var memberName = memberNameRaw === null || memberNameRaw === void 0 ? void 0 : memberNameRaw.trim();
    if (memberId && memberName) {
        var systemName = (_g = pkSystem === null || pkSystem === void 0 ? void 0 : pkSystem.name) === null || _g === void 0 ? void 0 : _g.trim();
        var label = systemName ? "".concat(memberName, " (PK:").concat(systemName, ")") : "".concat(memberName, " (PK)");
        return {
            id: memberId,
            name: memberName,
            tag: ((_h = pkMember === null || pkMember === void 0 ? void 0 : pkMember.name) === null || _h === void 0 ? void 0 : _h.trim()) || undefined,
            label: label,
            isPluralKit: true,
            pluralkit: {
                memberId: memberId,
                memberName: memberName,
                systemId: ((_j = pkSystem === null || pkSystem === void 0 ? void 0 : pkSystem.id) === null || _j === void 0 ? void 0 : _j.trim()) || undefined,
                systemName: systemName,
            },
        };
    }
    var senderTag = (0, format_js_1.formatDiscordUserTag)(params.author);
    var senderDisplay = (_m = (_l = (_k = params.member) === null || _k === void 0 ? void 0 : _k.nickname) !== null && _l !== void 0 ? _l : params.author.globalName) !== null && _m !== void 0 ? _m : params.author.username;
    var senderLabel = senderDisplay && senderTag && senderDisplay !== senderTag
        ? "".concat(senderDisplay, " (").concat(senderTag, ")")
        : ((_o = senderDisplay !== null && senderDisplay !== void 0 ? senderDisplay : senderTag) !== null && _o !== void 0 ? _o : params.author.id);
    return {
        id: params.author.id,
        name: (_p = params.author.username) !== null && _p !== void 0 ? _p : undefined,
        tag: senderTag,
        label: senderLabel,
        isPluralKit: false,
    };
}
function resolveDiscordSenderLabel(params) {
    return resolveDiscordSenderIdentity(params).label;
}
