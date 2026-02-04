"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMSTeamsMediaPayload = exports.summarizeMSTeamsHtmlAttachments = exports.buildMSTeamsAttachmentPlaceholder = exports.downloadMSTeamsGraphMedia = exports.buildMSTeamsGraphMessageUrls = exports.downloadMSTeamsImageAttachments = exports.downloadMSTeamsAttachments = void 0;
var download_js_1 = require("./attachments/download.js");
Object.defineProperty(exports, "downloadMSTeamsAttachments", { enumerable: true, get: function () { return download_js_1.downloadMSTeamsAttachments; } });
/** @deprecated Use `downloadMSTeamsAttachments` instead. */
Object.defineProperty(exports, "downloadMSTeamsImageAttachments", { enumerable: true, get: function () { return download_js_1.downloadMSTeamsImageAttachments; } });
var graph_js_1 = require("./attachments/graph.js");
Object.defineProperty(exports, "buildMSTeamsGraphMessageUrls", { enumerable: true, get: function () { return graph_js_1.buildMSTeamsGraphMessageUrls; } });
Object.defineProperty(exports, "downloadMSTeamsGraphMedia", { enumerable: true, get: function () { return graph_js_1.downloadMSTeamsGraphMedia; } });
var html_js_1 = require("./attachments/html.js");
Object.defineProperty(exports, "buildMSTeamsAttachmentPlaceholder", { enumerable: true, get: function () { return html_js_1.buildMSTeamsAttachmentPlaceholder; } });
Object.defineProperty(exports, "summarizeMSTeamsHtmlAttachments", { enumerable: true, get: function () { return html_js_1.summarizeMSTeamsHtmlAttachments; } });
var payload_js_1 = require("./attachments/payload.js");
Object.defineProperty(exports, "buildMSTeamsMediaPayload", { enumerable: true, get: function () { return payload_js_1.buildMSTeamsMediaPayload; } });
