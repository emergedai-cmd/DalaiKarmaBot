"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUnknownError = formatUnknownError;
exports.classifyMSTeamsSendError = classifyMSTeamsSendError;
exports.formatMSTeamsSendErrorHint = formatMSTeamsSendErrorHint;
function formatUnknownError(err) {
    var _a, _b;
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === "string") {
        return err;
    }
    if (err === null) {
        return "null";
    }
    if (err === undefined) {
        return "undefined";
    }
    if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") {
        return String(err);
    }
    if (typeof err === "symbol") {
        return (_a = err.description) !== null && _a !== void 0 ? _a : err.toString();
    }
    if (typeof err === "function") {
        return err.name ? "[function ".concat(err.name, "]") : "[function]";
    }
    try {
        return (_b = JSON.stringify(err)) !== null && _b !== void 0 ? _b : "unknown error";
    }
    catch (_c) {
        return "unknown error";
    }
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function extractStatusCode(err) {
    var _a;
    if (!isRecord(err)) {
        return null;
    }
    var direct = (_a = err.statusCode) !== null && _a !== void 0 ? _a : err.status;
    if (typeof direct === "number" && Number.isFinite(direct)) {
        return direct;
    }
    if (typeof direct === "string") {
        var parsed = Number.parseInt(direct, 10);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    var response = err.response;
    if (isRecord(response)) {
        var status_1 = response.status;
        if (typeof status_1 === "number" && Number.isFinite(status_1)) {
            return status_1;
        }
        if (typeof status_1 === "string") {
            var parsed = Number.parseInt(status_1, 10);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
    }
    return null;
}
function extractRetryAfterMs(err) {
    var _a, _b, _c;
    if (!isRecord(err)) {
        return null;
    }
    var direct = (_a = err.retryAfterMs) !== null && _a !== void 0 ? _a : err.retry_after_ms;
    if (typeof direct === "number" && Number.isFinite(direct) && direct >= 0) {
        return direct;
    }
    var retryAfter = (_b = err.retryAfter) !== null && _b !== void 0 ? _b : err.retry_after;
    if (typeof retryAfter === "number" && Number.isFinite(retryAfter)) {
        return retryAfter >= 0 ? retryAfter * 1000 : null;
    }
    if (typeof retryAfter === "string") {
        var parsed = Number.parseFloat(retryAfter);
        if (Number.isFinite(parsed) && parsed >= 0) {
            return parsed * 1000;
        }
    }
    var response = err.response;
    if (!isRecord(response)) {
        return null;
    }
    var headers = response.headers;
    if (!headers) {
        return null;
    }
    if (isRecord(headers)) {
        var raw = (_c = headers["retry-after"]) !== null && _c !== void 0 ? _c : headers["Retry-After"];
        if (typeof raw === "string") {
            var parsed = Number.parseFloat(raw);
            if (Number.isFinite(parsed) && parsed >= 0) {
                return parsed * 1000;
            }
        }
    }
    // Fetch Headers-like interface
    if (typeof headers === "object" &&
        headers !== null &&
        "get" in headers &&
        typeof headers.get === "function") {
        var raw = headers.get("retry-after");
        if (raw) {
            var parsed = Number.parseFloat(raw);
            if (Number.isFinite(parsed) && parsed >= 0) {
                return parsed * 1000;
            }
        }
    }
    return null;
}
/**
 * Classify outbound send errors for safe retries and actionable logs.
 *
 * Important: We only mark errors as retryable when we have an explicit HTTP
 * status code that indicates the message was not accepted (e.g. 429, 5xx).
 * For transport-level errors where delivery is ambiguous, we prefer to avoid
 * retries to reduce the chance of duplicate posts.
 */
function classifyMSTeamsSendError(err) {
    var statusCode = extractStatusCode(err);
    var retryAfterMs = extractRetryAfterMs(err);
    if (statusCode === 401 || statusCode === 403) {
        return { kind: "auth", statusCode: statusCode };
    }
    if (statusCode === 429) {
        return {
            kind: "throttled",
            statusCode: statusCode,
            retryAfterMs: retryAfterMs !== null && retryAfterMs !== void 0 ? retryAfterMs : undefined,
        };
    }
    if (statusCode === 408 || (statusCode != null && statusCode >= 500)) {
        return {
            kind: "transient",
            statusCode: statusCode,
            retryAfterMs: retryAfterMs !== null && retryAfterMs !== void 0 ? retryAfterMs : undefined,
        };
    }
    if (statusCode != null && statusCode >= 400) {
        return { kind: "permanent", statusCode: statusCode };
    }
    return {
        kind: "unknown",
        statusCode: statusCode !== null && statusCode !== void 0 ? statusCode : undefined,
        retryAfterMs: retryAfterMs !== null && retryAfterMs !== void 0 ? retryAfterMs : undefined,
    };
}
function formatMSTeamsSendErrorHint(classification) {
    if (classification.kind === "auth") {
        return "check msteams appId/appPassword/tenantId (or env vars MSTEAMS_APP_ID/MSTEAMS_APP_PASSWORD/MSTEAMS_TENANT_ID)";
    }
    if (classification.kind === "throttled") {
        return "Teams throttled the bot; backing off may help";
    }
    if (classification.kind === "transient") {
        return "transient Teams/Bot Framework error; retry may succeed";
    }
    return undefined;
}
