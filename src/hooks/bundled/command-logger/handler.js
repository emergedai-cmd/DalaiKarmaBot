"use strict";
/**
 * Example hook handler: Log all commands to a file
 *
 * This handler demonstrates how to create a hook that logs all command events
 * to a centralized log file for audit/debugging purposes.
 *
 * To enable this handler, add it to your config:
 *
 * ```json
 * {
 *   "hooks": {
 *     "internal": {
 *       "enabled": true,
 *       "handlers": [
 *         {
 *           "event": "command",
 *           "module": "./hooks/handlers/command-logger.ts"
 *         }
 *       ]
 *     }
 *   }
 * }
 * ```
 */
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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
/**
 * Log all command events to a file
 */
var logCommand = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var stateDir, logDir, logFile, logLine, err_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                // Only trigger on command events
                if (event.type !== "command") {
                    return [2 /*return*/];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                stateDir = ((_a = process.env.OPENCLAW_STATE_DIR) === null || _a === void 0 ? void 0 : _a.trim()) || node_path_1.default.join(node_os_1.default.homedir(), ".openclaw");
                logDir = node_path_1.default.join(stateDir, "logs");
                return [4 /*yield*/, promises_1.default.mkdir(logDir, { recursive: true })];
            case 2:
                _d.sent();
                logFile = node_path_1.default.join(logDir, "commands.log");
                logLine = JSON.stringify({
                    timestamp: event.timestamp.toISOString(),
                    action: event.action,
                    sessionKey: event.sessionKey,
                    senderId: (_b = event.context.senderId) !== null && _b !== void 0 ? _b : "unknown",
                    source: (_c = event.context.commandSource) !== null && _c !== void 0 ? _c : "unknown",
                }) + "\n";
                return [4 /*yield*/, promises_1.default.appendFile(logFile, logLine, "utf-8")];
            case 3:
                _d.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _d.sent();
                console.error("[command-logger] Failed to log command:", err_1 instanceof Error ? err_1.message : String(err_1));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = logCommand;
