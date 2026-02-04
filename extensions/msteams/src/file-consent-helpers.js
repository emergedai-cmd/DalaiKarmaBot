"use strict";
/**
 * Shared helpers for FileConsentCard flow in MSTeams.
 *
 * FileConsentCard is required for:
 * - Personal (1:1) chats with large files (>=4MB)
 * - Personal chats with non-image files (PDFs, documents, etc.)
 *
 * This module consolidates the logic used by both send.ts (proactive sends)
 * and messenger.ts (reply path) to avoid duplication.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFileConsentActivity = prepareFileConsentActivity;
exports.requiresFileConsent = requiresFileConsent;
var file_consent_js_1 = require("./file-consent.js");
var pending_uploads_js_1 = require("./pending-uploads.js");
/**
 * Prepare a FileConsentCard activity for large files or non-images in personal chats.
 * Returns the activity object and uploadId - caller is responsible for sending.
 */
function prepareFileConsentActivity(params) {
    var media = params.media, conversationId = params.conversationId, description = params.description;
    var uploadId = (0, pending_uploads_js_1.storePendingUpload)({
        buffer: media.buffer,
        filename: media.filename,
        contentType: media.contentType,
        conversationId: conversationId,
    });
    var consentCard = (0, file_consent_js_1.buildFileConsentCard)({
        filename: media.filename,
        description: description || "File: ".concat(media.filename),
        sizeInBytes: media.buffer.length,
        context: { uploadId: uploadId },
    });
    var activity = {
        type: "message",
        attachments: [consentCard],
    };
    return { activity: activity, uploadId: uploadId };
}
/**
 * Check if a file requires FileConsentCard flow.
 * True for: personal chat AND (large file OR non-image)
 */
function requiresFileConsent(params) {
    var _a, _b, _c;
    var isPersonal = ((_a = params.conversationType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "personal";
    var isImage = (_c = (_b = params.contentType) === null || _b === void 0 ? void 0 : _b.startsWith("image/")) !== null && _c !== void 0 ? _c : false;
    var isLargeFile = params.bufferSize >= params.thresholdBytes;
    return isPersonal && (isLargeFile || !isImage);
}
