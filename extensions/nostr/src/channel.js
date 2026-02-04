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
exports.nostrPlugin = void 0;
exports.getNostrMetrics = getNostrMetrics;
exports.getActiveNostrBuses = getActiveNostrBuses;
exports.publishNostrProfile = publishNostrProfile;
exports.getNostrProfileState = getNostrProfileState;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var config_schema_js_1 = require("./config-schema.js");
var nostr_bus_js_1 = require("./nostr-bus.js");
var runtime_js_1 = require("./runtime.js");
var types_js_1 = require("./types.js");
// Store active bus handles per account
var activeBuses = new Map();
// Store metrics snapshots per account (for status reporting)
var metricsSnapshots = new Map();
exports.nostrPlugin = {
    id: "nostr",
    meta: {
        id: "nostr",
        label: "Nostr",
        selectionLabel: "Nostr",
        docsPath: "/channels/nostr",
        docsLabel: "nostr",
        blurb: "Decentralized DMs via Nostr relays (NIP-04)",
        order: 100,
    },
    capabilities: {
        chatTypes: ["direct"], // DMs only for MVP
        media: false, // No media for MVP
    },
    reload: { configPrefixes: ["channels.nostr"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.NostrConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, types_js_1.listNostrAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, types_js_1.resolveNostrAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, types_js_1.resolveDefaultNostrAccountId)(cfg); },
        isConfigured: function (account) { return account.configured; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.configured,
            publicKey: account.publicKey,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, types_js_1.resolveNostrAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) {
                if (entry === "*") {
                    return "*";
                }
                try {
                    return (0, nostr_bus_js_1.normalizePubkey)(entry);
                }
                catch (_a) {
                    return entry; // Keep as-is if normalization fails
                }
            })
                .filter(Boolean);
        },
    },
    pairing: {
        idLabel: "nostrPubkey",
        normalizeAllowEntry: function (entry) {
            try {
                return (0, nostr_bus_js_1.normalizePubkey)(entry.replace(/^nostr:/i, ""));
            }
            catch (_a) {
                return entry;
            }
        },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var bus;
            var id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bus = activeBuses.get(plugin_sdk_1.DEFAULT_ACCOUNT_ID);
                        if (!bus) return [3 /*break*/, 2];
                        return [4 /*yield*/, bus.sendDm(id, "Your pairing request has been approved!")];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c;
            var account = _a.account;
            return {
                policy: (_b = account.config.dmPolicy) !== null && _b !== void 0 ? _b : "pairing",
                allowFrom: (_c = account.config.allowFrom) !== null && _c !== void 0 ? _c : [],
                policyPath: "channels.nostr.dmPolicy",
                allowFromPath: "channels.nostr.allowFrom",
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("nostr"),
                normalizeEntry: function (raw) {
                    try {
                        return (0, nostr_bus_js_1.normalizePubkey)(raw.replace(/^nostr:/i, "").trim());
                    }
                    catch (_a) {
                        return raw.trim();
                    }
                },
            };
        },
    },
    messaging: {
        normalizeTarget: function (target) {
            // Strip nostr: prefix if present
            var cleaned = target.replace(/^nostr:/i, "").trim();
            try {
                return (0, nostr_bus_js_1.normalizePubkey)(cleaned);
            }
            catch (_a) {
                return cleaned;
            }
        },
        targetResolver: {
            looksLikeId: function (input) {
                var trimmed = input.trim();
                return trimmed.startsWith("npub1") || /^[0-9a-fA-F]{64}$/.test(trimmed);
            },
            hint: "<npub|hex pubkey|nostr:npub...>",
        },
    },
    outbound: {
        deliveryMode: "direct",
        textChunkLimit: 4000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var core, aid, bus, tableMode, message, normalizedTo;
            var to = _b.to, text = _b.text, accountId = _b.accountId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        core = (0, runtime_js_1.getNostrRuntime)();
                        aid = accountId !== null && accountId !== void 0 ? accountId : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                        bus = activeBuses.get(aid);
                        if (!bus) {
                            throw new Error("Nostr bus not running for account ".concat(aid));
                        }
                        tableMode = core.channel.text.resolveMarkdownTableMode({
                            cfg: core.config.loadConfig(),
                            channel: "nostr",
                            accountId: aid,
                        });
                        message = core.channel.text.convertMarkdownTables(text !== null && text !== void 0 ? text : "", tableMode);
                        normalizedTo = (0, nostr_bus_js_1.normalizePubkey)(to);
                        return [4 /*yield*/, bus.sendDm(normalizedTo, message)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, { channel: "nostr", to: normalizedTo }];
                }
            });
        }); },
    },
    status: {
        defaultRuntime: {
            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
        },
        collectStatusIssues: function (accounts) {
            return accounts.flatMap(function (account) {
                var lastError = typeof account.lastError === "string" ? account.lastError.trim() : "";
                if (!lastError) {
                    return [];
                }
                return [
                    {
                        channel: "nostr",
                        accountId: account.accountId,
                        kind: "runtime",
                        message: "Channel error: ".concat(lastError),
                    },
                ];
            });
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                publicKey: (_c = snapshot.publicKey) !== null && _c !== void 0 ? _c : null,
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                lastStartAt: (_e = snapshot.lastStartAt) !== null && _e !== void 0 ? _e : null,
                lastStopAt: (_f = snapshot.lastStopAt) !== null && _f !== void 0 ? _f : null,
                lastError: (_g = snapshot.lastError) !== null && _g !== void 0 ? _g : null,
            });
        },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var account = _a.account, runtime = _a.runtime;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.configured,
                publicKey: account.publicKey,
                profile: account.profile,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                lastInboundAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _f !== void 0 ? _f : null,
                lastOutboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _g !== void 0 ? _g : null,
            });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, runtime, busHandle, bus;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = ctx.account;
                        ctx.setStatus({
                            accountId: account.accountId,
                            publicKey: account.publicKey,
                        });
                        (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting Nostr provider (pubkey: ").concat(account.publicKey, ")"));
                        if (!account.configured) {
                            throw new Error("Nostr private key not configured");
                        }
                        runtime = (0, runtime_js_1.getNostrRuntime)();
                        busHandle = null;
                        return [4 /*yield*/, (0, nostr_bus_js_1.startNostrBus)({
                                accountId: account.accountId,
                                privateKey: account.privateKey,
                                relays: account.relays,
                                onMessage: function (senderPubkey, text, reply) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.debug("[".concat(account.accountId, "] DM from ").concat(senderPubkey, ": ").concat(text.slice(0, 50), "..."));
                                                // Forward to OpenClaw's message pipeline
                                                return [4 /*yield*/, runtime.channel.reply.handleInboundMessage({
                                                        channel: "nostr",
                                                        accountId: account.accountId,
                                                        senderId: senderPubkey,
                                                        chatType: "direct",
                                                        chatId: senderPubkey, // For DMs, chatId is the sender's pubkey
                                                        text: text,
                                                        reply: function (responseText) { return __awaiter(void 0, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, reply(responseText)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); },
                                                    })];
                                            case 1:
                                                // Forward to OpenClaw's message pipeline
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onError: function (error, context) {
                                    var _a;
                                    (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.error("[".concat(account.accountId, "] Nostr error (").concat(context, "): ").concat(error.message));
                                },
                                onConnect: function (relay) {
                                    var _a;
                                    (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.debug("[".concat(account.accountId, "] Connected to relay: ").concat(relay));
                                },
                                onDisconnect: function (relay) {
                                    var _a;
                                    (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.debug("[".concat(account.accountId, "] Disconnected from relay: ").concat(relay));
                                },
                                onEose: function (relays) {
                                    var _a;
                                    (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.debug("[".concat(account.accountId, "] EOSE received from relays: ").concat(relays));
                                },
                                onMetric: function (event) {
                                    var _a, _b, _c, _d, _e, _f, _g;
                                    // Log significant metrics at appropriate levels
                                    if (event.name.startsWith("event.rejected.")) {
                                        (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.debug("[".concat(account.accountId, "] Metric: ").concat(event.name), event.labels);
                                    }
                                    else if (event.name === "relay.circuit_breaker.open") {
                                        (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.warn("[".concat(account.accountId, "] Circuit breaker opened for relay: ").concat((_c = event.labels) === null || _c === void 0 ? void 0 : _c.relay));
                                    }
                                    else if (event.name === "relay.circuit_breaker.close") {
                                        (_d = ctx.log) === null || _d === void 0 ? void 0 : _d.info("[".concat(account.accountId, "] Circuit breaker closed for relay: ").concat((_e = event.labels) === null || _e === void 0 ? void 0 : _e.relay));
                                    }
                                    else if (event.name === "relay.error") {
                                        (_f = ctx.log) === null || _f === void 0 ? void 0 : _f.debug("[".concat(account.accountId, "] Relay error: ").concat((_g = event.labels) === null || _g === void 0 ? void 0 : _g.relay));
                                    }
                                    // Update cached metrics snapshot
                                    if (busHandle) {
                                        metricsSnapshots.set(account.accountId, busHandle.getMetrics());
                                    }
                                },
                            })];
                    case 1:
                        bus = _c.sent();
                        busHandle = bus;
                        // Store the bus handle
                        activeBuses.set(account.accountId, bus);
                        (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("[".concat(account.accountId, "] Nostr provider started, connected to ").concat(account.relays.length, " relay(s)"));
                        // Return cleanup function
                        return [2 /*return*/, {
                                stop: function () {
                                    var _a;
                                    bus.close();
                                    activeBuses.delete(account.accountId);
                                    metricsSnapshots.delete(account.accountId);
                                    (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] Nostr provider stopped"));
                                },
                            }];
                }
            });
        }); },
    },
};
/**
 * Get metrics snapshot for a Nostr account.
 * Returns undefined if account is not running.
 */
