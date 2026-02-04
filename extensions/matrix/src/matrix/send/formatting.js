"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTextContent = buildTextContent;
exports.applyMatrixFormatting = applyMatrixFormatting;
exports.buildReplyRelation = buildReplyRelation;
exports.buildThreadRelation = buildThreadRelation;
exports.resolveMatrixMsgType = resolveMatrixMsgType;
exports.resolveMatrixVoiceDecision = resolveMatrixVoiceDecision;
var runtime_js_1 = require("../../runtime.js");
var format_js_1 = require("../format.js");
var types_js_1 = require("./types.js");
var getCore = function () { return (0, runtime_js_1.getMatrixRuntime)(); };
function buildTextContent(body, relation) {
    var content = relation
        ? {
            msgtype: types_js_1.MsgType.Text,
            body: body,
            "m.relates_to": relation,
        }
        : {
            msgtype: types_js_1.MsgType.Text,
            body: body,
        };
    applyMatrixFormatting(content, body);
    return content;
}
function applyMatrixFormatting(content, body) {
    var formatted = (0, format_js_1.markdownToMatrixHtml)(body !== null && body !== void 0 ? body : "");
    if (!formatted) {
        return;
    }
    content.format = "org.matrix.custom.html";
    content.formatted_body = formatted;
}
function buildReplyRelation(replyToId) {
    var trimmed = replyToId === null || replyToId === void 0 ? void 0 : replyToId.trim();
    if (!trimmed) {
        return undefined;
    }
    return { "m.in_reply_to": { event_id: trimmed } };
}
function buildThreadRelation(threadId, replyToId) {
    var trimmed = threadId.trim();
    return {
        rel_type: types_js_1.RelationType.Thread,
        event_id: trimmed,
        is_falling_back: true,
        "m.in_reply_to": { event_id: (replyToId === null || replyToId === void 0 ? void 0 : replyToId.trim()) || trimmed },
    };
}
function resolveMatrixMsgType(contentType, _fileName) {
    var kind = getCore().media.mediaKindFromMime(contentType !== null && contentType !== void 0 ? contentType : "");
    switch (kind) {
        case "image":
            return types_js_1.MsgType.Image;
        case "audio":
            return types_js_1.MsgType.Audio;
        case "video":
            return types_js_1.MsgType.Video;
        default:
            return types_js_1.MsgType.File;
    }
}
function resolveMatrixVoiceDecision(opts) {
    if (!opts.wantsVoice) {
        return { useVoice: false };
    }
    if (getCore().media.isVoiceCompatibleAudio({
        contentType: opts.contentType,
        fileName: opts.fileName,
    })) {
        return { useVoice: true };
    }
    return { useVoice: false };
}
