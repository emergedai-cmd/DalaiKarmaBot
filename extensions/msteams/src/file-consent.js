"use strict";
/**
 * FileConsentCard utilities for MS Teams large file uploads (>4MB) in personal chats.
 *
 * Teams requires user consent before the bot can upload large files. This module provides
 * utilities for:
 * - Building FileConsentCard attachments (to request upload permission)
 * - Building FileInfoCard attachments (to confirm upload completion)
 * - Parsing fileConsent/invoke activities
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFileConsentCard = buildFileConsentCard;
exports.buildFileInfoCard = buildFileInfoCard;
exports.parseFileConsentInvoke = parseFileConsentInvoke;
exports.uploadToConsentUrl = uploadToConsentUrl;
/**
 * Build a FileConsentCard attachment for requesting upload permission.
 * Use this for files >= 4MB in personal (1:1) chats.
 */
function buildFileConsentCard(params) {
    var _a;
    return {
        contentType: "application/vnd.microsoft.teams.card.file.consent",
        name: params.filename,
        content: {
            description: (_a = params.description) !== null && _a !== void 0 ? _a : "File: ".concat(params.filename),
            sizeInBytes: params.sizeInBytes,
            acceptContext: __assign({ filename: params.filename }, params.context),
            declineContext: __assign({ filename: params.filename }, params.context),
        },
    };
}
/**
 * Build a FileInfoCard attachment for confirming upload completion.
 * Send this after successfully uploading the file to the consent URL.
 */
function buildFileInfoCard(params) {
    return {
        contentType: "application/vnd.microsoft.teams.card.file.info",
        contentUrl: params.contentUrl,
        name: params.filename,
        content: {
            uniqueId: params.uniqueId,
            fileType: params.fileType,
        },
    };
}
/**
 * Parse a fileConsent/invoke activity.
 * Returns null if the activity is not a file consent invoke.
 */
function parseFileConsentInvoke(activity) {
    if (activity.name !== "fileConsent/invoke") {
        return null;
    }
    var value = activity.value;
    if ((value === null || value === void 0 ? void 0 : value.type) !== "fileUpload") {
        return null;
    }
    return {
        action: value.action === "accept" ? "accept" : "decline",
        uploadInfo: value.uploadInfo,
        context: value.context,
    };
}
/**
 * Upload a file to the consent URL provided by Teams.
 * The URL is provided in the fileConsent/invoke response after user accepts.
 */
function uploadToConsentUrl(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, fetchFn(params.url, {
                            method: "PUT",
                            headers: {
                                "Content-Type": (_b = params.contentType) !== null && _b !== void 0 ? _b : "application/octet-stream",
                                "Content-Range": "bytes 0-".concat(params.buffer.length - 1, "/").concat(params.buffer.length),
                            },
                            body: new Uint8Array(params.buffer),
                        })];
                case 1:
                    res = _c.sent();
                    if (!res.ok) {
                        throw new Error("File upload to consent URL failed: ".concat(res.status, " ").concat(res.statusText));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
