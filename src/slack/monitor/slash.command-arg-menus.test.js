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
var slash_js_1 = require("./slash.js");
var dispatchMock = vitest_1.vi.fn();
var readAllowFromStoreMock = vitest_1.vi.fn();
var upsertPairingRequestMock = vitest_1.vi.fn();
var resolveAgentRouteMock = vitest_1.vi.fn();
vitest_1.vi.mock("../../auto-reply/reply/provider-dispatcher.js", function () { return ({
    dispatchReplyWithDispatcher: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return dispatchMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readAllowFromStoreMock.apply(void 0, args);
    },
    upsertChannelPairingRequest: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return upsertPairingRequestMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../../routing/resolve-route.js", function () { return ({
    resolveAgentRoute: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return resolveAgentRouteMock.apply(void 0, args);
    },
}); });
vitest_1.vi.mock("../../agents/identity.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveEffectiveMessagesConfig: function () { return ({ responsePrefix: "" }); } })];
        }
    });
}); });
function encodeValue(parts) {
    return [
        "cmdarg",
        encodeURIComponent(parts.command),
        encodeURIComponent(parts.arg),
        encodeURIComponent(parts.value),
        encodeURIComponent(parts.userId),
    ].join("|");
}
function createHarness() {
    var _this = this;
    var commands = new Map();
    var actions = new Map();
    var postEphemeral = vitest_1.vi.fn().mockResolvedValue({ ok: true });
    var app = {
        client: { chat: { postEphemeral: postEphemeral } },
        command: function (name, handler) {
            commands.set(name, handler);
        },
        action: function (id, handler) {
            actions.set(id, handler);
        },
    };
    var ctx = {
        cfg: { commands: { native: true } },
        runtime: {},
        botToken: "bot-token",
        botUserId: "bot",
        teamId: "T1",
        allowFrom: ["*"],
        dmEnabled: true,
        dmPolicy: "open",
        groupDmEnabled: false,
        groupDmChannels: [],
        defaultRequireMention: true,
        groupPolicy: "open",
        useAccessGroups: false,
        channelsConfig: undefined,
        slashCommand: {
            enabled: true,
            name: "openclaw",
            ephemeral: true,
            sessionPrefix: "slack:slash",
        },
        textLimit: 4000,
        app: app,
        isChannelAllowed: function () { return true; },
        resolveChannelName: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ name: "dm", type: "im" })];
        }); }); },
        resolveUserName: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ name: "Ada" })];
        }); }); },
    };
    var account = { accountId: "acct", config: { commands: { native: true } } };
    return { commands: commands, actions: actions, postEphemeral: postEphemeral, ctx: ctx, account: account };
}
(0, vitest_1.beforeEach)(function () {
    dispatchMock.mockReset().mockResolvedValue({ counts: { final: 1, tool: 0, block: 0 } });
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
    resolveAgentRouteMock.mockReset().mockReturnValue({
        agentId: "main",
        sessionKey: "session:1",
        accountId: "acct",
    });
});
(0, vitest_1.describe)("Slack native command argument menus", function () {
    (0, vitest_1.it)("shows a button menu when required args are omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, commands, ctx, account, handler, respond, ack, payload;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = createHarness(), commands = _a.commands, ctx = _a.ctx, account = _a.account;
                    (0, slash_js_1.registerSlackMonitorSlashCommands)({ ctx: ctx, account: account });
                    handler = commands.get("/usage");
                    if (!handler) {
                        throw new Error("Missing /usage handler");
                    }
                    respond = vitest_1.vi.fn().mockResolvedValue(undefined);
                    ack = vitest_1.vi.fn().mockResolvedValue(undefined);
                    return [4 /*yield*/, handler({
                            command: {
                                user_id: "U1",
                                user_name: "Ada",
                                channel_id: "C1",
                                channel_name: "directmessage",
                                text: "",
                                trigger_id: "t1",
                            },
                            ack: ack,
                            respond: respond,
                        })];
                case 1:
                    _g.sent();
                    (0, vitest_1.expect)(respond).toHaveBeenCalledTimes(1);
                    payload = (_b = respond.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)((_d = (_c = payload.blocks) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.type).toBe("section");
                    (0, vitest_1.expect)((_f = (_e = payload.blocks) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.type).toBe("actions");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("dispatches the command when a menu button is clicked", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, actions, ctx, account, handler, respond, call;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = createHarness(), actions = _a.actions, ctx = _a.ctx, account = _a.account;
                    (0, slash_js_1.registerSlackMonitorSlashCommands)({ ctx: ctx, account: account });
                    handler = actions.get("openclaw_cmdarg");
                    if (!handler) {
                        throw new Error("Missing arg-menu action handler");
                    }
                    respond = vitest_1.vi.fn().mockResolvedValue(undefined);
                    return [4 /*yield*/, handler({
                            ack: vitest_1.vi.fn().mockResolvedValue(undefined),
                            action: {
                                value: encodeValue({ command: "usage", arg: "mode", value: "tokens", userId: "U1" }),
                            },
                            body: {
                                user: { id: "U1", name: "Ada" },
                                channel: { id: "C1", name: "directmessage" },
                                trigger_id: "t1",
                            },
                            respond: respond,
                        })];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(dispatchMock).toHaveBeenCalledTimes(1);
                    call = (_b = dispatchMock.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)((_c = call.ctx) === null || _c === void 0 ? void 0 : _c.Body).toBe("/usage tokens");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects menu clicks from other users", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, actions, ctx, account, handler, respond;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createHarness(), actions = _a.actions, ctx = _a.ctx, account = _a.account;
                    (0, slash_js_1.registerSlackMonitorSlashCommands)({ ctx: ctx, account: account });
                    handler = actions.get("openclaw_cmdarg");
                    if (!handler) {
                        throw new Error("Missing arg-menu action handler");
                    }
                    respond = vitest_1.vi.fn().mockResolvedValue(undefined);
                    return [4 /*yield*/, handler({
                            ack: vitest_1.vi.fn().mockResolvedValue(undefined),
                            action: {
                                value: encodeValue({ command: "usage", arg: "mode", value: "tokens", userId: "U1" }),
                            },
                            body: {
                                user: { id: "U2", name: "Eve" },
                                channel: { id: "C1", name: "directmessage" },
                                trigger_id: "t1",
                            },
                            respond: respond,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(dispatchMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(respond).toHaveBeenCalledWith({
                        text: "That menu is for another user.",
                        response_type: "ephemeral",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to postEphemeral with token when respond is unavailable", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, actions, postEphemeral, ctx, account, handler;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createHarness(), actions = _a.actions, postEphemeral = _a.postEphemeral, ctx = _a.ctx, account = _a.account;
                    (0, slash_js_1.registerSlackMonitorSlashCommands)({ ctx: ctx, account: account });
                    handler = actions.get("openclaw_cmdarg");
                    if (!handler) {
                        throw new Error("Missing arg-menu action handler");
                    }
                    return [4 /*yield*/, handler({
                            ack: vitest_1.vi.fn().mockResolvedValue(undefined),
                            action: { value: "garbage" },
                            body: { user: { id: "U1" }, channel: { id: "C1" } },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postEphemeral).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        token: "bot-token",
                        channel: "C1",
                        user: "U1",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats malformed percent-encoding as an invalid button (no throw)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, actions, postEphemeral, ctx, account, handler;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createHarness(), actions = _a.actions, postEphemeral = _a.postEphemeral, ctx = _a.ctx, account = _a.account;
                    (0, slash_js_1.registerSlackMonitorSlashCommands)({ ctx: ctx, account: account });
                    handler = actions.get("openclaw_cmdarg");
                    if (!handler) {
                        throw new Error("Missing arg-menu action handler");
                    }
                    return [4 /*yield*/, handler({
                            ack: vitest_1.vi.fn().mockResolvedValue(undefined),
                            action: { value: "cmdarg|%E0%A4%A|mode|on|U1" },
                            body: { user: { id: "U1" }, channel: { id: "C1" } },
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(postEphemeral).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        token: "bot-token",
                        channel: "C1",
                        user: "U1",
                        text: "Sorry, that button is no longer valid.",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
