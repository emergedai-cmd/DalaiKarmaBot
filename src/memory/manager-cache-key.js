"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMemoryManagerCacheKey = computeMemoryManagerCacheKey;
var headers_fingerprint_js_1 = require("./headers-fingerprint.js");
var internal_js_1 = require("./internal.js");
function computeMemoryManagerCacheKey(params) {
    var settings = params.settings;
    var fingerprint = (0, internal_js_1.hashText)(JSON.stringify({
        enabled: settings.enabled,
        sources: __spreadArray([], settings.sources, true).toSorted(function (a, b) { return a.localeCompare(b); }),
        extraPaths: __spreadArray([], settings.extraPaths, true).toSorted(function (a, b) { return a.localeCompare(b); }),
        provider: settings.provider,
        model: settings.model,
        fallback: settings.fallback,
        local: {
            modelPath: settings.local.modelPath,
            modelCacheDir: settings.local.modelCacheDir,
        },
        remote: settings.remote
            ? {
                baseUrl: settings.remote.baseUrl,
                headerNames: (0, headers_fingerprint_js_1.fingerprintHeaderNames)(settings.remote.headers),
                batch: settings.remote.batch
                    ? {
                        enabled: settings.remote.batch.enabled,
                        wait: settings.remote.batch.wait,
                        concurrency: settings.remote.batch.concurrency,
                        pollIntervalMs: settings.remote.batch.pollIntervalMs,
                        timeoutMinutes: settings.remote.batch.timeoutMinutes,
                    }
                    : undefined,
            }
            : undefined,
        experimental: settings.experimental,
        store: {
            driver: settings.store.driver,
            path: settings.store.path,
            vector: {
                enabled: settings.store.vector.enabled,
                extensionPath: settings.store.vector.extensionPath,
            },
        },
        chunking: settings.chunking,
        sync: settings.sync,
        query: settings.query,
        cache: settings.cache,
    }));
    return "".concat(params.agentId, ":").concat(params.workspaceDir, ":").concat(fingerprint);
}
