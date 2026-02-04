"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sdk = require("./index.js");
(0, vitest_1.describe)("plugin-sdk exports", function () {
    (0, vitest_1.it)("does not expose runtime modules", function () {
        var forbidden = [
            "chunkMarkdownText",
            "chunkText",
            "resolveTextChunkLimit",
            "hasControlCommand",
            "isControlCommandMessage",
            "shouldComputeCommandAuthorized",
            "shouldHandleTextCommands",
            "buildMentionRegexes",
            "matchesMentionPatterns",
            "resolveStateDir",
            "loadConfig",
            "writeConfigFile",
            "runCommandWithTimeout",
            "enqueueSystemEvent",
            "fetchRemoteMedia",
            "saveMediaBuffer",
            "formatAgentEnvelope",
            "buildPairingReply",
            "resolveAgentRoute",
            "dispatchReplyFromConfig",
            "createReplyDispatcherWithTyping",
            "dispatchReplyWithBufferedBlockDispatcher",
            "resolveCommandAuthorizedFromAuthorizers",
            "monitorSlackProvider",
            "monitorTelegramProvider",
            "monitorIMessageProvider",
            "monitorSignalProvider",
            "sendMessageSlack",
            "sendMessageTelegram",
            "sendMessageIMessage",
            "sendMessageSignal",
            "sendMessageWhatsApp",
            "probeSlack",
            "probeTelegram",
            "probeIMessage",
            "probeSignal",
        ];
        for (var _i = 0, forbidden_1 = forbidden; _i < forbidden_1.length; _i++) {
            var key = forbidden_1[_i];
            (0, vitest_1.expect)(Object.prototype.hasOwnProperty.call(sdk, key)).toBe(false);
        }
    });
});
