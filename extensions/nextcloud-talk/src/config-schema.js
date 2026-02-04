"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextcloudTalkConfigSchema = exports.NextcloudTalkAccountSchema = exports.NextcloudTalkAccountSchemaBase = exports.NextcloudTalkRoomSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
exports.NextcloudTalkRoomSchema = zod_1.z
    .object({
    requireMention: zod_1.z.boolean().optional(),
    tools: plugin_sdk_1.ToolPolicySchema,
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    enabled: zod_1.z.boolean().optional(),
    allowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    systemPrompt: zod_1.z.string().optional(),
})
    .strict();
exports.NextcloudTalkAccountSchemaBase = zod_1.z
    .object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    baseUrl: zod_1.z.string().optional(),
    botSecret: zod_1.z.string().optional(),
    botSecretFile: zod_1.z.string().optional(),
    apiUser: zod_1.z.string().optional(),
    apiPassword: zod_1.z.string().optional(),
    apiPasswordFile: zod_1.z.string().optional(),
    dmPolicy: plugin_sdk_1.DmPolicySchema.optional().default("pairing"),
    webhookPort: zod_1.z.number().int().positive().optional(),
    webhookHost: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    webhookPublicUrl: zod_1.z.string().optional(),
    allowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupPolicy: plugin_sdk_1.GroupPolicySchema.optional().default("allowlist"),
    rooms: zod_1.z.record(zod_1.z.string(), exports.NextcloudTalkRoomSchema.optional()).optional(),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z.record(zod_1.z.string(), plugin_sdk_1.DmConfigSchema.optional()).optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: plugin_sdk_1.BlockStreamingCoalesceSchema.optional(),
    mediaMaxMb: zod_1.z.number().positive().optional(),
})
    .strict();
exports.NextcloudTalkAccountSchema = exports.NextcloudTalkAccountSchemaBase.superRefine(function (value, ctx) {
    (0, plugin_sdk_1.requireOpenAllowFrom)({
        policy: value.dmPolicy,
        allowFrom: value.allowFrom,
        ctx: ctx,
        path: ["allowFrom"],
        message: 'channels.nextcloud-talk.dmPolicy="open" requires channels.nextcloud-talk.allowFrom to include "*"',
    });
});
exports.NextcloudTalkConfigSchema = exports.NextcloudTalkAccountSchemaBase.extend({
    accounts: zod_1.z.record(zod_1.z.string(), exports.NextcloudTalkAccountSchema.optional()).optional(),
}).superRefine(function (value, ctx) {
    (0, plugin_sdk_1.requireOpenAllowFrom)({
        policy: value.dmPolicy,
        allowFrom: value.allowFrom,
        ctx: ctx,
        path: ["allowFrom"],
        message: 'channels.nextcloud-talk.dmPolicy="open" requires channels.nextcloud-talk.allowFrom to include "*"',
    });
});
