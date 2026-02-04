"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReplyContext = resolveReplyContext;
exports.buildDirectLabel = buildDirectLabel;
exports.buildGuildLabel = buildGuildLabel;
var envelope_js_1 = require("../../auto-reply/envelope.js");
var format_js_1 = require("./format.js");
var sender_identity_js_1 = require("./sender-identity.js");
function resolveReplyContext(message, resolveDiscordMessageText, options) {
    var _a;
    var referenced = message.referencedMessage;
    if (!(referenced === null || referenced === void 0 ? void 0 : referenced.author)) {
        return null;
    }
    var referencedText = resolveDiscordMessageText(referenced, {
        includeForwarded: true,
    });
    if (!referencedText) {
        return null;
    }
    var sender = (0, sender_identity_js_1.resolveDiscordSenderIdentity)({
        author: referenced.author,
        pluralkitInfo: null,
    });
    var fromLabel = referenced.author ? buildDirectLabel(referenced.author, sender.tag) : "Unknown";
    var body = "".concat(referencedText, "\n[discord message id: ").concat(referenced.id, " channel: ").concat(referenced.channelId, " from: ").concat((_a = sender.tag) !== null && _a !== void 0 ? _a : sender.label, " user id:").concat(sender.id, "]");
    return (0, envelope_js_1.formatAgentEnvelope)({
        channel: "Discord",
        from: fromLabel,
        timestamp: (0, format_js_1.resolveTimestampMs)(referenced.timestamp),
        body: body,
        envelope: options === null || options === void 0 ? void 0 : options.envelope,
    });
}
function buildDirectLabel(author, tagOverride) {
    var username = (tagOverride === null || tagOverride === void 0 ? void 0 : tagOverride.trim()) || (0, sender_identity_js_1.resolveDiscordSenderIdentity)({ author: author, pluralkitInfo: null }).tag;
    return "".concat(username !== null && username !== void 0 ? username : "unknown", " user id:").concat(author.id);
}
function buildGuildLabel(params) {
    var _a;
    var guild = params.guild, channelName = params.channelName, channelId = params.channelId;
    return "".concat((_a = guild === null || guild === void 0 ? void 0 : guild.name) !== null && _a !== void 0 ? _a : "Guild", " #").concat(channelName, " channel id:").concat(channelId);
}
