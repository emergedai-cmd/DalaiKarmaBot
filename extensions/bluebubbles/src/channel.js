"use strict";
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
exports.bluebubblesPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var actions_js_1 = require("./actions.js");
var config_schema_js_1 = require("./config-schema.js");
var media_send_js_1 = require("./media-send.js");
var monitor_js_1 = require("./monitor.js");
var monitor_js_2 = require("./monitor.js");
var onboarding_js_1 = require("./onboarding.js");
var probe_js_1 = require("./probe.js");
var send_js_1 = require("./send.js");
var targets_js_1 = require("./targets.js");
var meta = {
    id: "bluebubbles",
    label: "BlueBubbles",
    selectionLabel: "BlueBubbles (macOS app)",
    detailLabel: "BlueBubbles",
    docsPath: "/channels/bluebubbles",
    docsLabel: "bluebubbles",
    blurb: "iMessage via the BlueBubbles mac app + REST API.",
    systemImage: "bubble.left.and.text.bubble.right",
    aliases: ["bb"],
    order: 75,
    preferOver: ["imessage"],
};
exports.bluebubblesPlugin = {
    id: "bluebubbles",
    meta: meta,
    capabilities: {
        chatTypes: ["direct", "group"],
        media: true,
        reactions: true,
        edit: true,
        unsend: true,
        reply: true,
        effects: true,
        groupManagement: true,
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveBlueBubblesGroupRequireMention,
        resolveToolPolicy: plugin_sdk_1.resolveBlueBubblesGroupToolPolicy,
    },
    threading: {
        buildToolContext: function (_a) {
            var _b, _c;
            var context = _a.context, hasRepliedRef = _a.hasRepliedRef;
            return ({
                currentChannelId: ((_b = context.To) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                currentThreadTs: (_c = context.ReplyToIdFull) !== null && _c !== void 0 ? _c : context.ReplyToId,
                hasRepliedRef: hasRepliedRef,
            });
        },
    },
    reload: { configPrefixes: ["channels.bluebubbles"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.BlueBubblesConfigSchema),
    onboarding: onboarding_js_1.blueBubblesOnboardingAdapter,
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listBlueBubblesAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, accounts_js_1.resolveBlueBubblesAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultBlueBubblesAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "bluebubbles",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "bluebubbles",
                accountId: accountId,
                clearBaseFields: ["serverUrl", "password", "name", "webhookPath"],
            });
        },
        isConfigured: function (account) { return account.configured; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.configured,
            baseUrl: account.baseUrl,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, accounts_js_1.resolveBlueBubblesAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^bluebubbles:/i, ""); })
                .map(function (entry) { return (0, targets_js_1.normalizeBlueBubblesHandle)(entry); });
        },
    },
    actions: actions_js_1.bluebubblesMessageActions,
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.bluebubbles) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.bluebubbles.accounts.".concat(resolvedAccountId, ".")
                : "channels.bluebubbles.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("bluebubbles"),
                normalizeEntry: function (raw) { return (0, targets_js_1.normalizeBlueBubblesHandle)(raw.replace(/^bluebubbles:/i, "")); },
            };
        },
        collectWarnings: function (_a) {
            var _b;
            var account = _a.account;
            var groupPolicy = (_b = account.config.groupPolicy) !== null && _b !== void 0 ? _b : "allowlist";
            if (groupPolicy !== "open") {
                return [];
            }
            return [
                "- BlueBubbles groups: groupPolicy=\"open\" allows any member to trigger the bot. Set channels.bluebubbles.groupPolicy=\"allowlist\" + channels.bluebubbles.groupAllowFrom to restrict senders.",
            ];
        },
    },
    messaging: {
        normalizeTarget: targets_js_1.normalizeBlueBubblesMessagingTarget,
        targetResolver: {
            looksLikeId: targets_js_1.looksLikeBlueBubblesTargetId,
            hint: "<handle|chat_guid:GUID|chat_id:ID|chat_identifier:ID>",
        },
        formatTargetDisplay: function (_a) {
            var target = _a.target, display = _a.display;
            var shouldParseDisplay = function (value) {
                if ((0, targets_js_1.looksLikeBlueBubblesTargetId)(value)) {
                    return true;
                }
                return /^(bluebubbles:|chat_guid:|chat_id:|chat_identifier:)/i.test(value);
            };
            // Helper to extract a clean handle from any BlueBubbles target format
            var extractCleanDisplay = function (value) {
                var trimmed = value === null || value === void 0 ? void 0 : value.trim();
                if (!trimmed) {
                    return null;
                }
                try {
                    var parsed = (0, targets_js_1.parseBlueBubblesTarget)(trimmed);
                    if (parsed.kind === "chat_guid") {
                        var handle_1 = (0, targets_js_1.extractHandleFromChatGuid)(parsed.chatGuid);
                        if (handle_1) {
                            return handle_1;
                        }
                    }
                    if (parsed.kind === "handle") {
                        return (0, targets_js_1.normalizeBlueBubblesHandle)(parsed.to);
                    }
                }
                catch (_a) {
                    // Fall through
                }
                // Strip common prefixes and try raw extraction
                var stripped = trimmed
                    .replace(/^bluebubbles:/i, "")
                    .replace(/^chat_guid:/i, "")
                    .replace(/^chat_id:/i, "")
                    .replace(/^chat_identifier:/i, "");
                var handle = (0, targets_js_1.extractHandleFromChatGuid)(stripped);
                if (handle) {
                    return handle;
                }
                // Don't return raw chat_guid formats - they contain internal routing info
                if (stripped.includes(";-;") || stripped.includes(";+;")) {
                    return null;
                }
                return stripped;
            };
            // Try to get a clean display from the display parameter first
            var trimmedDisplay = display === null || display === void 0 ? void 0 : display.trim();
            if (trimmedDisplay) {
                if (!shouldParseDisplay(trimmedDisplay)) {
                    return trimmedDisplay;
                }
                var cleanDisplay = extractCleanDisplay(trimmedDisplay);
                if (cleanDisplay) {
                    return cleanDisplay;
                }
            }
            // Fall back to extracting from target
            var cleanTarget = extractCleanDisplay(target);
            if (cleanTarget) {
                return cleanTarget;
            }
            // Last resort: return display or target as-is
            return (display === null || display === void 0 ? void 0 : display.trim()) || (target === null || target === void 0 ? void 0 : target.trim()) || "";
        },
    },
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "bluebubbles",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var input = _a.input;
            if (!input.httpUrl && !input.password) {
                return "BlueBubbles requires --http-url and --password.";
            }
            if (!input.httpUrl) {
                return "BlueBubbles requires --http-url.";
            }
            if (!input.password) {
                return "BlueBubbles requires --password.";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "bluebubbles",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "bluebubbles",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { bluebubbles: __assign(__assign(__assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.bluebubbles), { enabled: true }), (input.httpUrl ? { serverUrl: input.httpUrl } : {})), (input.password ? { password: input.password } : {})), (input.webhookPath ? { webhookPath: input.webhookPath } : {})) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { bluebubbles: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.bluebubbles), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.bluebubbles) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.bluebubbles) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.httpUrl ? { serverUrl: input.httpUrl } : {})), (input.password ? { password: input.password } : {})), (input.webhookPath ? { webhookPath: input.webhookPath } : {})), _b)) }) }) });
        },
    },
    pairing: {
        idLabel: "bluebubblesSenderId",
        normalizeAllowEntry: function (entry) { return (0, targets_js_1.normalizeBlueBubblesHandle)(entry.replace(/^bluebubbles:/i, "")); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(id, plugin_sdk_1.PAIRING_APPROVED_MESSAGE, {
                            cfg: cfg,
                        })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    outbound: {
        deliveryMode: "direct",
        textChunkLimit: 4000,
        resolveTarget: function (_a) {
            var to = _a.to;
            var trimmed = to === null || to === void 0 ? void 0 : to.trim();
            if (!trimmed) {
                return {
                    ok: false,
                    error: new Error("Delivering to BlueBubbles requires --to <handle|chat_guid:GUID>"),
                };
            }
            return { ok: true, to: trimmed };
        },
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var rawReplyToId, replyToMessageGuid, result;
            var cfg = _b.cfg, to = _b.to, text = _b.text, accountId = _b.accountId, replyToId = _b.replyToId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        rawReplyToId = typeof replyToId === "string" ? replyToId.trim() : "";
                        replyToMessageGuid = rawReplyToId
                            ? (0, monitor_js_1.resolveBlueBubblesMessageId)(rawReplyToId, { requireKnownShortId: true })
                            : "";
                        return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(to, text, {
                                cfg: cfg,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                replyToMessageGuid: replyToMessageGuid || undefined,
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: "bluebubbles" }, result)];
                }
            });
        }); },
        sendMedia: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var cfg, to, text, mediaUrl, accountId, replyToId, _a, mediaPath, mediaBuffer, contentType, filename, caption, resolvedCaption, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cfg = ctx.cfg, to = ctx.to, text = ctx.text, mediaUrl = ctx.mediaUrl, accountId = ctx.accountId, replyToId = ctx.replyToId;
                        _a = ctx, mediaPath = _a.mediaPath, mediaBuffer = _a.mediaBuffer, contentType = _a.contentType, filename = _a.filename, caption = _a.caption;
                        resolvedCaption = caption !== null && caption !== void 0 ? caption : text;
                        return [4 /*yield*/, (0, media_send_js_1.sendBlueBubblesMedia)({
                                cfg: cfg,
                                to: to,
                                mediaUrl: mediaUrl,
                                mediaPath: mediaPath,
                                mediaBuffer: mediaBuffer,
                                contentType: contentType,
                                filename: filename,
                                caption: resolvedCaption !== null && resolvedCaption !== void 0 ? resolvedCaption : undefined,
                                replyToId: replyToId !== null && replyToId !== void 0 ? replyToId : null,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, __assign({ channel: "bluebubbles" }, result)];
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
        collectStatusIssues: plugin_sdk_1.collectBlueBubblesStatusIssues,
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                baseUrl: (_c = snapshot.baseUrl) !== null && _c !== void 0 ? _c : null,
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                lastStartAt: (_e = snapshot.lastStartAt) !== null && _e !== void 0 ? _e : null,
                lastStopAt: (_f = snapshot.lastStopAt) !== null && _f !== void 0 ? _f : null,
                lastError: (_g = snapshot.lastError) !== null && _g !== void 0 ? _g : null,
                probe: snapshot.probe,
                lastProbeAt: (_h = snapshot.lastProbeAt) !== null && _h !== void 0 ? _h : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c;
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_d) {
                return [2 /*return*/, (0, probe_js_1.probeBlueBubbles)({
                        baseUrl: account.baseUrl,
                        password: (_c = account.config.password) !== null && _c !== void 0 ? _c : null,
                        timeoutMs: timeoutMs,
                    })];
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            var running = (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false;
            var probeOk = probe === null || probe === void 0 ? void 0 : probe.ok;
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.configured,
                baseUrl: account.baseUrl,
                running: running,
                connected: probeOk !== null && probeOk !== void 0 ? probeOk : running,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                probe: probe,
                lastInboundAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _f !== void 0 ? _f : null,
                lastOutboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _g !== void 0 ? _g : null,
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, webhookPath;
            var _a;
            return __generator(this, function (_b) {
                account = ctx.account;
                webhookPath = (0, monitor_js_2.resolveWebhookPathFromConfig)(account.config);
                ctx.setStatus({
                    accountId: account.accountId,
                    baseUrl: account.baseUrl,
                });
                (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting provider (webhook=").concat(webhookPath, ")"));
                return [2 /*return*/, (0, monitor_js_2.monitorBlueBubblesProvider)({
                        account: account,
                        config: ctx.cfg,
                        runtime: ctx.runtime,
                        abortSignal: ctx.abortSignal,
                        statusSink: function (patch) { return ctx.setStatus(__assign({ accountId: ctx.accountId }, patch)); },
                        webhookPath: webhookPath,
                    })];
            });
        }); },
    },
};
