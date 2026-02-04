"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueBubblesConfigSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var allowFromEntry = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
var bluebubblesActionSchema = zod_1.z
    .object({
    reactions: zod_1.z.boolean().default(true),
    edit: zod_1.z.boolean().default(true),
    unsend: zod_1.z.boolean().default(true),
    reply: zod_1.z.boolean().default(true),
    sendWithEffect: zod_1.z.boolean().default(true),
    renameGroup: zod_1.z.boolean().default(true),
    setGroupIcon: zod_1.z.boolean().default(true),
    addParticipant: zod_1.z.boolean().default(true),
    removeParticipant: zod_1.z.boolean().default(true),
    leaveGroup: zod_1.z.boolean().default(true),
    sendAttachment: zod_1.z.boolean().default(true),
})
    .optional();
var bluebubblesGroupConfigSchema = zod_1.z.object({
    requireMention: zod_1.z.boolean().optional(),
    tools: plugin_sdk_1.ToolPolicySchema,
});
var bluebubblesAccountSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    serverUrl: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    dmPolicy: zod_1.z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    allowFrom: zod_1.z.array(allowFromEntry).optional(),
    groupAllowFrom: zod_1.z.array(allowFromEntry).optional(),
    groupPolicy: zod_1.z.enum(["open", "disabled", "allowlist"]).optional(),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    mediaMaxMb: zod_1.z.number().int().positive().optional(),
    sendReadReceipts: zod_1.z.boolean().optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    groups: zod_1.z.object({}).catchall(bluebubblesGroupConfigSchema).optional(),
});
exports.BlueBubblesConfigSchema = bluebubblesAccountSchema.extend({
    accounts: zod_1.z.object({}).catchall(bluebubblesAccountSchema).optional(),
    actions: bluebubblesActionSchema,
});
