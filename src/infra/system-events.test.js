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
var session_updates_js_1 = require("../auto-reply/reply/session-updates.js");
var sessions_js_1 = require("../config/sessions.js");
var system_events_js_1 = require("./system-events.js");
var cfg = {};
var mainKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
(0, vitest_1.describe)("system events (session routing)", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, system_events_js_1.resetSystemEventsForTest)();
    });
    (0, vitest_1.it)("does not leak session-scoped events into main", function () { return __awaiter(void 0, void 0, void 0, function () {
        var main, discord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, system_events_js_1.enqueueSystemEvent)("Discord reaction added: ✅", {
                        sessionKey: "discord:group:123",
                        contextKey: "discord:reaction:added:msg:user:✅",
                    });
                    (0, vitest_1.expect)((0, system_events_js_1.peekSystemEvents)(mainKey)).toEqual([]);
                    (0, vitest_1.expect)((0, system_events_js_1.peekSystemEvents)("discord:group:123")).toEqual(["Discord reaction added: ✅"]);
                    return [4 /*yield*/, (0, session_updates_js_1.prependSystemEvents)({
                            cfg: cfg,
                            sessionKey: mainKey,
                            isMainSession: true,
                            isNewSession: false,
                            prefixedBodyBase: "hello",
                        })];
                case 1:
                    main = _a.sent();
                    (0, vitest_1.expect)(main).toBe("hello");
                    (0, vitest_1.expect)((0, system_events_js_1.peekSystemEvents)("discord:group:123")).toEqual(["Discord reaction added: ✅"]);
                    return [4 /*yield*/, (0, session_updates_js_1.prependSystemEvents)({
                            cfg: cfg,
                            sessionKey: "discord:group:123",
                            isMainSession: false,
                            isNewSession: false,
                            prefixedBodyBase: "hi",
                        })];
                case 2:
                    discord = _a.sent();
                    (0, vitest_1.expect)(discord).toMatch(/^System: \[[^\]]+\] Discord reaction added: ✅\n\nhi$/);
                    (0, vitest_1.expect)((0, system_events_js_1.peekSystemEvents)("discord:group:123")).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires an explicit session key", function () {
        (0, vitest_1.expect)(function () { return (0, system_events_js_1.enqueueSystemEvent)("Node: Mac Studio", { sessionKey: " " }); }).toThrow("sessionKey");
    });
});
