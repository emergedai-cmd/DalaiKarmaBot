"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixConfigSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var allowFromEntry = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
var matrixActionSchema = zod_1.z
    .object({
    reactions: zod_1.z.boolean().optional(),
    messages: zod_1.z.boolean().optional(),
    pins: zod_1.z.boolean().optional(),
    memberInfo: zod_1.z.boolean().optional(),
    channelInfo: zod_1.z.boolean().optional(),
})
    .optional();
var matrixDmSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    policy: zod_1.z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    allowFrom: zod_1.z.array(allowFromEntry).optional(),
})
    .optional();
var matrixRoomSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    allow: zod_1.z.boolean().optional(),
    requireMention: zod_1.z.boolean().optional(),
    tools: plugin_sdk_1.ToolPolicySchema,
    autoReply: zod_1.z.boolean().optional(),
    users: zod_1.z.array(allowFromEntry).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    systemPrompt: zod_1.z.string().optional(),
})
    .optional();
exports.MatrixConfigSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    homeserver: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    accessToken: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    deviceName: zod_1.z.string().optional(),
    initialSyncLimit: zod_1.z.number().optional(),
    encryption: zod_1.z.boolean().optional(),
    allowlistOnly: zod_1.z.boolean().optional(),
    groupPolicy: zod_1.z.enum(["open", "disabled", "allowlist"]).optional(),
    replyToMode: zod_1.z.enum(["off", "first", "all"]).optional(),
    threadReplies: zod_1.z.enum(["off", "inbound", "always"]).optional(),
    textChunkLimit: zod_1.z.number().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    mediaMaxMb: zod_1.z.number().optional(),
    autoJoin: zod_1.z.enum(["always", "allowlist", "off"]).optional(),
    autoJoinAllowlist: zod_1.z.array(allowFromEntry).optional(),
    groupAllowFrom: zod_1.z.array(allowFromEntry).optional(),
    dm: matrixDmSchema,
    groups: zod_1.z.object({}).catchall(matrixRoomSchema).optional(),
    rooms: zod_1.z.object({}).catchall(matrixRoomSchema).optional(),
    actions: matrixActionSchema,
});
