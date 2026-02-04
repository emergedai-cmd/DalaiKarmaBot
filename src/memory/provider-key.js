"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeEmbeddingProviderKey = computeEmbeddingProviderKey;
var headers_fingerprint_js_1 = require("./headers-fingerprint.js");
var internal_js_1 = require("./internal.js");
function computeEmbeddingProviderKey(params) {
    if (params.openAi) {
        var headerNames = (0, headers_fingerprint_js_1.fingerprintHeaderNames)(params.openAi.headers);
        return (0, internal_js_1.hashText)(JSON.stringify({
            provider: "openai",
            baseUrl: params.openAi.baseUrl,
            model: params.openAi.model,
            headerNames: headerNames,
        }));
    }
    if (params.gemini) {
        var headerNames = (0, headers_fingerprint_js_1.fingerprintHeaderNames)(params.gemini.headers);
        return (0, internal_js_1.hashText)(JSON.stringify({
            provider: "gemini",
            baseUrl: params.gemini.baseUrl,
            model: params.gemini.model,
            headerNames: headerNames,
        }));
    }
    return (0, internal_js_1.hashText)(JSON.stringify({ provider: params.providerId, model: params.providerModel }));
}
