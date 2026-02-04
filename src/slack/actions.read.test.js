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
var actions_js_1 = require("./actions.js");
function createClient() {
    var _this = this;
    return {
        conversations: {
            replies: vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ messages: [], has_more: false })];
            }); }); }),
            history: vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ messages: [], has_more: false })];
            }); }); }),
        },
    };
}
(0, vitest_1.describe)("readSlackMessages", function () {
    (0, vitest_1.it)("uses conversations.replies and drops the parent message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = createClient();
                    client.conversations.replies.mockResolvedValueOnce({
                        messages: [{ ts: "171234.567" }, { ts: "171234.890" }, { ts: "171235.000" }],
                        has_more: true,
                    });
                    return [4 /*yield*/, (0, actions_js_1.readSlackMessages)("C1", {
                            client: client,
                            threadId: "171234.567",
                            token: "xoxb-test",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(client.conversations.replies).toHaveBeenCalledWith({
                        channel: "C1",
                        ts: "171234.567",
                        limit: undefined,
                        latest: undefined,
                        oldest: undefined,
                    });
                    (0, vitest_1.expect)(client.conversations.history).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(result.messages.map(function (message) { return message.ts; })).toEqual(["171234.890", "171235.000"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses conversations.history when threadId is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = createClient();
                    client.conversations.history.mockResolvedValueOnce({
                        messages: [{ ts: "1" }],
                        has_more: false,
                    });
                    return [4 /*yield*/, (0, actions_js_1.readSlackMessages)("C1", {
                            client: client,
                            limit: 20,
                            token: "xoxb-test",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(client.conversations.history).toHaveBeenCalledWith({
                        channel: "C1",
                        limit: 20,
                        latest: undefined,
                        oldest: undefined,
                    });
                    (0, vitest_1.expect)(client.conversations.replies).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(result.messages.map(function (message) { return message.ts; })).toEqual(["1"]);
                    return [2 /*return*/];
            }
        });
    }); });
});
