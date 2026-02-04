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
(0, vitest_1.describe)("config msteams", function () {
    (0, vitest_1.it)("accepts replyStyle at global/team/channel levels", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_o.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: {
                            msteams: {
                                replyStyle: "top-level",
                                teams: {
                                    team123: {
                                        replyStyle: "thread",
                                        channels: {
                                            chan456: { replyStyle: "top-level" },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.replyStyle).toBe("top-level");
                        (0, vitest_1.expect)((_f = (_e = (_d = (_c = res.config.channels) === null || _c === void 0 ? void 0 : _c.msteams) === null || _d === void 0 ? void 0 : _d.teams) === null || _e === void 0 ? void 0 : _e.team123) === null || _f === void 0 ? void 0 : _f.replyStyle).toBe("thread");
                        (0, vitest_1.expect)((_m = (_l = (_k = (_j = (_h = (_g = res.config.channels) === null || _g === void 0 ? void 0 : _g.msteams) === null || _h === void 0 ? void 0 : _h.teams) === null || _j === void 0 ? void 0 : _j.team123) === null || _k === void 0 ? void 0 : _k.channels) === null || _l === void 0 ? void 0 : _l.chan456) === null || _m === void 0 ? void 0 : _m.replyStyle).toBe("top-level");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects invalid replyStyle", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_a.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: { msteams: { replyStyle: "nope" } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
