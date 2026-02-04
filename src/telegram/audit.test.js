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
(0, vitest_1.describe)("telegram audit", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.it)("collects unmentioned numeric group ids and flags wildcard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var collectTelegramUnmentionedGroupIds, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./audit.js"); })];
                case 1:
                    collectTelegramUnmentionedGroupIds = (_a.sent()).collectTelegramUnmentionedGroupIds;
                    res = collectTelegramUnmentionedGroupIds({
                        "*": { requireMention: false },
                        "-1001": { requireMention: false },
                        "@group": { requireMention: false },
                        "-1002": { requireMention: true },
                        "-1003": { requireMention: false, enabled: false },
                    });
                    (0, vitest_1.expect)(res.hasWildcardUnmentionedGroups).toBe(true);
                    (0, vitest_1.expect)(res.groupIds).toEqual(["-1001"]);
                    (0, vitest_1.expect)(res.unresolvedGroups).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("audits membership via getChatMember", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auditTelegramGroupMembership, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./audit.js"); })];
                case 1:
                    auditTelegramGroupMembership = (_c.sent()).auditTelegramGroupMembership;
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, result: { status: "member" } }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    })));
                    return [4 /*yield*/, auditTelegramGroupMembership({
                            token: "t",
                            botId: 123,
                            groupIds: ["-1001"],
                            timeoutMs: 5000,
                        })];
                case 2:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)((_a = res.groups[0]) === null || _a === void 0 ? void 0 : _a.chatId).toBe("-1001");
                    (0, vitest_1.expect)((_b = res.groups[0]) === null || _b === void 0 ? void 0 : _b.status).toBe("member");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports bot not in group when status is left", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auditTelegramGroupMembership, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./audit.js"); })];
                case 1:
                    auditTelegramGroupMembership = (_c.sent()).auditTelegramGroupMembership;
                    vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, result: { status: "left" } }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    })));
                    return [4 /*yield*/, auditTelegramGroupMembership({
                            token: "t",
                            botId: 123,
                            groupIds: ["-1001"],
                            timeoutMs: 5000,
                        })];
                case 2:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)((_a = res.groups[0]) === null || _a === void 0 ? void 0 : _a.ok).toBe(false);
                    (0, vitest_1.expect)((_b = res.groups[0]) === null || _b === void 0 ? void 0 : _b.status).toBe("left");
                    return [2 /*return*/];
            }
        });
    }); });
});
