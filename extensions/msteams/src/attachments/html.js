"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeMSTeamsHtmlAttachments = summarizeMSTeamsHtmlAttachments;
exports.buildMSTeamsAttachmentPlaceholder = buildMSTeamsAttachmentPlaceholder;
var shared_js_1 = require("./shared.js");
function summarizeMSTeamsHtmlAttachments(attachments) {
    var _a, _b;
    var list = Array.isArray(attachments) ? attachments : [];
    if (list.length === 0) {
        return undefined;
    }
    var htmlAttachments = 0;
    var imgTags = 0;
    var dataImages = 0;
    var cidImages = 0;
    var srcHosts = new Set();
    var attachmentTags = 0;
    var attachmentIds = new Set();
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var att = list_1[_i];
        var html = (0, shared_js_1.extractHtmlFromAttachment)(att);
        if (!html) {
            continue;
        }
        htmlAttachments += 1;
        shared_js_1.IMG_SRC_RE.lastIndex = 0;
        var match = shared_js_1.IMG_SRC_RE.exec(html);
        while (match) {
            imgTags += 1;
            var src = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim();
            if (src) {
                if (src.startsWith("data:")) {
                    dataImages += 1;
                }
                else if (src.startsWith("cid:")) {
                    cidImages += 1;
                }
                else {
                    srcHosts.add((0, shared_js_1.safeHostForUrl)(src));
                }
            }
            match = shared_js_1.IMG_SRC_RE.exec(html);
        }
        shared_js_1.ATTACHMENT_TAG_RE.lastIndex = 0;
        var attachmentMatch = shared_js_1.ATTACHMENT_TAG_RE.exec(html);
        while (attachmentMatch) {
            attachmentTags += 1;
            var id = (_b = attachmentMatch[1]) === null || _b === void 0 ? void 0 : _b.trim();
            if (id) {
                attachmentIds.add(id);
            }
            attachmentMatch = shared_js_1.ATTACHMENT_TAG_RE.exec(html);
        }
    }
    if (htmlAttachments === 0) {
        return undefined;
    }
    return {
        htmlAttachments: htmlAttachments,
        imgTags: imgTags,
        dataImages: dataImages,
        cidImages: cidImages,
        srcHosts: Array.from(srcHosts).slice(0, 5),
        attachmentTags: attachmentTags,
        attachmentIds: Array.from(attachmentIds).slice(0, 5),
    };
}
function buildMSTeamsAttachmentPlaceholder(attachments) {
    var list = Array.isArray(attachments) ? attachments : [];
    if (list.length === 0) {
        return "";
    }
    var imageCount = list.filter(shared_js_1.isLikelyImageAttachment).length;
    var inlineCount = (0, shared_js_1.extractInlineImageCandidates)(list).length;
    var totalImages = imageCount + inlineCount;
    if (totalImages > 0) {
        return "<media:image>".concat(totalImages > 1 ? " (".concat(totalImages, " images)") : "");
    }
    var count = list.length;
    return "<media:document>".concat(count > 1 ? " (".concat(count, " files)") : "");
}
