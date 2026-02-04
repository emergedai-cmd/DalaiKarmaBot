"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMentions = resolveMentions;
var runtime_js_1 = require("../../runtime.js");
function resolveMentions(params) {
    var _a;
    var mentions = params.content["m.mentions"];
    var mentionedUsers = Array.isArray(mentions === null || mentions === void 0 ? void 0 : mentions.user_ids)
        ? new Set(mentions.user_ids)
        : new Set();
    var wasMentioned = Boolean(mentions === null || mentions === void 0 ? void 0 : mentions.room) ||
        (params.userId ? mentionedUsers.has(params.userId) : false) ||
        (0, runtime_js_1.getMatrixRuntime)().channel.mentions.matchesMentionPatterns((_a = params.text) !== null && _a !== void 0 ? _a : "", params.mentionRegexes);
    return { wasMentioned: wasMentioned, hasExplicitMention: Boolean(mentions) };
}
