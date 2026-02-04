"use strict";
/**
 * Client manager registry for Twitch plugin.
 *
 * Manages the lifecycle of TwitchClientManager instances across the plugin,
 * ensuring proper cleanup when accounts are stopped or reconfigured.
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateClientManager = getOrCreateClientManager;
exports.getClientManager = getClientManager;
exports.removeClientManager = removeClientManager;
exports.removeAllClientManagers = removeAllClientManagers;
exports.getRegisteredClientManagerCount = getRegisteredClientManagerCount;
exports._clearAllClientManagersForTest = _clearAllClientManagersForTest;
var twitch_client_js_1 = require("./twitch-client.js");
/**
 * Global registry of client managers.
 * Keyed by account ID.
 */
var registry = new Map();
/**
 * Get or create a client manager for an account.
 *
 * @param accountId - The account ID
 * @param logger - Logger instance
 * @returns The client manager
 */
function getOrCreateClientManager(accountId, logger) {
    var existing = registry.get(accountId);
    if (existing) {
        return existing.manager;
    }
    var manager = new twitch_client_js_1.TwitchClientManager(logger);
    registry.set(accountId, {
        manager: manager,
        accountId: accountId,
        logger: logger,
        createdAt: Date.now(),
    });
    logger.info("Registered client manager for account: ".concat(accountId));
    return manager;
}
/**
 * Get an existing client manager for an account.
 *
 * @param accountId - The account ID
 * @returns The client manager, or undefined if not registered
 */
function getClientManager(accountId) {
    var _a;
    return (_a = registry.get(accountId)) === null || _a === void 0 ? void 0 : _a.manager;
}
/**
 * Disconnect and remove a client manager from the registry.
 *
 * @param accountId - The account ID
 * @returns Promise that resolves when cleanup is complete
 */
function removeClientManager(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entry = registry.get(accountId);
                    if (!entry) {
                        return [2 /*return*/];
                    }
                    // Disconnect the client manager
                    return [4 /*yield*/, entry.manager.disconnectAll()];
                case 1:
                    // Disconnect the client manager
                    _a.sent();
                    // Remove from registry
                    registry.delete(accountId);
                    entry.logger.info("Unregistered client manager for account: ".concat(accountId));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Disconnect and remove all client managers from the registry.
 *
 * @returns Promise that resolves when all cleanup is complete
 */
function removeAllClientManagers() {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = __spreadArray([], registry.keys(), true).map(function (accountId) { return removeClientManager(accountId); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the number of registered client managers.
 *
 * @returns The count of registered managers
 */
function getRegisteredClientManagerCount() {
    return registry.size;
}
/**
 * Clear all client managers without disconnecting.
 *
 * This is primarily for testing purposes.
 */
function _clearAllClientManagersForTest() {
    registry.clear();
}
