"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineConfigSchema = void 0;
var zod_1 = require("zod");
var DmPolicySchema = zod_1.z.enum(["open", "allowlist", "pairing", "disabled"]);
var GroupPolicySchema = zod_1.z.enum(["open", "allowlist", "disabled"]);
var LineGroupConfigSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    requireMention: zod_1.z.boolean().optional(),
    systemPrompt: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
})
    .strict();
var LineAccountConfigSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    channelAccessToken: zod_1.z.string().optional(),
    channelSecret: zod_1.z.string().optional(),
    tokenFile: zod_1.z.string().optional(),
    secretFile: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    dmPolicy: DmPolicySchema.optional().default("pairing"),
    groupPolicy: GroupPolicySchema.optional().default("allowlist"),
    mediaMaxMb: zod_1.z.number().optional(),
    webhookPath: zod_1.z.string().optional(),
    groups: zod_1.z.record(zod_1.z.string(), LineGroupConfigSchema.optional()).optional(),
})
    .strict();
exports.LineConfigSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    channelAccessToken: zod_1.z.string().optional(),
    channelSecret: zod_1.z.string().optional(),
    tokenFile: zod_1.z.string().optional(),
    secretFile: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    dmPolicy: DmPolicySchema.optional().default("pairing"),
    groupPolicy: GroupPolicySchema.optional().default("allowlist"),
    mediaMaxMb: zod_1.z.number().optional(),
    webhookPath: zod_1.z.string().optional(),
    accounts: zod_1.z.record(zod_1.z.string(), LineAccountConfigSchema.optional()).optional(),
    groups: zod_1.z.record(zod_1.z.string(), LineGroupConfigSchema.optional()).optional(),
})
    .strict();
