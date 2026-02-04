"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExecApprovalRequested = parseExecApprovalRequested;
exports.parseExecApprovalResolved = parseExecApprovalResolved;
exports.pruneExecApprovalQueue = pruneExecApprovalQueue;
exports.addExecApproval = addExecApproval;
exports.removeExecApproval = removeExecApproval;
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function parseExecApprovalRequested(payload) {
    if (!isRecord(payload)) {
        return null;
    }
    var id = typeof payload.id === "string" ? payload.id.trim() : "";
    var request = payload.request;
    if (!id || !isRecord(request)) {
        return null;
    }
    var command = typeof request.command === "string" ? request.command.trim() : "";
    if (!command) {
        return null;
    }
    var createdAtMs = typeof payload.createdAtMs === "number" ? payload.createdAtMs : 0;
    var expiresAtMs = typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : 0;
    if (!createdAtMs || !expiresAtMs) {
        return null;
    }
    return {
        id: id,
        request: {
            command: command,
            cwd: typeof request.cwd === "string" ? request.cwd : null,
            host: typeof request.host === "string" ? request.host : null,
            security: typeof request.security === "string" ? request.security : null,
            ask: typeof request.ask === "string" ? request.ask : null,
            agentId: typeof request.agentId === "string" ? request.agentId : null,
            resolvedPath: typeof request.resolvedPath === "string" ? request.resolvedPath : null,
            sessionKey: typeof request.sessionKey === "string" ? request.sessionKey : null,
        },
        createdAtMs: createdAtMs,
        expiresAtMs: expiresAtMs,
    };
}
function parseExecApprovalResolved(payload) {
    if (!isRecord(payload)) {
        return null;
    }
    var id = typeof payload.id === "string" ? payload.id.trim() : "";
    if (!id) {
        return null;
    }
    return {
        id: id,
        decision: typeof payload.decision === "string" ? payload.decision : null,
        resolvedBy: typeof payload.resolvedBy === "string" ? payload.resolvedBy : null,
        ts: typeof payload.ts === "number" ? payload.ts : null,
    };
}
function pruneExecApprovalQueue(queue) {
    var now = Date.now();
    return queue.filter(function (entry) { return entry.expiresAtMs > now; });
}
function addExecApproval(queue, entry) {
    var next = pruneExecApprovalQueue(queue).filter(function (item) { return item.id !== entry.id; });
    next.push(entry);
    return next;
}
function removeExecApproval(queue, id) {
    return pruneExecApprovalQueue(queue).filter(function (entry) { return entry.id !== id; });
}
