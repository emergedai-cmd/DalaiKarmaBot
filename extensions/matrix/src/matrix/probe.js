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
exports.probeMatrix = probeMatrix;
var client_js_1 = require("./client.js");
function probeMatrix(params) {
    return __awaiter(this, void 0, void 0, function () {
        var started, result, client, userId, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    started = Date.now();
                    result = {
                        ok: false,
                        status: null,
                        error: null,
                        elapsedMs: 0,
                    };
                    if ((0, client_js_1.isBunRuntime)()) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: "Matrix probe requires Node (bun runtime not supported)", elapsedMs: Date.now() - started })];
                    }
                    if (!((_a = params.homeserver) === null || _a === void 0 ? void 0 : _a.trim())) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: "missing homeserver", elapsedMs: Date.now() - started })];
                    }
                    if (!((_b = params.accessToken) === null || _b === void 0 ? void 0 : _b.trim())) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: "missing access token", elapsedMs: Date.now() - started })];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, client_js_1.createMatrixClient)({
                            homeserver: params.homeserver,
                            userId: (_c = params.userId) !== null && _c !== void 0 ? _c : "",
                            accessToken: params.accessToken,
                            localTimeoutMs: params.timeoutMs,
                        })];
                case 2:
                    client = _d.sent();
                    return [4 /*yield*/, client.getUserId()];
                case 3:
                    userId = _d.sent();
                    result.ok = true;
                    result.userId = userId !== null && userId !== void 0 ? userId : null;
                    result.elapsedMs = Date.now() - started;
                    return [2 /*return*/, result];
                case 4:
                    err_1 = _d.sent();
                    return [2 /*return*/, __assign(__assign({}, result), { status: typeof err_1 === "object" && err_1 && "statusCode" in err_1
                                ? Number(err_1.statusCode)
                                : result.status, error: err_1 instanceof Error ? err_1.message : String(err_1), elapsedMs: Date.now() - started })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
