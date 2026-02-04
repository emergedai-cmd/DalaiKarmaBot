"use strict";
/**
 * In-memory storage for files awaiting user consent in the FileConsentCard flow.
 *
 * When sending large files (>=4MB) in personal chats, Teams requires user consent
 * before upload. This module stores the file data temporarily until the user
 * accepts or declines, or until the TTL expires.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePendingUpload = storePendingUpload;
exports.getPendingUpload = getPendingUpload;
exports.removePendingUpload = removePendingUpload;
exports.getPendingUploadCount = getPendingUploadCount;
exports.clearPendingUploads = clearPendingUploads;
var node_crypto_1 = require("node:crypto");
var pendingUploads = new Map();
/** TTL for pending uploads: 5 minutes */
var PENDING_UPLOAD_TTL_MS = 5 * 60 * 1000;
/**
 * Store a file pending user consent.
 * Returns the upload ID to include in the FileConsentCard context.
 */
function storePendingUpload(upload) {
    var id = node_crypto_1.default.randomUUID();
    var entry = __assign(__assign({}, upload), { id: id, createdAt: Date.now() });
    pendingUploads.set(id, entry);
    // Auto-cleanup after TTL
    setTimeout(function () {
        pendingUploads.delete(id);
    }, PENDING_UPLOAD_TTL_MS);
    return id;
}
/**
 * Retrieve a pending upload by ID.
 * Returns undefined if not found or expired.
 */
function getPendingUpload(id) {
    if (!id) {
        return undefined;
    }
    var entry = pendingUploads.get(id);
    if (!entry) {
        return undefined;
    }
    // Check if expired (in case timeout hasn't fired yet)
    if (Date.now() - entry.createdAt > PENDING_UPLOAD_TTL_MS) {
        pendingUploads.delete(id);
        return undefined;
    }
    return entry;
}
/**
 * Remove a pending upload (after successful upload or user decline).
 */
function removePendingUpload(id) {
    if (id) {
        pendingUploads.delete(id);
    }
}
/**
 * Get the count of pending uploads (for monitoring/debugging).
 */
function getPendingUploadCount() {
    return pendingUploads.size;
}
/**
 * Clear all pending uploads (for testing).
 */
function clearPendingUploads() {
    pendingUploads.clear();
}
