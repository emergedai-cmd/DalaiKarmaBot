"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMessageCommands = registerMessageCommands;
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var help_format_js_1 = require("../help-format.js");
var helpers_js_1 = require("./message/helpers.js");
var register_broadcast_js_1 = require("./message/register.broadcast.js");
var register_discord_admin_js_1 = require("./message/register.discord-admin.js");
var register_emoji_sticker_js_1 = require("./message/register.emoji-sticker.js");
var register_permissions_search_js_1 = require("./message/register.permissions-search.js");
var register_pins_js_1 = require("./message/register.pins.js");
var register_poll_js_1 = require("./message/register.poll.js");
var register_reactions_js_1 = require("./message/register.reactions.js");
var register_read_edit_delete_js_1 = require("./message/register.read-edit-delete.js");
var register_send_js_1 = require("./message/register.send.js");
var register_thread_js_1 = require("./message/register.thread.js");
function registerMessageCommands(program, ctx) {
    var message = program
        .command("message")
        .description("Send messages and channel actions")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat((0, help_format_js_1.formatHelpExamples)([
            ['openclaw message send --target +15555550123 --message "Hi"', "Send a text message."],
            [
                'openclaw message send --target +15555550123 --message "Hi" --media photo.jpg',
                "Send a message with media.",
            ],
            [
                'openclaw message poll --channel discord --target channel:123 --poll-question "Snack?" --poll-option Pizza --poll-option Sushi',
                "Create a Discord poll.",
            ],
            [
                'openclaw message react --channel discord --target 123 --message-id 456 --emoji "✅"',
                "React to a message.",
            ],
        ]), "\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/message", "docs.openclaw.ai/cli/message"));
    })
        .action(function () {
        message.help({ error: true });
    });
    var helpers = (0, helpers_js_1.createMessageCliHelpers)(message, ctx.messageChannelOptions);
    (0, register_send_js_1.registerMessageSendCommand)(message, helpers);
    (0, register_broadcast_js_1.registerMessageBroadcastCommand)(message, helpers);
    (0, register_poll_js_1.registerMessagePollCommand)(message, helpers);
    (0, register_reactions_js_1.registerMessageReactionsCommands)(message, helpers);
    (0, register_read_edit_delete_js_1.registerMessageReadEditDeleteCommands)(message, helpers);
    (0, register_pins_js_1.registerMessagePinCommands)(message, helpers);
    (0, register_permissions_search_js_1.registerMessagePermissionsCommand)(message, helpers);
    (0, register_permissions_search_js_1.registerMessageSearchCommand)(message, helpers);
    (0, register_thread_js_1.registerMessageThreadCommands)(message, helpers);
    (0, register_emoji_sticker_js_1.registerMessageEmojiCommands)(message, helpers);
    (0, register_emoji_sticker_js_1.registerMessageStickerCommands)(message, helpers);
    (0, register_discord_admin_js_1.registerMessageDiscordAdminCommands)(message, helpers);
}
