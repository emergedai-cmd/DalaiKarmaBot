"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var bot_native_commands_js_1 = require("./bot-native-commands.js");
var listSkillCommandsForAgents = vitest_1.vi.hoisted(function () { return ({
    listSkillCommandsForAgents: vitest_1.vi.fn(function () { return []; }),
}); }).listSkillCommandsForAgents;
vitest_1.vi.mock("../auto-reply/skill-commands.js", function () { return ({
    listSkillCommandsForAgents: listSkillCommandsForAgents,
}); });
(0, vitest_1.describe)("registerTelegramNativeCommands", function () {
    (0, vitest_1.beforeEach)(function () {
        listSkillCommandsForAgents.mockReset();
    });
    var buildParams = function (cfg, accountId) {
        if (accountId === void 0) { accountId = "default"; }
        return ({
            bot: {
                api: {
                    setMyCommands: vitest_1.vi.fn().mockResolvedValue(undefined),
                    sendMessage: vitest_1.vi.fn().mockResolvedValue(undefined),
                },
                command: vitest_1.vi.fn(),
            },
            cfg: cfg,
            runtime: {},
            accountId: accountId,
            telegramCfg: {},
            allowFrom: [],
            groupAllowFrom: [],
            replyToMode: "off",
            textLimit: 4096,
            useAccessGroups: false,
            nativeEnabled: true,
            nativeSkillsEnabled: true,
            nativeDisabledExplicit: false,
            resolveGroupPolicy: function () { return ({ allowlistEnabled: false, allowed: true }); },
            resolveTelegramGroupConfig: function () { return ({
                groupConfig: undefined,
                topicConfig: undefined,
            }); },
            shouldSkipUpdate: function () { return false; },
            opts: { token: "token" },
        });
    };
    (0, vitest_1.it)("scopes skill commands when account binding exists", function () {
        var cfg = {
            agents: {
                list: [{ id: "main", default: true }, { id: "butler" }],
            },
            bindings: [
                {
                    agentId: "butler",
                    match: { channel: "telegram", accountId: "bot-a" },
                },
            ],
        };
        (0, bot_native_commands_js_1.registerTelegramNativeCommands)(buildParams(cfg, "bot-a"));
        (0, vitest_1.expect)(listSkillCommandsForAgents).toHaveBeenCalledWith({
            cfg: cfg,
            agentIds: ["butler"],
        });
    });
    (0, vitest_1.it)("keeps skill commands unscoped without a matching binding", function () {
        var cfg = {
            agents: {
                list: [{ id: "main", default: true }, { id: "butler" }],
            },
        };
        (0, bot_native_commands_js_1.registerTelegramNativeCommands)(buildParams(cfg, "bot-a"));
        (0, vitest_1.expect)(listSkillCommandsForAgents).toHaveBeenCalledWith({ cfg: cfg });
    });
});
