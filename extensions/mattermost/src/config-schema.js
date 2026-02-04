"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MattermostConfigSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var MattermostAccountSchemaBase = zod_1.z
    .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    enabled: zod_1.z.boolean().optional(),
    configWrites: zod_1.z.boolean().optional(),
    botToken: zod_1.z.string().optional(),
    baseUrl: zod_1.z.string().optional(),
    chatmode: zod_1.z.enum(["oncall", "onmessage", "onchar"]).optional(),
    oncharPrefixes: zod_1.z.array(zod_1.z.string()).optional(),
    requireMention: zod_1.z.boolean().optional(),
    dmPolicy: plugin_sdk_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupPolicy: plugin_sdk_1.GroupPolicySchema.optional().default("allowlist"),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: plugin_sdk_1.BlockStreamingCoalesceSchema.optional(),
})
    .strict();
var MattermostAccountSchema = MattermostAccountSchemaBase.superRefine(function (value, ctx) {
    (0, plugin_sdk_1.requireOpenAllowFrom)({
        policy: value.dmPolicy,
        allowFrom: value.allowFrom,
        ctx: ctx,
        path: ["allowFrom"],
        message: 'channels.mattermost.dmPolicy="open" requires channels.mattermost.allowFrom to include "*"',
    });
});
exports.MattermostConfigSchema = MattermostAccountSchemaBase.extend({
    accounts: zod_1.z.record(zod_1.z.string(), MattermostAccountSchema.optional()).optional(),
}).superRefine(function (value, ctx) {
    (0, plugin_sdk_1.requireOpenAllowFrom)({
        policy: value.dmPolicy,
        allowFrom: value.allowFrom,
        ctx: ctx,
        path: ["allowFrom"],
        message: 'channels.mattermost.dmPolicy="open" requires channels.mattermost.allowFrom to include "*"',
    });
});
