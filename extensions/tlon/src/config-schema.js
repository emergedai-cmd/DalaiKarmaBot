"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tlonChannelConfigSchema = exports.TlonConfigSchema = exports.TlonAccountSchema = exports.TlonAuthorizationSchema = exports.TlonChannelRuleSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var ShipSchema = zod_1.z.string().min(1);
var ChannelNestSchema = zod_1.z.string().min(1);
exports.TlonChannelRuleSchema = zod_1.z.object({
    mode: zod_1.z.enum(["restricted", "open"]).optional(),
    allowedShips: zod_1.z.array(ShipSchema).optional(),
});
exports.TlonAuthorizationSchema = zod_1.z.object({
    channelRules: zod_1.z.record(zod_1.z.string(), exports.TlonChannelRuleSchema).optional(),
});
exports.TlonAccountSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    ship: ShipSchema.optional(),
    url: zod_1.z.string().optional(),
    code: zod_1.z.string().optional(),
    groupChannels: zod_1.z.array(ChannelNestSchema).optional(),
    dmAllowlist: zod_1.z.array(ShipSchema).optional(),
    autoDiscoverChannels: zod_1.z.boolean().optional(),
    showModelSignature: zod_1.z.boolean().optional(),
});
exports.TlonConfigSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    ship: ShipSchema.optional(),
    url: zod_1.z.string().optional(),
    code: zod_1.z.string().optional(),
    groupChannels: zod_1.z.array(ChannelNestSchema).optional(),
    dmAllowlist: zod_1.z.array(ShipSchema).optional(),
    autoDiscoverChannels: zod_1.z.boolean().optional(),
    showModelSignature: zod_1.z.boolean().optional(),
    authorization: exports.TlonAuthorizationSchema.optional(),
    defaultAuthorizedShips: zod_1.z.array(ShipSchema).optional(),
    accounts: zod_1.z.record(zod_1.z.string(), exports.TlonAccountSchema).optional(),
});
exports.tlonChannelConfigSchema = (0, plugin_sdk_1.buildChannelConfigSchema)(exports.TlonConfigSchema);
