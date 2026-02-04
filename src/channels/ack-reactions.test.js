"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var utils_ts_1 = require("../utils.ts");
var ack_reactions_js_1 = require("./ack-reactions.js");
(0, vitest_1.describe)("shouldAckReaction", function () {
    (0, vitest_1.it)("honors direct and group-all scopes", function () {
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "direct",
            isDirect: true,
            isGroup: false,
            isMentionableGroup: false,
            requireMention: false,
            canDetectMention: false,
            effectiveWasMentioned: false,
        })).toBe(true);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "group-all",
            isDirect: false,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: false,
            canDetectMention: false,
            effectiveWasMentioned: false,
        })).toBe(true);
    });
    (0, vitest_1.it)("skips when scope is off or none", function () {
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "off",
            isDirect: true,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: true,
            canDetectMention: true,
            effectiveWasMentioned: true,
        })).toBe(false);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "none",
            isDirect: true,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: true,
            canDetectMention: true,
            effectiveWasMentioned: true,
        })).toBe(false);
    });
    (0, vitest_1.it)("defaults to group-mentions gating", function () {
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: undefined,
            isDirect: false,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: true,
            canDetectMention: true,
            effectiveWasMentioned: true,
        })).toBe(true);
    });
    (0, vitest_1.it)("requires mention gating for group-mentions", function () {
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "group-mentions",
            isDirect: false,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: false,
            canDetectMention: true,
            effectiveWasMentioned: true,
        })).toBe(false);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "group-mentions",
            isDirect: false,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: true,
            canDetectMention: false,
            effectiveWasMentioned: true,
        })).toBe(false);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "group-mentions",
            isDirect: false,
            isGroup: true,
            isMentionableGroup: false,
            requireMention: true,
            canDetectMention: true,
            effectiveWasMentioned: true,
        })).toBe(false);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "group-mentions",
            isDirect: false,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: true,
            canDetectMention: true,
            effectiveWasMentioned: true,
        })).toBe(true);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReaction)({
            scope: "group-mentions",
            isDirect: false,
            isGroup: true,
            isMentionableGroup: true,
            requireMention: true,
            canDetectMention: true,
            effectiveWasMentioned: false,
            shouldBypassMention: true,
        })).toBe(true);
    });
});
(0, vitest_1.describe)("shouldAckReactionForWhatsApp", function () {
    (0, vitest_1.it)("respects direct and group modes", function () {
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: true,
            isGroup: false,
            directEnabled: true,
            groupMode: "mentions",
            wasMentioned: false,
            groupActivated: false,
        })).toBe(true);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: true,
            isGroup: false,
            directEnabled: false,
            groupMode: "mentions",
            wasMentioned: false,
            groupActivated: false,
        })).toBe(false);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: false,
            isGroup: true,
            directEnabled: true,
            groupMode: "always",
            wasMentioned: false,
            groupActivated: false,
        })).toBe(true);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: false,
            isGroup: true,
            directEnabled: true,
            groupMode: "never",
            wasMentioned: true,
            groupActivated: true,
        })).toBe(false);
    });
    (0, vitest_1.it)("honors mentions or activation for group-mentions", function () {
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: false,
            isGroup: true,
            directEnabled: true,
            groupMode: "mentions",
            wasMentioned: true,
            groupActivated: false,
        })).toBe(true);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: false,
            isGroup: true,
            directEnabled: true,
            groupMode: "mentions",
            wasMentioned: false,
            groupActivated: true,
        })).toBe(true);
        (0, vitest_1.expect)((0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
            emoji: "👀",
            isDirect: false,
            isGroup: true,
            directEnabled: true,
            groupMode: "mentions",
            wasMentioned: false,
            groupActivated: false,
        })).toBe(false);
    });
});
(0, vitest_1.describe)("removeAckReactionAfterReply", function () {
    (0, vitest_1.it)("removes only when ack succeeded", function () { return __awaiter(void 0, void 0, void 0, function () {
        var remove, onError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    remove = vitest_1.vi.fn().mockResolvedValue(undefined);
                    onError = vitest_1.vi.fn();
                    (0, ack_reactions_js_1.removeAckReactionAfterReply)({
                        removeAfterReply: true,
                        ackReactionPromise: Promise.resolve(true),
                        ackReactionValue: "👀",
                        remove: remove,
                        onError: onError,
                    });
                    return [4 /*yield*/, (0, utils_ts_1.sleep)(0)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(remove).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(onError).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips removal when ack did not happen", function () { return __awaiter(void 0, void 0, void 0, function () {
        var remove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    remove = vitest_1.vi.fn().mockResolvedValue(undefined);
                    (0, ack_reactions_js_1.removeAckReactionAfterReply)({
                        removeAfterReply: true,
                        ackReactionPromise: Promise.resolve(false),
                        ackReactionValue: "👀",
                        remove: remove,
                    });
                    return [4 /*yield*/, (0, utils_ts_1.sleep)(0)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(remove).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips when not configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var remove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    remove = vitest_1.vi.fn().mockResolvedValue(undefined);
                    (0, ack_reactions_js_1.removeAckReactionAfterReply)({
                        removeAfterReply: false,
                        ackReactionPromise: Promise.resolve(true),
                        ackReactionValue: "👀",
                        remove: remove,
                    });
                    return [4 /*yield*/, (0, utils_ts_1.sleep)(0)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(remove).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
