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
exports.resolveBlockStreamingChunking = resolveBlockStreamingChunking;
exports.resolveBlockStreamingCoalescing = resolveBlockStreamingCoalescing;
var dock_js_1 = require("../../channels/dock.js");
var index_js_1 = require("../../channels/plugins/index.js");
var session_key_js_1 = require("../../routing/session-key.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var chunk_js_1 = require("../chunk.js");
var DEFAULT_BLOCK_STREAM_MIN = 800;
var DEFAULT_BLOCK_STREAM_MAX = 1200;
var DEFAULT_BLOCK_STREAM_COALESCE_IDLE_MS = 1000;
var getBlockChunkProviders = function () {
    return new Set(__spreadArray(__spreadArray([], (0, message_channel_js_1.listDeliverableMessageChannels)(), true), [message_channel_js_1.INTERNAL_MESSAGE_CHANNEL], false));
};
function normalizeChunkProvider(provider) {
    if (!provider) {
        return undefined;
    }
    var cleaned = provider.trim().toLowerCase();
    return getBlockChunkProviders().has(cleaned)
        ? cleaned
        : undefined;
}
function resolveProviderBlockStreamingCoalesce(params) {
    var _a, _b;
    var cfg = params.cfg, providerKey = params.providerKey, accountId = params.accountId;
    if (!cfg || !providerKey) {
        return undefined;
    }
    var providerCfg = cfg[providerKey];
    if (!providerCfg || typeof providerCfg !== "object") {
        return undefined;
    }
    var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
    var typed = providerCfg;
    var accountCfg = (_a = typed.accounts) === null || _a === void 0 ? void 0 : _a[normalizedAccountId];
    return (_b = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.blockStreamingCoalesce) !== null && _b !== void 0 ? _b : typed.blockStreamingCoalesce;
}
function resolveBlockStreamingChunking(cfg, provider, accountId) {
    var _a, _b, _c, _d, _e, _f;
    var providerKey = normalizeChunkProvider(provider);
    var providerConfigKey = providerKey;
    var providerId = providerKey ? (0, index_js_1.normalizeChannelId)(providerKey) : null;
    var providerChunkLimit = providerId
        ? (_b = (_a = (0, dock_js_1.getChannelDock)(providerId)) === null || _a === void 0 ? void 0 : _a.outbound) === null || _b === void 0 ? void 0 : _b.textChunkLimit
        : undefined;
    var textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, providerConfigKey, accountId, {
        fallbackLimit: providerChunkLimit,
    });
    var chunkCfg = (_d = (_c = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.blockStreamingChunk;
    // When chunkMode="newline", the outbound delivery splits on paragraph boundaries.
    // The block chunker should flush eagerly on \n\n boundaries during streaming,
    // regardless of minChars, so each paragraph is sent as its own message.
    var chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, providerConfigKey, accountId);
    var maxRequested = Math.max(1, Math.floor((_e = chunkCfg === null || chunkCfg === void 0 ? void 0 : chunkCfg.maxChars) !== null && _e !== void 0 ? _e : DEFAULT_BLOCK_STREAM_MAX));
    var maxChars = Math.max(1, Math.min(maxRequested, textLimit));
    var minFallback = DEFAULT_BLOCK_STREAM_MIN;
    var minRequested = Math.max(1, Math.floor((_f = chunkCfg === null || chunkCfg === void 0 ? void 0 : chunkCfg.minChars) !== null && _f !== void 0 ? _f : minFallback));
    var minChars = Math.min(minRequested, maxChars);
    var breakPreference = (chunkCfg === null || chunkCfg === void 0 ? void 0 : chunkCfg.breakPreference) === "newline" || (chunkCfg === null || chunkCfg === void 0 ? void 0 : chunkCfg.breakPreference) === "sentence"
        ? chunkCfg.breakPreference
        : "paragraph";
    return {
        minChars: minChars,
        maxChars: maxChars,
        breakPreference: breakPreference,
        flushOnParagraph: chunkMode === "newline",
    };
}
function resolveBlockStreamingCoalescing(cfg, provider, accountId, chunking, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var providerKey = normalizeChunkProvider(provider);
    var providerConfigKey = providerKey;
    // Resolve the outbound chunkMode so the coalescer can flush on paragraph boundaries
    // when chunkMode="newline", matching the delivery-time splitting behavior.
    var chunkMode = (_a = opts === null || opts === void 0 ? void 0 : opts.chunkMode) !== null && _a !== void 0 ? _a : (0, chunk_js_1.resolveChunkMode)(cfg, providerConfigKey, accountId);
    var providerId = providerKey ? (0, index_js_1.normalizeChannelId)(providerKey) : null;
    var providerChunkLimit = providerId
        ? (_c = (_b = (0, dock_js_1.getChannelDock)(providerId)) === null || _b === void 0 ? void 0 : _b.outbound) === null || _c === void 0 ? void 0 : _c.textChunkLimit
        : undefined;
    var textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, providerConfigKey, accountId, {
        fallbackLimit: providerChunkLimit,
    });
    var providerDefaults = providerId
        ? (_e = (_d = (0, dock_js_1.getChannelDock)(providerId)) === null || _d === void 0 ? void 0 : _d.streaming) === null || _e === void 0 ? void 0 : _e.blockStreamingCoalesceDefaults
        : undefined;
    var providerCfg = resolveProviderBlockStreamingCoalesce({
        cfg: cfg,
        providerKey: providerKey,
        accountId: accountId,
    });
    var coalesceCfg = providerCfg !== null && providerCfg !== void 0 ? providerCfg : (_g = (_f = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) === null || _g === void 0 ? void 0 : _g.blockStreamingCoalesce;
    var minRequested = Math.max(1, Math.floor((_k = (_j = (_h = coalesceCfg === null || coalesceCfg === void 0 ? void 0 : coalesceCfg.minChars) !== null && _h !== void 0 ? _h : providerDefaults === null || providerDefaults === void 0 ? void 0 : providerDefaults.minChars) !== null && _j !== void 0 ? _j : chunking === null || chunking === void 0 ? void 0 : chunking.minChars) !== null && _k !== void 0 ? _k : DEFAULT_BLOCK_STREAM_MIN));
    var maxRequested = Math.max(1, Math.floor((_l = coalesceCfg === null || coalesceCfg === void 0 ? void 0 : coalesceCfg.maxChars) !== null && _l !== void 0 ? _l : textLimit));
    var maxChars = Math.max(1, Math.min(maxRequested, textLimit));
    var minChars = Math.min(minRequested, maxChars);
    var idleMs = Math.max(0, Math.floor((_o = (_m = coalesceCfg === null || coalesceCfg === void 0 ? void 0 : coalesceCfg.idleMs) !== null && _m !== void 0 ? _m : providerDefaults === null || providerDefaults === void 0 ? void 0 : providerDefaults.idleMs) !== null && _o !== void 0 ? _o : DEFAULT_BLOCK_STREAM_COALESCE_IDLE_MS));
    var preference = (_p = chunking === null || chunking === void 0 ? void 0 : chunking.breakPreference) !== null && _p !== void 0 ? _p : "paragraph";
    var joiner = preference === "sentence" ? " " : preference === "newline" ? "\n" : "\n\n";
    return {
        minChars: minChars,
        maxChars: maxChars,
        idleMs: idleMs,
        joiner: joiner,
        flushOnEnqueue: chunkMode === "newline",
    };
}
