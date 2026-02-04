"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV_BRANCH = exports.DEFAULT_GIT_CHANNEL = exports.DEFAULT_PACKAGE_CHANNEL = void 0;
exports.normalizeUpdateChannel = normalizeUpdateChannel;
exports.channelToNpmTag = channelToNpmTag;
exports.isBetaTag = isBetaTag;
exports.isStableTag = isStableTag;
exports.resolveEffectiveUpdateChannel = resolveEffectiveUpdateChannel;
exports.formatUpdateChannelLabel = formatUpdateChannelLabel;
exports.DEFAULT_PACKAGE_CHANNEL = "stable";
exports.DEFAULT_GIT_CHANNEL = "dev";
exports.DEV_BRANCH = "main";
function normalizeUpdateChannel(value) {
    if (!value) {
        return null;
    }
    var normalized = value.trim().toLowerCase();
    if (normalized === "stable" || normalized === "beta" || normalized === "dev") {
        return normalized;
    }
    return null;
}
function channelToNpmTag(channel) {
    if (channel === "beta") {
        return "beta";
    }
    if (channel === "dev") {
        return "dev";
    }
    return "latest";
}
function isBetaTag(tag) {
    return tag.toLowerCase().includes("-beta");
}
function isStableTag(tag) {
    return !isBetaTag(tag);
}
function resolveEffectiveUpdateChannel(params) {
    var _a, _b;
    if (params.configChannel) {
        return { channel: params.configChannel, source: "config" };
    }
    if (params.installKind === "git") {
        var tag = (_a = params.git) === null || _a === void 0 ? void 0 : _a.tag;
        if (tag) {
            return { channel: isBetaTag(tag) ? "beta" : "stable", source: "git-tag" };
        }
        var branch = (_b = params.git) === null || _b === void 0 ? void 0 : _b.branch;
        if (branch && branch !== "HEAD") {
            return { channel: "dev", source: "git-branch" };
        }
        return { channel: exports.DEFAULT_GIT_CHANNEL, source: "default" };
    }
    if (params.installKind === "package") {
        return { channel: exports.DEFAULT_PACKAGE_CHANNEL, source: "default" };
    }
    return { channel: exports.DEFAULT_PACKAGE_CHANNEL, source: "default" };
}
function formatUpdateChannelLabel(params) {
    if (params.source === "config") {
        return "".concat(params.channel, " (config)");
    }
    if (params.source === "git-tag") {
        return params.gitTag ? "".concat(params.channel, " (").concat(params.gitTag, ")") : "".concat(params.channel, " (tag)");
    }
    if (params.source === "git-branch") {
        return params.gitBranch
            ? "".concat(params.channel, " (").concat(params.gitBranch, ")")
            : "".concat(params.channel, " (branch)");
    }
    return "".concat(params.channel, " (default)");
}
