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
exports.registerMatrixAutoJoin = registerMatrixAutoJoin;
var matrix_bot_sdk_1 = require("@vector-im/matrix-bot-sdk");
var runtime_js_1 = require("../../runtime.js");
function registerMatrixAutoJoin(params) {
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    var client = params.client, cfg = params.cfg, runtime = params.runtime;
    var core = (0, runtime_js_1.getMatrixRuntime)();
    var logVerbose = function (message) {
        var _a;
        if (!core.logging.shouldLogVerbose()) {
            return;
        }
        (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, message);
    };
    var autoJoin = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) === null || _b === void 0 ? void 0 : _b.autoJoin) !== null && _c !== void 0 ? _c : "always";
    var autoJoinAllowlist = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.matrix) === null || _e === void 0 ? void 0 : _e.autoJoinAllowlist) !== null && _f !== void 0 ? _f : [];
    if (autoJoin === "off") {
        return;
    }
    if (autoJoin === "always") {
        // Use the built-in autojoin mixin for "always" mode
        matrix_bot_sdk_1.AutojoinRoomsMixin.setupOnClient(client);
        logVerbose("matrix: auto-join enabled for all invites");
        return;
    }
    // For "allowlist" mode, handle invites manually
    client.on("room.invite", function (roomId, _inviteEvent) { return __awaiter(_this, void 0, void 0, function () {
        var alias, altAliases, aliasState, _a, allowed, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (autoJoin !== "allowlist") {
                        return [2 /*return*/];
                    }
                    altAliases = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client
                            .getRoomStateEvent(roomId, "m.room.canonical_alias", "")
                            .catch(function () { return null; })];
                case 2:
                    aliasState = _c.sent();
                    alias = aliasState === null || aliasState === void 0 ? void 0 : aliasState.alias;
                    altAliases = Array.isArray(aliasState === null || aliasState === void 0 ? void 0 : aliasState.alt_aliases) ? aliasState.alt_aliases : [];
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 4:
                    allowed = autoJoinAllowlist.includes("*") ||
                        autoJoinAllowlist.includes(roomId) ||
                        (alias ? autoJoinAllowlist.includes(alias) : false) ||
                        altAliases.some(function (value) { return autoJoinAllowlist.includes(value); });
                    if (!allowed) {
                        logVerbose("matrix: invite ignored (not in allowlist) room=".concat(roomId));
                        return [2 /*return*/];
                    }
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, client.joinRoom(roomId)];
                case 6:
                    _c.sent();
                    logVerbose("matrix: joined room ".concat(roomId));
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _c.sent();
                    (_b = runtime.error) === null || _b === void 0 ? void 0 : _b.call(runtime, "matrix: failed to join room ".concat(roomId, ": ").concat(String(err_1)));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
}
