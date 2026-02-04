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
exports.ensureNodeRuntime = ensureNodeRuntime;
exports.resolveActionClient = resolveActionClient;
var runtime_js_1 = require("../../runtime.js");
var active_client_js_1 = require("../active-client.js");
var client_js_1 = require("../client.js");
function ensureNodeRuntime() {
    if ((0, client_js_1.isBunRuntime)()) {
        throw new Error("Matrix support requires Node (bun runtime not supported)");
    }
}
function resolveActionClient() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var active, shouldShareClient, client_1, auth, client, joinedRooms, _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ensureNodeRuntime();
                    if (opts.client) {
                        return [2 /*return*/, { client: opts.client, stopOnDone: false }];
                    }
                    active = (0, active_client_js_1.getActiveMatrixClient)();
                    if (active) {
                        return [2 /*return*/, { client: active, stopOnDone: false }];
                    }
                    shouldShareClient = Boolean(process.env.OPENCLAW_GATEWAY_PORT);
                    if (!shouldShareClient) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, client_js_1.resolveSharedMatrixClient)({
                            cfg: (0, runtime_js_1.getMatrixRuntime)().config.loadConfig(),
                            timeoutMs: opts.timeoutMs,
                        })];
                case 1:
                    client_1 = _b.sent();
                    return [2 /*return*/, { client: client_1, stopOnDone: false }];
                case 2: return [4 /*yield*/, (0, client_js_1.resolveMatrixAuth)({
                        cfg: (0, runtime_js_1.getMatrixRuntime)().config.loadConfig(),
                    })];
                case 3:
                    auth = _b.sent();
                    return [4 /*yield*/, (0, client_js_1.createMatrixClient)({
                            homeserver: auth.homeserver,
                            userId: auth.userId,
                            accessToken: auth.accessToken,
                            encryption: auth.encryption,
                            localTimeoutMs: opts.timeoutMs,
                        })];
                case 4:
                    client = _b.sent();
                    if (!(auth.encryption && client.crypto)) return [3 /*break*/, 9];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, client.getJoinedRooms()];
                case 6:
                    joinedRooms = _b.sent();
                    return [4 /*yield*/, client.crypto.prepare(joinedRooms)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _a = _b.sent();
                    return [3 /*break*/, 9];
                case 9: return [4 /*yield*/, client.start()];
                case 10:
                    _b.sent();
                    return [2 /*return*/, { client: client, stopOnDone: true }];
            }
        });
    });
}
