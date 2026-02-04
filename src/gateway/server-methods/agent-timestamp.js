"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectTimestamp = injectTimestamp;
exports.timestampOptsFromConfig = timestampOptsFromConfig;
var date_time_js_1 = require("../../agents/date-time.js");
var envelope_js_1 = require("../../auto-reply/envelope.js");
/**
 * Cron jobs inject "Current time: ..." into their messages.
 * Skip injection for those.
 */
var CRON_TIME_PATTERN = /Current time: /;
/**
 * Matches a leading `[... YYYY-MM-DD HH:MM ...]` envelope — either from
 * channel plugins or from a previous injection. Uses the same YYYY-MM-DD
 * HH:MM format as {@link formatZonedTimestamp}, so detection stays in sync
 * with the formatting.
 */
var TIMESTAMP_ENVELOPE_PATTERN = /^\[.*\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;
/**
 * Injects a compact timestamp prefix into a message if one isn't already
 * present. Uses the same `YYYY-MM-DD HH:MM TZ` format as channel envelope
 * timestamps ({@link formatZonedTimestamp}), keeping token cost low (~7
 * tokens) and format consistent across all agent contexts.
 *
 * Used by the gateway `agent` and `chat.send` handlers to give TUI, web,
 * spawned subagents, `sessions_send`, and heartbeat wake events date/time
 * awareness — without modifying the system prompt (which is cached).
 *
 * Channel messages (Discord, Telegram, etc.) already have timestamps via
 * envelope formatting and take a separate code path — they never reach
 * these handlers, so there is no double-stamping risk. The detection
 * pattern is a safety net for edge cases.
 *
 * @see https://github.com/moltbot/moltbot/issues/3658
 */
function injectTimestamp(message, opts) {
    var _a, _b;
    if (!message.trim()) {
        return message;
    }
    // Already has an envelope or injected timestamp
    if (TIMESTAMP_ENVELOPE_PATTERN.test(message)) {
        return message;
    }
    // Already has a cron-injected timestamp
    if (CRON_TIME_PATTERN.test(message)) {
        return message;
    }
    var now = (_a = opts === null || opts === void 0 ? void 0 : opts.now) !== null && _a !== void 0 ? _a : new Date();
    var timezone = (_b = opts === null || opts === void 0 ? void 0 : opts.timezone) !== null && _b !== void 0 ? _b : "UTC";
    var formatted = (0, envelope_js_1.formatZonedTimestamp)(now, timezone);
    if (!formatted) {
        return message;
    }
    // 3-letter DOW: small models (8B) can't reliably derive day-of-week from
    // a date, and may treat a bare "Wed" as a typo. Costs ~1 token.
    var dow = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(now);
    return "[".concat(dow, " ").concat(formatted, "] ").concat(message);
}
/**
 * Build TimestampInjectionOptions from an OpenClawConfig.
 */
function timestampOptsFromConfig(cfg) {
    var _a, _b;
    return {
        timezone: (0, date_time_js_1.resolveUserTimezone)((_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.userTimezone),
    };
}
