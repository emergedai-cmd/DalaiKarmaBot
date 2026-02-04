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
exports.resolveDeliveryTarget = resolveDeliveryTarget;
var registry_js_1 = require("../../channels/registry.js");
var sessions_js_1 = require("../../config/sessions.js");
var channel_selection_js_1 = require("../../infra/outbound/channel-selection.js");
var targets_js_1 = require("../../infra/outbound/targets.js");
function resolveDeliveryTarget(cfg, agentId, jobPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var requestedChannel, explicitTo, sessionCfg, mainSessionKey, storePath, store, main, preliminary, fallbackChannel, selection, _a, resolved, channel, mode, toCandidate, docked;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    requestedChannel = typeof jobPayload.channel === "string" ? jobPayload.channel : "last";
                    explicitTo = typeof jobPayload.to === "string" ? jobPayload.to : undefined;
                    sessionCfg = cfg.session;
                    mainSessionKey = (0, sessions_js_1.resolveAgentMainSessionKey)({ cfg: cfg, agentId: agentId });
                    storePath = (0, sessions_js_1.resolveStorePath)(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store, { agentId: agentId });
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    main = store[mainSessionKey];
                    preliminary = (0, targets_js_1.resolveSessionDeliveryTarget)({
                        entry: main,
                        requestedChannel: requestedChannel,
                        explicitTo: explicitTo,
                        allowMismatchedLastTo: true,
                    });
                    if (!!preliminary.channel) return [3 /*break*/, 4];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, channel_selection_js_1.resolveMessageChannelSelection)({ cfg: cfg })];
                case 2:
                    selection = _e.sent();
                    fallbackChannel = selection.channel;
                    return [3 /*break*/, 4];
                case 3:
                    _a = _e.sent();
                    fallbackChannel = (_b = preliminary.lastChannel) !== null && _b !== void 0 ? _b : registry_js_1.DEFAULT_CHAT_CHANNEL;
                    return [3 /*break*/, 4];
                case 4:
                    resolved = fallbackChannel
                        ? (0, targets_js_1.resolveSessionDeliveryTarget)({
                            entry: main,
                            requestedChannel: requestedChannel,
                            explicitTo: explicitTo,
                            fallbackChannel: fallbackChannel,
                            allowMismatchedLastTo: true,
                            mode: preliminary.mode,
                        })
                        : preliminary;
                    channel = (_d = (_c = resolved.channel) !== null && _c !== void 0 ? _c : fallbackChannel) !== null && _d !== void 0 ? _d : registry_js_1.DEFAULT_CHAT_CHANNEL;
                    mode = resolved.mode;
                    toCandidate = resolved.to;
                    if (!toCandidate) {
                        return [2 /*return*/, { channel: channel, to: undefined, accountId: resolved.accountId, mode: mode }];
                    }
                    docked = (0, targets_js_1.resolveOutboundTarget)({
                        channel: channel,
                        to: toCandidate,
                        cfg: cfg,
                        accountId: resolved.accountId,
                        mode: mode,
                    });
                    return [2 /*return*/, {
                            channel: channel,
                            to: docked.ok ? docked.to : undefined,
                            accountId: resolved.accountId,
                            mode: mode,
                            error: docked.ok ? undefined : docked.error,
                        }];
            }
        });
    });
}
