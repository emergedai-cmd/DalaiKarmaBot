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
exports.checkGatewayHealth = checkGatewayHealth;
var call_js_1 = require("../gateway/call.js");
var channels_status_issues_js_1 = require("../infra/channels-status-issues.js");
var note_js_1 = require("../terminal/note.js");
var health_format_js_1 = require("./health-format.js");
var health_js_1 = require("./health.js");
function checkGatewayHealth(params) {
    return __awaiter(this, void 0, void 0, function () {
        var gatewayDetails, timeoutMs, healthOk, err_1, message, status_1, issues, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    gatewayDetails = (0, call_js_1.buildGatewayConnectionDetails)({ config: params.cfg });
                    timeoutMs = typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : 10000;
                    healthOk = false;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: timeoutMs, config: params.cfg }, params.runtime)];
                case 2:
                    _b.sent();
                    healthOk = true;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    message = String(err_1);
                    if (message.includes("gateway closed")) {
                        (0, note_js_1.note)("Gateway not running.", "Gateway");
                        (0, note_js_1.note)(gatewayDetails.message, "Gateway connection");
                    }
                    else {
                        params.runtime.error((0, health_format_js_1.formatHealthCheckFailure)(err_1));
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if (!healthOk) return [3 /*break*/, 8];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, call_js_1.callGateway)({
                            method: "channels.status",
                            params: { probe: true, timeoutMs: 5000 },
                            timeoutMs: 6000,
                        })];
                case 6:
                    status_1 = _b.sent();
                    issues = (0, channels_status_issues_js_1.collectChannelStatusIssues)(status_1);
                    if (issues.length > 0) {
                        (0, note_js_1.note)(issues
                            .map(function (issue) {
                            return "- ".concat(issue.channel, " ").concat(issue.accountId, ": ").concat(issue.message).concat(issue.fix ? " (".concat(issue.fix, ")") : "");
                        })
                            .join("\n"), "Channel warnings");
                    }
                    return [3 /*break*/, 8];
                case 7:
                    _a = _b.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, { healthOk: healthOk }];
            }
        });
    });
}
