"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAllowListLower = normalizeAllowListLower;
exports.resolveMatrixAllowListMatch = resolveMatrixAllowListMatch;
exports.resolveMatrixAllowListMatches = resolveMatrixAllowListMatches;
function normalizeAllowList(list) {
    return (list !== null && list !== void 0 ? list : []).map(function (entry) { return String(entry).trim(); }).filter(Boolean);
}
function normalizeAllowListLower(list) {
    return normalizeAllowList(list).map(function (entry) { return entry.toLowerCase(); });
}
function normalizeMatrixUser(raw) {
    return (raw !== null && raw !== void 0 ? raw : "").trim().toLowerCase();
}
function resolveMatrixAllowListMatch(params) {
    var _a;
    var allowList = params.allowList;
    if (allowList.length === 0) {
        return { allowed: false };
    }
    if (allowList.includes("*")) {
        return { allowed: true, matchKey: "*", matchSource: "wildcard" };
    }
    var userId = normalizeMatrixUser(params.userId);
    var userName = normalizeMatrixUser(params.userName);
    var localPart = userId.startsWith("@") ? ((_a = userId.slice(1).split(":")[0]) !== null && _a !== void 0 ? _a : "") : "";
    var candidates = [
        { value: userId, source: "id" },
        { value: userId ? "matrix:".concat(userId) : "", source: "prefixed-id" },
        { value: userId ? "user:".concat(userId) : "", source: "prefixed-user" },
        { value: userName, source: "name" },
        { value: localPart, source: "localpart" },
    ];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (!candidate.value) {
            continue;
        }
        if (allowList.includes(candidate.value)) {
            return {
                allowed: true,
                matchKey: candidate.value,
                matchSource: candidate.source,
            };
        }
    }
    return { allowed: false };
}
function resolveMatrixAllowListMatches(params) {
    return resolveMatrixAllowListMatch(params).allowed;
}
