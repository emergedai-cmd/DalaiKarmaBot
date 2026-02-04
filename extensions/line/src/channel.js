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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linePlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
// LINE channel metadata
var meta = {
    id: "line",
    label: "LINE",
    selectionLabel: "LINE (Messaging API)",
    detailLabel: "LINE Bot",
    docsPath: "/channels/line",
    docsLabel: "line",
    blurb: "LINE Messaging API bot for Japan/Taiwan/Thailand markets.",
    systemImage: "message.fill",
};
exports.linePlugin = {
    id: "line",
    meta: __assign(__assign({}, meta), { quickstartAllowFrom: true }),
    pairing: {
        idLabel: "lineUserId",
        normalizeAllowEntry: function (entry) {
            // LINE IDs are case-sensitive; only strip prefix variants (line: / line:user:).
            return entry.replace(/^line:(?:user:)?/i, "");
        },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var line, account;
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        line = (0, runtime_js_1.getLineRuntime)().channel.line;
                        account = line.resolveLineAccount({ cfg: cfg });
                        if (!account.channelAccessToken) {
                            throw new Error("LINE channel access token not configured");
                        }
                        return [4 /*yield*/, line.pushMessageLine(id, "OpenClaw: your access has been approved.", {
                                channelAccessToken: account.channelAccessToken,
                            })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "group"],
        reactions: false,
        threads: false,
        media: true,
        nativeCommands: false,
        blockStreaming: true,
    },
    reload: { configPrefixes: ["channels.line"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.LineConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, runtime_js_1.getLineRuntime)().channel.line.listLineAccountIds(cfg); },
        resolveAccount: function (cfg, accountId) {
            return (0, runtime_js_1.getLineRuntime)().channel.line.resolveLineAccount({ cfg: cfg, accountId: accountId });
        },
        defaultAccountId: function (cfg) { return (0, runtime_js_1.getLineRuntime)().channel.line.resolveDefaultLineAccountId(cfg); },
        setAccountEnabled: function (_a) {
            var _b;
            var _c, _d, _e;
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            var lineConfig = ((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.line) !== null && _d !== void 0 ? _d : {});
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign({}, lineConfig), { enabled: enabled }) }) });
            }
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign({}, lineConfig), { accounts: __assign(__assign({}, lineConfig.accounts), (_b = {}, _b[accountId] = __assign(__assign({}, (_e = lineConfig.accounts) === null || _e === void 0 ? void 0 : _e[accountId]), { enabled: enabled }), _b)) }) }) });
        },
        deleteAccount: function (_a) {
            var _b, _c;
            var cfg = _a.cfg, accountId = _a.accountId;
            var lineConfig = ((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.line) !== null && _c !== void 0 ? _c : {});
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                // oxlint-disable-next-line no-unused-vars
                var channelSecret = lineConfig.channelSecret, tokenFile = lineConfig.tokenFile, secretFile = lineConfig.secretFile, rest = __rest(lineConfig, ["channelSecret", "tokenFile", "secretFile"]);
                return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: rest }) });
            }
            var accounts = __assign({}, lineConfig.accounts);
            delete accounts[accountId];
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign({}, lineConfig), { accounts: Object.keys(accounts).length > 0 ? accounts : undefined }) }) });
        },
        isConfigured: function (account) { var _a; return Boolean((_a = account.channelAccessToken) === null || _a === void 0 ? void 0 : _a.trim()); },
        describeAccount: function (account) {
            var _a;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: Boolean((_a = account.channelAccessToken) === null || _a === void 0 ? void 0 : _a.trim()),
                tokenSource: account.tokenSource,
            });
        },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, runtime_js_1.getLineRuntime)().channel.line.resolveLineAccount({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) { return String(entry); });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) {
                // LINE sender IDs are case-sensitive; keep original casing.
                return entry.replace(/^line:(?:user:)?/i, "");
            });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.line) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.line.accounts.".concat(resolvedAccountId, ".")
                : "channels.line.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: "openclaw pairing approve line <code>",
                normalizeEntry: function (raw) { return raw.replace(/^line:(?:user:)?/i, ""); },
            };
        },
        collectWarnings: function (_a) {
            var _b, _c, _d, _e;
            var account = _a.account, cfg = _a.cfg;
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_e = (_d = account.config.groupPolicy) !== null && _d !== void 0 ? _d : defaultGroupPolicy) !== null && _e !== void 0 ? _e : "allowlist";
            if (groupPolicy !== "open") {
                return [];
            }
            return [
                "- LINE groups: groupPolicy=\"open\" allows any member in groups to trigger. Set channels.line.groupPolicy=\"allowlist\" + channels.line.groupAllowFrom to restrict senders.",
            ];
        },
    },
    groups: {
        resolveRequireMention: function (_a) {
            var _b, _c;
            var cfg = _a.cfg, accountId = _a.accountId, groupId = _a.groupId;
            var account = (0, runtime_js_1.getLineRuntime)().channel.line.resolveLineAccount({ cfg: cfg, accountId: accountId });
            var groups = account.config.groups;
            if (!groups) {
                return false;
            }
            var groupConfig = (_b = groups[groupId]) !== null && _b !== void 0 ? _b : groups["*"];
            return (_c = groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.requireMention) !== null && _c !== void 0 ? _c : false;
        },
    },
    messaging: {
        normalizeTarget: function (target) {
            var trimmed = target.trim();
            if (!trimmed) {
                return null;
            }
            return trimmed.replace(/^line:(group|room|user):/i, "").replace(/^line:/i, "");
        },
        targetResolver: {
            looksLikeId: function (id) {
                var trimmed = id === null || id === void 0 ? void 0 : id.trim();
                if (!trimmed) {
                    return false;
                }
                // LINE user IDs are typically U followed by 32 hex characters
                // Group IDs are C followed by 32 hex characters
                // Room IDs are R followed by 32 hex characters
                return /^[UCR][a-f0-9]{32}$/i.test(trimmed) || /^line:/i.test(trimmed);
            },
            hint: "<userId|groupId|roomId>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); },
        listGroups: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); },
    },
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, runtime_js_1.getLineRuntime)().channel.line.normalizeAccountId(accountId);
        },
        applyAccountName: function (_a) {
            var _b;
            var _c, _d, _e;
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            var lineConfig = ((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.line) !== null && _d !== void 0 ? _d : {});
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign({}, lineConfig), { name: name }) }) });
            }
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign({}, lineConfig), { accounts: __assign(__assign({}, lineConfig.accounts), (_b = {}, _b[accountId] = __assign(__assign({}, (_e = lineConfig.accounts) === null || _e === void 0 ? void 0 : _e[accountId]), { name: name }), _b)) }) }) });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            var typedInput = input;
            if (typedInput.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "LINE_CHANNEL_ACCESS_TOKEN can only be used for the default account.";
            }
            if (!typedInput.useEnv && !typedInput.channelAccessToken && !typedInput.tokenFile) {
                return "LINE requires channelAccessToken or --token-file (or --use-env).";
            }
            if (!typedInput.useEnv && !typedInput.channelSecret && !typedInput.secretFile) {
                return "LINE requires channelSecret or --secret-file (or --use-env).";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var typedInput = input;
            var lineConfig = ((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.line) !== null && _d !== void 0 ? _d : {});
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign(__assign(__assign(__assign({}, lineConfig), { enabled: true }), (typedInput.name ? { name: typedInput.name } : {})), (typedInput.useEnv
                            ? {}
                            : typedInput.tokenFile
                                ? { tokenFile: typedInput.tokenFile }
                                : typedInput.channelAccessToken
                                    ? { channelAccessToken: typedInput.channelAccessToken }
                                    : {})), (typedInput.useEnv
                            ? {}
                            : typedInput.secretFile
                                ? { secretFile: typedInput.secretFile }
                                : typedInput.channelSecret
                                    ? { channelSecret: typedInput.channelSecret }
                                    : {})) }) });
            }
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { line: __assign(__assign({}, lineConfig), { enabled: true, accounts: __assign(__assign({}, lineConfig.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign(__assign(__assign({}, (_e = lineConfig.accounts) === null || _e === void 0 ? void 0 : _e[accountId]), { enabled: true }), (typedInput.name ? { name: typedInput.name } : {})), (typedInput.tokenFile
                            ? { tokenFile: typedInput.tokenFile }
                            : typedInput.channelAccessToken
                                ? { channelAccessToken: typedInput.channelAccessToken }
                                : {})), (typedInput.secretFile
                            ? { secretFile: typedInput.secretFile }
                            : typedInput.channelSecret
                                ? { channelSecret: typedInput.channelSecret }
                                : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getLineRuntime)().channel.text.chunkMarkdownText(text, limit); },
        textChunkLimit: 5000, // LINE allows up to 5000 characters per text message
        sendPayload: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var runtime, lineData, sendText, sendBatch, sendFlex, sendTemplate, sendLocation, sendQuickReplies, buildTemplate, createQuickReplyItems, lastResult, quickReplies, hasQuickReplies, quickReply, sendMessageBatch, processed, chunkLimit, chunks, mediaUrls, shouldSendQuickRepliesInline, template, _i, _c, flexMsg, sendMediaAfterText, _d, mediaUrls_1, url, i, isLast, quickReplyMessages, template, _e, _f, flexMsg, _g, mediaUrls_2, url, trimmed, lastIndex, _h, mediaUrls_3, url;
            var _j, _k, _l, _m, _o, _p, _q;
            var to = _b.to, payload = _b.payload, accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        runtime = (0, runtime_js_1.getLineRuntime)();
                        lineData = (_k = (_j = payload.channelData) === null || _j === void 0 ? void 0 : _j.line) !== null && _k !== void 0 ? _k : {};
                        sendText = runtime.channel.line.pushMessageLine;
                        sendBatch = runtime.channel.line.pushMessagesLine;
                        sendFlex = runtime.channel.line.pushFlexMessage;
                        sendTemplate = runtime.channel.line.pushTemplateMessage;
                        sendLocation = runtime.channel.line.pushLocationMessage;
                        sendQuickReplies = runtime.channel.line.pushTextMessageWithQuickReplies;
                        buildTemplate = runtime.channel.line.buildTemplateMessageFromPayload;
                        createQuickReplyItems = runtime.channel.line.createQuickReplyItems;
                        lastResult = null;
                        quickReplies = (_l = lineData.quickReplies) !== null && _l !== void 0 ? _l : [];
                        hasQuickReplies = quickReplies.length > 0;
                        quickReply = hasQuickReplies ? createQuickReplyItems(quickReplies) : undefined;
                        sendMessageBatch = function (messages) { return __awaiter(void 0, void 0, void 0, function () {
                            var i, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (messages.length === 0) {
                                            return [2 /*return*/];
                                        }
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < messages.length)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, sendBatch(to, messages.slice(i, i + 5), {
                                                verbose: false,
                                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                            })];
                                    case 2:
                                        result = _a.sent();
                                        lastResult = { messageId: result.messageId, chatId: result.chatId };
                                        _a.label = 3;
                                    case 3:
                                        i += 5;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        processed = payload.text
                            ? (0, plugin_sdk_1.processLineMessage)(payload.text)
                            : { text: "", flexMessages: [] };
                        chunkLimit = (_p = (_o = (_m = runtime.channel.text).resolveTextChunkLimit) === null || _o === void 0 ? void 0 : _o.call(_m, cfg, "line", accountId !== null && accountId !== void 0 ? accountId : undefined, {
                            fallbackLimit: 5000,
                        })) !== null && _p !== void 0 ? _p : 5000;
                        chunks = processed.text
                            ? runtime.channel.text.chunkMarkdownText(processed.text, chunkLimit)
                            : [];
                        mediaUrls = (_q = payload.mediaUrls) !== null && _q !== void 0 ? _q : (payload.mediaUrl ? [payload.mediaUrl] : []);
                        shouldSendQuickRepliesInline = chunks.length === 0 && hasQuickReplies;
                        if (!!shouldSendQuickRepliesInline) return [3 /*break*/, 10];
                        if (!lineData.flexMessage) return [3 /*break*/, 2];
                        return [4 /*yield*/, sendFlex(to, lineData.flexMessage.altText, lineData.flexMessage.contents, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        lastResult = _r.sent();
                        _r.label = 2;
                    case 2:
                        if (!lineData.templateMessage) return [3 /*break*/, 4];
                        template = buildTemplate(lineData.templateMessage);
                        if (!template) return [3 /*break*/, 4];
                        return [4 /*yield*/, sendTemplate(to, template, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 3:
                        lastResult = _r.sent();
                        _r.label = 4;
                    case 4:
                        if (!lineData.location) return [3 /*break*/, 6];
                        return [4 /*yield*/, sendLocation(to, lineData.location, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 5:
                        lastResult = _r.sent();
                        _r.label = 6;
                    case 6:
                        _i = 0, _c = processed.flexMessages;
                        _r.label = 7;
                    case 7:
                        if (!(_i < _c.length)) return [3 /*break*/, 10];
                        flexMsg = _c[_i];
                        return [4 /*yield*/, sendFlex(to, flexMsg.altText, flexMsg.contents, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 8:
                        lastResult = _r.sent();
                        _r.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10:
                        sendMediaAfterText = !(hasQuickReplies && chunks.length > 0);
                        if (!(mediaUrls.length > 0 && !shouldSendQuickRepliesInline && !sendMediaAfterText)) return [3 /*break*/, 14];
                        _d = 0, mediaUrls_1 = mediaUrls;
                        _r.label = 11;
                    case 11:
                        if (!(_d < mediaUrls_1.length)) return [3 /*break*/, 14];
                        url = mediaUrls_1[_d];
                        return [4 /*yield*/, runtime.channel.line.sendMessageLine(to, "", {
                                verbose: false,
                                mediaUrl: url,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 12:
                        lastResult = _r.sent();
                        _r.label = 13;
                    case 13:
                        _d++;
                        return [3 /*break*/, 11];
                    case 14:
                        if (!(chunks.length > 0)) return [3 /*break*/, 21];
                        i = 0;
                        _r.label = 15;
                    case 15:
                        if (!(i < chunks.length)) return [3 /*break*/, 20];
                        isLast = i === chunks.length - 1;
                        if (!(isLast && hasQuickReplies)) return [3 /*break*/, 17];
                        return [4 /*yield*/, sendQuickReplies(to, chunks[i], quickReplies, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 16:
                        lastResult = _r.sent();
                        return [3 /*break*/, 19];
                    case 17: return [4 /*yield*/, sendText(to, chunks[i], {
                            verbose: false,
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                        })];
                    case 18:
                        lastResult = _r.sent();
                        _r.label = 19;
                    case 19:
                        i += 1;
                        return [3 /*break*/, 15];
                    case 20: return [3 /*break*/, 23];
                    case 21:
                        if (!shouldSendQuickRepliesInline) return [3 /*break*/, 23];
                        quickReplyMessages = [];
                        if (lineData.flexMessage) {
                            quickReplyMessages.push({
                                type: "flex",
                                altText: lineData.flexMessage.altText.slice(0, 400),
                                contents: lineData.flexMessage.contents,
                            });
                        }
                        if (lineData.templateMessage) {
                            template = buildTemplate(lineData.templateMessage);
                            if (template) {
                                quickReplyMessages.push(template);
                            }
                        }
                        if (lineData.location) {
                            quickReplyMessages.push({
                                type: "location",
                                title: lineData.location.title.slice(0, 100),
                                address: lineData.location.address.slice(0, 100),
                                latitude: lineData.location.latitude,
                                longitude: lineData.location.longitude,
                            });
                        }
                        for (_e = 0, _f = processed.flexMessages; _e < _f.length; _e++) {
                            flexMsg = _f[_e];
                            quickReplyMessages.push({
                                type: "flex",
                                altText: flexMsg.altText.slice(0, 400),
                                contents: flexMsg.contents,
                            });
                        }
                        for (_g = 0, mediaUrls_2 = mediaUrls; _g < mediaUrls_2.length; _g++) {
                            url = mediaUrls_2[_g];
                            trimmed = url === null || url === void 0 ? void 0 : url.trim();
                            if (!trimmed) {
                                continue;
                            }
                            quickReplyMessages.push({
                                type: "image",
                                originalContentUrl: trimmed,
                                previewImageUrl: trimmed,
                            });
                        }
                        if (!(quickReplyMessages.length > 0 && quickReply)) return [3 /*break*/, 23];
                        lastIndex = quickReplyMessages.length - 1;
                        quickReplyMessages[lastIndex] = __assign(__assign({}, quickReplyMessages[lastIndex]), { quickReply: quickReply });
                        return [4 /*yield*/, sendMessageBatch(quickReplyMessages)];
                    case 22:
                        _r.sent();
                        _r.label = 23;
                    case 23:
                        if (!(mediaUrls.length > 0 && !shouldSendQuickRepliesInline && sendMediaAfterText)) return [3 /*break*/, 27];
                        _h = 0, mediaUrls_3 = mediaUrls;
                        _r.label = 24;
                    case 24:
                        if (!(_h < mediaUrls_3.length)) return [3 /*break*/, 27];
                        url = mediaUrls_3[_h];
                        return [4 /*yield*/, runtime.channel.line.sendMessageLine(to, "", {
                                verbose: false,
                                mediaUrl: url,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 25:
                        lastResult = _r.sent();
                        _r.label = 26;
                    case 26:
                        _h++;
                        return [3 /*break*/, 24];
                    case 27:
                        if (lastResult) {
                            return [2 /*return*/, __assign({ channel: "line" }, lastResult)];
                        }
                        return [2 /*return*/, { channel: "line", messageId: "empty", chatId: to }];
                }
            });
        }); },
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var runtime, sendText, sendFlex, processed, result, _i, _c, flexMsg;
            var to = _b.to, text = _b.text, accountId = _b.accountId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        runtime = (0, runtime_js_1.getLineRuntime)();
                        sendText = runtime.channel.line.pushMessageLine;
                        sendFlex = runtime.channel.line.pushFlexMessage;
                        processed = (0, plugin_sdk_1.processLineMessage)(text);
                        if (!processed.text.trim()) return [3 /*break*/, 2];
                        return [4 /*yield*/, sendText(to, processed.text, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        // If text is empty after processing, still need a result
                        result = { messageId: "processed", chatId: to };
                        _d.label = 3;
                    case 3:
                        _i = 0, _c = processed.flexMessages;
                        _d.label = 4;
                    case 4:
                        if (!(_i < _c.length)) return [3 /*break*/, 7];
                        flexMsg = _c[_i];
                        return [4 /*yield*/, sendFlex(to, flexMsg.altText, flexMsg.contents, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, __assign({ channel: "line" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        send = (0, runtime_js_1.getLineRuntime)().channel.line.sendMessageLine;
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                mediaUrl: mediaUrl,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: "line" }, result)];
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
            var _a, _b, _c;
            var issues = [];
            for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
                var account = accounts_1[_i];
                var accountId = (_a = account.accountId) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                if (!((_b = account.channelAccessToken) === null || _b === void 0 ? void 0 : _b.trim())) {
                    issues.push({
                        channel: "line",
                        accountId: accountId,
                        kind: "config",
                        message: "LINE channel access token not configured",
                    });
                }
                if (!((_c = account.channelSecret) === null || _c === void 0 ? void 0 : _c.trim())) {
                    issues.push({
                        channel: "line",
                        accountId: accountId,
                        kind: "config",
                        message: "LINE channel secret not configured",
                    });
                }
            }
            return issues;
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                tokenSource: (_c = snapshot.tokenSource) !== null && _c !== void 0 ? _c : "none",
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                mode: (_e = snapshot.mode) !== null && _e !== void 0 ? _e : null,
                lastStartAt: (_f = snapshot.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = snapshot.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = snapshot.lastError) !== null && _h !== void 0 ? _h : null,
                probe: snapshot.probe,
                lastProbeAt: (_j = snapshot.lastProbeAt) !== null && _j !== void 0 ? _j : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, runtime_js_1.getLineRuntime)().channel.line.probeLineBot(account.channelAccessToken, timeoutMs)];
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            var configured = Boolean((_b = account.channelAccessToken) === null || _b === void 0 ? void 0 : _b.trim());
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: configured,
                tokenSource: account.tokenSource,
                running: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _c !== void 0 ? _c : false,
                lastStartAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _d !== void 0 ? _d : null,
                lastStopAt: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _e !== void 0 ? _e : null,
                lastError: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _f !== void 0 ? _f : null,
                mode: "webhook",
                probe: probe,
                lastInboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _g !== void 0 ? _g : null,
                lastOutboundAt: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _h !== void 0 ? _h : null,
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, token, secret, lineBotLabel, probe, displayName, err_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        account = ctx.account;
                        token = account.channelAccessToken.trim();
                        secret = account.channelSecret.trim();
                        lineBotLabel = "";
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, runtime_js_1.getLineRuntime)().channel.line.probeLineBot(token, 2500)];
                    case 2:
                        probe = _f.sent();
                        displayName = probe.ok ? (_b = (_a = probe.bot) === null || _a === void 0 ? void 0 : _a.displayName) === null || _b === void 0 ? void 0 : _b.trim() : null;
                        if (displayName) {
                            lineBotLabel = " (".concat(displayName, ")");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _f.sent();
                        if ((0, runtime_js_1.getLineRuntime)().logging.shouldLogVerbose()) {
                            (_d = (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.debug) === null || _d === void 0 ? void 0 : _d.call(_c, "[".concat(account.accountId, "] bot probe failed: ").concat(String(err_1)));
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        (_e = ctx.log) === null || _e === void 0 ? void 0 : _e.info("[".concat(account.accountId, "] starting LINE provider").concat(lineBotLabel));
                        return [2 /*return*/, (0, runtime_js_1.getLineRuntime)().channel.line.monitorLineProvider({
                                channelAccessToken: token,
                                channelSecret: secret,
                                accountId: account.accountId,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                webhookPath: account.config.webhookPath,
                            })];
                }
            });
        }); },
        logoutAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var envToken, nextCfg, lineConfig, nextLine, cleared, changed, accounts, entry, nextEntry, nextChannels, resolved, loggedOut;
            var _c, _d, _e, _f;
            var accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        envToken = (_d = (_c = process.env.LINE_CHANNEL_ACCESS_TOKEN) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
                        nextCfg = __assign({}, cfg);
                        lineConfig = ((_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.line) !== null && _f !== void 0 ? _f : {});
                        nextLine = __assign({}, lineConfig);
                        cleared = false;
                        changed = false;
                        if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                            if (nextLine.channelAccessToken ||
                                nextLine.channelSecret ||
                                nextLine.tokenFile ||
                                nextLine.secretFile) {
                                delete nextLine.channelAccessToken;
                                delete nextLine.channelSecret;
                                delete nextLine.tokenFile;
                                delete nextLine.secretFile;
                                cleared = true;
                                changed = true;
                            }
                        }
                        accounts = nextLine.accounts ? __assign({}, nextLine.accounts) : undefined;
                        if (accounts && accountId in accounts) {
                            entry = accounts[accountId];
                            if (entry && typeof entry === "object") {
                                nextEntry = __assign({}, entry);
                                if ("channelAccessToken" in nextEntry ||
                                    "channelSecret" in nextEntry ||
                                    "tokenFile" in nextEntry ||
                                    "secretFile" in nextEntry) {
                                    cleared = true;
                                    delete nextEntry.channelAccessToken;
                                    delete nextEntry.channelSecret;
                                    delete nextEntry.tokenFile;
                                    delete nextEntry.secretFile;
                                    changed = true;
                                }
                                if (Object.keys(nextEntry).length === 0) {
                                    delete accounts[accountId];
                                    changed = true;
                                }
                                else {
                                    accounts[accountId] = nextEntry;
                                }
                            }
                        }
                        if (accounts) {
                            if (Object.keys(accounts).length === 0) {
                                delete nextLine.accounts;
                                changed = true;
                            }
                            else {
                                nextLine.accounts = accounts;
                            }
                        }
                        if (!changed) return [3 /*break*/, 2];
                        if (Object.keys(nextLine).length > 0) {
                            nextCfg.channels = __assign(__assign({}, nextCfg.channels), { line: nextLine });
                        }
                        else {
                            nextChannels = __assign({}, nextCfg.channels);
                            delete nextChannels.line;
                            if (Object.keys(nextChannels).length > 0) {
                                nextCfg.channels = nextChannels;
                            }
                            else {
                                delete nextCfg.channels;
                            }
                        }
                        return [4 /*yield*/, (0, runtime_js_1.getLineRuntime)().config.writeConfigFile(nextCfg)];
                    case 1:
                        _g.sent();
                        _g.label = 2;
                    case 2:
                        resolved = (0, runtime_js_1.getLineRuntime)().channel.line.resolveLineAccount({
                            cfg: changed ? nextCfg : cfg,
                            accountId: accountId,
                        });
                        loggedOut = resolved.tokenSource === "none";
                        return [2 /*return*/, { cleared: cleared, envToken: Boolean(envToken), loggedOut: loggedOut }];
                }
            });
        }); },
    },
    agentPrompt: {
        messageToolHints: function () { return [
            "",
            "### LINE Rich Messages",
            "LINE supports rich visual messages. Use these directives in your reply when appropriate:",
            "",
            "**Quick Replies** (bottom button suggestions):",
            "  [[quick_replies: Option 1, Option 2, Option 3]]",
            "",
            "**Location** (map pin):",
            "  [[location: Place Name | Address | latitude | longitude]]",
            "",
            "**Confirm Dialog** (yes/no prompt):",
            "  [[confirm: Question text? | Yes Label | No Label]]",
            "",
            "**Button Menu** (title + text + buttons):",
            "  [[buttons: Title | Description | Btn1:action1, Btn2:https://url.com]]",
            "",
            "**Media Player Card** (music status):",
            "  [[media_player: Song Title | Artist Name | Source | https://albumart.url | playing]]",
            "  - Status: 'playing' or 'paused' (optional)",
            "",
            "**Event Card** (calendar events, meetings):",
            "  [[event: Event Title | Date | Time | Location | Description]]",
            "  - Time, Location, Description are optional",
            "",
            "**Agenda Card** (multiple events/schedule):",
            "  [[agenda: Schedule Title | Event1:9:00 AM, Event2:12:00 PM, Event3:3:00 PM]]",
            "",
            "**Device Control Card** (smart devices, TVs, etc.):",
            "  [[device: Device Name | Device Type | Status | Control1:data1, Control2:data2]]",
            "",
            "**Apple TV Remote** (full D-pad + transport):",
            "  [[appletv_remote: Apple TV | Playing]]",
            "",
            "**Auto-converted**: Markdown tables become Flex cards, code blocks become styled cards.",
            "",
            "When to use rich messages:",
            "- Use [[quick_replies:...]] when offering 2-4 clear options",
            "- Use [[confirm:...]] for yes/no decisions",
            "- Use [[buttons:...]] for menus with actions/links",
            "- Use [[location:...]] when sharing a place",
            "- Use [[media_player:...]] when showing what's playing",
            "- Use [[event:...]] for calendar event details",
            "- Use [[agenda:...]] for a day's schedule or event list",
            "- Use [[device:...]] for smart device status/controls",
            "- Tables/code in your response auto-convert to visual cards",
        ]; },
    },
};
