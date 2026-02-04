"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateCloseReason = truncateCloseReason;
var node_buffer_1 = require("node:buffer");
var CLOSE_REASON_MAX_BYTES = 120;
function truncateCloseReason(reason, maxBytes) {
    if (maxBytes === void 0) { maxBytes = CLOSE_REASON_MAX_BYTES; }
    if (!reason) {
        return "invalid handshake";
    }
    var buf = node_buffer_1.Buffer.from(reason);
    if (buf.length <= maxBytes) {
        return reason;
    }
    return buf.subarray(0, maxBytes).toString();
}
