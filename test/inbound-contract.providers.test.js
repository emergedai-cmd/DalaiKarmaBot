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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var inbound_context_js_1 = require("../src/auto-reply/reply/inbound-context.js");
var inbound_contract_js_1 = require("./helpers/inbound-contract.js");
(0, vitest_1.describe)("inbound context contract (providers + extensions)", function () {
    var cases = [
        {
            name: "whatsapp group",
            ctx: {
                Provider: "whatsapp",
                Surface: "whatsapp",
                ChatType: "group",
                From: "123@g.us",
                To: "+15550001111",
                Body: "[WhatsApp 123@g.us] hi",
                RawBody: "hi",
                CommandBody: "hi",
                SenderName: "Alice",
            },
        },
        {
            name: "telegram group",
            ctx: {
                Provider: "telegram",
                Surface: "telegram",
                ChatType: "group",
                From: "group:123",
                To: "telegram:123",
                Body: "[Telegram group:123] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "Telegram Group",
                SenderName: "Alice",
            },
        },
        {
            name: "slack channel",
            ctx: {
                Provider: "slack",
                Surface: "slack",
                ChatType: "channel",
                From: "slack:channel:C123",
                To: "channel:C123",
                Body: "[Slack #general] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "#general",
                SenderName: "Alice",
            },
        },
        {
            name: "discord channel",
            ctx: {
                Provider: "discord",
                Surface: "discord",
                ChatType: "channel",
                From: "group:123",
                To: "channel:123",
                Body: "[Discord #general] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "#general",
                SenderName: "Alice",
            },
        },
        {
            name: "signal dm",
            ctx: {
                Provider: "signal",
                Surface: "signal",
                ChatType: "direct",
                From: "signal:+15550001111",
                To: "signal:+15550002222",
                Body: "[Signal] hi",
                RawBody: "hi",
                CommandBody: "hi",
            },
        },
        {
            name: "imessage group",
            ctx: {
                Provider: "imessage",
                Surface: "imessage",
                ChatType: "group",
                From: "group:chat_id:123",
                To: "chat_id:123",
                Body: "[iMessage Group] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "iMessage Group",
                SenderName: "Alice",
            },
        },
        {
            name: "matrix channel",
            ctx: {
                Provider: "matrix",
                Surface: "matrix",
                ChatType: "channel",
                From: "matrix:channel:!room:example.org",
                To: "room:!room:example.org",
                Body: "[Matrix] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "#general",
                SenderName: "Alice",
            },
        },
        {
            name: "msteams channel",
            ctx: {
                Provider: "msteams",
                Surface: "msteams",
                ChatType: "channel",
                From: "msteams:channel:19:abc@thread.tacv2",
                To: "msteams:channel:19:abc@thread.tacv2",
                Body: "[Teams] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "Teams Channel",
                SenderName: "Alice",
            },
        },
        {
            name: "zalo dm",
            ctx: {
                Provider: "zalo",
                Surface: "zalo",
                ChatType: "direct",
                From: "zalo:123",
                To: "zalo:123",
                Body: "[Zalo] hi",
                RawBody: "hi",
                CommandBody: "hi",
            },
        },
        {
            name: "zalouser group",
            ctx: {
                Provider: "zalouser",
                Surface: "zalouser",
                ChatType: "group",
                From: "group:123",
                To: "zalouser:123",
                Body: "[Zalo Personal] hi",
                RawBody: "hi",
                CommandBody: "hi",
                GroupSubject: "Zalouser Group",
                SenderName: "Alice",
            },
        },
    ];
    var _loop_1 = function (entry) {
        (0, vitest_1.it)(entry.name, function () {
            var ctx = (0, inbound_context_js_1.finalizeInboundContext)(__assign({}, entry.ctx));
            (0, inbound_contract_js_1.expectInboundContextContract)(ctx);
        });
    };
    for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
        var entry = cases_1[_i];
        _loop_1(entry);
    }
});