function getNostrMetrics(accountId) {
    if (accountId === void 0) { accountId = plugin_sdk_1.DEFAULT_ACCOUNT_ID; }
    var bus = activeBuses.get(accountId);
    if (bus) {
        return bus.getMetrics();
    }
    return metricsSnapshots.get(accountId);
}
/**
 * Get all active Nostr bus handles.
 * Useful for debugging and status reporting.
 */
function getActiveNostrBuses() {
    return new Map(activeBuses);
}
/**
 * Publish a profile (kind:0) for a Nostr account.
 * @param accountId - Account ID (defaults to "default")
 * @param profile - Profile data to publish
 * @returns Publish results with successes and failures
 * @throws Error if account is not running
 */
function publishNostrProfile() {
    return __awaiter(this, arguments, void 0, function (accountId, profile) {
        var bus;
        if (accountId === void 0) { accountId = plugin_sdk_1.DEFAULT_ACCOUNT_ID; }
        return __generator(this, function (_a) {
            bus = activeBuses.get(accountId);
            if (!bus) {
                throw new Error("Nostr bus not running for account ".concat(accountId));
            }
            return [2 /*return*/, bus.publishProfile(profile)];
        });
    });
}
/**
 * Get profile publish state for a Nostr account.
 * @param accountId - Account ID (defaults to "default")
 * @returns Profile publish state or null if account not running
 */
function getNostrProfileState() {
    return __awaiter(this, arguments, void 0, function (accountId) {
        var bus;
        if (accountId === void 0) { accountId = plugin_sdk_1.DEFAULT_ACCOUNT_ID; }
        return __generator(this, function (_a) {
            bus = activeBuses.get(accountId);
            if (!bus) {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, bus.getProfileState()];
        });
    });
}
