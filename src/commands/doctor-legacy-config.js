"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLegacyConfigValues = normalizeLegacyConfigValues;
function normalizeLegacyConfigValues(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var changes = [];
    var next = cfg;
    var legacyAckReaction = (_b = (_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.ackReaction) === null || _b === void 0 ? void 0 : _b.trim();
    var hasWhatsAppConfig = ((_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) !== undefined;
    if (legacyAckReaction && hasWhatsAppConfig) {
        var hasWhatsAppAck = ((_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.whatsapp) === null || _e === void 0 ? void 0 : _e.ackReaction) !== undefined;
        if (!hasWhatsAppAck) {
            var legacyScope = (_g = (_f = cfg.messages) === null || _f === void 0 ? void 0 : _f.ackReactionScope) !== null && _g !== void 0 ? _g : "group-mentions";
            var direct = true;
            var group = "mentions";
            if (legacyScope === "all") {
                direct = true;
                group = "always";
            }
            else if (legacyScope === "direct") {
                direct = true;
                group = "never";
            }
            else if (legacyScope === "group-all") {
                direct = false;
                group = "always";
            }
            else if (legacyScope === "group-mentions") {
                direct = false;
                group = "mentions";
            }
            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { whatsapp: __assign(__assign({}, (_h = next.channels) === null || _h === void 0 ? void 0 : _h.whatsapp), { ackReaction: { emoji: legacyAckReaction, direct: direct, group: group } }) }) });
            changes.push("Copied messages.ackReaction \u2192 channels.whatsapp.ackReaction (scope: ".concat(legacyScope, ")."));
        }
    }
    return { config: next, changes: changes };
}
