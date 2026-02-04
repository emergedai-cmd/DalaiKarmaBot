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
var discord_js_1 = require("../channels/plugins/normalize/discord.js");
var directory_live_js_1 = require("./directory-live.js");
var targets_js_1 = require("./targets.js");
vitest_1.vi.mock("./directory-live.js", function () { return ({
    listDiscordDirectoryPeersLive: vitest_1.vi.fn(),
}); });
(0, vitest_1.describe)("parseDiscordTarget", function () {
    (0, vitest_1.it)("parses user mention and prefixes", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("<@123>")).toMatchObject({
            kind: "user",
            id: "123",
            normalized: "user:123",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("<@!456>")).toMatchObject({
            kind: "user",
            id: "456",
            normalized: "user:456",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("user:789")).toMatchObject({
            kind: "user",
            id: "789",
            normalized: "user:789",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("discord:987")).toMatchObject({
            kind: "user",
            id: "987",
            normalized: "user:987",
        });
    });
    (0, vitest_1.it)("parses channel targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("channel:555")).toMatchObject({
            kind: "channel",
            id: "555",
            normalized: "channel:555",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("general")).toMatchObject({
            kind: "channel",
            id: "general",
            normalized: "channel:general",
        });
    });
    (0, vitest_1.it)("rejects ambiguous numeric ids without a default kind", function () {
        (0, vitest_1.expect)(function () { return (0, targets_js_1.parseDiscordTarget)("123"); }).toThrow(/Ambiguous Discord recipient/);
    });
    (0, vitest_1.it)("accepts numeric ids when a default kind is provided", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseDiscordTarget)("123", { defaultKind: "channel" })).toMatchObject({
            kind: "channel",
            id: "123",
            normalized: "channel:123",
        });
    });
    (0, vitest_1.it)("rejects non-numeric @ mentions", function () {
        (0, vitest_1.expect)(function () { return (0, targets_js_1.parseDiscordTarget)("@bob"); }).toThrow(/Discord DMs require a user id/);
    });
});
(0, vitest_1.describe)("resolveDiscordChannelId", function () {
    (0, vitest_1.it)("strips channel: prefix and accepts raw ids", function () {
        (0, vitest_1.expect)((0, targets_js_1.resolveDiscordChannelId)("channel:123")).toBe("123");
        (0, vitest_1.expect)((0, targets_js_1.resolveDiscordChannelId)("123")).toBe("123");
    });
    (0, vitest_1.it)("rejects user targets", function () {
        (0, vitest_1.expect)(function () { return (0, targets_js_1.resolveDiscordChannelId)("user:123"); }).toThrow(/channel id is required/i);
    });
});
(0, vitest_1.describe)("resolveDiscordTarget", function () {
    var cfg = { channels: { discord: {} } };
    var listPeers = vitest_1.vi.mocked(directory_live_js_1.listDiscordDirectoryPeersLive);
    (0, vitest_1.beforeEach)(function () {
        listPeers.mockReset();
    });
    (0, vitest_1.it)("returns a resolved user for usernames", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listPeers.mockResolvedValueOnce([{ kind: "user", id: "user:999", name: "Jane" }]);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, targets_js_1.resolveDiscordTarget)("jane", { cfg: cfg, accountId: "default" })).resolves.toMatchObject({ kind: "user", id: "999", normalized: "user:999" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to parsing when lookup misses", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listPeers.mockResolvedValueOnce([]);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, targets_js_1.resolveDiscordTarget)("general", { cfg: cfg, accountId: "default" })).resolves.toMatchObject({ kind: "channel", id: "general" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not call directory lookup for explicit user ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listPeers.mockResolvedValueOnce([]);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, targets_js_1.resolveDiscordTarget)("user:123", { cfg: cfg, accountId: "default" })).resolves.toMatchObject({ kind: "user", id: "123" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(listPeers).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("normalizeDiscordMessagingTarget", function () {
    (0, vitest_1.it)("defaults raw numeric ids to channels", function () {
        (0, vitest_1.expect)((0, discord_js_1.normalizeDiscordMessagingTarget)("123")).toBe("channel:123");
    });
});
