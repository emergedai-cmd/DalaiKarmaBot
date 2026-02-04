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
exports.normalizeBlueBubblesReactionInput = normalizeBlueBubblesReactionInput;
exports.sendBlueBubblesReaction = sendBlueBubblesReaction;
var accounts_js_1 = require("./accounts.js");
var types_js_1 = require("./types.js");
var REACTION_TYPES = new Set(["love", "like", "dislike", "laugh", "emphasize", "question"]);
var REACTION_ALIASES = new Map([
    // General
    ["heart", "love"],
    ["love", "love"],
    ["❤", "love"],
    ["❤️", "love"],
    ["red_heart", "love"],
    ["thumbs_up", "like"],
    ["thumbsup", "like"],
    ["thumbs-up", "like"],
    ["thumbsup", "like"],
    ["like", "like"],
    ["thumb", "like"],
    ["ok", "like"],
    ["thumbs_down", "dislike"],
    ["thumbsdown", "dislike"],
    ["thumbs-down", "dislike"],
    ["dislike", "dislike"],
    ["boo", "dislike"],
    ["no", "dislike"],
    // Laugh
    ["haha", "laugh"],
    ["lol", "laugh"],
    ["lmao", "laugh"],
    ["rofl", "laugh"],
    ["😂", "laugh"],
    ["🤣", "laugh"],
    ["xd", "laugh"],
    ["laugh", "laugh"],
    // Emphasize / exclaim
    ["emphasis", "emphasize"],
    ["emphasize", "emphasize"],
    ["exclaim", "emphasize"],
    ["!!", "emphasize"],
    ["‼", "emphasize"],
    ["‼️", "emphasize"],
    ["❗", "emphasize"],
    ["important", "emphasize"],
    ["bang", "emphasize"],
    // Question
    ["question", "question"],
    ["?", "question"],
    ["❓", "question"],
    ["❔", "question"],
    ["ask", "question"],
    // Apple/Messages names
    ["loved", "love"],
    ["liked", "like"],
    ["disliked", "dislike"],
    ["laughed", "laugh"],
    ["emphasized", "emphasize"],
    ["questioned", "question"],
    // Colloquial / informal
    ["fire", "love"],
    ["🔥", "love"],
    ["wow", "emphasize"],
    ["!", "emphasize"],
    // Edge: generic emoji name forms
    ["heart_eyes", "love"],
    ["smile", "laugh"],
    ["smiley", "laugh"],
    ["happy", "laugh"],
    ["joy", "laugh"],
]);
var REACTION_EMOJIS = new Map([
    // Love
    ["❤️", "love"],
    ["❤", "love"],
    ["♥️", "love"],
    ["♥", "love"],
    ["😍", "love"],
    ["💕", "love"],
    // Like
    ["👍", "like"],
    ["👌", "like"],
    // Dislike
    ["👎", "dislike"],
    ["🙅", "dislike"],
    // Laugh
    ["😂", "laugh"],
    ["🤣", "laugh"],
    ["😆", "laugh"],
    ["😁", "laugh"],
    ["😹", "laugh"],
    // Emphasize
    ["‼️", "emphasize"],
    ["‼", "emphasize"],
    ["!!", "emphasize"],
    ["❗", "emphasize"],
    ["❕", "emphasize"],
    ["!", "emphasize"],
    // Question
    ["❓", "question"],
    ["❔", "question"],
    ["?", "question"],
]);
function resolveAccount(params) {
    var _a, _b, _c, _d, _e;
    var account = (0, accounts_js_1.resolveBlueBubblesAccount)({
        cfg: (_a = params.cfg) !== null && _a !== void 0 ? _a : {},
        accountId: params.accountId,
    });
    var baseUrl = ((_b = params.serverUrl) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = account.config.serverUrl) === null || _c === void 0 ? void 0 : _c.trim());
    var password = ((_d = params.password) === null || _d === void 0 ? void 0 : _d.trim()) || ((_e = account.config.password) === null || _e === void 0 ? void 0 : _e.trim());
    if (!baseUrl) {
        throw new Error("BlueBubbles serverUrl is required");
    }
    if (!password) {
        throw new Error("BlueBubbles password is required");
    }
    return { baseUrl: baseUrl, password: password };
}
function normalizeBlueBubblesReactionInput(emoji, remove) {
    var _a, _b, _c;
    var trimmed = emoji.trim();
    if (!trimmed) {
        throw new Error("BlueBubbles reaction requires an emoji or name.");
    }
    var raw = trimmed.toLowerCase();
    if (raw.startsWith("-")) {
        raw = raw.slice(1);
    }
    var aliased = (_a = REACTION_ALIASES.get(raw)) !== null && _a !== void 0 ? _a : raw;
    var mapped = (_c = (_b = REACTION_EMOJIS.get(trimmed)) !== null && _b !== void 0 ? _b : REACTION_EMOJIS.get(raw)) !== null && _c !== void 0 ? _c : aliased;
    if (!REACTION_TYPES.has(mapped)) {
        throw new Error("Unsupported BlueBubbles reaction: ".concat(trimmed));
    }
    return remove ? "-".concat(mapped) : mapped;
}
function sendBlueBubblesReaction(params) {
    return __awaiter(this, void 0, void 0, function () {
        var chatGuid, messageGuid, reaction, _a, baseUrl, password, url, payload, res, errorText;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    chatGuid = params.chatGuid.trim();
                    messageGuid = params.messageGuid.trim();
                    if (!chatGuid) {
                        throw new Error("BlueBubbles reaction requires chatGuid.");
                    }
                    if (!messageGuid) {
                        throw new Error("BlueBubbles reaction requires messageGuid.");
                    }
                    reaction = normalizeBlueBubblesReactionInput(params.emoji, params.remove);
                    _a = resolveAccount((_b = params.opts) !== null && _b !== void 0 ? _b : {}), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/message/react",
                        password: password,
                    });
                    payload = {
                        chatGuid: chatGuid,
                        selectedMessageGuid: messageGuid,
                        reaction: reaction,
                        partIndex: typeof params.partIndex === "number" ? params.partIndex : 0,
                    };
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        }, (_c = params.opts) === null || _c === void 0 ? void 0 : _c.timeoutMs)];
                case 1:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()];
                case 2:
                    errorText = _d.sent();
                    throw new Error("BlueBubbles reaction failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
