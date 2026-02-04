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
exports.persistCallRecord = persistCallRecord;
exports.loadActiveCallsFromStore = loadActiveCallsFromStore;
exports.getCallHistoryFromStore = getCallHistoryFromStore;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var types_js_1 = require("../types.js");
function persistCallRecord(storePath, call) {
    var logPath = node_path_1.default.join(storePath, "calls.jsonl");
    var line = "".concat(JSON.stringify(call), "\n");
    // Fire-and-forget async write to avoid blocking event loop.
    promises_1.default.appendFile(logPath, line).catch(function (err) {
        console.error("[voice-call] Failed to persist call record:", err);
    });
}
function loadActiveCallsFromStore(storePath) {
    var logPath = node_path_1.default.join(storePath, "calls.jsonl");
    if (!node_fs_1.default.existsSync(logPath)) {
        return {
            activeCalls: new Map(),
            providerCallIdMap: new Map(),
            processedEventIds: new Set(),
        };
    }
    var content = node_fs_1.default.readFileSync(logPath, "utf-8");
    var lines = content.split("\n");
    var callMap = new Map();
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (!line.trim()) {
            continue;
        }
        try {
            var call = types_js_1.CallRecordSchema.parse(JSON.parse(line));
            callMap.set(call.callId, call);
        }
        catch (_a) {
            // Skip invalid lines.
        }
    }
    var activeCalls = new Map();
    var providerCallIdMap = new Map();
    var processedEventIds = new Set();
    for (var _b = 0, callMap_1 = callMap; _b < callMap_1.length; _b++) {
        var _c = callMap_1[_b], callId = _c[0], call = _c[1];
        if (types_js_1.TerminalStates.has(call.state)) {
            continue;
        }
        activeCalls.set(callId, call);
        if (call.providerCallId) {
            providerCallIdMap.set(call.providerCallId, callId);
        }
        for (var _d = 0, _e = call.processedEventIds; _d < _e.length; _d++) {
            var eventId = _e[_d];
            processedEventIds.add(eventId);
        }
    }
    return { activeCalls: activeCalls, providerCallIdMap: providerCallIdMap, processedEventIds: processedEventIds };
}
function getCallHistoryFromStore(storePath_1) {
    return __awaiter(this, arguments, void 0, function (storePath, limit) {
        var logPath, _a, content, lines, calls, _i, _b, line, parsed;
        if (limit === void 0) { limit = 50; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logPath = node_path_1.default.join(storePath, "calls.jsonl");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.access(logPath)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [2 /*return*/, []];
                case 4: return [4 /*yield*/, promises_1.default.readFile(logPath, "utf-8")];
                case 5:
                    content = _c.sent();
                    lines = content.trim().split("\n").filter(Boolean);
                    calls = [];
                    for (_i = 0, _b = lines.slice(-limit); _i < _b.length; _i++) {
                        line = _b[_i];
                        try {
                            parsed = types_js_1.CallRecordSchema.parse(JSON.parse(line));
                            calls.push(parsed);
                        }
                        catch (_d) {
                            // Skip invalid lines.
                        }
                    }
                    return [2 /*return*/, calls];
            }
        });
    });
}
