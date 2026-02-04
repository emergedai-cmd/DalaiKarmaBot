"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchConfigSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
/**
 * Twitch user roles that can be allowed to interact with the bot
 */
var TwitchRoleSchema = zod_1.z.enum(["moderator", "owner", "vip", "subscriber", "all"]);
/**
 * Twitch account configuration schema
 */
var TwitchAccountSchema = zod_1.z.object({
    /** Twitch username */
    username: zod_1.z.string(),
    /** Twitch OAuth access token (requires chat:read and chat:write scopes) */
    accessToken: zod_1.z.string(),
    /** Twitch client ID (from Twitch Developer Portal or twitchtokengenerator.com) */
    clientId: zod_1.z.string().optional(),
    /** Channel name to join */
    channel: zod_1.z.string().min(1),
    /** Enable this account */
    enabled: zod_1.z.boolean().optional(),
    /** Allowlist of Twitch user IDs who can interact with the bot (use IDs for safety, not usernames) */
    allowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    /** Roles allowed to interact with the bot (e.g., ["moderator", "vip", "subscriber"]) */
    allowedRoles: zod_1.z.array(TwitchRoleSchema).optional(),
    /** Require @mention to trigger bot responses */
    requireMention: zod_1.z.boolean().optional(),
    /** Twitch client secret (required for token refresh via RefreshingAuthProvider) */
    clientSecret: zod_1.z.string().optional(),
    /** Refresh token (required for automatic token refresh) */
    refreshToken: zod_1.z.string().optional(),
    /** Token expiry time in seconds (optional, for token refresh tracking) */
    expiresIn: zod_1.z.number().nullable().optional(),
    /** Timestamp when token was obtained (optional, for token refresh tracking) */
    obtainmentTimestamp: zod_1.z.number().optional(),
});
/**
 * Base configuration properties shared by both single and multi-account modes
 */
var TwitchConfigBaseSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().optional(),
    markdown: plugin_sdk_1.MarkdownConfigSchema.optional(),
});
/**
 * Simplified single-account configuration schema
 *
 * Use this for single-account setups. Properties are at the top level,
 * creating an implicit "default" account.
 */
var SimplifiedSchema = zod_1.z.intersection(TwitchConfigBaseSchema, TwitchAccountSchema);
/**
 * Multi-account configuration schema
 *
 * Use this for multi-account setups. Each key is an account ID (e.g., "default", "secondary").
 */
var MultiAccountSchema = zod_1.z.intersection(TwitchConfigBaseSchema, zod_1.z
    .object({
    /** Per-account configuration (for multi-account setups) */
    accounts: zod_1.z.record(zod_1.z.string(), TwitchAccountSchema),
})
    .refine(function (val) { return Object.keys(val.accounts || {}).length > 0; }, {
    message: "accounts must contain at least one entry",
}));
/**
 * Twitch plugin configuration schema
 *
 * Supports two mutually exclusive patterns:
 * 1. Simplified single-account: username, accessToken, clientId, channel at top level
 * 2. Multi-account: accounts object with named account configs
 *
 * The union ensures clear discrimination between the two modes.
 */
exports.TwitchConfigSchema = zod_1.z.union([SimplifiedSchema, MultiAccountSchema]);
