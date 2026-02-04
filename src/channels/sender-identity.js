"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSenderIdentity = validateSenderIdentity;
var chat_type_js_1 = require("./chat-type.js");
function validateSenderIdentity(ctx) {
    var _a, _b, _c, _d;
    var issues = [];
    var chatType = (0, chat_type_js_1.normalizeChatType)(ctx.ChatType);
    var isDirect = chatType === "direct";
    var senderId = ((_a = ctx.SenderId) === null || _a === void 0 ? void 0 : _a.trim()) || "";
    var senderName = ((_b = ctx.SenderName) === null || _b === void 0 ? void 0 : _b.trim()) || "";
    var senderUsername = ((_c = ctx.SenderUsername) === null || _c === void 0 ? void 0 : _c.trim()) || "";
    var senderE164 = ((_d = ctx.SenderE164) === null || _d === void 0 ? void 0 : _d.trim()) || "";
    if (!isDirect) {
        if (!senderId && !senderName && !senderUsername && !senderE164) {
            issues.push("missing sender identity (SenderId/SenderName/SenderUsername/SenderE164)");
        }
    }
    if (senderE164) {
        if (!/^\+\d{3,}$/.test(senderE164)) {
            issues.push("invalid SenderE164: ".concat(senderE164));
        }
    }
    if (senderUsername) {
        if (senderUsername.includes("@")) {
            issues.push("SenderUsername should not include \"@\": ".concat(senderUsername));
        }
        if (/\s/.test(senderUsername)) {
            issues.push("SenderUsername should not include whitespace: ".concat(senderUsername));
        }
    }
    if (ctx.SenderId != null && !senderId) {
        issues.push("SenderId is set but empty");
    }
    return issues;
}
