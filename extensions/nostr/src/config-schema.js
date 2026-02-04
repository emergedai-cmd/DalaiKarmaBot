"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nostrChannelConfigSchema = exports.NostrConfigSchema = exports.NostrProfileSchema = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zod_1 = require("zod");
var allowFromEntry = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
/**
 * Validates https:// URLs only (no javascript:, data:, file:, etc.)
 */
var safeUrlSchema = zod_1.z
    .string()
    .url()
    .refine(function (url) {
    try {
        var parsed = new URL(url);
        return parsed.protocol === "https:";
    }
    catch (_a) {
        return false;
    }
}, { message: "URL must use https:// protocol" });
/**
 * NIP-01 profile metadata schema
 * https://github.com/nostr-protocol/nips/blob/master/01.md
 */
exports.NostrProfileSchema = zod_1.z.object({
    /** Username (NIP-01: name) - max 256 chars */
    name: zod_1.z.string().max(256).optional(),
    /** Display name (NIP-01: display_name) - max 256 chars */
    displayName: zod_1.z.string().max(256).optional(),
    /** Bio/description (NIP-01: about) - max 2000 chars */
    about: zod_1.z.string().max(2000).optional(),
    /** Profile picture URL (must be https) */
    picture: safeUrlSchema.optional(),
    /** Banner image URL (must be https) */
    banner: safeUrlSchema.optional(),
    /** Website URL (must be https) */
    website: safeUrlSchema.optional(),
    /** NIP-05 identifier (e.g., "user@example.com") */
    nip05: zod_1.z.string().optional(),
    /** Lightning address (LUD-16) */
    lud16: zod_1.z.string().optional(),
});
/**
 * Zod schema for channels.nostr.* configuration
 */
exports.NostrConfigSchema = zod_1.z.object({
    /** Account name (optional display name) */
    name: zod_1.z.string().optional(),
    /** Whether this channel is enabled */
    enabled: zod_1.z.boolean().optional(),
    /** Markdown formatting overrides (tables). */
    markdown: plugin_sdk_1.MarkdownConfigSchema,
    /** Private key in hex or nsec bech32 format */
    privateKey: zod_1.z.string().optional(),
    /** WebSocket relay URLs to connect to */
    relays: zod_1.z.array(zod_1.z.string()).optional(),
    /** DM access policy: pairing, allowlist, open, or disabled */
    dmPolicy: zod_1.z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    /** Allowed sender pubkeys (npub or hex format) */
    allowFrom: zod_1.z.array(allowFromEntry).optional(),
    /** Profile metadata (NIP-01 kind:0 content) */
    profile: exports.NostrProfileSchema.optional(),
});
/**
 * JSON Schema for Control UI (converted from Zod)
 */
exports.nostrChannelConfigSchema = (0, plugin_sdk_1.buildChannelConfigSchema)(exports.NostrConfigSchema);
