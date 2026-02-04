"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var schema_js_1 = require("./schema.js");
(0, vitest_1.describe)("config schema", function () {
    (0, vitest_1.it)("exports schema + hints", function () {
        var _a, _b, _c, _d;
        var res = (0, schema_js_1.buildConfigSchema)();
        var schema = res.schema;
        (0, vitest_1.expect)((_a = schema.properties) === null || _a === void 0 ? void 0 : _a.gateway).toBeTruthy();
        (0, vitest_1.expect)((_b = schema.properties) === null || _b === void 0 ? void 0 : _b.agents).toBeTruthy();
        (0, vitest_1.expect)((_c = res.uiHints.gateway) === null || _c === void 0 ? void 0 : _c.label).toBe("Gateway");
        (0, vitest_1.expect)((_d = res.uiHints["gateway.auth.token"]) === null || _d === void 0 ? void 0 : _d.sensitive).toBe(true);
        (0, vitest_1.expect)(res.version).toBeTruthy();
        (0, vitest_1.expect)(res.generatedAt).toBeTruthy();
    });
    (0, vitest_1.it)("merges plugin ui hints", function () {
        var _a, _b, _c, _d;
        var res = (0, schema_js_1.buildConfigSchema)({
            plugins: [
                {
                    id: "voice-call",
                    name: "Voice Call",
                    description: "Outbound voice calls",
                    configUiHints: {
                        provider: { label: "Provider" },
                        "twilio.authToken": { label: "Auth Token", sensitive: true },
                    },
                },
            ],
        });
        (0, vitest_1.expect)((_a = res.uiHints["plugins.entries.voice-call"]) === null || _a === void 0 ? void 0 : _a.label).toBe("Voice Call");
        (0, vitest_1.expect)((_b = res.uiHints["plugins.entries.voice-call.config"]) === null || _b === void 0 ? void 0 : _b.label).toBe("Voice Call Config");
        (0, vitest_1.expect)((_c = res.uiHints["plugins.entries.voice-call.config.twilio.authToken"]) === null || _c === void 0 ? void 0 : _c.label).toBe("Auth Token");
        (0, vitest_1.expect)((_d = res.uiHints["plugins.entries.voice-call.config.twilio.authToken"]) === null || _d === void 0 ? void 0 : _d.sensitive).toBe(true);
    });
    (0, vitest_1.it)("merges plugin + channel schemas", function () {
        var _a, _b;
        var res = (0, schema_js_1.buildConfigSchema)({
            plugins: [
                {
                    id: "voice-call",
                    name: "Voice Call",
                    configSchema: {
                        type: "object",
                        properties: {
                            provider: { type: "string" },
                        },
                    },
                },
            ],
            channels: [
                {
                    id: "matrix",
                    label: "Matrix",
                    configSchema: {
                        type: "object",
                        properties: {
                            accessToken: { type: "string" },
                        },
                    },
                },
            ],
        });
        var schema = res.schema;
        var pluginsNode = (_a = schema.properties) === null || _a === void 0 ? void 0 : _a.plugins;
        var entriesNode = pluginsNode === null || pluginsNode === void 0 ? void 0 : pluginsNode.properties;
        var entriesProps = entriesNode === null || entriesNode === void 0 ? void 0 : entriesNode.entries;
        var entryProps = entriesProps === null || entriesProps === void 0 ? void 0 : entriesProps.properties;
        var pluginEntry = entryProps === null || entryProps === void 0 ? void 0 : entryProps["voice-call"];
        var pluginConfig = pluginEntry === null || pluginEntry === void 0 ? void 0 : pluginEntry.properties;
        var pluginConfigSchema = pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.config;
        var pluginConfigProps = pluginConfigSchema === null || pluginConfigSchema === void 0 ? void 0 : pluginConfigSchema.properties;
        (0, vitest_1.expect)(pluginConfigProps === null || pluginConfigProps === void 0 ? void 0 : pluginConfigProps.provider).toBeTruthy();
        var channelsNode = (_b = schema.properties) === null || _b === void 0 ? void 0 : _b.channels;
        var channelsProps = channelsNode === null || channelsNode === void 0 ? void 0 : channelsNode.properties;
        var channelSchema = channelsProps === null || channelsProps === void 0 ? void 0 : channelsProps.matrix;
        var channelProps = channelSchema === null || channelSchema === void 0 ? void 0 : channelSchema.properties;
        (0, vitest_1.expect)(channelProps === null || channelProps === void 0 ? void 0 : channelProps.accessToken).toBeTruthy();
    });
    (0, vitest_1.it)("adds heartbeat target hints with dynamic channels", function () {
        var res = (0, schema_js_1.buildConfigSchema)({
            channels: [
                {
                    id: "bluebubbles",
                    label: "BlueBubbles",
                    configSchema: { type: "object" },
                },
            ],
        });
        var defaultsHint = res.uiHints["agents.defaults.heartbeat.target"];
        var listHint = res.uiHints["agents.list.*.heartbeat.target"];
        (0, vitest_1.expect)(defaultsHint === null || defaultsHint === void 0 ? void 0 : defaultsHint.help).toContain("bluebubbles");
        (0, vitest_1.expect)(defaultsHint === null || defaultsHint === void 0 ? void 0 : defaultsHint.help).toContain("last");
        (0, vitest_1.expect)(listHint === null || listHint === void 0 ? void 0 : listHint.help).toContain("bluebubbles");
    });
});
