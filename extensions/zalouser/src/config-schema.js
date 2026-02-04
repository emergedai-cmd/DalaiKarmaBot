"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZalouserConfigSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var allowFromEntry = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
var groupConfigSchema = zod_1.z.object({
    allow: zod_1.z.boolean().optional(),
    enabled: zod_1.z.boolean().optional(),
    tools: plugin_sdk_1.ToolPolicySchema,
});
var zalouserAccountSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    profile: zod_1.z.string().optional(),
    dmPolicy: zod_1.z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    allowFrom: zod_1.z.array(allowFromEntry).optional(),
    groupPolicy: zod_1.z.enum(["disabled", "allowlist", "open"]).optional(),
    groups: zod_1.z.object({}).catchall(groupConfigSchema).optional(),
    messagePrefix: zod_1.z.string().optional(),
});
exports.ZalouserConfigSchema = zalouserAccountSchema.extend({
    accounts: zod_1.z.object({}).catchall(zalouserAccountSchema).optional(),
    defaultAccount: zod_1.z.string().optional(),
});
