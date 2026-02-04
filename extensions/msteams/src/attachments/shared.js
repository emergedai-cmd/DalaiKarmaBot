"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRAPH_ROOT = exports.DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST = exports.DEFAULT_MEDIA_HOST_ALLOWLIST = exports.ATTACHMENT_TAG_RE = exports.IMG_SRC_RE = exports.IMAGE_EXT_RE = void 0;
exports.isRecord = isRecord;
exports.normalizeContentType = normalizeContentType;
exports.inferPlaceholder = inferPlaceholder;
exports.isLikelyImageAttachment = isLikelyImageAttachment;
exports.isDownloadableAttachment = isDownloadableAttachment;
exports.extractHtmlFromAttachment = extractHtmlFromAttachment;
exports.extractInlineImageCandidates = extractInlineImageCandidates;
exports.safeHostForUrl = safeHostForUrl;
exports.resolveAllowedHosts = resolveAllowedHosts;
exports.resolveAuthAllowedHosts = resolveAuthAllowedHosts;
exports.isUrlAllowed = isUrlAllowed;
exports.IMAGE_EXT_RE = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;
exports.IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
exports.ATTACHMENT_TAG_RE = /<attachment[^>]+id=["']([^"']+)["'][^>]*>/gi;
exports.DEFAULT_MEDIA_HOST_ALLOWLIST = [
    "graph.microsoft.com",
    "graph.microsoft.us",
    "graph.microsoft.de",
    "graph.microsoft.cn",
    "sharepoint.com",
    "sharepoint.us",
    "sharepoint.de",
    "sharepoint.cn",
    "sharepoint-df.com",
    "1drv.ms",
    "onedrive.com",
    "teams.microsoft.com",
    "teams.cdn.office.net",
    "statics.teams.cdn.office.net",
    "office.com",
    "office.net",
    // Azure Media Services / Skype CDN for clipboard-pasted images
    "asm.skype.com",
    "ams.skype.com",
    "media.ams.skype.com",
    // Bot Framework attachment URLs
    "trafficmanager.net",
    "blob.core.windows.net",
    "azureedge.net",
    "microsoft.com",
];
exports.DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST = [
    "api.botframework.com",
    "botframework.com",
    "graph.microsoft.com",
    "graph.microsoft.us",
    "graph.microsoft.de",
    "graph.microsoft.cn",
];
exports.GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function normalizeContentType(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    var trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}
function inferPlaceholder(params) {
    var _a, _b, _c, _d, _e, _f;
    var mime = (_b = (_a = params.contentType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    var name = (_d = (_c = params.fileName) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : "";
    var fileType = (_f = (_e = params.fileType) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : "";
    var looksLikeImage = mime.startsWith("image/") || exports.IMAGE_EXT_RE.test(name) || exports.IMAGE_EXT_RE.test("x.".concat(fileType));
    return looksLikeImage ? "<media:image>" : "<media:document>";
}
function isLikelyImageAttachment(att) {
    var _a;
    var contentType = (_a = normalizeContentType(att.contentType)) !== null && _a !== void 0 ? _a : "";
    var name = typeof att.name === "string" ? att.name : "";
    if (contentType.startsWith("image/")) {
        return true;
    }
    if (exports.IMAGE_EXT_RE.test(name)) {
        return true;
    }
    if (contentType === "application/vnd.microsoft.teams.file.download.info" &&
        isRecord(att.content)) {
        var fileType = typeof att.content.fileType === "string" ? att.content.fileType : "";
        if (fileType && exports.IMAGE_EXT_RE.test("x.".concat(fileType))) {
            return true;
        }
        var fileName = typeof att.content.fileName === "string" ? att.content.fileName : "";
        if (fileName && exports.IMAGE_EXT_RE.test(fileName)) {
            return true;
        }
    }
    return false;
}
/**
 * Returns true if the attachment can be downloaded (any file type).
 * Used when downloading all files, not just images.
 */
function isDownloadableAttachment(att) {
    var _a;
    var contentType = (_a = normalizeContentType(att.contentType)) !== null && _a !== void 0 ? _a : "";
    // Teams file download info always has a downloadUrl
    if (contentType === "application/vnd.microsoft.teams.file.download.info" &&
        isRecord(att.content) &&
        typeof att.content.downloadUrl === "string") {
        return true;
    }
    // Any attachment with a contentUrl can be downloaded
    if (typeof att.contentUrl === "string" && att.contentUrl.trim()) {
        return true;
    }
    return false;
}
function isHtmlAttachment(att) {
    var _a;
    var contentType = (_a = normalizeContentType(att.contentType)) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith("text/html");
}
function extractHtmlFromAttachment(att) {
    if (!isHtmlAttachment(att)) {
        return undefined;
    }
    if (typeof att.content === "string") {
        return att.content;
    }
    if (!isRecord(att.content)) {
        return undefined;
    }
    var text = typeof att.content.text === "string"
        ? att.content.text
        : typeof att.content.body === "string"
            ? att.content.body
            : typeof att.content.content === "string"
                ? att.content.content
                : undefined;
    return text;
}
function decodeDataImage(src) {
    var _a, _b;
    var match = /^data:(image\/[a-z0-9.+-]+)?(;base64)?,(.*)$/i.exec(src);
    if (!match) {
        return null;
    }
    var contentType = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    var isBase64 = Boolean(match[2]);
    if (!isBase64) {
        return null;
    }
    var payload = (_b = match[3]) !== null && _b !== void 0 ? _b : "";
    if (!payload) {
        return null;
    }
    try {
        var data = Buffer.from(payload, "base64");
        return { kind: "data", data: data, contentType: contentType, placeholder: "<media:image>" };
    }
    catch (_c) {
        return null;
    }
}
function fileHintFromUrl(src) {
    try {
        var url = new URL(src);
        var name_1 = url.pathname.split("/").pop();
        return name_1 || undefined;
    }
    catch (_a) {
        return undefined;
    }
}
function extractInlineImageCandidates(attachments) {
    var _a;
    var out = [];
    for (var _i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
        var att = attachments_1[_i];
        var html = extractHtmlFromAttachment(att);
        if (!html) {
            continue;
        }
        exports.IMG_SRC_RE.lastIndex = 0;
        var match = exports.IMG_SRC_RE.exec(html);
        while (match) {
            var src = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim();
            if (src && !src.startsWith("cid:")) {
                if (src.startsWith("data:")) {
                    var decoded = decodeDataImage(src);
                    if (decoded) {
                        out.push(decoded);
                    }
                }
                else {
                    out.push({
                        kind: "url",
                        url: src,
                        fileHint: fileHintFromUrl(src),
                        placeholder: "<media:image>",
                    });
                }
            }
            match = exports.IMG_SRC_RE.exec(html);
        }
    }
    return out;
}
function safeHostForUrl(url) {
    try {
        return new URL(url).hostname.toLowerCase();
    }
    catch (_a) {
        return "invalid-url";
    }
}
function normalizeAllowHost(value) {
    var trimmed = value.trim().toLowerCase();
    if (!trimmed) {
        return "";
    }
    if (trimmed === "*") {
        return "*";
    }
    return trimmed.replace(/^\*\.?/, "");
}
function resolveAllowedHosts(input) {
    if (!Array.isArray(input) || input.length === 0) {
        return exports.DEFAULT_MEDIA_HOST_ALLOWLIST.slice();
    }
    var normalized = input.map(normalizeAllowHost).filter(Boolean);
    if (normalized.includes("*")) {
        return ["*"];
    }
    return normalized;
}
function resolveAuthAllowedHosts(input) {
    if (!Array.isArray(input) || input.length === 0) {
        return exports.DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST.slice();
    }
    var normalized = input.map(normalizeAllowHost).filter(Boolean);
    if (normalized.includes("*")) {
        return ["*"];
    }
    return normalized;
}
function isHostAllowed(host, allowlist) {
    if (allowlist.includes("*")) {
        return true;
    }
    var normalized = host.toLowerCase();
    return allowlist.some(function (entry) { return normalized === entry || normalized.endsWith(".".concat(entry)); });
}
function isUrlAllowed(url, allowlist) {
    try {
        var parsed = new URL(url);
        if (parsed.protocol !== "https:") {
            return false;
        }
        return isHostAllowed(parsed.hostname, allowlist);
    }
    catch (_a) {
        return false;
    }
}
