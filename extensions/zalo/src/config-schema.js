"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloConfigSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var allowFromEntry = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
var zaloAccountSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    botToken: zod_1.z.string().optional(),
    tokenFile: zod_1.z.string().optional(),
    webhookUrl: zod_1.z.string().optional(),
    webhookSecret: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    dmPolicy: zod_1.z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    allowFrom: zod_1.z.array(allowFromEntry).optional(),
    mediaMaxMb: zod_1.z.number().optional(),
    proxy: zod_1.z.string().optional(),
});
exports.ZaloConfigSchema = zaloAccountSchema.extend({
    accounts: zod_1.z.object({}).catchall(zaloAccountSchema).optional(),
    defaultAccount: zod_1.z.string().optional(),
});
