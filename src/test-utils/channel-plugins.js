"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutboundTestPlugin = exports.createIMessageTestPlugin = exports.createTestRegistry = void 0;
var imessage_js_1 = require("../channels/plugins/outbound/imessage.js");
var targets_js_1 = require("../imessage/targets.js");
var createTestRegistry = function (channels) {
    if (channels === void 0) { channels = []; }
    return ({
        plugins: [],
        tools: [],
        hooks: [],
        typedHooks: [],
        channels: channels,
        providers: [],
        gatewayHandlers: {},
        httpHandlers: [],
        httpRoutes: [],
        cliRegistrars: [],
        services: [],
        commands: [],
        diagnostics: [],
    });
};
exports.createTestRegistry = createTestRegistry;
var createIMessageTestPlugin = function (params) {
    var _a;
    return ({
        id: "imessage",
        meta: {
            id: "imessage",
            label: "iMessage",
            selectionLabel: "iMessage (imsg)",
            docsPath: "/channels/imessage",
            blurb: "iMessage test stub.",
            aliases: ["imsg"],
        },
        capabilities: { chatTypes: ["direct", "group"], media: true },
        config: {
            listAccountIds: function () { return []; },
            resolveAccount: function () { return ({}); },
        },
        status: {
            collectStatusIssues: function (accounts) {
                return accounts.flatMap(function (account) {
                    var lastError = typeof account.lastError === "string" ? account.lastError.trim() : "";
                    if (!lastError) {
                        return [];
                    }
                    return [
                        {
                            channel: "imessage",
                            accountId: account.accountId,
                            kind: "runtime",
                            message: "Channel error: ".concat(lastError),
                        },
                    ];
                });
            },
        },
        outbound: (_a = params === null || params === void 0 ? void 0 : params.outbound) !== null && _a !== void 0 ? _a : imessage_js_1.imessageOutbound,
        messaging: {
            targetResolver: {
                looksLikeId: function (raw) {
                    var trimmed = raw.trim();
                    if (!trimmed) {
                        return false;
                    }
                    if (/^(imessage:|sms:|auto:|chat_id:|chat_guid:|chat_identifier:)/i.test(trimmed)) {
                        return true;
                    }
                    if (trimmed.includes("@")) {
                        return true;
                    }
                    return /^\+?\d{3,}$/.test(trimmed);
                },
                hint: "<handle|chat_id:ID>",
            },
            normalizeTarget: function (raw) { return (0, targets_js_1.normalizeIMessageHandle)(raw); },
        },
    });
};
exports.createIMessageTestPlugin = createIMessageTestPlugin;
var createOutboundTestPlugin = function (params) {
    var _a, _b, _c, _d;
    return ({
        id: params.id,
        meta: {
            id: params.id,
            label: (_a = params.label) !== null && _a !== void 0 ? _a : String(params.id),
            selectionLabel: (_b = params.label) !== null && _b !== void 0 ? _b : String(params.id),
            docsPath: (_c = params.docsPath) !== null && _c !== void 0 ? _c : "/channels/".concat(params.id),
            blurb: "test stub.",
        },
        capabilities: (_d = params.capabilities) !== null && _d !== void 0 ? _d : { chatTypes: ["direct"] },
        config: {
            listAccountIds: function () { return []; },
            resolveAccount: function () { return ({}); },
        },
        outbound: params.outbound,
    });
};
exports.createOutboundTestPlugin = createOutboundTestPlugin;
