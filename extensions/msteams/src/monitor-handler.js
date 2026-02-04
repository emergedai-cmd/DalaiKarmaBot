"use strict";
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
exports.registerMSTeamsHandlers = registerMSTeamsHandlers;
var file_consent_js_1 = require("./file-consent.js");
var message_handler_js_1 = require("./monitor-handler/message-handler.js");
var pending_uploads_js_1 = require("./pending-uploads.js");
/**
 * Handle fileConsent/invoke activities for large file uploads.
 */
function handleFileConsentInvoke(context, log) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, consentResponse, uploadId, pendingFile, fileInfoCard, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    activity = context.activity;
                    if (activity.type !== "invoke" || activity.name !== "fileConsent/invoke") {
                        return [2 /*return*/, false];
                    }
                    consentResponse = (0, file_consent_js_1.parseFileConsentInvoke)(activity);
                    if (!consentResponse) {
                        log.debug("invalid file consent invoke", { value: activity.value });
                        return [2 /*return*/, false];
                    }
                    uploadId = typeof ((_a = consentResponse.context) === null || _a === void 0 ? void 0 : _a.uploadId) === "string"
                        ? consentResponse.context.uploadId
                        : undefined;
                    if (!(consentResponse.action === "accept" && consentResponse.uploadInfo)) return [3 /*break*/, 11];
                    pendingFile = (0, pending_uploads_js_1.getPendingUpload)(uploadId);
                    if (!pendingFile) return [3 /*break*/, 8];
                    log.debug("user accepted file consent, uploading", {
                        uploadId: uploadId,
                        filename: pendingFile.filename,
                        size: pendingFile.buffer.length,
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 6, 7]);
                    // Upload file to the provided URL
                    return [4 /*yield*/, (0, file_consent_js_1.uploadToConsentUrl)({
                            url: consentResponse.uploadInfo.uploadUrl,
                            buffer: pendingFile.buffer,
                            contentType: pendingFile.contentType,
                        })];
                case 2:
                    // Upload file to the provided URL
                    _b.sent();
                    fileInfoCard = (0, file_consent_js_1.buildFileInfoCard)({
                        filename: consentResponse.uploadInfo.name,
                        contentUrl: consentResponse.uploadInfo.contentUrl,
                        uniqueId: consentResponse.uploadInfo.uniqueId,
                        fileType: consentResponse.uploadInfo.fileType,
                    });
                    return [4 /*yield*/, context.sendActivity({
                            type: "message",
                            attachments: [fileInfoCard],
                        })];
                case 3:
                    _b.sent();
                    log.info("file upload complete", {
                        uploadId: uploadId,
                        filename: consentResponse.uploadInfo.name,
                        uniqueId: consentResponse.uploadInfo.uniqueId,
                    });
                    return [3 /*break*/, 7];
                case 4:
                    err_1 = _b.sent();
                    log.debug("file upload failed", { uploadId: uploadId, error: String(err_1) });
                    return [4 /*yield*/, context.sendActivity("File upload failed: ".concat(String(err_1)))];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    (0, pending_uploads_js_1.removePendingUpload)(uploadId);
                    return [7 /*endfinally*/];
                case 7: return [3 /*break*/, 10];
                case 8:
                    log.debug("pending file not found for consent", { uploadId: uploadId });
                    return [4 /*yield*/, context.sendActivity("The file upload request has expired. Please try sending the file again.")];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    // User declined
                    log.debug("user declined file consent", { uploadId: uploadId });
                    (0, pending_uploads_js_1.removePendingUpload)(uploadId);
                    _b.label = 12;
                case 12: return [2 /*return*/, true];
            }
        });
    });
}
function registerMSTeamsHandlers(handler, deps) {
    var _this = this;
    var handleTeamsMessage = (0, message_handler_js_1.createMSTeamsMessageHandler)(deps);
    // Wrap the original run method to intercept invokes
    var originalRun = handler.run;
    if (originalRun) {
        handler.run = function (context) { return __awaiter(_this, void 0, void 0, function () {
            var ctx, handled;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ctx = context;
                        if (!(((_a = ctx.activity) === null || _a === void 0 ? void 0 : _a.type) === "invoke" && ((_b = ctx.activity) === null || _b === void 0 ? void 0 : _b.name) === "fileConsent/invoke")) return [3 /*break*/, 3];
                        return [4 /*yield*/, handleFileConsentInvoke(ctx, deps.log)];
                    case 1:
                        handled = _c.sent();
                        if (!handled) return [3 /*break*/, 3];
                        // Send invoke response for file consent
                        return [4 /*yield*/, ctx.sendActivity({ type: "invokeResponse", value: { status: 200 } })];
                    case 2:
                        // Send invoke response for file consent
                        _c.sent();
                        return [2 /*return*/];
                    case 3: return [2 /*return*/, originalRun.call(handler, context)];
                }
            });
        }); };
    }
    handler.onMessage(function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, handleTeamsMessage(context)];
                case 1:
                    _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _c.sent();
                    (_b = (_a = deps.runtime).error) === null || _b === void 0 ? void 0 : _b.call(_a, "msteams handler failed: ".concat(String(err_2)));
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, next()];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    handler.onMembersAdded(function (context, next) { return __awaiter(_this, void 0, void 0, function () {
        var membersAdded, _i, membersAdded_1, member;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    membersAdded = (_b = (_a = context.activity) === null || _a === void 0 ? void 0 : _a.membersAdded) !== null && _b !== void 0 ? _b : [];
                    for (_i = 0, membersAdded_1 = membersAdded; _i < membersAdded_1.length; _i++) {
                        member = membersAdded_1[_i];
                        if (member.id !== ((_d = (_c = context.activity) === null || _c === void 0 ? void 0 : _c.recipient) === null || _d === void 0 ? void 0 : _d.id)) {
                            deps.log.debug("member added", { member: member.id });
                            // Don't send welcome message - let the user initiate conversation.
                        }
                    }
                    return [4 /*yield*/, next()];
                case 1:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    return handler;
}
