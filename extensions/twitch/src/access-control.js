"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTwitchAccessControl = checkTwitchAccessControl;
exports.extractMentions = extractMentions;
/**
 * Check if a Twitch message should be allowed based on account configuration
 *
 * This function implements the access control logic for incoming Twitch messages,
 * checking allowlists, role-based restrictions, and mention requirements.
 *
 * Priority order:
 * 1. If `requireMention` is true, message must mention the bot
 * 2. If `allowFrom` is set, sender must be in the allowlist (by user ID)
 * 3. If `allowedRoles` is set (and `allowFrom` is not), sender must have at least one role
 *
 * Note: `allowFrom` is a hard allowlist. When set, only those user IDs are allowed.
 * Use `allowedRoles` as an alternative when you don't want to maintain an allowlist.
 *
 * Available roles:
 * - "moderator": Moderators
 * - "owner": Channel owner/broadcaster
 * - "vip": VIPs
 * - "subscriber": Subscribers
 * - "all": Anyone in the chat
 */
function checkTwitchAccessControl(params) {
    var _a;
    var message = params.message, account = params.account, botUsername = params.botUsername;
    if ((_a = account.requireMention) !== null && _a !== void 0 ? _a : true) {
        var mentions = extractMentions(message.message);
        if (!mentions.includes(botUsername.toLowerCase())) {
            return {
                allowed: false,
                reason: "message does not mention the bot (requireMention is enabled)",
            };
        }
    }
    if (account.allowFrom && account.allowFrom.length > 0) {
        var allowFrom = account.allowFrom;
        var senderId = message.userId;
        if (!senderId) {
            return {
                allowed: false,
                reason: "sender user ID not available for allowlist check",
            };
        }
        if (allowFrom.includes(senderId)) {
            return {
                allowed: true,
                matchKey: senderId,
                matchSource: "allowlist",
            };
        }
        return {
            allowed: false,
            reason: "sender is not in allowFrom allowlist",
        };
    }
    if (account.allowedRoles && account.allowedRoles.length > 0) {
        var allowedRoles = account.allowedRoles;
        // "all" grants access to everyone
        if (allowedRoles.includes("all")) {
            return {
                allowed: true,
                matchKey: "all",
                matchSource: "role",
            };
        }
        var hasAllowedRole = checkSenderRoles({
            message: message,
            allowedRoles: allowedRoles,
        });
        if (!hasAllowedRole) {
            return {
                allowed: false,
                reason: "sender does not have any of the required roles: ".concat(allowedRoles.join(", ")),
            };
        }
        return {
            allowed: true,
            matchKey: allowedRoles.join(","),
            matchSource: "role",
        };
    }
    return {
        allowed: true,
    };
}
/**
 * Check if the sender has any of the allowed roles
 */
function checkSenderRoles(params) {
    var message = params.message, allowedRoles = params.allowedRoles;
    var isMod = message.isMod, isOwner = message.isOwner, isVip = message.isVip, isSub = message.isSub;
    for (var _i = 0, allowedRoles_1 = allowedRoles; _i < allowedRoles_1.length; _i++) {
        var role = allowedRoles_1[_i];
        switch (role) {
            case "moderator":
                if (isMod) {
                    return true;
                }
                break;
            case "owner":
                if (isOwner) {
                    return true;
                }
                break;
            case "vip":
                if (isVip) {
                    return true;
                }
                break;
            case "subscriber":
                if (isSub) {
                    return true;
                }
                break;
        }
    }
    return false;
}
/**
 * Extract @mentions from a Twitch chat message
 *
 * Returns a list of lowercase usernames that were mentioned in the message.
 * Twitch mentions are in the format @username.
 */
function extractMentions(message) {
    var mentionRegex = /@(\w+)/g;
    var mentions = [];
    var match;
    while ((match = mentionRegex.exec(message)) !== null) {
        var username = match[1];
        if (username) {
            mentions.push(username.toLowerCase());
        }
    }
    return mentions;
}
