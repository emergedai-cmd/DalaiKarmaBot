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
exports.usageHandlers = void 0;
var config_js_1 = require("../../config/config.js");
var provider_usage_js_1 = require("../../infra/provider-usage.js");
var session_cost_usage_js_1 = require("../../infra/session-cost-usage.js");
var COST_USAGE_CACHE_TTL_MS = 30000;
var costUsageCache = new Map();
var parseDays = function (raw) {
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return Math.floor(raw);
    }
    if (typeof raw === "string" && raw.trim() !== "") {
        var parsed = Number(raw);
        if (Number.isFinite(parsed)) {
            return Math.floor(parsed);
        }
    }
    return 30;
};
function loadCostUsageSummaryCached(params) {
    return __awaiter(this, void 0, void 0, function () {
        var days, now, cached, entry, inFlight;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    days = Math.max(1, params.days);
                    now = Date.now();
                    cached = costUsageCache.get(days);
                    if ((cached === null || cached === void 0 ? void 0 : cached.summary) && cached.updatedAt && now - cached.updatedAt < COST_USAGE_CACHE_TTL_MS) {
                        return [2 /*return*/, cached.summary];
                    }
                    if (!(cached === null || cached === void 0 ? void 0 : cached.inFlight)) return [3 /*break*/, 2];
                    if (cached.summary) {
                        return [2 /*return*/, cached.summary];
                    }
                    return [4 /*yield*/, cached.inFlight];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    entry = cached !== null && cached !== void 0 ? cached : {};
                    inFlight = (0, session_cost_usage_js_1.loadCostUsageSummary)({ days: days, config: params.config })
                        .then(function (summary) {
                        costUsageCache.set(days, { summary: summary, updatedAt: Date.now() });
                        return summary;
                    })
                        .catch(function (err) {
                        if (entry.summary) {
                            return entry.summary;
                        }
                        throw err;
                    })
                        .finally(function () {
                        var current = costUsageCache.get(days);
                        if ((current === null || current === void 0 ? void 0 : current.inFlight) === inFlight) {
                            current.inFlight = undefined;
                            costUsageCache.set(days, current);
                        }
                    });
                    entry.inFlight = inFlight;
                    costUsageCache.set(days, entry);
                    if (entry.summary) {
                        return [2 /*return*/, entry.summary];
                    }
                    return [4 /*yield*/, inFlight];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.usageHandlers = {
    "usage.status": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var summary;
        var respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)()];
                case 1:
                    summary = _c.sent();
                    respond(true, summary, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "usage.cost": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var config, days, summary;
        var respond = _b.respond, params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = (0, config_js_1.loadConfig)();
                    days = parseDays(params === null || params === void 0 ? void 0 : params.days);
                    return [4 /*yield*/, loadCostUsageSummaryCached({ days: days, config: config })];
                case 1:
                    summary = _c.sent();
                    respond(true, summary, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
