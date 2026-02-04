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
exports.fetchGroupChanges = fetchGroupChanges;
exports.fetchAllChannels = fetchAllChannels;
var utils_js_1 = require("./utils.js");
function fetchGroupChanges(api_1, runtime_1) {
    return __awaiter(this, arguments, void 0, function (api, runtime, daysAgo) {
        var changeDate, changes, error_1;
        var _a, _b, _c, _d;
        if (daysAgo === void 0) { daysAgo = 5; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    changeDate = (0, utils_js_1.formatChangesDate)(daysAgo);
                    (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Fetching group changes since ".concat(daysAgo, " days ago (").concat(changeDate, ")..."));
                    return [4 /*yield*/, api.scry("/groups-ui/v5/changes/".concat(changeDate, ".json"))];
                case 1:
                    changes = _e.sent();
                    if (changes) {
                        (_b = runtime.log) === null || _b === void 0 ? void 0 : _b.call(runtime, "[tlon] Successfully fetched changes data");
                        return [2 /*return*/, changes];
                    }
                    return [2 /*return*/, null];
                case 2:
                    error_1 = _e.sent();
                    (_c = runtime.log) === null || _c === void 0 ? void 0 : _c.call(runtime, "[tlon] Failed to fetch changes (falling back to full init): ".concat((_d = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _d !== void 0 ? _d : String(error_1)));
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fetchAllChannels(api, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var changes, initData, channels, _i, _a, groupData, _b, _c, channelNest, error_2;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 6, , 7]);
                    (_d = runtime.log) === null || _d === void 0 ? void 0 : _d.call(runtime, "[tlon] Attempting auto-discovery of group channels...");
                    return [4 /*yield*/, fetchGroupChanges(api, runtime, 5)];
                case 1:
                    changes = _p.sent();
                    initData = void 0;
                    if (!changes) return [3 /*break*/, 3];
                    (_e = runtime.log) === null || _e === void 0 ? void 0 : _e.call(runtime, "[tlon] Changes data received, using full init for channel extraction");
                    return [4 /*yield*/, api.scry("/groups-ui/v6/init.json")];
                case 2:
                    initData = _p.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, api.scry("/groups-ui/v6/init.json")];
                case 4:
                    initData = _p.sent();
                    _p.label = 5;
                case 5:
                    channels = [];
                    if (initData && initData.groups) {
                        // oxlint-disable-next-line typescript/no-explicit-any
                        for (_i = 0, _a = Object.values(initData.groups); _i < _a.length; _i++) {
                            groupData = _a[_i];
                            if (groupData && typeof groupData === "object" && groupData.channels) {
                                for (_b = 0, _c = Object.keys(groupData.channels); _b < _c.length; _b++) {
                                    channelNest = _c[_b];
                                    if (channelNest.startsWith("chat/")) {
                                        channels.push(channelNest);
                                    }
                                }
                            }
                        }
                    }
                    if (channels.length > 0) {
                        (_f = runtime.log) === null || _f === void 0 ? void 0 : _f.call(runtime, "[tlon] Auto-discovered ".concat(channels.length, " chat channel(s)"));
                        (_g = runtime.log) === null || _g === void 0 ? void 0 : _g.call(runtime, "[tlon] Channels: ".concat(channels.slice(0, 5).join(", ")).concat(channels.length > 5 ? "..." : ""));
                    }
                    else {
                        (_h = runtime.log) === null || _h === void 0 ? void 0 : _h.call(runtime, "[tlon] No chat channels found via auto-discovery");
                        (_j = runtime.log) === null || _j === void 0 ? void 0 : _j.call(runtime, "[tlon] Add channels manually to config: channels.tlon.groupChannels");
                    }
                    return [2 /*return*/, channels];
                case 6:
                    error_2 = _p.sent();
                    (_k = runtime.log) === null || _k === void 0 ? void 0 : _k.call(runtime, "[tlon] Auto-discovery failed: ".concat((_l = error_2 === null || error_2 === void 0 ? void 0 : error_2.message) !== null && _l !== void 0 ? _l : String(error_2)));
                    (_m = runtime.log) === null || _m === void 0 ? void 0 : _m.call(runtime, "[tlon] To monitor group channels, add them to config: channels.tlon.groupChannels");
                    (_o = runtime.log) === null || _o === void 0 ? void 0 : _o.call(runtime, '[tlon] Example: ["chat/~host-ship/channel-name"]');
                    return [2 /*return*/, []];
                case 7: return [2 /*return*/];
            }
        });
    });
}
