"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMatrixThreadTarget = resolveMatrixThreadTarget;
exports.resolveMatrixThreadRootId = resolveMatrixThreadRootId;
var RelationType = {
    Thread: "m.thread",
};
function resolveMatrixThreadTarget(params) {
    var threadReplies = params.threadReplies, messageId = params.messageId, threadRootId = params.threadRootId;
    if (threadReplies === "off") {
        return undefined;
    }
    var isThreadRoot = params.isThreadRoot === true;
    var hasInboundThread = Boolean(threadRootId && threadRootId !== messageId && !isThreadRoot);
    if (threadReplies === "inbound") {
        return hasInboundThread ? threadRootId : undefined;
    }
    if (threadReplies === "always") {
        return threadRootId !== null && threadRootId !== void 0 ? threadRootId : messageId;
    }
    return undefined;
}
function resolveMatrixThreadRootId(params) {
    var relates = params.content["m.relates_to"];
    if (!relates || typeof relates !== "object") {
        return undefined;
    }
    if ("rel_type" in relates && relates.rel_type === RelationType.Thread) {
        if ("event_id" in relates && typeof relates.event_id === "string") {
            return relates.event_id;
        }
        if ("m.in_reply_to" in relates &&
            typeof relates["m.in_reply_to"] === "object" &&
            relates["m.in_reply_to"] &&
            "event_id" in relates["m.in_reply_to"] &&
            typeof relates["m.in_reply_to"].event_id === "string") {
            return relates["m.in_reply_to"].event_id;
        }
    }
    return undefined;
}
