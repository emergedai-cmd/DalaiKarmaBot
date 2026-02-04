"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectInboundContextContract = expectInboundContextContract;
var vitest_1 = require("vitest");
var chat_type_js_1 = require("../../src/channels/chat-type.js");
var conversation_label_js_1 = require("../../src/channels/conversation-label.js");
var sender_identity_js_1 = require("../../src/channels/sender-identity.js");
function expectInboundContextContract(ctx) {
    var _a;
    (0, vitest_1.expect)((0, sender_identity_js_1.validateSenderIdentity)(ctx)).toEqual([]);
    (0, vitest_1.expect)(ctx.Body).toBeTypeOf("string");
    (0, vitest_1.expect)(ctx.BodyForAgent).toBeTypeOf("string");
    (0, vitest_1.expect)(ctx.BodyForCommands).toBeTypeOf("string");
    var chatType = (0, chat_type_js_1.normalizeChatType)(ctx.ChatType);
    if (chatType && chatType !== "direct") {
        var label = ((_a = ctx.ConversationLabel) === null || _a === void 0 ? void 0 : _a.trim()) || (0, conversation_label_js_1.resolveConversationLabel)(ctx);
        (0, vitest_1.expect)(label).toBeTruthy();
    }
}
