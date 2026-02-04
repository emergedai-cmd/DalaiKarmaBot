"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var file_consent_helpers_js_1 = require("./file-consent-helpers.js");
var pendingUploads = require("./pending-uploads.js");
(0, vitest_1.describe)("requiresFileConsent", function () {
    var thresholdBytes = 4 * 1024 * 1024; // 4MB
    (0, vitest_1.it)("returns true for personal chat with non-image", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "personal",
            contentType: "application/pdf",
            bufferSize: 1000,
            thresholdBytes: thresholdBytes,
        })).toBe(true);
    });
    (0, vitest_1.it)("returns true for personal chat with large image", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "personal",
            contentType: "image/png",
            bufferSize: 5 * 1024 * 1024, // 5MB
            thresholdBytes: thresholdBytes,
        })).toBe(true);
    });
    (0, vitest_1.it)("returns false for personal chat with small image", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "personal",
            contentType: "image/png",
            bufferSize: 1000,
            thresholdBytes: thresholdBytes,
        })).toBe(false);
    });
    (0, vitest_1.it)("returns false for group chat with large non-image", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "groupChat",
            contentType: "application/pdf",
            bufferSize: 5 * 1024 * 1024,
            thresholdBytes: thresholdBytes,
        })).toBe(false);
    });
    (0, vitest_1.it)("returns false for channel with large non-image", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "channel",
            contentType: "application/pdf",
            bufferSize: 5 * 1024 * 1024,
            thresholdBytes: thresholdBytes,
        })).toBe(false);
    });
    (0, vitest_1.it)("handles case-insensitive conversation type", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "Personal",
            contentType: "application/pdf",
            bufferSize: 1000,
            thresholdBytes: thresholdBytes,
        })).toBe(true);
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "PERSONAL",
            contentType: "application/pdf",
            bufferSize: 1000,
            thresholdBytes: thresholdBytes,
        })).toBe(true);
    });
    (0, vitest_1.it)("returns false when conversationType is undefined", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: undefined,
            contentType: "application/pdf",
            bufferSize: 1000,
            thresholdBytes: thresholdBytes,
        })).toBe(false);
    });
    (0, vitest_1.it)("returns true for personal chat when contentType is undefined (non-image)", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "personal",
            contentType: undefined,
            bufferSize: 1000,
            thresholdBytes: thresholdBytes,
        })).toBe(true);
    });
    (0, vitest_1.it)("returns true for personal chat with file exactly at threshold", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "personal",
            contentType: "image/jpeg",
            bufferSize: thresholdBytes, // exactly 4MB
            thresholdBytes: thresholdBytes,
        })).toBe(true);
    });
    (0, vitest_1.it)("returns false for personal chat with file just below threshold", function () {
        (0, vitest_1.expect)((0, file_consent_helpers_js_1.requiresFileConsent)({
            conversationType: "personal",
            contentType: "image/jpeg",
            bufferSize: thresholdBytes - 1, // 4MB - 1 byte
            thresholdBytes: thresholdBytes,
        })).toBe(false);
    });
});
(0, vitest_1.describe)("prepareFileConsentActivity", function () {
    var mockUploadId = "test-upload-id-123";
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.spyOn(pendingUploads, "storePendingUpload").mockReturnValue(mockUploadId);
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("creates activity with consent card attachment", function () {
        var result = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
            media: {
                buffer: Buffer.from("test content"),
                filename: "test.pdf",
                contentType: "application/pdf",
            },
            conversationId: "conv123",
            description: "My file",
        });
        (0, vitest_1.expect)(result.uploadId).toBe(mockUploadId);
        (0, vitest_1.expect)(result.activity.type).toBe("message");
        (0, vitest_1.expect)(result.activity.attachments).toHaveLength(1);
        var attachment = result.activity.attachments[0];
        (0, vitest_1.expect)(attachment.contentType).toBe("application/vnd.microsoft.teams.card.file.consent");
        (0, vitest_1.expect)(attachment.name).toBe("test.pdf");
    });
    (0, vitest_1.it)("stores pending upload with correct data", function () {
        var buffer = Buffer.from("test content");
        (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
            media: {
                buffer: buffer,
                filename: "test.pdf",
                contentType: "application/pdf",
            },
            conversationId: "conv123",
            description: "My file",
        });
        (0, vitest_1.expect)(pendingUploads.storePendingUpload).toHaveBeenCalledWith({
            buffer: buffer,
            filename: "test.pdf",
            contentType: "application/pdf",
            conversationId: "conv123",
        });
    });
    (0, vitest_1.it)("uses default description when not provided", function () {
        var result = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
            media: {
                buffer: Buffer.from("test"),
                filename: "document.docx",
                contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
            conversationId: "conv456",
        });
        var attachment = result.activity.attachments[0];
        (0, vitest_1.expect)(attachment.content.description).toBe("File: document.docx");
    });
    (0, vitest_1.it)("uses provided description", function () {
        var result = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
            media: {
                buffer: Buffer.from("test"),
                filename: "report.pdf",
                contentType: "application/pdf",
            },
            conversationId: "conv789",
            description: "Q4 Financial Report",
        });
        var attachment = result.activity.attachments[0];
        (0, vitest_1.expect)(attachment.content.description).toBe("Q4 Financial Report");
    });
    (0, vitest_1.it)("includes uploadId in consent card context", function () {
        var result = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
            media: {
                buffer: Buffer.from("test"),
                filename: "file.txt",
                contentType: "text/plain",
            },
            conversationId: "conv000",
        });
        var attachment = result.activity.attachments[0];
        (0, vitest_1.expect)(attachment.content.acceptContext.uploadId).toBe(mockUploadId);
    });
    (0, vitest_1.it)("handles media without contentType", function () {
        var result = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
            media: {
                buffer: Buffer.from("binary data"),
                filename: "unknown.bin",
            },
            conversationId: "conv111",
        });
        (0, vitest_1.expect)(result.uploadId).toBe(mockUploadId);
        (0, vitest_1.expect)(result.activity.type).toBe("message");
    });
});
